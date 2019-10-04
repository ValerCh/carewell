const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Connect to MongoDB
require("./server/config/db")();

// // Passport config
// require("./server/config/passport")(app);

// Cors
require("./server/config/cors")(app);

// Routes
require("./server/routes")(app);

const port = process.env.PORT || 8765;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
