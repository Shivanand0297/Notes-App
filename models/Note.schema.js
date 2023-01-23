const mongoose = require("mongoose")
const NoteSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            default: "General",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
        
    },
    {
        timestamps: true
    }
)

const Note = mongoose.model("Note", NoteSchema)
module.exports = Note 