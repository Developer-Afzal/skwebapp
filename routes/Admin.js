const express = require("express");
const multer = require('multer');

const {
    studentapiStart, 
    AddStudent, 
    Getstudentlist, 
    GetsingleStudent, 
    DeleteStudent, 
    UpdateStudent, 
    GetDashboard,
    MakePayment, 
    AcceptFee,
    GetStudentList,
    uploadStudentResult,
    FindResult,
    updateEventList,
    deleteEventList,
    geteventlist} = require("../controllers/student_controllers")
const { Token_validator, feeValidation } = require("../middleware/validateadmin")
const router = express.Router()
// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.get('/',studentapiStart)
router.post('/api/v1/addstudent',Token_validator, AddStudent)
router.get('/api/v1/studentlist', Token_validator, Getstudentlist)
router.get('/api/v1/studentlist/:id', Token_validator, GetsingleStudent)
router.delete('/api/v1/deletestudent', Token_validator, DeleteStudent)
router.put('/api/v1/studentlist', Token_validator, UpdateStudent)
router.get('/api/v1/dashboard', Token_validator, GetDashboard )
router.post('/api/v1/fee', Token_validator, feeValidation, AcceptFee)
router.put('/api/v1/payment', Token_validator, MakePayment)
router.get('/api/v1/allstudents', Token_validator, GetStudentList)
router.post('/api/v1/uploadresult', Token_validator, upload.single('file'), uploadStudentResult)
router.post('/api/v1/findresult', Token_validator, FindResult)
router.post('/api/v1/addevent', updateEventList)
router.delete('/api/v1/deletevent', deleteEventList)
router.get('/api/v1/geteventlist', geteventlist)

module.exports = router;    