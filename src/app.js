import express from 'express'
import config from './config/env.config.js'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import session from 'express-session'
import path from 'path'
import { cartsAPIRouter } from './routes/cartsAPI.router.js'
import { productViewRouter } from './routes/productsView.router.js'
import { productsAPIRouter } from './routes/productsAPI.router.js'
import { productsSocketRouter } from './routes/productsSocketRouter.router.js'
import { authRouter } from './routes/auth.router.js'
import { __dirname, connectMongo, connectSocketServer } from './utils.js'
import { iniPassPortLocalAndGithub } from './config/passport.config.js'
import { cartViewRouter } from './routes/cartView.router.js'
import { chatRouter } from './routes/chat.router.js'
import passport from 'passport'
import { sessionsRouter } from './routes/sessions.router.js'
const { sessionSecret, port, mongoUrl } = config
const app = express()
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

// CONFIG EXPRESS
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, '/public/assets')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

app.use(
  session({
    store: MongoStore.create({ mongoUrl, ttl: 7200 }),
    secret: `${sessionSecret}`,
    resave: true,
    saveUninitialized: true
  })
)

// Initialize passport
iniPassPortLocalAndGithub()
app.use(passport.initialize())
app.use(passport.session())

// Execute SocketSever in Rute /realtimeserver
connectSocketServer(httpServer)

// Connect Mongo
connectMongo()

// Rutes: API REST WITH JSON
app.use('/api/products', productsAPIRouter)
app.use('/api/carts', cartsAPIRouter)
app.use('/api/sessions', sessionsRouter)

// Rutes: HTML
app.use('/products', productViewRouter)
app.use('/carts', cartViewRouter)
app.use('/auth', authRouter)

// Rutes: SOCKETS
app.use('/realtimeproducts', productsSocketRouter)
app.use('/chat', chatRouter)

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error', msg: 'no encontrado', data: ''
  })
})
