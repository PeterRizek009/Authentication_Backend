const mongoose = require('mongoose')
const User = require('../model/user')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


// register controller
const registerNewUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;


    const foundUser = await User.findOne({ email }).exec();


    if (!first_name || !last_name || !email || !password) {
        res.status(400).json({ error: "'All fields are required'" });
    } else if (foundUser) {
        res.status(401).json({ error: "user already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create
        ({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

    const accessToken = jwt.sign({
        userInfo: {
            id: user._id
        }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })

    const refreshToken = jwt.sign({
        userInfo: {
            id: user._id
        }
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

    res.cookie("jwt", refreshToken, {
        httpOnly: true, // only can access by web server
        secure: true,// secure
        sameSite: "None",
        maxAge: 604800
    }
    )

    res.json({ accessToken, email: user.email, first_name: user.first_name, last_name: user.last_name })

}




// login controller
const login = async (req, res) => {
    const { email, password } = req.body;


    const foundUser = await User.findOne({ email }).exec();

    const matchedPassword = await bcrypt.compare(password, foundUser.password);

    if (!email || !password) {
        res.status(400).json({ error: "'All fields are required'" });
    } else if (!foundUser) {
        res.status(401).json({ error: "user doesn't exists" });
    } else if (!matchedPassword) {
        return res.status(401).json({ error: "wrong password " });
    }


    const accessToken = jwt.sign({
        userInfo: {
            id: foundUser._id
        }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })

    const refreshToken = jwt.sign({
        userInfo: {
            id: foundUser._id
        }
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

    res.cookie("jwt", refreshToken, {
        httpOnly: true, // only can access by web server
        secure: true,// secure
        sameSite: "None",
        maxAge: 604800
    }
    )
    res.json({
        accessToken,
        email: foundUser.email,
    })
}


//get  refresh token 
const refresh  = (req, res) => {
    const cookies =  req.cookies;

    if(!cookies?.jwt)
        res.status(401).json({ message :  "unauthorized"})

        const refreshToken =  cookies.jwt
        jwt.verify(refreshToken ,process.env.REFRESH_TOKEN_SECRET , async (err , decoded) => {
              if(err)  res.status(403).json({ message :  "foridden"})

           const foundUser =  await User. findById(decoded.userInfo.id).exec();  
           
           if(!foundUser){
            res.status(401).json({ message :  "unauthorized"})
           }


            const accessToken = jwt.sign({
                userInfo: {
                    id: foundUser._id
                }
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
           


           res.json({accessToken})
        })
    
}


const logout =  (req, res) => {
    const cookies =  req.cookies;

    if(!cookies?.jwt)
        res.sendStatus(201)


    res.clearCookie("jwt" , {
        httpOnly: true, // only can access by web server
        secure: true,// secure
        sameSite: "None",
      
    })

    res.json({message :  "logout successful"})

}



module.exports = {
    registerNewUser,
    login,
    refresh,
    logout
}