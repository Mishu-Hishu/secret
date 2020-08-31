require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//database
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({email: String, password: String});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});  //database encryption
const User = mongoose.model("User", userSchema);


//GETs
app.get("/", (req,res) => {
	res.render("home");
});

app.get("/login", (req,res) => {
	res.render("login");
});

app.get("/register", (req,res) => {
	res.render("register");
});


//POSTs
app.post("/register", (req,res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	});

	newUser.save((err) => {
		if(!err){
			res.render("secrets");
		} else {
			console.log(err);
		}
	});
});

app.post("/login", (req,res) => {
	User.findOne({email: req.body.username}, (err,user) => {
		if(!err) {
			console.log(user.password);
			if(user.password === req.body.password) {
				res.render("secrets");
			} else {
				res.send("email or password incorrect")
			}
		} else {
			console.log(err);
		}
	});
});

app.listen(8080, () => {
	console.log("server started on 8080");
});