import { userModel } from '../DAO/models/users.model.js'
import GitHubStrategy from 'passport-github2'
import passport from 'passport'
import local from 'passport-local'
import { createHash, isValidPassword } from '../utils.js'
import { CartManagerDB } from '../DAO/DB/CartManagerDB.js'
import config from './env.config.js'
const LocalStrategy = local.Strategy
const { clientID, clientSecret, port } = config
const cartManager = new CartManagerDB()
// ---------------- GITHUB PASSPORT ----------------
export function iniPassPortLocalAndGithub () {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username })
        if (!user) {
          console.log('User Not Found with username (email) ' + username)
          return done(null, false)
        }
        if (!isValidPassword(password, user.password)) {
          console.log('Invalid Password')
          return done(null, false)
        }

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    })
  )

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email'
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body
          const user = await userModel.findOne({ email: username })
          if (user) {
            console.log('User already exists')
            return done(null, false)
          }
          const newCart = await cartManager.addCart()
          const newUser = {
            email,
            firstName,
            lastName,
            age,
            isAdmin: false,
            password: createHash(password),
            role: 'user',
            cart: newCart.data._id
          }
          const userCreated = await userModel.create(newUser)
          return done(null, userCreated)
        } catch (e) {
          console.log('Error in register')
          console.log(e)
          return done(e)
        }
      }
    )
  )
  // GITHUB
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: `http://localhost:${port}/api/sessions/githubcallback`
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28'
            }
          })
          const emails = await res.json()
          // eslint-disable-next-line eqeqeq
          const emailDetail = emails.find((email) => email.verified == true)
          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'))
          }
          profile.email = emailDetail.email
          const user = await userModel.findOne({ email: profile.email })
          if (!user) {
            const newCart = await cartManager.addCart()
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              role: 'user',
              age: 0,
              password: 'nopass',
              cart: newCart.data._id
            }
            const userCreated = await userModel.create(newUser)
            return done(null, userCreated)
          } else {
            return done(null, user)
          }
        } catch (e) {
          console.log('Error en auth github')
          console.log(e)
          return done(e)
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id)
    done(null, user)
  })
}
