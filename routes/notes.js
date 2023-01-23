const express = require("express")
const isLoggedIn = require("../middleware/isLoggedin")
const { body, validationResult } = require("express-validator")
const Note = require("../models/Note.schema")
const router = express.Router()

/***************************************************************
 * @route - http://127.0.0.1:4000/api/auth/createnote
 * @type - POST
 * @description - create note in the database, login required
 ***************************************************************/

router.post("/createnote",[
    body('title', "name must be 3 characters").isLength({ min: 3 }),    
    body('description', "description must be 5 characters").isLength({ min: 5 }),    
], isLoggedIn, async (req, res)=>{
    try {
         // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        // if there are errors returns bad request and the errors
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tag } = req.body

        const note = await Note.create({
            title,
            description,
            tag,
            user: req.user.id
        })

        return res.status(200).json({
            success: true,
            note
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

/***************************************************************
 * @route - http://127.0.0.1:4000/api/auth/getnotes
 * @type - get
 * @description - returns all the notes of the logged-in user, login required
 ***************************************************************/

router.get("/getnotes", isLoggedIn, async (req, res)=>{
    try {
        const notes = await Note.find({user: req.user.id})
        return res.status(200).json({
            success: true,
            notes
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})


/***************************************************************
 * @route - http://127.0.0.1:4000/api/auth/updatenotes
 * @type - PUT
 * @description - returns the updated note, login required
 ***************************************************************/

router.put("/updatenote/:id", isLoggedIn, async (req, res)=>{
    try {

        const note = await Note.findById(req.params.id)
        if(!note){
            return res.status(400).json({
                success: false,
                message: "Could not find the note"
            })
        }

        // checking if the note belongs to the user or not 
        if(note.user.toString() !== req.user.id){
            return res.status(400).json({
                success: false,
                message: "not a valid user"
            })
        }

        const { title, description, tag } = req.body;

        if(!title || !description || !tag){
            return res.status(400).send("please fill all the details")
        }

        const updatedData = {
            title,
            description,
            tag
        }

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, updatedData,{ new: true})

        return res.status(200).json({
            success: true,
            message: updatedNote
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
})


/***************************************************************
 * @route - http://127.0.0.1:4000/api/notes/deletenote/:id
 * @type - DELETE
 * @description - returns the deleted note, login required
 ***************************************************************/

router.delete("/deletenote/:id", isLoggedIn, async (req, res)=>{
    try {

        const note = await Note.findById(req.params.id)
        if(!note){
            return res.status(400).json({
                success: false,
                message: "Could not find the note"
            })
        }

        // checking if the note belongs to the user or not 
        if(note.user.toString() !== req.user.id){
            return res.status(400).json({
                success: false,
                message: "not a valid user"
            })
        }

        const deletedNote = await Note.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            success: true,
            message: deletedNote
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
})







module.exports = router