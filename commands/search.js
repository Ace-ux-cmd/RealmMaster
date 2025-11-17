require("dotenv").config()
    const axios = require('axios');

module.exports = (bot) =>{
bot.onText(/\/search/, async(msg)=>{
    let query = msg.text.split(" ")
    query.shift()
 
   //Ensure no invalid searches
if(Boolean(query.join(" ").trim()) === false ){
  bot.sendMessage(msg.chat.id, "Enter a valid query")
  return;
}
bot.sendMessage(msg.chat.id, "Please be patient while your request is being processed🔎")
// Fetch from api
try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.SEARCH_ENGINE_ID,
        q: query.join(" ").trim()
      }
    });

    // Google returns items array
    const results = response.data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));

    results.forEach (n=>{
let message = `Title:   ${n.title}
 Link:   ${n.link}
 Snippet:   ${n.snippet}`
   bot.sendMessage(msg.chat.id, message, {reply_to_message_id : msg.message_id})
    })
  } catch (err) {
    bot.sendMessage(msg.chat.id, "Sorry, search was interrupted", {reply_to_message_id : msg.message_id})
    console.error('Search error:', err.message);
    return [];
  }
})
}