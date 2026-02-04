const {Client} = require("pg");
const client = new Client({
    user: "me",
    host: "localhost",
    database: "investment_db",
    password: "me",
    port: 5432,
});
client.connect();
module.exports = client;