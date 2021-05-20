const express = require('express');



const app = express();
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");



let contactList = [
    {
        name: "Satyansh",
        phone: "1234567890"
    },
    {
        name: "ACF",
        phone: "3556363663"
    }
];
app.get("/", function (req, res) {
    // console.log(contactList);
    return res.render("home",
        {
            title: "Contact List",
            contact: contactList
        }
    );
});

app.post("/add-contact", function (req, res) {
    console.log(req.body);
    contactList.push(req.body);

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