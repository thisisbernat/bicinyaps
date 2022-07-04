// models/Nyap.model.js
const { Schema, model } = require('mongoose');

const nyapSchema = new Schema(
    {
        category: {
            type: String,
            enum : ['interruptus','badConnection', 'detour', 'degredation', 'width', 'signaling', 'parking', 'obstacles', 'others'],
            required: [true, 'Category is required.'],
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
        authorEmail: String
    }
);

module.exports = model('Nyap', nyapSchema);
