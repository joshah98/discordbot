const Discord = require("discord.js");
const config = require("./config.json");
const Datastore = require('nedb')
  , db = new Datastore({ filename: 'wallet.db', autoload: true });

const client = new Discord.Client();

const prefix = "!";
const blobCost = 17;


client.on("message", function(message) {
    let wallet;

    db.find({_id: 'id1'}, (err, docs) => {
        wallet = docs.balance;
    })

    if (message.channel.id === "864026396111667231") {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;
    
        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
    
        if (command === "blobtime" && wallet >= blobCost) {
            wallet -= 17;
            db.update({_id: 'id1'}, {$set: {balance: wallet}}, {}, () => {
                message.channel.send("OHH YAAA ITS BLOB TIME BAABBAYYYY!!");
            });
        } else if (command === "blobtime" && wallet < blobCost) {
            message.channel.send("balance too low :c u broke!!");
        } else if (command === "swag" && message.author.id === "172205824876347392") {
            wallet += parseInt(args,10);
            db.update({_id: 'id1'}, {$set: {balance: wallet}}, {}, () => {
                message.channel.send(`FRIK YEEAA U NOW HAVE ${wallet} DOLLAS $$$$ CHA CHING`);
            });
        } else if (command === "swag") {
            message.channel.send("HEY!!!! U R NOT ALLOWED TO USE THAT >:(");
        } else if (command === "whenblob?") {
            message.channel.send(`You have ${wallet} blob dolla.`);
            if (wallet >= blobCost) {
                message.channel.send(`You can afford ${Math.floor(wallet/blobCost)} blob :D`);
            } else {
                message.channel.send(`You need ${blobCost-wallet} more blob dollars to get the blob :(`);
            }
        } else if (command === "commands") {
            message.channel.send("!blobtime: use when you have enough blob dollars to redeem a blob tea :)");
            message.channel.send("!swag (number): use when a meal is sufficiently swag, add (number) to blob dollar balance");
            message.channel.send("!whenblob?: use to find out the balance and figure out when the next blob is available");
            message.channel.send("!commands: use when....wait....uhhhh");
        }
    }
});


client.login(config.BOT_TOKEN);