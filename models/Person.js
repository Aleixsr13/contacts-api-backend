const { Schema, model } = require('mongoose')

const personSchema = new Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = model('Person', personSchema)

/*
Person.find({}).then((result) => {
  console.log(result)
  mongoose.connection.close()
})

const person = new Person({
  name: 'Test db',
  number: '131313',
})

person
  .save()
  .then((result) => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch((err) => {
    console.error(err)
  })
*/

module.exports = Person
