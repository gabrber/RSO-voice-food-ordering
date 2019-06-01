const DB_NAME = process.env.DB_NAME
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD

db.createUser({user: DB_USERNAME, pwd: DB_PASSWORD, roles: [{role: "readWrite", db: DB_NAME}]})