const bcrypt = require("bcrypt")
const client = require("./database")
const jwt = require("jsonwebtoken")

// Esta é uma função assíncrona porque se comunica com o Banco de Dados
exports.login = async (req, res) => {
    // Recebe do fronend o email e a senha
    // Localiza via name o elemento no body da página
    const { email, senha } = req.body
    try {
        // Verifica se o usuário está cadastrado no banco de dados
        // O resultado da consulta é armazenado na variável "data"
        const data = await client.query(`SELECT * FROM usuarios WHERE email= $1;`, [email])
        // As linhas do resultado são jogadas dentro da variável "user"
        // Assim, "user" se torna um array de usuários
        const user = data.rows
        // Se o array "user" estiver vazio, significa que não foi localizado um usuário com aquele e-mail, ou seja, o usuário não está cadastrado
        if (user.length === 0) {
            // Devolve a seguinte mensagem para o frontend
            res.status(400).json({
                error: "Usuário não registrado. Cadastre-se!",
            });
        }
        // Caso o usuário tenha sido localizado
        else {
            // Encripta a senha digitada pelo usuário e compara com a senha guardada em hash
            bcrypt.compare(senha, user[0].senha, (err, result) => { 
                // Se acontecer erro no servidor
                if (err) {
                    // Retorna erro para o usuário
                    res.status(500).json({
                        error: "Erro interno no servidor",
                    })
                // Se a senha for validada
                } else if (result === true) { 
                    // Cria um token de acesso para o usuário
                    const token = jwt.sign(
                        {
                            email: email,
                        },
                        // process.env.SECRET_KEY
                        "girafa"
                    );
                    // res.status(200).json({
                    //     message: "User signed in!",
                    //     token: token,
                    // });
                    // Store the token in a cookie or pass it to the front-end
                    // Você pode guardar o token nos cookies do navegador
                    res.cookie('token', token, { httpOnly: true });
                    // Redireciona o usuário para a home page após confirmar o login
                    return res.status(200).redirect('/home');
                }
                // Se a senha não foi validada
                else {
                    // Informa o usuário que a senha está incorreta
                    if (result != true)
                        res.status(400).json({
                            error: "Senha incorreta!",
                        });
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error occurred while signing in!", //Database connection error
        });
    };
};