const User = require('../models/user')

const auth = async (req,res,next)=>{
    try {
        const id = req.session.user._id
        const user = await User.findOne({_id:id})
        if(!user){
            throw new Error()
        }
        req.user= user
        next()
    } catch (error) {
        res.status(401).send({error:'Please Authenticate!!'})
    }
}
module.exports = auth