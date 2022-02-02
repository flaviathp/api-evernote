const mongoose = require('mongoose');

let noteSchema = new mongoose.Schema({
    title: String,
    body: String,
    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    author: {
        // tipo de dado: id do mongoose
        type: mongoose.Schema.Types.ObjectId,
        // tabela na qual está sendo referenciado, no caso o banco de dados de usuários
        ref: 'User',
        // relação obrigatória
        required: true
    }
});

// cria um index para pesquisa
noteSchema.index({ 'title': 'text', 'body': 'text' });

module.exports = mongoose.model('Note', noteSchema);