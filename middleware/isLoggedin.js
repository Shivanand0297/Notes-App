const jwt = require("jsonwebtoken")

const isLoggedIn = (req, res, next) => {
    // getting token from the header
    const token = req.header("auth-token")
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Please authenticate using valid token"
        })
    }

    try {
        const decodeToken = jwt.verify(token, process.env.SECRET)
        console.log(decodeToken);
        if(!decodeToken){
            return res.status(401).json({
                success: false,
                message: "Please authenticate using valid token"
            })  
        }

        req.user = decodeToken
        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })            
    }
}

module.exports = isLoggedIn