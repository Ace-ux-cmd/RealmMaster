const User = require("../db/user.js")

module.exports = (bot) => {
    bot.onText(/\/bal/, async(msg) =>{
    try{
           const user =  await User.findOne({userId: msg.from.id})
bot.sendMessage(msg.chat.id,`You have $${user.balance}`, {reply_to_message_id: msg.message_id})
      
    }catch(err){
        bot.sendMessage(msg.chat.id,`⚠️ Oops! Something didn’t go as planned.
           Try the command again or continue with other commands. 👍
           If the issue persists, you can reach out to my admin using /callad `, {reply_to_message_id: msg.message_id})
        console.log("Error in balance.js", err.message)
    }
    })
}