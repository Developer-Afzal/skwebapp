const express  = require('express')
const {studentlogin, getStudentinfo, makepayment, checkfeevalidation, Updatefeemonth, paymentInfo, checkfeeStatus} = require ('../controllers/studentuser_controller')
const {studentloginvarify} = require ('../middleware/validateadmin')
const router = express.Router()

// router.post('/api/v1/webhook', express.raw({ type: 'application/json' }), checkfeeStatus)
router.post('/api/v1/studentlogin', studentloginvarify, studentlogin)
router.get('/api/v1/studentinfo/:id', getStudentinfo)
router.get('/api/v1/studentresult')
router.post('/api/v1/studentlogout')
router.post('/api/v1/create-checkout-session',  makepayment)
router.get('/api/v1/success/:session_id', paymentInfo)
router.post('/api/v1/result')
router.post('/api/v1/getfeeinfo', checkfeevalidation)
router.post('/api/v1/updatefeemonth', Updatefeemonth)


module.exports = router;  