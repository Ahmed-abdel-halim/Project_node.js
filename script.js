const express = require("express");
const dotenv = require("dotenv").config();
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');


const authRouters = require('./routes/authRouters');
const userRoutes = require('./routes/userRoutes');
const managerRoutes = require('./routes/managerRoutes');
const adminController =require("./routes/adminRoutes");
const contactController = require("./routes/contactRotes")


// express app
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// middleware for logger
if(process.env.NODE_ENV == "development"){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}


// Routes
app.get('/', (req, res)=>{
    res.send('Our API');
});
// check roles
// auth
app.use("/website/auth",authRouters);
// user
app.use("/website/role",userRoutes);
// mamnger
app.use("/website/manage", managerRoutes);
// admin route
app.use("/website/edit", adminController);
// contact route
app.use("/website/contact", contactController);



// test

// check server
app.use((err, req, res, next) => {
	console.error('Error:', err.message);
	res.status(500).send(('Something Broken'));
});

// checked 
app.post('/serverinfo', (req, res)=>{
    const name = req.body.name;
    console.log(name);
    console.log(req.body); 
    console.log(req.params); 
    res.send(name)
})

//start the server
const PORT = process.env.PORT ||4000;
app.listen(PORT, ()=>{
    console.log(`server is rnning at http://localhost:${PORT}`);
});
