const mongoose = require("mongoose");
const Pusher = require("pusher");
const keys = require("./keys");


const pusher = new Pusher({
    appId: keys.appId,
    key: keys.key,
    secret: keys.secret,
    cluster: keys.cluster,
    useTLS: true
});

var mongoDB = keys.MongoURL;
// console.log(keys);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', (err) => {
    console.log("Error in Connecting MongoDb", err);
});

db.once('open', function () {
    console.log("Connected To DB Successfully!!!");

    const contactCollection = db.collection("contact_lists");
    const changeStream = contactCollection.watch();
    // console.log(changeStream);
    changeStream.on("change", (change) => {
        // console.log("A change Occured", change);
        if (change.operationType == "insert") {
            const contactDeatils = change.fullDocument;
            pusher.trigger("contacts", "inserted", {
                name: contactDeatils.name,
                phone: contactDeatils.phone,
            });
        } else {
            console.log("Error in Triggering Pusher");
        }
    });

});