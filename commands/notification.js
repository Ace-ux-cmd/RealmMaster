const Chat = require("../db/chat")
module.exports = (bot) =>{
    bot.onText(/\/notify/, async(msg)=>{
        if (msg.from.id !== 5205724214){
bot.sendMessage(msg.chat.id, "Only bot admin can use this command")
return;
        }
        const [cmd, ...query] = msg.text.split(' ')
        const message = query.join(" ").trim()
try{
    const chat = await Chat.find()
const chatId = chat.forEach(n=>bot.sendMessage(n.chatId, ` 🛠Administrative Notice
+++++++++++++++++++++\n${message}`))
 


}catch(err){
    bot.sendMessage(5205724214, "Error In notification.js")
    console.log("Error sending notification", err.message)
}
    })
}