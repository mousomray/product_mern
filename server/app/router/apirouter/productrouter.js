const express = require('express')
const productcontroller = require('../../controller/apicontroller/productcontroller')
const uploadImage = require('../../helper/imagehandler') // Image handle Area
const { Auth } = require('../../middleware/auth')
const router = express.Router()

router.post('/createproduct',Auth, uploadImage.single('image'), productcontroller.create) // POST
router.get('/productlist',Auth, productcontroller.getall) // GET
router.get('/singleproduct/:id',Auth, productcontroller.getsingle) // GET single
router.put('/editproduct/:id',Auth, uploadImage.single('image'), productcontroller.productupdate) // PUT or PATCH
router.delete('/delete/:id',Auth, productcontroller.productdelete) // DELETE 

module.exports = router