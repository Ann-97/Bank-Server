
//import express
const { application } = require('express')
const express=require('express')

//import dataservice
const dataService=require('./services/data.service')

//import jsonwebtoken
const jwt=require('jsonwebtoken')

//import cors
const cors=require('cors')

//create server app using express
const app=express()

//use cors
app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data
app.use(express.json())

//resolving REST API 
//GET-to read data
app.get('/',(req,res)=>{
    res.send("GET REQUEST")
})

//POST-to create data
app.post('/',(req,res)=>{
    res.send("POST REQUEST")
})

//PUT-to update/modify data
app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})

//PATCH-to partially update data
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})

//DELETE-to delete data
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST")
})

//logMiddleware - application specific middleware
const logMiddleware=(req,res,next)=>{
    console.log("APPLICATION SPECIFIC MIDDLEWARE");
    next()
}
app.use(logMiddleware)

//BANK SERVER

//jwtmiddleware
const jwtMiddleWare=(req,res,next)=>{
  try 
  { const token=req.headers["x-access-token"]
    const data=jwt.verify(token,'secret123456')
    req.currentAcno=data.currentAcno
    next()
}
catch{
    res.status(401).json({
        statusCode:401,
        status:false,
        message:"please log in"
    })
}
}

//REGISTER API
app.post('/register',(req,res)=>{
    //asynchronous
    const result=dataService.register(req.body.uname,req.body.acno,req.body.password)
    .then(result=>{

        res.status(result.statusCode).json(result)
    })
    
    
})

//LOGIN API
app.post('/login',(req,res)=>{
    console.log(req.body.pswd);
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
    
    
})

//DEPOSIT API
app.post('/deposit',jwtMiddleWare,(req,res)=>{
    console.log(req.body.pswd);
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
    res.status(result.statusCode).json(result)
    
})
})

//WITHDRAW API
app.post('/withdraw',jwtMiddleWare,(req,res)=>{
    console.log(req.body.pswd);
    dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
    res.status(result.statusCode).json(result)
    
})
})

//TRANSACTION API
app.post('/transaction',jwtMiddleWare,(req,res)=>{
    console.log(req.body.pswd);
    dataService.transaction(req.body.acno)
    .then(result=>{
    res.status(result.statusCode).json(result)
    
})
})
//onDelete API
app.delete('/onDelete/:acno',jwtMiddleWare,(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })

})

//set port number
app.listen(3000,()=>{
    console.log("Server started at 3000");
})