const allowedOrginis = require("./allowedOrigins")

const corsOptions = {
    origin : (origin , callback) => {
        if(allowedOrginis.indexOf(origin) !== -1 || !origin) {
            callback(null ,true)
        }
        else{
            callback(new Error ("not allowed"))
        }
    },
    credentials : true,
    optionSuccessStatus :200,
    
}


module.exports =  corsOptions;