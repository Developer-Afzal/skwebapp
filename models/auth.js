const mongoose =  require("mongoose")


const admin_Schema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
})

const admin = new mongoose.model("admin", admin_Schema)

module.exports = admin