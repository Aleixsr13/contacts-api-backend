require('dotenv').config()

require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/Person')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

const date = new Date()

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const monthsOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const dayOfWeek = daysOfWeek[date.getDay()]
const month = monthsOfYear[date.getMonth()]
const year = date.getFullYear()
const day = date.getDate()
const hours = date.getHours().toString().padStart(2, '0')
const minutes = date.getMinutes().toString().padStart(2, '0')
const seconds = date.getSeconds().toString().padStart(2, '0')
const timezone = date.toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]

app.get('/', (request, response) => {
  response.send('<h1>Hola</h1>')
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then((count) => {
    response.send(
      `<h2>Phonebook has info for ${count} people</h2>
      <p>${dayOfWeek} ${month} ${day} ${year} ${hours}:${minutes}:${seconds} ${timezone}</p>`
    )
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const person = request.body

  const newPersonInfo = {
    name: person.name,
    number: person.number,
  }

  Person.findByIdAndUpdate(id, newPersonInfo, { new: true })
    .then((result) => {
      response.json(result)
    })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body

  if (!person || !person.name) {
    return response.status(400).json({
      error: 'person.name is missing',
    })
  } else if (!person.number) {
    return response.status(400).json({
      error: 'person.number is missing',
    })
  }

  Person.find({ name: person.name })
    .then((result) => {
      if (result.length > 0) {
        return response.status(409).json({
          error: 'name must be unique',
        })
      } else {
        const newPerson = new Person({
          name: person.name,
          number: person.number,
        })

        newPerson.save().then((savedPerson) => {
          response.status(201).json(savedPerson)
        })
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
