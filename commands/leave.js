module.exports = (bot) =>{
    bot.on("message", (msg)=>{
        let left = msg.left_chat_member
        if(!left) return;
        const message = `Please someone should bring back ${left.first_name}`
    bot.sendMessage(msg.chat.id, message,  {reply_to_message_id: msg.message_id} )
    })
}