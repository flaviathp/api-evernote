const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    name: String,
    // tipo de dado, preenchimento obrigatório e tem que ser único (não pode repetir email)
    email: {type: String, required: true, unique: true},
    // tipo de dado e preenchimento obrigatório
    password: {type: String, required: true},
    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

//#region Autenticação

// pre permite que rode um script antes de fazer alterações no banco de dados
// next é pra seguir para o próximo middleware
userSchema.pre('save', function(next) {
    // verifica se a senha é nova ou se foi modificada para então fazer a criptografia
    if (this.isNew || this.isModified(password)) {
        const document = this;
        // o primeiro parâmetro é o valor que vai ser transformado em hash, ou seja, a senha
        // o segundo é a salt0rRound, o número de caracteres aleatórios que vão ser inseridos para gerar o hash
        bcrypt.hash(this.password, 10, 
            (err, hashedPassword) => {
                // se deu erro, envia o erro para o próximo middleware
                // senão, envia a senha criptografada para o próximo middleware
                if (err) {
                    next(err);
                } else {
                    this.password = hashedPassword;
                    next();
                }
            }
        )
    }
});

//#endregion

// #region Validação de Usuário

userSchema.methods.isCorrectPassword = function (password, callback) {
    // método de comparação entre a senha informada e a senha salva
    // same é caso a validação seja verdadeira
    bcrypt.compare(password, this.password, function(err, same) {
        if(err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

// #endregion

module.exports = mongoose.model('User', userSchema);