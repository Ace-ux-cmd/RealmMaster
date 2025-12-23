const Chat = require("../db/chat")
const botOwner = process.env.BOT_OWNER_ID
module.exports = (bot) =>{
    bot.onText(/\/notify/, async(msg)=>{
        if (Number(msg.from.id) != botOwner){
bot.sendMessage(msg.chat.id, "Only bot admin can use this command")
return;
        }
        const [cmd, ...query] = msg.text.split(' ')
        const message = query.join(" ").trim()
try{
    const chat = await Chat.find()
 chat.forEach(n=>bot.sendMessage(n.chatId, ` 🛠Administrative Notice
+++++++++++++++++++++\n${message}`))
 


}catch(err){
    bot.sendMessage(botOwner, "Error In notification.js")
    console.log("Error sending notification", err.message)
}
    })
}