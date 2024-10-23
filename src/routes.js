const express = require('express')
const router = express.Router()
const {register} = require("./register")
const {login} = require("./login")
const {logout} = require("./logout")

// Aciona a função "register" que vem do arquivo "register.js"
router.post('/register' , register) 
// Aciona a função "login" que vem do arquivo "login.js"
router.post('/login' , login)
router.post('/logout', logout)

module.exports = router