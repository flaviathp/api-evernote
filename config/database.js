// importa o mongoose
const mongoose = require('mongoose');
// conecta o mongoose com a promise global
mongoose.Promise = global.Promise;

// conecta o mongoose com o banco de dados local
mongoose.connect('mongodb://localhost/ApiNote', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex cria index automaticamente, usado para fazer buscas no banco de dados
  useCreateIndex: true
}).then(() => console.log('Connection succesful'))
  .catch((err) => console.error(err));