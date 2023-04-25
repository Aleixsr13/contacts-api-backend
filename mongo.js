const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

//conection to mongodb

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Database connection established')
  })
  .catch((err) => {
    console.error(err)
  })
