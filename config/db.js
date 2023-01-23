const mongoose = require("mongoose")
mongoose.set('strictQuery', true) // to supress the warning
const MONGO_URI = process.env.MONGO_URI

exports.connectToDb = () =>{
    mongoose.connect(MONGO_URI)
    .then(conn=>{
        console.log(`connected to db http://${conn.connection.host}:${process.env.PORT}`);
    })
    .catch(err=>{
        console.log(`Failed to connect to mongodb ${err.message}`)
        process.exit(1)
    })
}