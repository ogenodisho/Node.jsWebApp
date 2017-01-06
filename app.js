var express = require("express")
var path = require("path");
var bodyParser = require("body-parser")
var express_dot = require('express-dot-engine')
var mongoose = require('mongoose')
var mongoConfig = require('./config/database')

// mongoose
mongoose.Promise = global.Promise; // to remove deprecation warning: http://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise
mongoose.connect(mongoConfig.url);
var db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", function() {
    app.listen(3000, function() {
        console.log("Magic happens on port 3000!");
    });
});

var app = express()

app.engine('html', express_dot.__express);
app.set('views', path.join(__dirname, './public/dot_views'));
app.set('view engine', 'html');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
app.use(express.static(path.join(__dirname, "public")));

// routes
require('./routes')(app);
