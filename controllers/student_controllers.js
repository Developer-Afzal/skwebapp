const student = require("../models/student");
const FeeStatus = require("../models/studentfee");
const  admin = require("../models/auth");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const stripe = require("stripe")("shdsadhsah") 
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');
const stream = require('stream');
// const { model } = require("mongoose");
// const { log } = require("console");

const  studentapiStart = async (req, res)=> {
     return res.sendFile(path.join(__dirname, "../", "View", "Dashboard.html"))
} 
const AddStudent = async (req, res)=>{
    const Body = req.body;
    // console.log(Body);
   try {
    if(!Body){
        return res.status(400).json({msg:'pls fill required values', response: res}) 
    }
       const result =  await student.create({
            enroll_no:Body.enroll_no,
            s_address:Body.s_address,
            coaching_time:Body.coaching_time,
            joining_date:Body.joining_date,
            board:Body.board,
            coaching_fee:Body.coaching_fee,
            f_name:Body.f_name,
            fee_status:Body.fee_status,
            m_name:Body.m_name,
            pincode:Body.pincode,
            s_class:Body.s_class,
            s_contact:Body.s_contact,
            s_dob:Body.s_dob,
            s_email:Body.s_email,
            s_name:Body.s_name,
        })
        return res.status(201).json({msg:'Student added successfully'})
   } catch (error) {
    console.log(error)
    res.status(400).json({'error':error?.message})
   }
}

const Getstudentlist = async (req, res)=>{
    const Enroll_no = req.query?.searchKey;
    // console.log(req.query);
    if(Enroll_no){
        const SearchedData = await student.findOne({enroll_no:Enroll_no})
        // console.log(SearchedData);
        if(SearchedData === null){
            return res.status(404).json({message:'data not found!'})
        }
         return res.status(200).json([SearchedData])
    }else{
        try {   
            const limit = parseInt(req.query.limit) || 5;
            const page = parseInt(req.query.page_no) || 1;
            const startIndex = (page - 1 ) * limit;
            const endIndex = page  * limit;
            // console.log(startIndex, endIndex);
            const result ={}
            if(endIndex < student.length){
                result.next ={
                page: page + 1,
                limit:limit
            }
            }
           if(startIndex > 0){
            result.previus ={
                page:page - 1,
                limit:limit
            }
           }
            const allList = await student.find().limit(limit).skip(startIndex);  
            if(allList){
             return res.status(200).json(allList) 
            }
          } catch (error) {
              console.log(error);
          }
    }
    
}
const GetsingleStudent = async(req, res)=>{
    const {id} = req.params
    try {
      const single_Item = await student.findById(id)  
       res.status(201).json(single_Item) 
    } catch (error) {
        console.log(error);
    }
}
const DeleteStudent = async(req, res)=>{
    // console.log(req.body);
    const {id} = req.body;
    try {
      const deleteitem = await student.findByIdAndDelete(id);
      if(!deleteitem){
        return res.status(404).json({error:'id not found!'})
    }
    return res.status(200).json({msg:`${id} item deleted successfully`})  
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error})
    }
}
const UpdateStudent = async (req, res)=>{
    const {_id} = req.body
    const update = req.body;
    try {
    const updateItem = await student.findByIdAndUpdate(_id, update, {new:true})
    if(!updateItem){
        return res.status(400).json({message:'id not found!'})
    }
    res.status(200).json({message:'update successfully'})
    } catch (error) {
        res.status(400).json({error:error})
    }
}
const RegisterStudent = async (req, res)=>{
}
const LoginStudent = async (req, res)=>{
}
const LoginAdmin = async (req, res)=>{
    const {username, password} = req.body;
    const ADMIN = await admin.findOne({username:username});
    if(!ADMIN){
        return res.status(400).json({message:'user not found!'})
    }
    const checkpass = await bcrypt.compare(password,ADMIN.password) 
    admin.findOne({username:username}).then((item)=> {
            if(checkpass){
                const accessToken = jwt.sign({username:username},process.env.TOKEN_SECRET_KEY, {expiresIn:'15m'})
                const refeshToken = jwt.sign({username:username},process.env.TOKEN_SECRET_KEY, {expiresIn:'30m'})
                res.cookie('accessToken', accessToken, {maxAge:15 * 60000, httpOnly:true, secure:true, sameSite:'None'});
                res.cookie('refeshToken', refeshToken, {maxAge:30 * 60000, httpOnly:true, secure:true, sameSite:'None'})
                res.json({item, isAuth:true, userType:'admin', message:'success'})
            }else{
                res.status(400).json({message:'Invalid password'})
            }
    })
    // console.log(req.body.password);  if you want access the object after the desturturing it will give you undefine
    // try {
    // const ADMIN = await admin.findOne({username:username})
    // if(!username || !password) { 
    //     return res.status(400).json({message:"please fill required field"})
    // }
    // if(!ADMIN){
    //    return res.status(404).json({message:"Invalid username or password"})
    // }
    // const IsEqual = await bcrypt.compare(password, ADMIN.password)
    // if(!IsEqual){
    //    res.status(401).json({message:'Unauthroized'})
    // }
    // const tokenObject ={
    //     _id:ADMIN._id,
    //     username:ADMIN.username,
    // }
    // const jwttoken = jwt.sign(tokenObject, process.env.SECRET, {expiresIn:'4h'})
    // res.status(200).json({jwttoken, tokenObject})
    // } catch (error) {
    //     console.log(error.message);
    //     res.status(500).json({message:"Internal server error"})
    // }
}
const LogoutAdmin = async (req, res)=>{
        res.clearCookie("accessToken")
        res.clearCookie("refeshToken")
        res.status(200).json({message:"success"})
}

const RegisterAdmin = async (req, res)=>{
    //    const auth_Model = new admin(req.body);
    //    auth_Model.password = await bcrypt.hash(req.body.password, 10)
    //    console.log(auth_Model.password)
    // try {
    //     const ADMIN = await admin.findOne({username:req.body.username})
    //     if(ADMIN) return res.status(400).json({message:"you have already registred"})
    //     const response = await auth_Model.save();
    //     response.password = undefined;
    //     return res.status(201).json({message:'success', data:response})
    // } catch (error) {
    // res.status(500).json({message:"internal server error",})
    // }
    // applying second way

    try {
        const {username, password}= req.body;
        const ADMIN = await admin.findOne({username})
        const hashedpassword = await bcrypt.hash(password, 10)
        if(ADMIN) return req.status(400).json({success:false, message:'User already exit'})
        await admin.create({username:username,password:hashedpassword})
        res.status(201).json({success:true, message:'successfully registred'})
    } catch (error) {
        res.status(500).json({message:"internal server error",})
    }
    
}
const GetDashboard = async (req, res)=>{
    try {
         return res.status(200).json({username:  req.username, message:"Authrized"}) 
      } catch (error) {
          console.log(error);
      }
}

const AcceptFee = async (req, res)=>{
    const {body} = req
    const findValue = await student.findOne({enroll_no :body.enroll_no })
    try {
        if(!body) return res.status(404).json({message:'Please fill form firslty'})
        if(!findValue) return res.status(404).json({message:"Student Not Found"})
        const result = await FeeStatus.create({
            enroll_no:body.enroll_no,
            s_name:body.s_name,
            s_class:body.s_class,
            Months:body.Months,
            amount:body.amount
        })
        return res.status(200).json({message:"Fee submitted"})
    } catch (error) {
        console.log(error);
    }
}

const monthdata =[]
const MakePayment = async (req, res)=>{
    const {_id, enroll_no, F_month} = req.body;
    const propertName = `month.${F_month}`
    const query ={
        $and:[
            {enroll_no:enroll_no,[propertName]:true}
        ]
    }
    const findData = await student.find(query)
    const update = { $set: {} };
    update.$set[`month.${F_month}`] = true;
    if(findData != '') return res.status(400).json({message:`Already submitted ${F_month} month fee.`})
    const data = await student.updateOne({enroll_no:enroll_no}, update)
    // const data = await student.updateOne({_id:_id},{$set:{month:{Jan:true}}})
    res.status(200).json({message:"running"})
    // const {product, token} = req.body;
    // const idempontencyKey =uuid()
    // return stripe.customers.create({
    //     email:token.email,
    //     source:token.id
    // }).then((customer)=>{
    //     stripe.charges.create({
    //         amount:product.price * 100,
    //         currency:'usd',
    //         customer:customer.id,
    //         receipt_email:token.email,
    //         description:`purchase the prodtcct`,
    //         shipping:{
    //             name:token.card.name,
    //             address:{
    //                 country:token.card.address_country
    //             }
    //         }
    //     }, {idempontencyKey})
    // }).then(result => res.status(200).json(result))
    // .catch(err => console.log(err))
}

const data = [
    { id: 1, name: 'John Doe', age: 30, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
    { id: 3, name: 'Michael Johnson', age: 35, city: 'Chicago' },
  ];

  // Generate CSV File and Download
const GetStudentList = async (req, res) => {
    const Data = await student.find({})
    const filePath = path.join(__dirname, 'Studentlist.csv');
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 's_name', title: 'Student Name' },
        { id: 'f_name', title: 'Father Name' },
        { id: 'enroll_no', title: 'Enroll No' },
        { id: 's_class', title: 'Class' },
        { id: 'board', title: 'Board' },
      ],
    });
  
    try {
      await csvWriter.writeRecords(Data);
      res.download(filePath, 'studentlist.csv', (err) => {
        if (err) {
          console.error('Error during file download:', err);
          res.status(500).send('Error downloading the file');
        } else {
          // Optionally delete the file after download
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting the file:', unlinkErr);
            } else {

            }
          });
        }
      });
    } catch (err) {
      // console.error('Error generating the CSV file:', err);
      res.status(500).send('Error generating the CSV file');
    }
  }

const uploadStudentResult = async (req, res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded');
      }
      const results = [];
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      bufferStream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            
              for(const resultdata of results){
              const {ID , Hindi, English, Math, Physics,Chemistry } = resultdata
              await student.findByIdAndUpdate(
                ID,
                {
                  'results.Quaterly.Hindi':Hindi, 
                  'results.Quaterly.English':English, 
                  'results.Quaterly.Math':Math,
                  'results.Quaterly.Physics':Physics,
                  'results.Quaterly.Chemistry':Chemistry,
                }
              )
            }
            res.status(200).json({message:"result updated successfully"})
            // if(results) return res.status(200).json({msg:results})
            // await student.findByIdAndUpdate(results);
            // console.log('CSV data inserted into database');
            // res.send('CSV data imported into database successfully');
          } catch (err) {
            // console.error('Error inserting data into database:', err);
            res.status(500).send('Error inserting data into database');
          }
        })
        .on('error', (err) => {
          // console.error('Error reading CSV file:', err);
          res.status(500).send('Error reading CSV file');
        });

}
const FindResult =  async(req, res)=>{
   try {
     const {enroll_no} = req.body
     const data = await student.findOne({enroll_no:enroll_no})
     res.status(200).json({data})
   } catch (error) {
    
   }
    
}
    

module.exports = { 
    studentapiStart, 
    AddStudent, 
    Getstudentlist, 
    GetsingleStudent, 
    DeleteStudent, 
    UpdateStudent,
    LoginAdmin,
    RegisterAdmin, 
    GetDashboard,
    LogoutAdmin, 
    AcceptFee, 
    MakePayment,
    GetStudentList,
    uploadStudentResult,
    FindResult
 }