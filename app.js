const express = require('express')
const mongoose = require('./db/mongoose')
const session = require('express-session')
const MongoDBstore = require('connect-mongodb-session')(session)
const User= require('./models/user')
const auth = require('./middleware/auth')
const app =express()

const port = 3000 || 'port'
app.use(express.json())

//create connet-mongodb-session instance
const store = MongoDBstore({
    uri:"mongodb://127.0.0.1:27017/User",
    collection:"Sessions"
})
      
//use session middleware in express
app.use(session({
    secret:"any string",
    resave:false,
    saveUninitialized:false,
    store:store
}))

app.post('/login',async (req,res)=>{
    try {
        let user = await User.findOne({username:req.body.username})
        if(!user){
            user = new User(req.body)
            await user.save()
        }
        req.session.user = user
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }  
})
app.get('/user',auth,(req,res)=>{
        res.send(req.user)
})
app.get('/logout',auth,async (req,res)=>{
  req.session.destroy()
  res.send("logout seccessfully")
})

app.listen(port,()=>{
    console.log(`server run on port ${port}`);
})