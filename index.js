var express=require("express");
var mongoose=require("mongoose");
var bodyparser=require("body-parser");
var cors=require("cors");
require("dotenv").config();
var Grid=require("gridfs-stream");

var app=express();

let gfs;
mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    gfs=Grid(mongoose.connection.db,mongoose.mongo);
    gfs.collection('uploads');
     console.log("gfs done");
})
.then(()=>{console.log("DB connected..")})
.catch((err)=>console.log(err));



//const con=mongoose.createConnection(process.env.MONGODB_URL,{useNewUrlParser:true,useUnifiedTopology:true});


//middleware
//var method=(req,res,next)=>{console.log("hi..");
//next();}
// app.get('/',method,(req,res)=>{
//     res.send("Hello vamshi!..");
// })


app.use(bodyparser.json());
//app.use(cors());
app.use('/',require("./routes/auth"));
app.use(require("./routes/post"));

app.listen(process.env.PORT,()=>console.log(`server running at http://localhost:${3000}`));

module.exports=gfs;