const User = require("../db/user")
module.exports = (bot)=>{
    bot.onText(/\/rps/,async (msg)=>{
let choices = ["Rock", "Paper", "Scissors"];
let botChoice = choices[Math.floor(Math.random()*choices.length)]

const rps = await bot.sendMessage(msg.chat.id, "Game on! Choose your move",{
    reply_to_message_id: msg.message_id,
        reply_markup:{
            inline_keyboard:[
                [{text: "Rock ✊", callback_data:"Rock"}],
                [{text: "Paper ✋", callback_data:"Paper"}],
             [{text: "Scissors ✌️", callback_data:"Scissors"}],
            ]
        }
    })


bot.once("callback_query",async(query)=>{
setTimeout(()=>{bot.deleteMessage(msg.chat.id, rps.message_id)},2000)
    if(query.message.message_id==rps.message_id){
 if (query.data===botChoice){
    bot.sendMessage(query.message.chat.id, `A tie! We both chose ${botChoice}😉. Enter /rps for rematch`)
 return;
}
  if((query.data == "Rock"&& botChoice== "Scissors")|| (query.data == "Paper"&& botChoice== "Rock")|| (query.data == "Scissors"&& botChoice== "Paper")){
     bot.sendMessage(query.message.chat.id, `Congratulations, You Won! I chose ${botChoice}. Here's $50`)
     
     try{
    //Find user from database
    const user = await User.findOne({userId: query.from.id})
    user.score++
    user.balance+=50
    user.save()
}catch(err){
    console.log("Error happened ar rpg.js", err.message)
}
}else 
     bot.sendMessage(query.message.chat.id, `Pathetic! I chose ${botChoice}😝🫵`, {reply_to_message_id:msg.message_id})
}
})
    })
}