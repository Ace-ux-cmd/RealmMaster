const User = require("../db/user");

module.exports = bot => {
  bot.onText(/\/bank/, async msg => {
    try {
      const sender = await User.findOne({ userId: msg.from.id });
      if (!sender) {
        return bot.sendMessage(msg.chat.id, "You are not registered");
      }

      const bankPrompt = await bot.sendMessage(
        msg.chat.id,
        `Hello ${msg.from.first_name}, reply to this message with the amount you want to send`,
        { reply_to_message_id: msg.message_id }
      );

      bot.once("message", async amount => {
        try {
          if (!amount.reply_to_message || amount.reply_to_message.message_id !== bankPrompt.message_id) return;

          const money_to_send = Number(amount.text);

          if (isNaN(money_to_send) || money_to_send <= 0) {
            return bot.sendMessage(
              amount.chat.id,
              "Enter a valid amount",
              { reply_to_message_id: amount.message_id }
            );
          }

          const bankPrompt2 = await bot.sendMessage(
            amount.chat.id,
            "Reply to this message with the recipient's ID",
            { reply_to_message_id: amount.message_id }
          );

          bot.deleteMessage(amount.chat.id, bankPrompt.message_id);

          bot.once("message", async to => {
            try {
              if (!to.reply_to_message || to.reply_to_message.message_id !== bankPrompt2.message_id) return;

              const recId = Number(to.text);
              const recipient = await User.findOne({ userId: recId });

              if (!recipient) {
                return bot.sendMessage(
                  to.chat.id,
                  "Transaction Error: Invalid user",
                  { reply_to_message_id: to.message_id }
                );
              }

              if (sender.balance < money_to_send) {
                return bot.sendMessage(
                  to.chat.id,
                  "Transaction Error: Insufficient funds",
                  { reply_to_message_id: to.message_id }
                );
              }

              recipient.balance += money_to_send;
              sender.balance -= money_to_send;

              await recipient.save();
              await sender.save();

              bot.deleteMessage(to.chat.id, bankPrompt2.message_id);

              bot.sendMessage(
                to.chat.id,
                "Transaction Successful",
                { reply_to_message_id: to.message_id }
              );

            } catch (err) {
              bot.sendMessage(
                msg.chat.id,
                "Something went wrong. Try again",
                { reply_to_message_id: msg.message_id }
              );
              console.log("Error in bank.js stage 2", err.message);
            }
          });

        } catch (err) {
          bot.sendMessage(
            msg.chat.id,
            "Something went wrong. Try again",
            { reply_to_message_id: msg.message_id }
          );
          console.log("Error in bank.js stage 1", err.message);
        }
      });

    } catch (err) {
      bot.sendMessage(
        msg.chat.id,
        "Something went wrong",
        { reply_to_message_id: msg.message_id }
      );
      console.log("Error in bank.js", err.message);
    }
  });
};
