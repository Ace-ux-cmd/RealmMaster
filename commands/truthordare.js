module.exports = (bot)=>{
 bot.onText(/\/truthordare/,async(msg)=>{
    try{
 let challenge = await bot.sendMessage(msg.chat.id, "Truth Or Dare", {
    reply_markup:{
        inline_keyboard:[
    [{text: "Truth", callback_data: "Truth"}],
    [{text: "Dare", callback_data: "Dare"}]
        ]
    }
})

bot.once("callback_query",(query)=>{
   if(query.message.message_id==challenge.message_id) {
if(query.data === "Truth"){
  fetch("https://api.truthordarebot.xyz/v1/truth")
    .then(res=> res.json())
    .then(res=> bot.sendMessage(msg.chat.id,`Be Honest: \n  ${res.question}`), {reply_to_message_id: msg.message_id,})
}else{
     fetch("https://api.truthordarebot.xyz/api/dare")
    .then(res=> res.json())
    .then(res=> bot.sendMessage(msg.chat.id,`${res.type}\n  ${res.question}`),{reply_to_message_id: msg.message_id,})
}}
bot.deleteMessage(query.message.chat.id, challenge.message_id)
})
}catch(err){
    bot.sendMessage(msg.chat.id, "Coming back with more truths/ dare",  {reply_to_message_id:msg.message_id})
    console.log("Error in truthordare.js", err.message)
}
    })
}

