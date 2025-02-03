console.log('May Node be with you')

const MongoClient = require('mongodb').MongoClient
const express = require('express')
const app = express();
const { mongoKey } = require('./config.js');

MongoClient.connect(mongoKey)
    .then(client =>{
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        app.set('view engine', 'ejs')
        app.use(express.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(express.json())
        app.get('/', (req,res)=>{
            quotesCollection.find().toArray()
            .then(results => {
                console.log(results)
                res.render('index.ejs', {quotes: results})
            })
              .catch(error => console.error(error))
        })
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result=>{
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        app.put('/quotes', (req,res)=>{
            console.log(req.body)
        quotesCollection
        .findOneAndUpdate(
            { name: 'Yoda' },
            {
              $set: {
                name: req.body.name,
                quote: req.body.quote,
              },
            },
            {
                upsert: true,
              }
          )
            .then(result => {
                console.log(result)
                res.json('Success')
        })
        .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res) => {
            quotesCollection
                .deleteOne({ name: req.body.name })
                .then(result => {
                    if(result.deletedCount === 0){
                        return res.json('No quote to delete')
                    }
                    res.json(`Deleted Darth Vader's quote`)
            })
        .catch(error => console.error(error))
        
        })

        
        app.listen(3000, function () {
            console.log('listening on 3000')
          })
        
    })

