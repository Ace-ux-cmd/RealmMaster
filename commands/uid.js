module.exports = (bot)=>{
    bot.onText(/\/uid/, (msg)=>{
        bot.sendMessage(msg.chat.id,`Name: ${msg.from.first_name}, Id: ${msg.from.id}, UserName: ${msg.from.username}`,{reply_to_message_id: msg.message_id,})
    })
}