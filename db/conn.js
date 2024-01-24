const mongoose = require("mongoose");

const DB = 'mongodb+srv://raisulislam714:login123@cluster0.5qtbp6u.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("database connected")).catch((err)=>console.log("errr",err))