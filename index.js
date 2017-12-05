var TelegramBot = require('node-telegram-bot-api');
var MongoClient = require('mongodb').MongoClient;

//установим токен
var token = '449042193:AAG_rxZQdbcTot2NmL1rZJSUtcdHReoIgYs';

//опрос сервера
var bot = new TelegramBot(token,{polling:true});

var notes = [];
var url = "mongodb://Patriot:strelok@cluster0-shard-00-00-opb6q.mongodb.net:27017,cluster0-shard-00-01-opb6q.mongodb.net:27017,cluster0-shard-00-02-opb6q.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
//var uri = "mongodb://Patriot:strelok@cluster0-shard-00-00-opb6q.mongodb.net:27017 ,cluster0-shard-00-01-opb6q.mongodb.net:27017 , cluster0-shard-00-02-opb6q.mongodb.net:27017 /admin?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
MongoClient.connect(url, function(err, db) {
    if(err){
        return console.log(err);
    }
    db.close();
});

bot.onText(/\/ad (.+) i (.+)/, (msg, match) => {
    
    MongoClient.connect(url, function(err, db) {
        if(err){
            return console.log(err);
        }
        else{
            const chatId = msg.chat.id;
            var top = match[1]; 
            var message = match[2];
            var post = {
                top: top,
                message: message
                };
            var messages = db.collection("messages");
            var err = messages.insertOne(post,function(err, result){
                if(err){
                    return console.log(err);
                }
                console.log(result.ops);
                var str = 'Add '+post.top + " "+ post.message;
                bot.sendMessage(chatId, str);
                db.close();
            });
        }
    });
});

bot.onText(/\/get_all/, (msg, match) => {
    MongoClient.connect(url, function(err, db){
        if(err){
            return console.log(err);
        }
        db.collection("messages").find().toArray(function(err, results){
            const chatId = msg.chat.id;
            for(var i=0;i<results.length;i++){
                var str = i + " " + results[i].top + " " + results[i].message;
                bot.sendMessage(chatId, str);
            }

            console.log(results);
            db.close();
        });
    });
});

bot.onText(/\/get (.+)/, (msg, match) => {
    MongoClient.connect(url, function(err, db){
        if(err){
            return console.log(err);
        }
        const chatId = msg.chat.id;
        const top = match[1]; 
        db.collection("messages").find({top: top}).toArray(function(err, results){
            const chatId = msg.chat.id;
            for(var i=0;i<results.length;i++){
                var str = i + " " + results[i].top + " " + results[i].message;
                bot.sendMessage(chatId, str);
            }

            console.log(results);
            db.close();
        });
    });
});

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

bot.onText(/\/note (.+) in (.+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];
    var time = match[2];

    notes.push( { 'uid':userId, 'time':time, 'text':text } );

    bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)');
});