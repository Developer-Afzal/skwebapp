const student = require("../models/student");
const FeeStatus = require("../models/studentfee");
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const studentlogin = async (req, res)=>{
    const {enrollno} = req.body; 
     // if(!enrollno) return res.status(403).json({message:"Enrollment Number Required"})
    // console.log(enrollno);
    try {
        const userData = await student.findOne({enroll_no:enrollno})
        if(!userData) return res.status(404).json({message:"Data not found!"})
        res.status(200).json({data:userData, message:'success'})
    } catch (error) {
       console.log(error);
       res.status(404).json({message:"Invalid enrollment No"})
    }
}

const getStudentinfo = async (req, res)=>{
    const id = req.params.id
    try {
        const userData =  await student.findOne({enroll_no:id})
        if(!userData) return res.status(404).json({message:"Data not found!"})
        return res.status(200).json({message:"success", userData})
    } catch (error) {
        res.status(500).json({message:error})
    }
}

const checkfeevalidation = async (req, res, next)=>{
    const {enroll_no, F_month, s_name, amt} = req.body
    // console.log(enroll_no, F_month, s_name, amt);
    const Amount = amt * 100
    const propertName = `month.${F_month}`
    const query ={
        $and:[
            {enroll_no:enroll_no,[propertName]:true}
        ]
    }
    const findData = await student.find(query)
    // console.log('working', findData);
    if(findData !== '') return res.status(404).json({message:"Already Submmited Fee for this month"})
    next()
}

const makepayment = async (req, res)=>{
    const {enroll_no, F_month, s_name, amt} = req.body
    const Amount = amt * 100
    const propertName = `month.${F_month}`
    const query ={
        $and:[
            {enroll_no:enroll_no,[propertName]:true}
        ]
    }
    const findData = await student.find(query)
    const update = { $set: {} };
    update.$set[`month.${F_month}`] = true;
    try {
        const session  = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items:[{
                price_data: {
                    currency: 'inr',
                    product_data: {
                      name: s_name,
                      description: `Payment for ${F_month}`,
                    },
                    unit_amount:100 * 1,
                  },
                //   price:`${amt}`,
                quantity: 1,
            }],
            mode:'payment',
            success_url: `http://localhost:3000/studentinfo/${enroll_no}`, // Replace with your success URL
            cancel_url: `http://localhost:3000/`,

        })
        
        const data = await student.updateOne({enroll_no:enroll_no}, update)
         res.status(200).json({ id: session.id });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}



module.exports= {
    studentlogin,getStudentinfo, checkfeevalidation,makepayment
}