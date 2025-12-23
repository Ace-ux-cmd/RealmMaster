const Chat = require("../db/chat");
const User = require("../db/user");
let uptime = (new Date()).toLocaleString();

let count = 0
let  chatInfo;
let message;

//count all commands
    require("fs").readdirSync("./commands").forEach((file)=>{
        if(file.endsWith(".js")) count++
      })
module.exports = (bot) =>{
    bot.onText(/\/bot/,async(msg)=>{
if(msg.from.id == process.env.BOT_OWNER_ID ){
 

    const chat = await Chat.find();
    const user = await User.find();
    // Map through each messages and retun their values
   if(chat){
 chatInfo = chat.map(n=> `ChatName: ${n.chatName}, chatId: ${n.chatId}, chatType: ${n.chatType}, totalMessages: ${n.totalMessages}.\n`)
//  Set message  
 message =  `🛡️ REALMMASTER PANEL
====================

Name: RealmMaster🧙‍♂️
Status: 🟢 Online
Command Count: ${count}

⚙️UPTIME⚙️
Bot has been running since ${uptime}

💬 Chat Overview
👥 Current Users: ${user.length}

Current Chats: \n
${chatInfo.join("\n")}

====================
Created By: Elvis`
  
}else {
     bot.sendMessage(msg.chat.id, "No chat found",{reply_to_message_id: msg.message_id})
     return;
}
}else message =  "Only bot's admin can use this command"
bot.sendMessage(msg.chat.id, message,{reply_to_message_id: msg.message_id})
    })
}