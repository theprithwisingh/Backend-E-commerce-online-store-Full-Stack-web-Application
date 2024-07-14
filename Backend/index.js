const port  = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors);

//Database Connection With MongoDB
mongoose.connect("mongodb+srv://prithwisingh77:Prithwi@139@cluster0.nvv9rdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

//API Creation
app.get("/",(req,res)=>{
    res.send("Express app is runnig");
})

//Image storage Engine
const storage  = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cd)=>{
        return cd(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage:storage})
//creating Upload endpoint for images
app.use("/image" ,express.static('upload/images'));

app.post("/upload", upload.single('product'),(req,res)=>{
    res.json({
      sucess:1,
     image_url:`http://localhost:${port}/images/${req.file.filename}`
})
     
})

app.listen(port,(error)=>{
    if (!error){
        console.log("Server Running on Port"+port)
    }
    else{
        console.log("Error :"+error)
    }
})
