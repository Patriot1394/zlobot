var TelegramBot = require('node-telegram-bot-api');
console.log('STOP PLEASE');
//установим токен
/*
var token = '449042193:AAG_rxZQdbcTot2NmL1rZJSUtcdHReoIgYs';

//опрос сервера
var bot = new TelegramBot(token,{polling:true});

var notes = [];

setInterval(function(){
    for (var i = 0; i < notes.length; i++){
        var curDate = new Date().getHours() + ':' + new Date().getMinutes();
        if ( notes[i]['time'] == curDate ) {
            bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
            notes.splice(i,1);
        }
    }
},1000);


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

bot.onText(/\/напомни (.+) в (.+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];
    var time = match[2];

    notes.push( { 'uid':userId, 'time':time, 'text':text } );

    bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)');
});*/