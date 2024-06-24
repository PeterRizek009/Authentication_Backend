require("dotenv").config()


//init server
const express = require("express");

//init express app
const app = express();
const connectDB = require("./config/dbConfig")
const mongoose = require("mongoose");
const cors = require("cors")
const path = require("path")
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const Port = process.env.PORT || 5000;


connectDB();

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

//routes 
app.use("/", express.static(path.join(__dirname, "public")));
app.use('/', require("./routes/root"));
app.use('/auth', require("./routes/authRoutes"));
app.use('/users', require("./routes/userRoutes"));


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if (req.accepts("json")) {
        res.json({ message: "404 not found" })
    } else {
        res.type('txt').send("404 not found")
    }
})

mongoose.connection.once('open', () => {
    console.log("connected");
    app.listen(Port, () => {
        console.log(`server runing on port ${Port}`);
    });

})

mongoose.connection.on('error', (err) => {
    console.log(err);
})




