module.exports = (bot)=>{
    bot.onText(/\/tid/, (msg)=>{
        bot.sendMessage(msg.chat.id,`Name: ${msg.chat.title|| msg.chat.first_name}, Id: ${msg.chat.id}, Type: ${msg.chat.type}`,{reply_to_message_id: msg.message_id,})
    })
}