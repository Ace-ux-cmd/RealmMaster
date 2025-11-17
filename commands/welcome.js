module.exports = (bot) =>{
    bot.on("message", (msg)=>{
        let newMember = msg.new_chat_member
        if(!newMember) return;
        const message = `Welcome ${newMember.first_name} to ${msg.chat.title}. I am Realmmaster here to keep things light and interesting. Click /help to see my commands`
    bot.sendMessage(msg.chat.id, message, {reply_to_message_id: msg.message_id} )
    })
}