const express = require("express")
// const {CheckAuthentication} = require("../middleware")
const {RegisterStudent, LoginStudent, LoginAdmin, RegisterAdmin, LogoutAdmin} = require("../controllers/student_controllers")
const { validate_admin } = require("../middleware/validateadmin")
const router = express.Router()

router.post('/api/v1/register', validate_admin,  RegisterAdmin)
router.post('/api/v1/login',  LoginAdmin)
router.post('/api/v1/logout', LogoutAdmin)

module.exports = router;
