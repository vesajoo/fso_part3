require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
/*
app.use(morgan('tiny', {
    skip: function (req, res) { return req.method == "POST" }
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post', {
    skip: function (req, res) { return req.method != "POST" }
}))
*/
app.use(express.json())
app.use(cors())


let persons = [
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    let personsLength = persons.length
    let d = new Date()
    response.send(`Phonebook has info for ${personsLength} people<br>${d}`)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error:'content missing'
        })
    }/*else if(persons.find(({name}) => name === body.name)){
        return response.status(400).json({
            error:'name must be unique'
        })
    }*/

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})