const User = require ("../db/user")

module.exports = (bot)=>{
    bot.onText((/\/daily/), (msg)=>{
        let luck = Math.floor(Math.random()*100)+1
        let points = Math.round(luck/4)
setTimeout(async()=>{
    try{
    let user = await User.findOne({userId:msg.from.id})
if(!user){
bot.sendMessage(msg.chat.id, "Please try again", {reply_to_message_id:msg.message_id})
return;
}
if(new Date().getDay() ===user.lastDaily){
bot.sendMessage(msg.chat.id, "Today's daily has already been claimed, try again tomorrow", {reply_to_message_id:msg.message_id})

}else{
    bot.sendMessage(msg.chat.id, `🎁 Daily Reward Claimed
Your account has been credited. Enter /balance to view`, {reply_to_message_id:msg.message_id})
    user.balance += luck 
    user.score += points
    user.lastDaily = new Date().getDay()
    await user.save()
}

    }catch(err){
        bot.sendMessage(msg.chat.id,`⚠️ Oops! Something didn’t go as planned.
           Try the command again or continue with other commands. 👍
           If the issue persists, you can reach out to my admin using /callad `, {reply_to_message_id: msg.message_id})
        console.log(`Error in daily.js`, err.message)
    }
},0)
    })
}