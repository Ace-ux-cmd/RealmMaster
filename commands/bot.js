const Chat = require("../db/chat");
let count = 0
let  chatInfo;
let message;
let secs = 0
let mins =0
let hrs =0
let days =0
   // Time settings
  setInterval(()=>{
    if(secs >= 60){
    secs = 0
    mins++
}else{
    secs++
}
if(mins >= 60){
    mins =0
    hrs++
}
if (hrs >= 24){
    hrs=0
    days++
}
},1000)

//count all commands
    require("fs").readdirSync("./commands").forEach((file)=>{
        if(file.endsWith(".js")) count++
      })
module.exports = (bot) =>{
    bot.onText(/\/bot/,async(msg)=>{
if(msg.from.id === 5205724214 ){
 

    const chat = await Chat.find();
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
Bot is running for ${days}Days ${hrs}Hours ${mins}Minutes and ${secs}Seconds

💬 Chat Overview
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