const mongoose = require('mongoose');
const validator = require('validator');

const errorCodes = require('../constants/errorCodes');


const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        validate:(value)=>{
            if(value === ''){
                throw new Error(errorCodes.task.invalidTitleError)
            }
        }
    },
    description: {
        type: String,
        required: true,
        trim: true,
        validate:(value)=>{
            if(value === ''){
                throw new Error(errorCodes.task.invalidDescError)
            }
        }
    },
    // status:{
    //     type: String,
    //     required: true,
    //     validate: (value) =>{
    //         const validStatus = ['ToDo', 'inProgress', 'Done'];
    //         if(validStatus.indexOf(value) === -1){
    //             throw new Error(errorCodes.task.inValidStatusError)
    //         }
    //     }
    // },
    isComplete: {
        type: Boolean,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
},{timestamps: true})

module.exports = mongoose.model('Task',taskSchema)