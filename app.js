const express =  require("express");
const path = require("path");
const app = express();
const db = require("./connection");
const hbs = require("hbs");
const { rawListeners } = require("process");
const bodyParser = require("body-parser")
const port = process.env.PORT || 3000
const Register =  require("./user");

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

app.get('/', (req,res) =>{
    res.render("index")
});

app.get("/register", (req,res)=>{
    res.render("register");
})

app.get("/login", (req,res) =>{
    res.render("login");
})
app.post("/register", async(req,res)=>{
    try{
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        console.log(req.body);
        if(password === confirmpassword){
           /* const registerUser = new Register({
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                password:password,
                confirmpassword:confirmpassword
            })*/
            //const registered =  await registerUser.save();
            Register.create({firstname: req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                password:password,
                confirmpassword:confirmpassword}, function (err, small) {
                if (err) return console.log(err);
                // saved
                console.log(small);
              });
            res.render("index");
            
        }else{
            res.send("Password does not match");
        }
    }catch(error){
        res.status(400).send(error);
    }
})

app.post("/login", async (req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password; 
       
        const userEmail = await Register.findOne({email:email});
        if(userEmail.password === password)
        {
                res.render("index");
        }else{
            res.send("invalid login deatils");
        }
    }catch(error){
        res.status(400).send("invalid login deatils");
    }
})

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});