const mongoose = require("mongoose");
const db = require("./keys").mongoURI;

module.exports = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      auth: {
        user: "homecare",
        password: "Homecare.321"
      }
    })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));
};
