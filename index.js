const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('tiny', {
    skip: function (req, res) { return req.method == "POST" }
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post', {
    skip: function (req, res) { return req.method != "POST" }
}))
app.use(express.json())


let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let personsLength = persons.length
    let d = new Date()
    response.send(`Phonebook has info for ${personsLength} people<br>${d}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 9999999)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error:'content missing'
        })
    }else if(persons.find(({name}) => name === body.name)){
        return response.status(400).json({
            error:'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    morgan.token('post', function (req, res) {
        return JSON.stringify(person)
    })
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})