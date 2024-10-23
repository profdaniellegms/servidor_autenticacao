const bcrypt = require("bcrypt")
const client = require("./database")
const jwt = require("jsonwebtoken")

// Esta é uma função assíncrona porque se comunica com o Banco de Dados
exports.register = async (req, res) => {
     // Recebe do fronend o email e a senha
    // Localiza via name o elemento no body da página
    const { email, senha } = req.body;
    try {
        // Verifica se o usuário está cadastrado no banco de dados
        // O resultado da consulta é armazenado na variável "data"
        const data = await client.query(`SELECT * FROM usuarios WHERE email= $1;`, [email]); 
        // As linhas do resultado são jogadas dentro da variável "user"
        // Assim, "user" se torna um array de usuários
        const user = data.rows;
        // Se o array "user" não estiver vazio, significa que já existe um usuário cadastrado com aquele e-mail
        if (user.length != 0) {
            // Notifica o usuário
            return res.status(400).json({
                error: "Este usuário já está cadastrado. Faça o login.",
            });
        }
        // Se o usuário não for localizado
        else {
            // Encripta a senha digitada pelo usuário
            bcrypt.hash(senha, 10, (err, hash) => {
                if (err)
                    res.status(err).json({
                        error: "Erro interno do servidor",
                    });
                // Cria um usuário com e-mail e senha encriptada
                const user = {
                    email,
                    senha: hash,
                };
                var flag = 1; 
                // Salva usuário na tabela
                client.query(`INSERT INTO usuarios (email, senha) VALUES ($1,$2);`, [user.email, user.senha], (err) => {
                    // Se ocorrer erro ao salvar
                    if (err) {
                        flag = 0; 
                        console.error(err);
                        // Notifica usuário do erro
                        return res.status(500).json({
                            error: "Database error"
                        })
                    }
                    // Do contrário
                    else {
                        flag = 1;
                        // Notifica usuário que o cadastro foi realizado
                        res.status(200).send({ message: 'Usuário criado com sucesso!' });
                    }
                })
                if (flag) {
                    const token = jwt.sign( //Signing a jwt token
                        {
                            email: user.email
                        },
                        "girafa"
                        // process.env.SECRET_KEY
                    );
                };
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error while registring user!", //Database connection error
        });
    };
}