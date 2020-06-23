var express=require("express");
var mongoose=require("mongoose");
var userModel=require("../models/user");
var router=express.Router();
var requireLogin=require("../middleware/requireLogin");
var postModel=require("../models/post");
const MulterGridfsStorage = require("multer-gridfs-storage");
require("dotenv").config();
const multer=require("multer");
var promise=require("promise");
var crypto=require("crypto");
var Grid=require("gridfs-stream");
var gfs=require("../index");
//var fs=require("fs");
//const {ObjectId}=mongoose.Schema.Types;




const storage=new MulterGridfsStorage({
    url:process.env.MONGODB_URL,
    file:(req,file)=>{
        return new promise((resolve,reject)=>{
            crypto.randomBytes(16,(err,buf)=>{
                if(err){
                    return reject(err);
                }
                const filename=file.originalname;
                const fileInfo={
                    filename:filename,
                    bucketName:'uploads',
                }
                resolve(fileInfo);
            })
        })
    },
})

const upload=multer({storage});

router.post("/uploads",upload.single('img'),(req,res,err)=>{
    if (err) throw err
    res.status(201).json({message:"pushed"});
})

// router.get('/:filename',(req,res)=>{
//     gfs.file.findOne({filename:req.params.filename},(err,file)=>{
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//               err: 'No file exists',
//             })
//         }
//         if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//             // Read output to browser
//             const readstream = gfs.createReadStream(file.filename)
//             readstream.pipe(res)
//           } else {
//             res.status(404).json({
//               err: 'Not an image',
//             })
//           }
//     })
// })

// let gfs;

// router.get("/pic/:filename",(req,res)=>{
//    var filename=req.params.filename;
//    console.log(filename);

// //    mongoose.createConnection(process.env.MONGODB_URL,function(err,db){
    
//     gfs=Grid(mongoose.connection.db,mongoose.mongo);
//     gfs.collection('uploads');
//     console.log("gfs done");
//     gfs.files.findOne({filename:filename},(err,file)=>{
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//               err: 'No file exists',
//             })
//         }
//         if (file.contentType === 'image/jpeg' ||file.contentType === 'image/jpg'|| file.contentType === 'image/png') {
//             // Read output to browser
//             const readstream = gfs.createReadStream(file.filename)
//             readstream.pipe(res)
         
//           } else {
//             res.status(404).json({
//               err: 'Not an image',
//             })
//           }
//     })
//     // db.collection('uploads').findOne({_id:ObjectId(filename)},(err,results)=>{
//     //     console.log(result);
//     //     res.setHeader('content-type', results.contentType);
//     //     res.send(results.img.buffer);
//     // })
//    })
// //})
router.post("/createpost",requireLogin,(req,res)=>{
    const {title,body,photo}=req.body;
    if(!title || !body || !photo){
        return res.status(422).json({error:"fill all the details.."});
    }

    req.user.password=undefined;//inorder to not to store the password...
    const user={
        title,
        body,
        photo,
        postedBy:req.user
    }
    postModel(user).save()
    .then(result=>{
        res.json(result);
    })
    .catch(err=>console.log(err));
})

router.get("/allpost",requireLogin,(req,res)=>{
    postModel.find()
    .populate("postedBy","_id name") //to show only name and id from user model..
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>console.log(err));
})

router.get("/mypost",requireLogin,(req,res)=>{
    postModel.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(post=>
        res.json(post))
    .catch(err=>console.log(err));
})

module.exports=router;