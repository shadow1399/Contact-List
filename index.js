const express = require('express');
const cors = require('cors')
const db = require("./config/mongoose");
const Contact = require("./models/contact");
const Pusher = require("pusher");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


app.use(cors());
app.use(express.json());
// let contactList = [
//     {
//         name: "Satyansh",
//         phone: "1234567890"
//     },
//     {
//         name: "ACF",
//         phone: "3556363663"
//     }
// ];


app.get("/", function (req, res) {
    // console.log(contactList);
    Contact.find({}, function (err, data) {
        res.render("home",
            {
                title: "Contact List",
                contact: data
            }
        );
    });

});
app.get("/api/v1/contacts", function (req, res) {
    Contact.find({}, function (err, data) {
        return res.status(200).json({
            message: "Data Displayed Succesfuuly",
            contacts: data
        });
    });
})

app.post("/add-contact", function (req, res) {
    console.log(req.body);
    // contactList.push(req.body);
    var user = {
        name: req.body.name,
        phone: req.body.phone
    }

    Contact.create(user, function (err, new_contact) {
        if (err) {
            console.log(err);
            return;
        }
        // console.log("********", new_contact);
    })


    res.redirect("/");
});

app.post("/api/v1/add-contact", function (req, res) {
    // console.log("Data Coming in Node", req.body);
    // contactList.push(req.body);
    var user = {
        name: req.body.contact.name,
        phone: req.body.contact.phone
    }

    Contact.create(user, function (err, new_contact) {
        if (err) {
            console.log(err);
            return;
        }
        // console.log("********", new_contact);

        return res.status(201).json({
            message: "Contact Created"
        });
    })


});

app.get("/delete/:_id", function (req, res) {
    const id = req.params._id;

    Contact.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Successfully Deleted");
    })
    res.redirect("/");
});
app.listen(8000, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Server Is Running!!!!");
});