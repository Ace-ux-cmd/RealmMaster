require('dotenv').config();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports =  (bot) =>{
    bot.onText(/\/gpt/, async(msg)=>{
        //Ensure no invalid searches
          let query = msg.text.split(" ")
    query.shift()
    let text = query.join(" ").trim() 
        if(Boolean(text) === false ){
  bot.sendMessage(msg.chat.id, "Enter a valid query")
  return;
};
 try{
    const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "user", content: text}
    ],
    max_tokens: 150,
    temperature: 1,
});

const aiResponse = completion.choices[0].message.content;
bot.sendMessage(msg.chat.id, aiResponse, {reply_to_message_id:msg.message_id})

 }catch(error){
      console.error("Error in gpt.js:", error);
            bot.sendMessage(msg.chat.id, "Sorry, I'm busy rn! Let's talk some other time🏃💨🥲 Use /callad to contact my admin if I'm not back soon",  {reply_to_message_id:msg.message_id});
       }

    })
}