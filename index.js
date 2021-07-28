const express = require('express');
const cors = require('cors')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const db = require("./config/mongoose");
const Contact = require("./models/contact");
const Pusher = require("pusher");
const keys = require("./config/keys");
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
            return res.status(500).send("Error");
        }
        // console.log("********", new_contact);

        return res.status(201).json({
            message: "Contact Created"
        });
    })


});

app.delete("/delete/:_id", function (req, res) {
    const id = req.params._id;

    Contact.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send("Error");
        }
        console.log("Successfully Deleted");
    })
    res.redirect("/");
});
app.delete("/api/v1/delete/:_id", function (req, res) {
    const id = req.params._id;
    // console.log(id);
    Contact.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        // console.log("Successfully Deleted");
        return res.status(200).json({
            message: "Contact Deleted"
        });
    })
    // res.redirect("/");
});

app.post("/api/v1/register", async function (req, res) {
    try {
        let { email, password, passwordCheck, name } = req.body;
        //validate
        if (!email || !password || !passwordCheck) {
            return res.status(400).json({ msg: "Not all fields have been entered." });
        }
        if (password != passwordCheck) {
            return res.status(400).json({ msg: "Both passwords should match." });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email Already Exists." });
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        var user = {
            name: name,
            email: email,
            password: passwordHash
        }
        const newUser = await User.create(user);

        return res.status(200).json({ msg: "User created Successfully" });

    }
    catch (err) {
        return res.status(400).json({ msg: "Error in creating User." });
    }
});
app.post("/api/v1/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        // console.log("***", email, "*****", password);
        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required." });
        }
        const existUser = await User.findOne({ email: email });
        // console.log(existUser);
        if (!existUser) {
            return res.status(400).json({ msg: "Email does not exist." });
        }
        const isMatch = await bcrypt.compare(password, existUser.password);
        // console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }
        const token = jwt.sign({ id: existUser.id }, keys.JWT_SECRET);
        return res.json({ token, user: { id: existUser.id, name: existUser.name } });

    } catch (err) {
        return res.status(400).json({ msg: "Login failed." });
    }
});

//Check If token is Valid
app.post("/api/v1/tokenIsValid", async function (req, res) {
    try {
        const token = req.header("x-auth-token");
        // console.log(req.headers);
        // console.log(token);
        if (!token) {
            // console.log("Here*******");
            return res.json(false);
        }

        const verified = jwt.verify(token, keys.JWT_SECRET);

        if (!verified) {
            return res.json(false);
        }
        const user = await User.findById(verified.id);
        if (!user) {
            return res.json(false);
        }
        return res.json(true);
    } catch (err) {
        return res.status(500).json({ msg: "Token is Not Valid." });
    }
});




app.listen(8000, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Server Is Running!!!!");
});