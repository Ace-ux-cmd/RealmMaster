const helpData = require('../cmd.json'); 

module.exports = (bot) =>{
    bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    let helpMessage = "✨ Bot Commands & Instructions ✨\n\n";

    for (const category in helpData) {
        helpMessage += `📂 ${category} 📂\n`;
        const commands = helpData[category];

        for (const cmd in commands) {
            const details = commands[cmd].details;
            helpMessage += `/${cmd} - ${details}\n`;
        }

        helpMessage += "\n"; // Extra space between categories
    }

    bot.sendMessage(chatId, helpMessage);
});
}