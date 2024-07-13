const express = require('express')
const cors = require('cors')
const Admin_Routes = require('./routes/Admin/AdminRoutes')
const app = express()
const port = process.env.PORT || 4000

const corsOptions = {
    origin:'http://localhost:3000', // Allow only this origin
    credentials:true
  };
app.use(cors(corsOptions))
app.use(Admin_Routes);

app.listen(port, ()=>{
    console.log('app is running');
})