require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))

app.use(morgan('tiny'))
/*
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
    let d = new Date()
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has ${persons.length} people<br>${d}</p>`)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(205).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(body.name === "" || !body.number === ""){
        return response.status(400).json({
            error:'content missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name : body.name,
        number : body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.messsage)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})