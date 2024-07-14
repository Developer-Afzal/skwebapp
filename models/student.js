const { required, boolean } = require("joi");
const mongoose =  require("mongoose")

 const students_schema = new mongoose.Schema({
    enroll_no:{
        type:String,
        required:true,
        unique:true,

    },
    s_name:{
        type:String,
        required:true,
    },
    s_email:{
        type:String,    
        required:true,
        unique:true,
    },
    f_name:{
        type:String,
        required:true 
    },
    fee_status:{
        type:String,
        required:true 
    },
    s_address:{
        type:String, 
    },
    pincode:{
        type:Number,
        required: true,
    },
    coaching_time:{
        type:String,
        required:true, 
    },
    s_contact:{
        type:String,
        required:true,
    },
    s_dob:{
        type:String,  
        required:true,

    },
    s_class:{
        type:String,
        required:true,
    },
    board:{
        type:String, 
        required:true,  
    }, 
    coaching_fee:{
        type:String,
        required:true,
    },
    joining_date:{
        type:String,
        required:true,
    },
    month:{
        Jan:{type:Boolean,},
        Feb:{type:Boolean,},
        Mar:{type:Boolean,},
        Apr:{type:Boolean},
        May:{type:Boolean},
        Jun:{type:Boolean},
        Jul:{type:Boolean},
        Aug:{type:Boolean},
        Sep:{type:Boolean},
        Oct:{type:Boolean},
        Nov:{type:Boolean},
        Dec:{type:Boolean}
    },
    results:{
        Quaterly:{Hindi:{type:String},English:{type:String},Math:{type:String},Physics:{type:String}, Chemistry:{type:String}},
        Halfyearly:{Hindi:{type:String},English:{type:String},Math:{type:String},Physics:{type:String}, Chemistry:{type:String}},
        Annual:{Hindi:{type:String},English:{type:String},Math:{type:String},Physics:{type:String}, Chemistry:{type:String}}
    }
}) 




const student = new mongoose.model("students", students_schema)


module.exports = student;

