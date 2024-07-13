const Router = require('express')
const {getStudent} = require('../../Controllers/Admin')


 const  router = Router()

router.get('/api/v1/list', getStudent)

module.exports = router