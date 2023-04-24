const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-12345677',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]
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
  response.send(
    `<h2>Phonebook has info for ${persons.length} people</h2>
    <p>${dayOfWeek} ${month} ${day} ${year} ${hours}:${minutes}:${seconds} ${timezone}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
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

  const ids = persons.map((person) => person.id)
  const maxId = Math.max(...ids)
  const newPerson = {
    id: maxId + 1,
    name: person.name,
    number: person.number,
  }

  if (persons.some((person) => person.name === newPerson.name)) {
    return response.status(409).json({
      error: 'name must be unique',
    })
  } else {
    persons = [...persons, newPerson]

    response.status(201).json(newPerson)
  }
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found',
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
