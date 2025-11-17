module.exports = (bot) =>{
bot.onText(/\/joke/, async(msg)=>{
    try{
        let data = await fetch ("https://v2.jokeapi.dev/joke/Any")
    let joke = await data.json()
   if(joke.setup) bot.sendMessage(msg.chat.id,  `${joke.setup }😃😃`)
    setTimeout(()=>{
        bot.sendMessage(msg.chat.id, (joke.delivery || joke.joke)+`🤣🤣`)
    },3000)
  console.log(joke)
}catch(err){
     bot.sendMessage(msg.chat.id, `If you are looking for a joke right now, go look in the mirror...😝
         JK... But seriously, more jokes are coming. Try again or use /callad to contact bot's admin`,  {reply_to_message_id:msg.message_id})
    console.log("Error from joke.js",err.message)
}
 })
}

