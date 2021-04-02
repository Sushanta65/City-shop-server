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


app.use(cors())
app.use(bodyParser.json())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("CityShops").collection("products");
  const ordersCollection = client.db("CityShops").collection("orders"); 
        
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
    /////// Add Products
    app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      productsCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })
    ////// Add Orders
    app.post('/addOrder', (req, res) => {
      const order = req.body;
      ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })

    app.get('/orders', (req, res) => {
      ordersCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })

    app.get('/', (req, res) => {
      res.send("Your Deployed Code is Working!")
    })

    // Delete Product
     app.delete('/delete/:id', (req, res) => {
       const id = ObjectId(req.params.id)
       productsCollection.findOneAndDelete({_id: id})
       .then((err, documents) => {
         res.send(documents)
       })
    })

});


// const port = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080)