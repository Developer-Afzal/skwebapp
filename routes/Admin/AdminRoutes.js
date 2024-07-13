const Router = require('express')
const {getStudent} = require('../../Controllers/Admin')


 const  router = Router()

router.get('/', getStudent)
router.get('/api/v1/list', (req, res)=>{
    res.status(200).json({message:'list page'})
})

module.exports = router