var express = require('express');
var router = express.Router();
const Note = require('../models/note');
const withAuth = require('../middlewares/auth');

// #region Criar nota
// Cria rota para uma nova nota
router.post('/', withAuth, async(req, res) => {
    // retorna o title e o body da requisição
    const { title, body } = req.body;
    // cria uma nova nota com as informações recebidas
    let note = new Note({ title: title, body: body, author: req.user._id });
    
    try {
        // salva a nota
        await note.save();
        // retorna status de sucesso e a nota
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json('Problem to create a new note');
    }
});

// #endregion

module.exports = router;