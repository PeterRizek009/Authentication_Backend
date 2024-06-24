
const User = require('../model/user')


const getAllUsers = async (req , res)=> {

   const users = await User.find().select("-password").lean();

   if(!users.length){
    return res.status(400).json({message: "there aren't any users"})
   }

    res.json(users)
   
}

module.exports = {
    getAllUsers
}