var express = require('express');
var router = express.Router();
const User = require('../models/user');

// #region Registro de usuários

// rota para cadastro de usuários
router.post('/register', async(req, res) => {
  // requisição que retorna as informações do usuário
  const { name, email, password } = req.body;
  // cria um novo usuário
  const user = new User({ name, email, password });

  try {
    // caso dê certo salvar retorna um status de sucesso e um json com as informoções do usuário
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    // caso dê certo salvar retorna um status de erro e um json com as informoções do usuário
    res.status(500).json({ error: 'Error registring new user' });
  }
});

// #endregion

module.exports = router;
