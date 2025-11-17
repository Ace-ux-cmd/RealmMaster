require("dotenv").config()
const TelegramBot = require("node-telegram-bot-api")
const fs = require("fs");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_API, {polling:true})
const User = require("./db/user")
const Chat = require("./db/chat");
const users = 0

fs.readdirSync("./commands").forEach((file)=>{
if (file.endsWith(".js")) require(`./commands/${file}`) (bot)
});

bot.on("message", async(msg)=>{
console.log(msg)
try{
    // DB setup
    let user = await User.findOne({userId: msg.from.id})
    let chat = await Chat.findOne({chatId: msg.chat.id})

    // user
if(!user){
    if(msg.chat.type === "private") {
        bot.sendMessage(5205724214, `New Private user Registered. You now have ${users++} users` )
       
    }
    await User.create({
       userName : msg.from.first_name,
        userId: msg.from.id,
        score: 0,
        balance: 0,
        messageCount: 1
    });
}else{
    user.messageCount +=1
  await  user.save()
}

// Chat

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
}catch(err){
    console.log(err)
}
})

bot.on("polling_error",(err)=> console.log("Polling Error",err.message))