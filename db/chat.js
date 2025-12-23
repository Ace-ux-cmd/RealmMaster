const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("chat.js connected successfully"))
.catch((e)=>console.log("Error connecting to chat database",e.message ));

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String
    },
    chatId: {
        type: Number
    },
    chatType: {
        type : String
    },
    totalMessages:{
        type : Number
    },
    inlineChat : {
        type : Boolean
    }
});

const Chat = mongoose.model("Chat", chatSchema)

module.exports = Chat