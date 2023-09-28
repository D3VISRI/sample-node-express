const express = require('express');
const app = express();
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.use(express.static("public"));

app.get("/registration", function (req, res) {
    res.sendFile(__dirname + "/registration.html");
});

app.get("/reg", function (req, res) {
    db.collection('students').add({

       Full_name: req.query.fullname,
       Email: req.query.email,
       Password: req.query.password
    })
    .then(() => {
        res.sendFile(__dirname + "/login.html");
    });
});

app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.get("/dashboard", function (req, res) {
    // Handle the dashboard route here, send the dashboard.html file
    res.sendFile(__dirname + "/dashboard.html");
});
app.get("/articles", function (req, res) {
    res.send(__dirname + "/articles.html");
});


app.get("/authenticate", function (req, res) {
    const email = req.query.email;
    const password = req.query.password;

    console.log("Received email:", email);
    console.log("Received password:", password);
    
    db.collection('students')
    .where("Email", "==", email)
    .where("Password", "==", password)
    .get()
    .then((docs) => {
        if (docs.size > 0) {
            // Authentication successful
            res.redirect("/dashboard"); // Redirect to the dashboard route
        } else {
            res.send("CHECK YOUR PASSWORD / EMAIL, LOG IN FAILED");
        }
    })
    .catch((error) => {
        console.error("Error authenticating user:", error);
        res.status(500).send("An error occurred during authentication.");
    });
    // JavaScript code for redirection
   
});

app.listen(3009, function () {  
     console.log('Example app listening on port 3011!');
});
