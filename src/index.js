// Importação de bibliotecas
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const db = require('./database')
const router = require("./routes")

// Conexão ao banco de dados
db.connect((err) => {
    if(err) {
        console.log(err)
    }
    else {
        console.log("Conectado ao banco de dados")
    }
})

// Constroi o servidor
const server = express() 
server.use(cors())
server.use(bodyParser.json())
server.use(express.urlencoded({ extended: true }))
server.use(cookieParser())

// Rotas
server.use(router)
server.get("/", (req, res) => res.sendFile(__dirname+"/pages/login.html"))
server.get("/register", (req, res) => res.sendFile(__dirname+"/pages/register.html"))
server.get("/home", (req, res) => res.sendFile(__dirname+"/pages/home.html"))

// Coloca o servidor online
server.listen(3333, () => {
    console.log("Servidor online na porta 3333")
})