const Chat = require("../db/chat")
const fs = require ("fs");
const path = require("path")
const response = fs.readFileSync(path.join(__dirname, "../greeting.json"), "utf8")
const data = JSON.parse(response)

module.exports = bot =>{
    // Toggle chat on/off
    bot.onText(/\/chat/, async msg =>{
        try{
            if(msg.chat.type !== 'private'){
                bot.sendMessage(msg.chat.id, "This command is only accessible in private chats", {reply_to_message_id : msg.message_id})
                return;
            }
            const chat = await Chat.findOne({chatId : msg.chat.id})
            if(chat.inlineChat){
                chat.inlineChat = false;
                await chat.save()
                bot.sendMessage(msg.chat.id,"Inline chat disabled. Bye for now")
            }else{
                chat.inlineChat = true
                await chat.save()
                 bot.sendMessage(msg.chat.id,`${data[Math.floor(Math.random()*data.length)]}`)
            }
        } catch (err) {
              bot.sendMessage(
                msg.chat.id,
                "Something went wrong. Try again.\n If the issue persists, you can reach out to my admin using /callad ",
                { reply_to_message_id: msg.message_id }
              );
              console.log("Error in switching chat command on/off", err.message);
            }
        
    })
}