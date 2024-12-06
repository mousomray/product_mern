const express = require('express')
const uploadImage = require('../../helper/imagehandler') // Image handle Area
const authcontroller = require('../../controller/authcontroller/authcontroller')
const { Auth } = require('../../middleware/auth')
const router = express.Router()

router.post('/register', uploadImage.single('image'), authcontroller.register) // Register
router.post('/verifyotp', authcontroller.verifyOtp) // For verify OTP
router.post('/login', authcontroller.login) // Login
router.get('/dashboard', Auth, authcontroller.dashboard) // Dashboard Data
router.post('/updatepassword', Auth, authcontroller.updatePassword) // Update Password
router.post('/resetpasswordlink', authcontroller.resetpasswordlink)//Reset Password link
router.post('/forgetpassword/:id/:token', authcontroller.forgetPassword)//Forget password

module.exports = router  