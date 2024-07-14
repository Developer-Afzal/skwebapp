const { required } = require("joi")
const mongoose =  require("mongoose")


const studentfree_Schema = new mongoose.Schema({
    enroll_no:{
        type:String,
        required:true,
    },
    s_name:{
        type:String,
        required:true,
    },
    s_class:{
        type:String,
        required:true,
    },
    Months:{
        type:String,
        required:true
    },
    amount:{
        type:String,
        required:true,
    }
})

const studentfee = new mongoose.model("feestatus", studentfree_Schema)

module.exports = studentfee