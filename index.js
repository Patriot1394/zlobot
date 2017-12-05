var TelegramBot = require('node-telegram-bot-api');

//установим токен
var token = '449042193:AAG_rxZQdbcTot2NmL1rZJSUtcdHReoIgYs';

//опрос сервера
var bot = new TelegramBot(token,{polling:true});

var node=[];


bot.onText(/\/start/, (msg, match) => {
    
      const chatId = msg.chat.id;
      const resp = match[1]; 
    
      bot.sendMessage(chatId, 'молодца');
});

bot.onText(/\/echo (.+)/, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = match[1]; 
  
    bot.sendMessage(chatId, resp);
});


bot.onText(/\/help (.+)/, (msg, match) => {
    
    const chatId = msg.chat.id;
    const resp = match[1]; 

    bot.sendMessage(chatId, resp);
});
  
  /*
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Received your message');
});
*/