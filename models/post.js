var mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types;
var postSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"no photo"
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
})

module.exports=mongoose.model("post",postSchema);