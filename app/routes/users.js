var express = require('express');
var router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_TOKEN;

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

// #region Login

router.post('/login', async(req, res) => {
  const { email, password } = req.body;

  try {
    // localiza o email
    let user = await User.findOne({ email });
    // verifica se o email está cadastrado
    if(!user) {
      res.status(401).json({ error: 'Incorrect email or password'});
    } else {
      // verifica se a senha está correta
      user.isCorrectPassword(password, function(err, same) {
        if(!same) {
          res.status(401).json({ error: 'Incorrect email or password'});
        } else {
          // secret é a const com o token do .env
          // expireIn é o prazo de validade
          const token = jwt.sign({ email }, secret, { expiresIn: '1d' });
          // retorna o usuário e o token
          res.json({ user: user, token: token });
        }
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal error, please try again' });
  }
});

// #endregion

module.exports = router;
