const express = require('express')
const app = express()
require('dotenv').config()
// Mongo Client 
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
// Uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.in3ti.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 8080;

app.use(cors())
app.use(bodyParser.json())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("CityShops").collection("products");
        
    app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })

    app.get('/products/:id', (req, res) => {
      productsCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err, items) => {
        res.send(items)
      })
      
    })

    app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      productsCollection.insertOne(newProduct)
      .then(result => {
        console.log("result", result.insertedCount)
        res.send(result.insertedCount > 0)
      })
      console.log(newProduct)
    })

});




app.listen(port, console.log(`Run time port is ${port}`))