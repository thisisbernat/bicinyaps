// models/Nyap.model.js
const { Schema, model } = require('mongoose');

const nyapSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'Title is required.'],
        },
        description: String,
        latitude: {
            type: Number,
            required: [true, 'Latitude is required.'],
        },
        longitude: {
            type: Number,
            required: [true, 'Longitude is required.'],
        },
        image: String,
        votes: {
            type: Number,
            default: 1
        },
        created: {
            type: Date,
            default: Date.now
        },
        inMap: {
            type: Boolean,
            default: false
        },
        creator: {
            name: String,
            email: {
                type: String,
                lowercase: true,
                trim: true
            }
        }
    }
);

module.exports = model('Nyap', nyapSchema);
