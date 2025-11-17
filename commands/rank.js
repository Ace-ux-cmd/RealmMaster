const User = require ("../db/user");

module.exports = (bot) =>{
bot.onText(/\/rank/, async (msg)=>{
   try{
        const user = await User.find()
const userCount = user.sort((a,b)=>b.score- a.score)
const leaderBoard = userCount.map(n=> `${n.userName} - ${n.score}Points`)
const position = userCount.findIndex(n => n.userId === msg.from.id);
const displayPosition = position !== -1 ? position + 1 : "Not ranked";


bot.sendMessage(msg.chat.id, `🏆LEADERBOARD:🏅  
${leaderBoard.join("\n")}

You are currently at position: ${displayPosition}`,{reply_to_message_id: msg.message_id})
}catch(err){
    bot.sendMessage(msg.chat.id, "Error getting count Please call admin", {reply_to_message_id: msg.message_id})
    console.log("Error in count.js", err.message)
}
})
}