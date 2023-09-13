const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser')
const Person =require('./personSchema.js')

const app = express()
const PORT = process.env.PORT || 8000

// DB config
mongoose.connect(process.env.mongo,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

  mongoose.connection.on('error', error => {
    console.error('Error in MongoDb connection: ' + error);})

  mongoose.connection.on('connected', () => console.log('database is connected...'));

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');})

// middlewares

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// CRUD Api(s)
// Create
app.post('/api',async(req,res)=>{
    try {

        const person = new Person({
            name: req.body.name,
            
        })

        const savedPerson = await person.save()
        res.status(200).json(savedPerson)
    } catch (err) {
        console.log(err)
    }
})


// Read
app.get( '/api/user_id',async(req, res) => {
    try {
        const person = await Person.findOne(req.params.id)
        res.status(200).json(person)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update
app.put('/api/user_id',async(req, res, next) => {
    try {
        const updatedPerson = await Person.findOneAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedPerson)
    } catch (err) {
        res.status(500).json(err)
    }
})


// Delete
app.delete( "/api/user_id",async(req, res) => {
    try {
        Person.findByIdAndDelete(req.params.id)
        res.status(200).json("Person has been deleted")
    } catch (err) {
         res.status(500).json(err)
    }
})



// listener
app.listen(PORT,()=>{ 
    console.log(`server is listening on port ${PORT}...`)
})