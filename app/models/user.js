const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    // tipo de dado, preenchimento obrigatório e tem que ser único (não pode repetir email)
    email: {type: String, required: true, unique: true},
    // tipo de dado e preenchimento obrigatório
    password: {type: String, required: true},
    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);