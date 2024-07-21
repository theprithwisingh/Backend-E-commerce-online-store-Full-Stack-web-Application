const port  = 6000;
require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require('os');
// const { type } = require("os");

app.use(express.json());
app.use(cors());

//Database Connection With MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

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
        type:Number,
        required:true
    },
    name:{
        type:String,
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
        let products = await Product.find({});
        let id;
        if(products.length>0){
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id+1;
        }
        else{
            id:1;
        }
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

//creating API for deleting products
app.post('/removeproduct', async (req,res)=>{
      await Product.findByIdAndDelete({id:req.body.id});
      console.log("removed");
      res.json({
        success:true,
        name:req.body.name
      })
})

//Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products fetched");
    res.send(products);
})

//shcema creataing for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating Endpoint for registering the user
app.post('/signup', async (req,res)=>{
  let check = await Users.findOne({email:body.email});
  if (check){
    return res.status(400).json({success:false,errors:"existing user found with same email address"})
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i]=0;
  }
  const user = new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart,
  })

  await user.save();

  const data={
    user:{
        id:user.id
    }
   }
    const token  = jwt.sign(data, 'secret_ecom');
    res.json({success:true,token})
})

//Creating Endpoint for  user login
app.post('/login',async()=>{
    let user  = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password=== user.password;
       if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
      else{
        res.json({success:false,errors:"Wrong Password"});
    }
  }
    else{
        res.json({success:false,error:"Wrong Email Id"})
    }
})


















app.listen(port, (error) => {
    if (!error){
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});
