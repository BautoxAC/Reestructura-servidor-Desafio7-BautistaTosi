import passport from 'passport'
import express from 'express'
export const sessionsRouter = express.Router()
/* nos guiamos por el mail es de la documentacion */
sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = req.user
  // Successful authentication, redirect home.
  res.redirect('/products')
})

sessionsRouter.get('/current', (req, res) => {
  return res.status(200).json({ Session: req.session })
})
