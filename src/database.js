const { Pool } = require("pg")

const pool = new Pool({
    host: "localhost",
    port: 5434,
    user: "postgres",
    password: "postgres",
    database: "autenticacao"
})

module.exports = pool