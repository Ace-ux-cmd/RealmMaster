const User = require("../db/user")
module.exports = (bot) =>{
bot.onText(/\/quiz/, async(msg)=>{
    bot.sendMessage(msg.chat.id, "Hold on, let me fetch your question.")
 try{
// Question Fetch
    const response = await fetch("https://opentdb.com/api.php?amount=1")
    const data = await response.json()
   const [results] = await data.results
   
    //    Options Setup
 results.incorrect_answers.push(results.correct_answer)
 const optionsLength = results.incorrect_answers.length
 const ans = [];

        //  Shuffling options
for(let i = 0; i< optionsLength; i++){
let rand = Math.floor(Math.random()*results.incorrect_answers.length)
ans[i] =results.incorrect_answers [rand]
results.incorrect_answers.splice(rand,1)
}
        // Assigning Options
let options;
[optionA, optionB, optionC, optionD] = ans

 if(results.type =="multiple"){
    options = {
        reply_to_message_id: msg.message_id,
    reply_markup : {
        inline_keyboard: [
         [{text: optionA, callback_data: optionA}],
         [{text: optionB, callback_data: optionB}],
         [{text: optionC, callback_data: optionC}],
         [{text: optionD, callback_data: optionD}]
        ]
    }
}
}else if(results.type =="boolean"){
  options = {
    reply_to_message_id: msg.message_id,
    reply_markup : {
        inline_keyboard: [
         [{text: optionA, callback_data: optionA}],
         [{text: optionB, callback_data: optionB}]
        ]
    }
}
}
// Message Setup

    const replyMessage = `⚙️   Type: ${results.type}.

🎚  Difficulty: ${results.difficulty}.

🗂  Category: ${results.category}.

🙋‍♂️  Question: ${results.question.replaceAll(`&quot;`, `"`).replaceAll("&#039;","'")}.`
 const quiz =  await bot.sendMessage(msg.chat.id,replyMessage, options )
 console.log(results.correct_answer)
// Delete Message after 15s

setTimeout(()=>{
    bot.deleteMessage(msg.chat.id,quiz.message_id)
},15000)

// Callback
bot.once("callback_query", async (query)=>{
     if(query.message.message_id==quiz.message_id) {
    if(query.data == results.correct_answer){
       
  try {
        //Get User from database
    const user = await User.findOne({userId: query.from.id})
   
        // Update user's score
       if (user){
         if(results.difficulty == "easy"){
            user.score++
             bot.sendMessage(query.message.chat.id, "💯 Spot on! You got 1 point. Try another with /quiz!")
         }else if(results.difficulty == "medium"){
            user.score+=3
             bot.sendMessage(query.message.chat.id, "💯 Spot on! You got 3 points. Try another with /quiz!")
         }else{
            user.score+=5
             bot.sendMessage(query.message.chat.id, "💯 Spot on! You got 5 points. Try another with /quiz!")

         }
        user.save()
    }
}catch(err){
    console.log(err.message)
}
}else{
        bot.sendMessage(query.message.chat.id, `😬 Oops, that wasn’t correct!
The right answer is: ${results.correct_answer}`)
}}
})

}catch(err){
  bot.sendMessage(msg.chat.id,"This question could not be loaded, Please Try again",  {reply_to_message_id:msg.message_id})
 console.log(err.message)
}
})
}