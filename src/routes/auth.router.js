import express from 'express'
import { isUser, isAdmin, AdminCredentials } from '../middlewares/auth.js'
import passport from 'passport'
export const authRouter = express.Router()

authRouter.get('/login', (req, res) => {
  return res.render('login', {})
})

authRouter.post('/login', AdminCredentials, passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'invalid credentials' })
  }
  req.session.user = {
    _id: req.user?._id,
    email: req.user.email,
    firstName: req.user?.firstName,
    lastName: req.user?.lastName,
    role: req.user.role,
    age: req.user?.age,
    cart: req.user.cart
  }
  return res.redirect('/products')
})

authRouter.get('/faillogin', async (req, res) => {
  return res.json({ error: 'fail to login' })
})

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'no se pudo cerrar su session' })
    }
    return res.redirect('/auth/login')
  })
})

authRouter.get('/register', (req, res) => {
  return res.render('register', {})
})
authRouter.post('/register', AdminCredentials, passport.authenticate('register', { failureRedirect: '/auth/failregister' }), (req, res) => {
  if (!req.user) {
    return res.json({ error: 'something went wrong' })
  }
  req.session.user = {
    _id: req.user._id,
    age: req.user.age,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    role: req.user.role,
    cart: req.user.cart
  }
  return res.redirect('/products')
})
authRouter.get('/failregister', async (req, res) => {
  return res.json({ error: 'fail to register' })
})
authRouter.get('/perfil', isUser, (req, res) => {
  const user = req.user
  return res.json({ perfil: user })
})

authRouter.get('/administracion', isUser, isAdmin, (req, res) => {
  return res.send('datos super secretos clasificados sobre los perfiles registrados de la pagina')
})
