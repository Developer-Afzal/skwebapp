const mongoose =  require("mongoose")


const event_Schema = new mongoose.Schema({
    paragraph:{
        type:String,
        required:true,
    },
})

const latestevents = new mongoose.model("latestevents", event_Schema)

module.exports = latestevents