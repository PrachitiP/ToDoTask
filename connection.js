const mongoose = require("mongoose");
//mongodb+srv://Prachiti:PrachitiCP513@cluster0.lunhk.mongodb.net/ToDoTask
mongoose.connect("mongodb+srv://Prachiti:PrachitiCP513@cluster0.lunhk.mongodb.net/User_data", {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.log(`no connection`);
})