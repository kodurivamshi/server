var express=require("express");
var userModel=require("../models/user");
var router=express.Router();
var requireLogin=require("../middleware/requireLogin");
var bcrypt=require("bcryptjs");
var jwt=require("jsonwebtoken");
//var requireLogin=require("../middleware/requireLogin");

// router.get("/protected",requireLogin,(req,res)=>{
//    // console.log(req.user);
//     res.send("u r safe...");
// })

router.get('/',(req,res)=>{
    res.send("hello vamshi..");
})

router.post('/signup',(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(422).json({error:"fill all the details.."});
    }
    userModel.findOne({email:email})
    .then(userdata=>{
        if(userdata){
            return res.status(422).json({error:"user already exists."});
        }
        bcrypt.hash(password,10)
        .then(hashpassword=>{
            const user={
                name,
                email,
                password:hashpassword
            }
            userModel(user).save()
            .then(data=>{
                res.json({message:"saved successfully.."});
            })
            .catch(err=>console.log(err));
        })
    })
    .catch(err=>console.log(err));
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(422).json({error:"fill all fields.."});
    }
    userModel.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Invalid Credentials.."});
        }
        bcrypt.compare(password,user.password)
        .then(ismatch=>{
            if(ismatch){
                //res.json({message:"successfully signed In"});
                const {_id,name,email}=user;
                const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
                res.json({token,user:{_id,name,email}});
            }
            else{
                return res.status(422).json({error:"Invalid Credentials"});
            }
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
})

module.exports=router;