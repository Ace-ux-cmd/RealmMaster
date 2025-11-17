module.exports = (bot) => {
    bot.onText(/\/support/, (msg) => {
        const chatId = msg.chat.id;

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📱🟢💬 Message Admin on WhatsApp", url: "https://wa.me/+2347054971517" }],
                    [{ text: "📘💬 Add on Facebook", url: "https://www.facebook.com/share/1DmUNL2VG9/" }],
                    [{ text: "🆘 Contact Bot Support Gc", url: "https://t.me/katiespace" }]
                 ]
            }
        };

        bot.sendMessage(chatId, "Need help? Choose an option below:", options);
    });
};