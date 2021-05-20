const express =  require("express");
const path = require("path");
const app = express();
const db = require("./connection");
const hbs = require("hbs");
const { rawListeners } = require("process");
const bodyParser = require("body-parser")
const port = process.env.PORT || 3000
const Register =  require("./user");
const Task = require("./taskSchema");
const crypto =require("crypto");
const bcryptjs = require("bcryptjs");
const bcrypt = require("bcrypt");



const static_path = path.join(__dirname, "views");
const template_path = path.join(__dirname, "./templates/views")
const partial_path = path.join(__dirname, "./templates/partials")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(static_path));
app.set("views", template_path);
hbs.registerPartials(partial_path);
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.get("/", (req,res) =>{
    res.render("index");
})

app.get("/register", (req,res)=>{
    res.render("register");
})

app.get("/login", (req,res) =>{
    res.render("login");
})

app.get("/insert", (req,res) =>{
    res.render("insert");
})



app.post("/register",  async(req,res)=>{
    try{
        const pass = req.body.pass;
        const confirmPass = req.body.confirmPass;
       
        if(pass === confirmPass){
            
           const userRegister = new Register({
                userId : crypto.randomBytes(64).toString('hex'),
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                pass:req.body.pass,
                confirmPass:req.body.confirmPass
              });
            console.log(userRegister);

            const token = await userRegister.generateAuthToken();
            console.log("token"+ token);
        
            const registered = await userRegister.save();
            res.render("index");
            return token;
            
        }else{
            res.send("Password does not match");
        }
    }catch(error){
        res.status(400).send(error);
        console.log("error part");
    }
})


app.post("/login", async(req,res) => {
    try{
        const email = req.body.email;
        const pass = req.body.pass; 
        
        const userEmail = await Register.findOne({email:email});
        const isMatch = await bcrypt.compare(pass, userEmail.pass);
        
        
        if(isMatch)
        {
                res.render("index");
                
        }else{
            res.send("invalid login deatils");
        }
    }catch(error){
        res.status(400).send("invalid login deatils");
    }
    
})


app.post("/insert", async(req, res) => {
    const task = req.body.task;
    const addTask= new Task({ task });

    addTask
      .save()
      .then(() => {
        console.log("Successfully added task!");
        console.log(addTask);
        res.send(addTask);
      })
      .catch((err) => console.log(err));
  })


app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});
