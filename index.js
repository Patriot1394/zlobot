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
    }else{
        return console.log("db_ok");
    }
    db.close();
});

bot.onText(/\/add (.+) & (.+)/, (msg, match) => {
    MongoClient.connect(url, function(err, db) {
        if(err){
            return console.log(err);
        }
        else{
            const chatId = msg.chat.id;
            var top = match[1]; 
            var message = match[2];
            var post = {
                author: chatId,
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


bot.onText(/\/get_all_usr/, (msg, match) => {
    MongoClient.connect(url, function(err, db){
        if(err){
            return console.log(err);
        }
        db.collection("users").find().toArray(function(err, results){
            const chatId = msg.chat.id;
            for(var i=0;i<results.length;i++){
                var str = i + ": " + results[i].chatId + " " + results[i].chatName;
                bot.sendMessage(chatId, str);
            }

            console.log(results);
            db.close();
        });
    });
});
bot.onText(/\/(get_all$)/, (msg, match) => {
    MongoClient.connect(url, function(err, db){
        if(err){
            return console.log(err);
        }
        db.collection("messages").find().toArray(function(err, results){
            const chatId = msg.chat.id;
            for(var i=0;i<results.length;i++){
                var str = i + ": " + results[i].top + " " + results[i].message;
                bot.sendMessage(chatId, str);
            }
            console.log(results);
            db.close();
        });
    });
});

bot.onText(/\/who (\d+)/, (msg, match) => {
    MongoClient.connect(url, function(err, db){
        if(err){
            return console.log(err);
        }
        const chatId = msg.chat.id;
        db.collection("messages").find().toArray(function(err, results){
            const chatId = msg.chat.id;
            var iter = match[1];
            var who = results[iter].author;
            db.collection("users").find({chatId: who}).toArray(function(err, results){
                var str =  results[0].chatName ;
                bot.sendMessage(chatId, str);
                console.log(results);
                db.close();
            });
        });
    });
});

bot.onText(/\/get_my/, (msg, match) => {
    MongoClient.connect(url, function(err, db){
        if(err){
            return console.log(err);
        }
        const chatId = msg.chat.id;
        db.collection("messages").find({author: chatId}).toArray(function(err, results){
            const chatId = msg.chat.id;
            for(var i=0;i<results.length;i++){
                var str = i + ": " + results[i].top + " " + results[i].message;
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
                var str = i + ": " + results[i].top + " " + results[i].message;
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


bot.onText(/\/name (.+)/, (msg, match) => {
    MongoClient.connect(url, function(err, db) {
        if(err){
            return console.log(err);
        }
        else{
            const chatId = msg.chat.id;
            const chatName = match[1]; 
            var users = db.collection("users");
            var err = users.findOneAndUpdate(
                {chatId: chatId},
                { $set:{chatName: chatName}},
                {
                    returnOriginal: false
                },
                function(err,result){
                if(err){
                    return console.log(err);
                }
                console.log(result.ops);
                var str = 'Ваш новый ник: '+ result.value.chatName ;
                bot.sendMessage(chatId, str);
                db.close();
            });
        }
    });
});

bot.onText(/\/(name$)/, (msg, match) => {
    MongoClient.connect(url, function(err, db) {
        if(err){
            return console.log(err);
        }
        else{
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Введите ник');
                bot.on('message', (msg1) => {
                    var ci = msg1.chat.id;
                    if(chatId==ci && msg.text != msg1.text){
                        var users = db.collection("users");
                        var chatName = msg1.text.toString();
                        var err = users.findOneAndUpdate(
                            {chatId: chatId},
                            { $set:{chatName: chatName}},
                            {
                                returnOriginal: false
                            },
                            function(err,result){
                            if(err){
                                return console.log(err);
                            }
                            console.log(result);
                            var str = 'Ваш новый ник: '+ result.value.chatName ;
                            bot.sendMessage(chatId, str);
                            db.close();
                        });
                    }else{
                        bot.on('message', (msg) => {});
                    }
                });
        }
    });
});

bot.onText(/\/start/, (msg, match) => {
    MongoClient.connect(url, function(err, db) {
        if(err){
            return console.log(err);
        }
        else{
            var flag1 = false;
            var flag2 = false;
            const chatId = msg.chat.id;
            const chatName = msg.chat.username;
            var users = db.collection("users");
            users.find({chatId: chatId}).toArray(function(err, results){
                if(results.length==0){
                    var user = {
                        chatId: chatId,
                        chatName: chatName
                        };
                    bot.sendMessage(chatId, 'Ваш ник: '+chatName+"\nХотите его сменить? да/нет");
                    do{
                        bot.once('message', (msg) => {
                            if(chatId == msg.chat.id){
                                if(msg.text.toString().toLowerCase()=="да"){
                                    bot.sendMessage(chatId, 'Введите ник');
                                    do{
                                        bot.once('message', (msg) => {
                                            if(chatId == msg.chat.id){
                                                user.chatName=msg.text.toString();
                                                var err = users.insertOne(user,function(err, result){
                                                    if(err){
                                                        return console.log(err);
                                                    }
                                                    console.log(result.ops);
                                                    var str = 'Здраствуйте '+ user.chatName + ", ваш чатID: "+ user.chatId + "\nВ дальнешем вы можете сменить ник по комaнде /name";
                                                    bot.sendMessage(chatId, str);
                                                    db.close();
                                                });
                                                flag2=false;
                                            }else{
                                                flag2=true;
                                            }
                                        });
                                    }while(flag2);
                                }else{
                                    var err = users.insertOne(user,function(err, result){
                                        if(err){
                                            return console.log(err);
                                        }
                                        console.log(result.ops);
                                        var str = 'Здраствуйте '+ user.chatName + ", ваш чатID: "+ user.chatId;
                                        bot.sendMessage(chatId, str);
                                        db.close();
                                    });
                                }
                                flag1=false;
                            }else{
                                flag1=true;
                            }
                        });
                    }while(flag1);
                }
            });
        }
    });
});

bot.onText(/\/drop 3259/, (msg, match) => {
    MongoClient.connect(url, function(err, db) {
        if(err){
            return console.log(err);
        }
        /*
        var messages = db.collection("users");
        messages.drop();*/
        db.collection("users").drop(function(err, result){
             
            console.log(result);
            db.close();
        });
    });
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