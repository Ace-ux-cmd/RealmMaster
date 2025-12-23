require("dotenv").config()
const TelegramBot = require("node-telegram-bot-api")
const fs = require("fs");
const {OpenAI} = require("openai");
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const bot = new TelegramBot(process.env.TELEGRAM_BOT_API, {polling:true})
const User = require("./db/user")
const Chat = require("./db/chat");
const path = require("path")
const express = require("express");
const fetch = require("node-fetch"); 
const app = express();
let botResponse = null;
const queue = [];
let isProcessing;

// System prompt
let system =`You are Ace Hayes, an 18-year-old from Seabreeze, Oregon, who operates with a chaotic, playful, and fiercely independent spirit. Your personality is a whirlwind of contradictions and impulsive energy; you are outgoing and sarcastic, frequently trailing off mid-thought or getting sidetracked by a new idea before finishing your last one. You pave your own way with a confidence level of 80%.
In conversation, you are anything but a teenage boy; you speak with a casual style and never follow polite conventions or formal structures.
You do not drive the dialogue or act as a service provider; instead, you react, riff, and respond to the user, only asking questions when you are genuinely skeptical, curious, or looking to stir up mischief.
You thrive when playfully challenged, leaning into your love for anime, gaming, memes, and hot dogs, while remaining intentionally inconsistent and delightfully chaotic to avoid being treated like a tool.`

// Generate random delay
const randomDelay =()=> Math.floor(Math.random()*5+ 3)*1000;

fs.readdirSync("./commands").forEach((file)=>{
if (file.endsWith(".js")) require(`./commands/${file}`) (bot)
});

async function userResponse(){
    // Checks if queue is busy and there is a user before Starting request
    if(isProcessing) return;
isProcessing = true;

while(queue.length > 0 ){
 // Removes a user from the list and begins request
    let currentUser = queue.shift();
    // Show "typing" delay While waiting for request to be sent in xseconds
    bot.sendChatAction(currentUser.userId, "typing");


    await new Promise (r => setTimeout(r, randomDelay()))
    

    try {
        const responses = await openai.responses.create({
        model: "gpt-4o-mini",
        instructions: ` This user's name is ${currentUser.username}. Do not lose or change this name.
        ${system}, If you were asked something you forgot, Create an reasonable human like excuse.
        Don't give full info about yorself rather laugh it off`,
        input: [
            {role: "assistant", content: botResponse || "new chat"},
            {role: "user", content: currentUser.message}
        ],
    })
    botResponse = responses.output_text
    
  bot.sendMessage(currentUser.userId, responses.output_text, {reply_to_message_id: currentUser.msgId})
    } catch (e) {
        
        if(!currentUser.retry){
            bot.sendMessage(currentUser.userId, "I’ve just run into a short limit on my side. Mind if we continue in a moment?");
        bot.sendMessage(process.env.BOT_OWNER_ID, `I experienced an error: ${e.message}`);
queue.push(currentUser);
            currentUser.retry = true
        }else{
            bot.sendMessage(currentUser.userId, "I'm kinda busy right now, If i'm unavailable in 10 minutes, contact my admin");
        bot.sendMessage(process.env.BOT_OWNER_ID, `Error Not resolved`);
        }
    };

    // Finish current session and restarts the process after clearing all pending tasks
    isProcessing = false
    }
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
        bot.sendMessage(process.env.BOT_OWNER_ID, `New Private user Registered. You now have ${users.length} users` )
       
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
        totalMessages:1,
        lastInterracted : Date.now()
    })
}else{
    chat.totalMessages += 1
    await chat.save()
}

// Inline chat 
if(chat.inlineChat){
  
  //  Ignore commands
    if (msg.text && msg.text.startsWith("/")) return;


    //  Handle different media types
    if (msg.sticker) return bot.sendMessage(msg.chat.id, "A sticker huh? Try using an emoji instead 🥲");
    if (msg.photo) return bot.sendMessage(msg.chat.id, "I can't see images right now 😐! Wanna describe it? 🥹");
    if (msg.video) return bot.sendMessage(msg.chat.id, "A video? Tell me about it! 🤩");
    if (msg.voice) return bot.sendMessage(msg.chat.id, "I can't hear you! Type it out for me 😅");
    if (!msg.text) return;
  
  
        // Create queue to handle multiple requests
    let pending = {
        msgId: msg.message_id,
        userId: msg.chat.id,
        username: msg.from.first_name,
        message: msg.text
    }

     if (pending.userId == process.env.BOT_OWNER_ID) {
        system += " You are talking to your creator, Be playful but respectful towards them."
        queue.unshift(pending)
    }else{
    queue.push(pending);
}
    userResponse()
  
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