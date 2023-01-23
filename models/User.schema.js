const mongoose = require("mongoose")
const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        }
        
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", UserSchema)
// User.createIndexes()    // to avoid dublicate entries
module.exports = User