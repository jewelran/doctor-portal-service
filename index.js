const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

console.log(process.env.DB_USER,process.env.DB_PASS);


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cb95t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("storeAppointment").collection("storeAppointmentInfo");
  app.post("/addAppointment",(req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
    .then(response => {
      res.send(response.insertedCount > 0)
    })
  });
   
  app.post("/appointmentByDate", (req, res) =>{
    const date = req.body;
    appointmentCollection.find({date: date.data})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  
});

app.get("/", (req, res) => {
  res.send("Hello World! i am here");
});

app.listen(process.env.PORT || port);
