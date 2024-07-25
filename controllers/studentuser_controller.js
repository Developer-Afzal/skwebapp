const student = require("../models/student");
const FeeStatus = require("../models/studentfee");
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const endpointSecret = process.env.WEBHOOK_PAYMENT_STATUS_KEY;
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
    if(findData.length !== 0){
        const data = {
            data : { message:"Already Submmited Fee for this month", FeeMonth:true}
        }
         return res.status(404).json(data)
         }
    res.status(200).json({message:"success", FeeMonth:false})
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
                      description: `Payment for ${F_month} Month.`,
                    },
                    unit_amount:100 * 1,
                  },
                //   price:`${amt}`,
                quantity: 1,
            }],
            mode:'payment',
            success_url: `https://skweb.onrender.com/studentinfo/${enroll_no}`, // Replace with your success URL
            cancel_url: `https://skweb.onrender.com/studentinfo/${enroll_no}`,

        })
        console.log(session.payment_status);
         res.status(200).json({ id: session.id });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const checkfeeStatus = async (request, response)=>{
    const sig = request.headers['stripe-signature'];
    let event;
    try {
         // Verify the signature and extract the event
         event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (error) {
        // Log the error for monitoring and debugging
    console.error(`error aaya Webhook signature verification failed: ${error}`);
    return response.status(400).send(`Webhook Error: ${error}`);
    }

      // Handle the event based on its type
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      console.log(checkoutSessionAsyncPaymentFailed.id);
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      console.log(checkoutSessionAsyncPaymentSucceeded.id);
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Checkout session completed for session ID: ${session.id}`);
      // Fulfill the purchase, update your database, etc.
      break;
      case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      console.log(checkoutSessionExpired.id);
      // Then define and call a function to handle the event checkout.session.expired
      break;
    // Add more cases to handle other relevant events
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.sendStatus(200); // Responding to acknowledge receipt of the event
}

const Updatefeemonth = async (req, res)=>{
    const {enroll_no, F_month, s_name, amt} = req.body
    const data = await student.updateOne({enroll_no:enroll_no}, update)
} 



module.exports= {
    studentlogin,
    getStudentinfo, 
    checkfeevalidation,
    makepayment, 
    Updatefeemonth,
    checkfeeStatus
}