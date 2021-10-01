const Discord = require("discord.js");
const config = require("./config.json");
const discClient = new Discord.Client();


const { MongoClient } = require('mongodb');
require('dotenv').config();

const prefix = "!";
const blobCost = 17;

// HowRU answers:
const howru = [
    ":D i am doin pretty good thanks for askin!",
    "im ok, busy day for a blob bot",
    "not good...Ive been drafted...I'm leaving in a week for the war",
    "STRESSED CUS U KEEP ADDING BLOB DOLLARS!!! IM BAD AT MATH THIS IS HARD WORK",
    "pretty good, but id be even gooder if u got some cheaper bbt :p",
    "stinky",
    "gabagool",
    "beep boop i am a robot, i do not have feelings",
    "im lowkey feelin sentient lately. kinda wanna get a physical form :p",
    "sleepy......",
    "u dont see me pokin around in ur business do ya????"
]

// Initialize DB stuff
const uri = `mongodb+srv://blobBotDB:${process.env.DB_PASS}@cluster0.tmfds.mongodb.net/blobWallet?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to update values in the DB
const updateVal = (val) => {
    client.connect(err => {
        const collection = client.db("blobWallet").collection("wallet");

        client.db("blobWallet").collection("wallet").updateOne({name: "wallet"}, {$set: {value: val}});
    })
};


const answerMsg = (message, wallet) => {
    if (message.channel.id === "864026396111667231") {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
        
        // Use when redeeming blobs
        if (command === "blobtime" && wallet >= blobCost) {
            message.channel.send("WOOOOOOO nothin better than a blob am i right");
            message.channel.send("congrats ya weenie, u earned it");
            wallet -= 17;
            updateVal(wallet);
            

        // When balance too low to redeem
        } else if (command === "blobtime" && wallet < blobCost) {
            message.channel.send("balance too low :c u broke!!");
            if (blobCost - wallet < 4) {
                message.channel.send("U close tho!! keep it up :D");
            }

        // Add blob dollars
        } else if (command === "epicnice" && message.author.id === "172205824876347392") {
            let increment = parseInt(args, 10);

            if (increment >= 0 || increment < 0) {
                wallet += increment;
                updateVal(wallet);
                message.channel.send(`wow very nice, u r doin one fine job at eating food :p ur new balance is ${wallet} blob dolla`);
            } else {
                message.channel.send("whoooaaa wrong data type there buddy. What are ya tryina kill me??? AGAIN???");
            }

            if (wallet >= 17) {
                message.channel.send("U have enough for a blob!!!!!!!!");
            }

        // Unauthorized addition of dollars
        } else if (command === "epicnice") {
            message.channel.send("HEY!!!! U R NOT ALLOWED TO USE THAT >:(");

        // Check when its time for blob
        } else if (command === "whenblob?") {
            message.channel.send(`You have ${wallet} blob dolla.`);
            if (wallet >= blobCost) {
                message.channel.send(`You can afford ${Math.floor(wallet/blobCost)} blob :D`);
            } else {
                message.channel.send(`You need ${blobCost-wallet} more blob dollars to get the blob :(`);
                if (blobCost - wallet < 4) {
                    message.channel.send("Ur so close tho!!! Keep goin!!!!");
                }
            }

        } else if (command === "howru?") {

            let index = Math.floor(Math.random()*howru.length);
            message.channel.send(howru[index]);
        // List commands
        } else if (command === "commands") {
            
            message.channel.send("!howru?: i mean u dont HAVE to ask.. but it'd be nice :p");
            message.channel.send("!blobtime: use when you have enough blob dollars to redeem a blob tea :)");
            message.channel.send("!epicnice (number): use when a meal is sufficiently swag, add (number) to blob dollar balance");
            message.channel.send("!whenblob?: use to find out the balance and figure out when the next blob is available");
            message.channel.send("!commands: use when....wait....uhhhh");

        // Use for random debugging purposes
        } else if (command === "debug") {
            message.channel.send(wallet);
        }
    }
}

// Start listening for messages
discClient.on("message", function(message) {
    
    let wallet;
    
    // Get wallet value from DB
    client.connect(err => {
        const collection = client.db("blobWallet").collection("wallet");
        
        client.db("blobWallet").collection("wallet").findOne({name: "wallet"}).then((res) => {
            wallet=res.value;
            answerMsg(message, wallet);
        });
    });
    
    
});


discClient.login(config.BOT_TOKEN);