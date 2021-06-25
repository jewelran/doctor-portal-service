const express = require("express");
require("dotenv").config();
const cors = require("cors");
const fs = require("fs-extra")
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('doctors'))
app.use(fileUpload());
const port = process.env.PORT || 5000;



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cb95t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("storeAppointment").collection("storeAppointmentInfo");
  const doctorsCollection = client.db("doctorPortal").collection("doctors");
  app.post("/addAppointment",(req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
    .then(response => {
      res.send(response.insertedCount > 0)
    })
  });
   
  app.post("/appointmentByDate", (req, res) =>{
    const date = req.body;
    const email = req.body.email
    doctorsCollection.find({email:email})
    .toArray((err, doctors) => {
      const filter ={date: date.data}
        if (doctors.length === 0) {
          filter.email = email
        }
        appointmentCollection.find(filter)
        .toArray((err, documents) => {
          res.send(documents)
        })
    })
    
  })
  app.post('/isDoctors',(req, res) =>{
    const email = req.body.email;
    // console.log(email);
    doctorsCollection.find({email:email})
    .toArray((err, doctors)=>{
      res.send(doctors.length > 0)
    })
    
  })


  app.get("/appointment" ,(req, res) =>{
    appointmentCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post ("/addADoctors", (req, res) => {
    const file = req.files.file;
    const email = req.body.email;
    const name = req.body.name;
  // const filePath =`${__dirname}/doctors/${file.name}`;


    // file.mv(filePath, err => {
    //   if (err) {
    //     // consol.log(err)
    //     return res.status(500).send({msg:"failed to upload image"})
    //   }

      const newImg = file.data;
      const encImg = newImg.toString('base64')
  
      var image = {
        contentType: file.mimetype,
        size:file.size,
        img: Buffer.from(encImg, 'base64')
      }

      doctorsCollection.insertOne({email, name, image })
      .then(result  => {
        // fs.remove(filePath, error => {
        //   if (error) {
        //     // console.log(error);
        //     res.status(500).send({msg:"failed to upload images"})
        //   }
          res.send (result.insertedCount > 0)
        })
   
      // })
      // return res.send({name: file.name , path: `/${file.name}`})
    // })
   
   
  })

  app.get('/doctors', (req, res) => {
    doctorsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

 

});

app.get("/", (req, res) => {
  res.send("Hello World! i am here");
});

app.listen(process.env.PORT || port);
