const User = require("../db/user.js")
 let slots = ["♠️","♣️","♥️","🍒","♦️"];
let fee;
module.exports = (bot) =>{
bot.onText(/\/slot/, async(msg)=>{
try{
           let user =  await User.findOne({userId: msg.from.id})
if(user.balance-100 < 0){
    bot.sendMessage(msg.chat.id, "Your balance is too low to place a bet")
return;
}
// Gameplay
  let pick = []
  for (let i = 0; i< 3; i++){
    pick[i] = slots[Math.floor(Math.random()*slots.length)]
  }
  if (pick[0] === pick[1] && pick[1] === pick[2]) {
   bot.sendMessage(msg.chat.id, `JACKPOT🍾🍾, you're one in a million to get ${pick}! You've earned $1000`, {reply_to_message_id: msg.message_id})
   fee = 1000
  } else if (pick[0] === pick[1] || pick[0] === pick[2] || pick[1] === pick[2]) {
     bot.sendMessage(msg.chat.id, `Not bad, you managed to get ${pick}. You've earned $100`,{reply_to_message_id: msg.message_id})
     fee = 100
  } else {
    bot.sendMessage(msg.chat.id, `Result: ${pick} \n Sorry, Nothing for you, You lost $100`,{reply_to_message_id: msg.message_id})
  fee = -100
}
      user.balance += fee
   await user.save()
    }catch(err){
        bot.sendMessage(msg.chat.id, "Slot is currently closed, please contact admin",  {reply_to_message_id:msg.message_id})
        console.log("Error in slot.js", err.message)
    }
})
}