const port  = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());

//Database Connection With MongoDB
mongoose.connect("mongodb+srv://prithwisingh77:Prithwi@139@cluster0.nvv9rdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

//API Creation
app.get("/",(req,res)=>{
    res.send("Express app is running");
})

//Image storage Engine
const storage  = multer.diskStorage({
    destination:'./upload/images',
    filename:(req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });
//creating Upload endpoint for images
app.use("/image", express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/image/${req.file.filename}`
    });
});
//schema for creating Products
const Product = mongoose.model("Product",{
    id:{
        type:number,
        required:true
    },
    name:{
        type:string,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async ()=>{
        const product = new Product ({
            id:req.body.id,
            name:req.body.name,
            image:req.body.image,
            category:req.body.category,
            new_price:req.body.new_price,
            old_price:req.body.old_price,
        });
        console.log(product)
        await product.save();
        console.log("Saved");
        res.json({
            success:true,
            name:req.body.name,
        })
})
app.listen(port, (error) => {
    if (!error){
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});
