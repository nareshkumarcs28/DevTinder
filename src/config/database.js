const mongoose = require('mongoose');

const connectDB = async () => {
   await mongoose.connect("mongodb+srv://namastenode:gu96IsmoMvPCLXIL@namastenode.nvq6asc.mongodb.net/devTinder");
}
module.exports = connectDB; 
