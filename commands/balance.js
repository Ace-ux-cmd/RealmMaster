const User = require("../db/user.js")

module.exports = (bot) => {
    bot.onText(/\/bal/, async(msg) =>{
if(msg.text.includes('all')){
    try{
        const user = await User.find()
const userCount = user.sort((a,b)=>b.balance- a.balance)
const leaderBoard = userCount.map(n=> `${n.userName} - $${n.balance}`)
const position = userCount.findIndex(n => n.userId === msg.from.id);
const displayPosition = position !== -1 ? position + 1 : "Not ranked";


bot.sendMessage(msg.chat.id, `🏦LEADERBOARD:🏦  
${leaderBoard.join("\n")}

You are currently at position: ${displayPosition}`,{reply_to_message_id: msg.message_id})
}catch(err){
    bot.sendMessage(msg.chat.id,`⚠️ Oops! Something didn’t go as planned.
           Try the command again or continue with other commands. 👍
           If the issue persists, you can reach out to my admin using /callad `, {reply_to_message_id: msg.message_id})
    console.log("Error in count.js", err.message)
}
return;
}

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