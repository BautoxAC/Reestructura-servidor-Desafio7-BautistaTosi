export class SessionsController {
  redirectHome (req, res) {
    req.session.user = req.user
    res.redirect('/products')
  }

  seeCurrentSession (req, res) {
    return res.status(200).json({ Session: req.session })
  }
}
