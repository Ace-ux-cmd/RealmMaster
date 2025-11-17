const User = require ("../db/user");

module.exports = (bot) =>{
bot.onText(/\/count/,  (msg)=>{
   setTimeout (async() => {
    try{
        const user = await User.find()
const userCount = user.sort((a,b)=>b.messageCount - a.messageCount)
const leaderBoard = userCount.map(n=> `${n.userName} - ${n.messageCount}messages`)
const position = userCount.findIndex(n => n.userId === msg.from.id);
const displayPosition = position !== -1 ? position + 1 : "Not ranked";

bot.sendMessage(msg.chat.id, `Total messages: 
${leaderBoard.join("\n")}

You are currently at position: ${displayPosition}`,{reply_to_message_id: msg.message_id})
}catch(err){
     bot.sendMessage(msg.chat.id,`⚠️ Oops! Something didn’t go as planned.
           Try the command again or continue with other commands. 👍
           If the issue persists, you can reach out to my admin using /callad `, {reply_to_message_id: msg.message_id})
    console.log("Error in count.js", err.message)
}
},1000)
})
}