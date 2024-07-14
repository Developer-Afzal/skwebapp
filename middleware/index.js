 module.exports ={
    CheckAuthentication : async (req, res)=>{
        try {
            if(req.authenticated){
              return next()
            }
            res.status(401).json({message:"unauthroized"})
        } catch (error) {
            res.status(500).send('Internal server Error')
        }
    }
 }