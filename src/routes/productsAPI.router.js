import express from 'express'
import { uploader } from '../utils.js'
import { ProductsAPIController } from '../controller/productAPI.controller.js'
const ProductsAPIControllerRouting = new ProductsAPIController()
export const productsAPIRouter = express.Router()

productsAPIRouter.get('/', ProductsAPIControllerRouting.getProducts)

productsAPIRouter.get('/:pid', ProductsAPIControllerRouting.getProductById)

productsAPIRouter.put('/:pid', ProductsAPIControllerRouting.updateProduct)

productsAPIRouter.delete('/:pid', ProductsAPIControllerRouting.deleteProduct)

productsAPIRouter.post('/', uploader.single('file'), ProductsAPIControllerRouting.addImage)
