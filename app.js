const express =  require("express");
const path = require("path");
const app = express();
const db = require("./connection");
const hbs = require("hbs");
const { rawListeners } = require("process");
const port = process.env.PORT || 3000
const Register =  require("./user");

const static_path = path.join(__dirname, "views");
const template_path = path.join(__dirname, "./templates/views")
const partial_path = path.join(__dirname, "./templates/partials")

app.use(express.static(static_path));
app.set("views", template_path);
hbs.registerPartials(partial_path);
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', (req,res) =>{
    res.render("index")
});

app.get("/register", (req,res)=>{
    res.render("register");
})

app.post("/register", async(req,res)=>{
    try{
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password === confirmpassword){
            const registerUser = new Register({
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword
            })
            const registered =  await registerUser.save();
            res.render("index");
            
        }else{
            res.send("Password does not match");
        }
    }catch(error){
        res.status(400).send(error);
    }
})

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});