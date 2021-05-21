const express = require('express');

const db = require("./config/mongoose");
const Contact = require("./models/contact");
const app = express();
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");



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
        console.log("********", new_contact);
    })


    res.redirect("/");
});

app.get("/delete/:phone", function (req, res) {
    const phone = req.params.phone;

    const index = contactList.findIndex(contact => contact.phone == phone);

    if (index != -1) {
        contactList.splice(index, 1);
    }
    res.redirect("/");
});
app.listen(3000, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Server Is Running!!!!");
});