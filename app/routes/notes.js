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

// #region Pesquisar nota
router.get('/search', withAuth, async(req, res) => {
    // retorna um dos parâmetros da requisição
    const { query } = req.query;

    try {
        let notes = await Note
            // busca pelo autor
            .find({ author: req.user._id })
            // dentro do resultado anterior busca em todos os campos indexados como text
            .find({ $text: { $search: query }});
        res.json(notes);
    } catch {
        res.json({ error: error }).status(500);
    }
});

// #endregion

// #region Baixar nota
router.get('/:id', withAuth, async(req, res) => {
    try {
        // retorna o id dos parâmetros da url
        const { id } = req.params;
        // localiza a nota
        let note = await Note.findById(id);
        if(isOwner(req.user, note)) {
            res.json(note);
        } else {
            res.status(403).json({ error: 'Permission denied' });
        }
    } catch {
        res.status(500).json({ error: 'Problem to get a note' });
    }
});

// #endregion

// #region Baixar lista de notas
router.get('/', withAuth, async(req, res) => {
    try {
        // localiza as notas de um mesmo autor
        let notes = await Note.find({ author: req.user._id });
        res.json(notes);
    } catch {
        res.json({ error: error }).status(500);
    }
});

// #endregion

// #region Atualizar nota
router.put('/:id', withAuth, async(req, res) => {
    // retorna o title e o body da requisição
    const { title, body } = req.body;
    // retorna o id dos parâmetros da url
    const { id } = req.params;

    try {
        // localiza as notas de um mesmo autor
        let note = await Note.findById(id);
        if (isOwner(req.user, note)) {
            let note = await Note.findOneAndUpdate(id,
                { $set: { title: title, body: body }},
                { upsert: true, 'new': true }
            );
            res.json(note);
        } else {
            res.status(403).json({ error: 'Permission denied' });  
        }
    } catch {
        res.status(500).json({ error: 'Problem to update a note' });
    }
});

// #endregion

// #region Deletar notas 

router.delete('/:id', withAuth, async (req, res) => {
    // retorna o id dos parâmetros da url
    const { id } = req.params;

    try {
        // localiza as notas de um mesmo autor
        let note = await Note.findById(id);

        if (isOwner(req.user, note)) {
            await note.delete();
            res.json({ message: 'OK'}).status(204);
        } else {
            res.status(403).json({ error: 'Permission denied' });  
        }
    } catch {
        res.status(500).json({ error: 'Problem to delete a note' });
    }
})

// #endregion

// #region Método isOwner
// verifica se o autor e o usuário são os mesmos
const isOwner = (user, note) => {
    // converte os dados em string e compara se são iguais
    if (JSON.stringify(user._id) == JSON.stringify(note.author._id)) {
        return true;
    } else {
        return false;
    }
};

// #endregion

module.exports = router;