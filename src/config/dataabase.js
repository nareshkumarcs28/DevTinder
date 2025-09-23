const mongoose = require('mongoose');

const connectDB = async()=>{
   await mongoose.connect("mongodb+srv://jraj785namastedev:R1SKhmoXQTxQXhK2@namastenode.hnkgwsg.mongodb.net/devTinder");
}
module.exports = connectDB;