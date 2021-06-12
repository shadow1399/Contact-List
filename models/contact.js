var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });
var Contact = mongoose.model('Contact_List', contactSchema); //Contact_List is the name of the collection in db

module.exports = Contact;