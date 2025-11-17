module.exports = (bot)=>{
    bot.onText(/\/start/,(msg)=>{
 const chatId = msg.chat.id
 bot.sendMessage(chatId, `👋 Hello ${msg.from.first_name}!
You can add me to your group chat to enhance interactions,
or type /help to view my full command list.
`)
    })
}