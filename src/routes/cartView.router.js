import express from 'express'
import { CartViewController } from '../controller/cartView.controller.js'
export const cartViewRouter = express.Router()
const cartViewControllerRouting = new CartViewController()

cartViewRouter.get('/:cid', cartViewControllerRouting.getCartByIdToView)
