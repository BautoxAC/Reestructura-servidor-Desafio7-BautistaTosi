import express from 'express'
import { CartsController } from '../controller/carts.controller.js'
export const cartsAPIRouter = express.Router()
const CartsControllerRouting = new CartsController()

cartsAPIRouter.get('/:cid', CartsControllerRouting.getCartById)

cartsAPIRouter.post('/', CartsControllerRouting.addCart)

cartsAPIRouter.post('/:cid/products/:pid', CartsControllerRouting.addProduct)

cartsAPIRouter.delete('/:cid/products/:pid', CartsControllerRouting.deleteProduct)

cartsAPIRouter.delete('/:cid', CartsControllerRouting.deleteAllProducts)

cartsAPIRouter.put('/:cid', CartsControllerRouting.addNewProducts)

cartsAPIRouter.put('/:cid/products/:pid', CartsControllerRouting.updateQuantityProduct)
