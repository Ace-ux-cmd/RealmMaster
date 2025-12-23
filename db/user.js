const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("User connection successful"))
.catch ((err)=>console.log("Error Connecting to user database:", err.message));

const userData = new mongoose.Schema({
userName:{
    type: String
},
    userId: {
    type : Number
},
balance: {
    type : Number
},
score: {
    type: Number
},
messageCount: {
    type: Number
},
lastDaily: {
    type: Number
}
})

const User = mongoose.model("User", userData)


module.exports = User