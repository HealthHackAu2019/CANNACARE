const mongoose = require('mongoose')
require('dotenv').config()

const applicationSchema = new mongoose.Schema({
    text: {
        type:String,
        required: true,
    },
    success: {
        type:Boolean,
    },
    drug: {
        name: {
            type:String,
            required: true,
        },
        administered: {
            type: String,
        }
    },
    indication: {
        type: String,
    },
    ethicCommittee: {
        type: String,
    },
    hrecDate: {
        submission: {
            type: Date,
            required: true,
        },
        response: { 
            type: Date,
        }
    },
    apsDate: {
        submission: {
            type: Date,
        },
        response: { 
            type: Date,
        }
    },
})

const Application = mongoose.model('Application', applicationSchema)

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL);
};

module.exports = {connectDb, Application}