const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const uuid = require("uuid")
const path = require('path');
require('dotenv').config();
const Admin_StudentRouter = require('./routes/Admin');
const PublicRouter = require('./routes/Auth');
const StudentRoutes = require('./routes/Student')
const {connectDatabase} = require('./connection')
// const {dataencoded} = require('./middleware')

const app = express();

// Use raw body parser to ensure the payload is not modified
app.use(bodyParser.raw({ type: 'application/json' }));

const port = process.env.PORT || 8080;

// connectDatabase('mongodb://127.0.0.1:27017/skdatabase')
connectDatabase(process.env.DATABASEKEY).then((res)=>{
    // console.log('mongo database connected !')
}).catch((error)=>{console.log(error)})
// connectDatabase('mongodb://127.0.0.1:27017/skdatabase').then((res)=>{
//     console.log('mongo database connected !')
// }).catch((error)=>{console.log(error)})

const corsOptions = {
    origin:['http://localhost:3000', 'https://skweb.onrender.com'], // Allow only this origin
    credentials:true
  };

// Serve static files from the React app's build directory
// app.use(express.static(path.join(__dirname, 'build')));


// Parse JSON bodies for this app
app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
//   });

app.use('/', Admin_StudentRouter);
app.use('/', PublicRouter);
app.use('/', StudentRoutes);

app.listen(port,  ()=>{
    console.log(port);
});
