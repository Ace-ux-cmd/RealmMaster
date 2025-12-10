require("dotenv").config()
const TelegramBot = require("node-telegram-bot-api")
const fs = require("fs");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_API, {polling:true})
const User = require("./db/user")
const Chat = require("./db/chat");
const path = require("path")
const response = fs.readFileSync(path.join("storage/chat.json"), "utf8")
const chat_response = JSON.parse(response);
const express = require("express");
const fetch = require("node-fetch"); 
const app = express();

fs.readdirSync("./commands").forEach((file)=>{
if (file.endsWith(".js")) require(`./commands/${file}`) (bot)
});


// ✅ Generate Random Delay (5-10 seconds)
function getRandomDelay() {
    return Math.floor(Math.random() * 6 + 5) * 1000; // Random delay between 5000ms (5s) - 10000ms (10s)
}



bot.on("message", async(msg)=>{
try{
    // DB setup
    let user = await User.findOne({userId: msg.from.id})
    let chat = await Chat.findOne({chatId: msg.chat.id})

    // Access user from db
if(!user){
  
    await User.create({
       userName : msg.from.first_name,
        userId: msg.from.id,
        score: 0,
        balance: 0,
        messageCount: 1
    });
    let users = await User.find()

      if(msg.chat.type === "private") {
        bot.sendMessage(5205724214, `New Private user Registered. You now have ${users.length} users` )
       
    }
}else{
    user.messageCount +=1
  await  user.save()
}

// Access chat from db
if (!chat){
    await Chat.create({
        chatName: msg.chat.title|| msg.chat.first_name,
        chatId: msg.chat.id,
        chatType: msg.chat.type,
        totalMessages:1
    })
}else{
    chat.totalMessages += 1
    await chat.save()
}

// Inline chat 


if(chat.inlineChat){
  if(msg.text.includes("/")) return;

 // ✅ Show Typing Indicator with Random Delay
    const typingDelay = getRandomDelay();
    bot.sendChatAction(msg.chat.id, "typing");

   // ✅ Wait after typing ends before sending response
            setTimeout(() => {
               bot.sendMessage(msg.chat.id, `${chat_response[Math.floor(Math.random()*chat_response.length)]}`, {reply_to_message_id : msg.message_id})
            }, typingDelay);
             
            }

}catch(err){
    console.log(err)
}
})


// 1. Simple endpoint to respond to pings
app.get("/", (req, res) => {
  res.send("Bot is running ✅");
});

// 2. Start server on Render's PORT or default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// 3. Self-ping every 25 minutes to keep Render awake
const BOT_URL = process.env.BOT_URL;

setInterval(async () => {
  try {
    await fetch(BOT_URL);
    console.log("Self-ping successful ✅");
  } catch (err) {
    console.error("Self-ping failed ❌", err);
  }
}, 25 * 60 * 1000); // 25 minutes

bot.on("polling_error",(err)=> console.log("Polling Error",err.message))