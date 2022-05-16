//jsonwebtoken import
const jwt = require('jsonwebtoken')

//import database
const db=require('./db')


database ={
    1000:{acno:1000,uname:"Neer",password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,uname:"Niha",password:1001,balance:3000,transaction:[]},
    1002:{acno:1002,uname:"Neha",password:1002,balance:2000,transaction:[]},
  }

  //register-index.js will give uname,acno,password-asynchronous
  const register= (uname,acno,password)=> {
    //asynchronous
   return db.User.findOne({acno})
   .then(user=>{
     
    if(user){//already exist
      return {
        statusCode:401,
        status:false,
        message:"Account number already exist"
       
      }

    }
    else{
      const newUser=new db.User({
         acno,
        uname,
        password,
        balance:0,
        transaction:[]
       

      })
      newUser.save()
      return {
        statusCode:200,
        status:true,
        message:"Successfully registered.please log in"
       
      }
    }

   })
   
  }

  //login
const login=(acno,pswd)=>{

 return db.User.findOne({acno,password:pswd})
 .then(user=>{
   if(user){
    currentUser=user.uname
    currentAcno=acno
    //token generate
    const token = jwt.sign({
      currentAcno:acno
    },'secret123456')

    //already exist in db
    return  {
      statusCode:200,
      status:true,
    message:"login successfull",
    currentAcno,
    currentUser,
    token
     
    }
   }
   else{
  
    return {
     statusCode:401,
     status:false,
   message:"Invalid credentials"
    
   }
   }
 }) 
 }

 //deposit
const deposit=(acno,pswd,amt)=>{
  var amount= parseInt(amt)

  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if(user){
      user.balance +=amount
      user.transaction.push({
      type:"CREDIT",
      amount:amount
      })
      user.save()
     
      return {
        statusCode:200,
        status:true,
      message:amount + " successfully deposited and new balance is : "+ user.balance
       
      }
    }
    else{
    return {
      statusCode:401,
      status:false,
    message:"Invalid credentials"
     
    }
  }
  })

  }
 

//withdraw
const withdraw=(req,acno,pswd,amt)=>{
  var amount= parseInt(amt)
 
  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if(req.currentAcno!=acno){
      return {
        statusCode:422,
        status:false,
      message: "operation denied "
       
      }
    }

    if(user){
      if(user.balance>amount){
        user.balance-=amount

        user.transaction.push({
          type:"DEBIT",
          amount:amount
          })
          user.save()
          
        return {
          statusCode:200,
          status:true,
        message:amount + " successfully debited and new balance is : "+ user.balance
         
        }
       

      }
      else{
        return {
          statusCode:401,
          status:false,
        message:"Insufficient balance"
         
        }
      }
      }
     
        else {

          return {
            statusCode:401,
            status:false,
          message:"Invalid credentials"
           
          }

        }
      

    })
  }  
 

//transaction
const transaction=(acno)=>{
  return db.User.findOne({acno})
  .then(user=>{
    if(user){
      return {
        statusCode:200,
        status:true,
       transaction:user.transaction
       
      }

    }
    else{
      return  {
        statusCode:401,
        status:false,
      message:"user doesnot exist"
    }
    }
  })
 
  }
  
   //deleteAcc
  const  deleteAcc=(acno)=>{
    return db.User.deleteOne({acno})
    .then(user=>{
      if(!user){
        return{
          statusCode:401,
          status:false,
        message:"operation failed"
        }
      }
      else{
        return {
          statusCode:200,
          status:true,
        message:amount + "account number"+acno+"deleted successfully"
         
        }
      }
    })
  }




  //export
  module.exports={
    register,
    login,
    deposit,
    withdraw,
    transaction,
    deleteAcc
  }


