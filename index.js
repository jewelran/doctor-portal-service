const express = require('express')
require('dotenv').config()
const cors = require('cors')
const  bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.json())


const port =process.env.PORT || 5000



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dqp4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
 
});







app.get('/', (req, res) => {
  res.send('Hello World! i am here')
})

app.listen (process.env.PORT || port)