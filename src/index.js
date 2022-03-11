
const { Client, Intents, RichPresenceAssets, MessageActionRow } = require("discord.js");
const prefix = "cf.";
require("dotenv").config();
// require("./db/mongoose");
// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

let Queue = new Set();

// When the client is ready, run this code (only once)
client.once("ready", async () => {
  console.log("mogus");
  client.user.setStatus("dnd");
  client.user.setActivity("amongus", { type: "PLAYING" });

});

// Login to Discord with your client's token

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const connectionURL = process.env.MONGODB_URL;
const databaseName = "TheBoringBot";
const Clnt = new MongoClient(connectionURL)
const connection = Clnt.connect()
//  MongoClient.connect(
//   connectionURL,
//   { useNewUrlParser: true },
//   (error, client) => {
//     if (error) {
//       return console.log("Unable to connect to database!");
//     }

//     //   }
//   }
// );

client.on("messageCreate", async (message) => {
  let server = message.guild.id;
  let sender = message.author.id;

  const connect = connection
    if(message.content.startsWith(prefix)){
          connect.then(async()=>{
    const db = Clnt.db('TheBoringBot')
    await db.collection('users').find({ discordID: sender }).toArray((error, tasks) => {
       // console.log(tasks)

        if(tasks.length == 0) {
 
             //No Previous Profile
             connect.then(async()=>{
    const db = Clnt.db('TheBoringBot')
    await db.collection("users").insertOne({
        discordID: sender,
        trophies: 0,
        wins: 0,
        losses: 0
      });

      userTrophies = 0
      wins = 0
      losses = 0

})
        } else if(tasks.length > 0) {

            user = tasks[0]
           // console.log(user)
            userTrophies = user.trophies
            wins = user.wins
            losses = user.losses
        }


        if (
            message.content.startsWith(prefix + "queue") ||
            message.content.startsWith(prefix + "q")
          ) {
            if (!Queue.has(sender)) {
                //Matchmaking system
              Queue.add(sender);
              message.reply("You entered the queue with "+userTrophies+" points");
        
                let QueuedPeople = [...Queue]
                console.log(QueuedPeople)
                if(QueuedPeople.length === 2) {
                    player1 = QueuedPeople[0]
                    player2 = QueuedPeople[1]
        
                    Queue.delete(player1)
                    Queue.delete(player2)
        
                    // DM 
        

        
                        playerOne = client.users.cache.get(player1)
                           
                        playerTwo = client.users.cache.get(player2)     
                        client.users.cache.get(player1).send("You found a match against "+playerTwo.username+"#"+playerTwo.discriminator).catch((e) => {
                          console.log("The bot tried to dm "+player1+" but got blocked")
                        });
                        client.users.cache.get(player2).send("You found a match against "+playerOne.username+"#"+playerOne.discriminator).catch((e) => {
                          console.log("The bot tried to dm "+player2+" but got blocked")
                        });

                        console.log("User has blocked the bot")
                    
                    
                    //randomize + score
                    n = Math.floor(Math.random() * (1 - 0 + 1)) + 0; // 
 
                    if(n==0){
                      //player 1 wins
               
        
                        playerOne = client.users.cache.get(player1)
                        playerTwo = client.users.cache.get(player2)     
                        client.users.cache.get(player1).send("You won the coinflip against "+playerTwo.username+"#"+playerTwo.discriminator+" and won 5 points").catch((e) => {
                          console.log("User got blocked by some guy")
                        });
                        client.users.cache.get(player2).send("You lost the coinflip against "+playerOne.username+"#"+playerOne.discriminator+" and lost 4 points").catch((e) => {
                          console.log("MONGUS")
                        });

                        db.collection("users").updateOne({
                          discordID: player1
                        }, {
                          $inc: {
                            trophies: 5,
                            wins: 1
                          }
                        })

                        db.collection("users").updateOne({
                          discordID: player2
                        }, {
                          $inc: {
                            trophies: -4,
                            losses: 1
                          }
                        })

                        db.collection("users").find({discordID: player2}).toArray((error,user) => {
                          console.log(user)
                          if(user.trophies < 0) {


                            db.collection("users").updateOne({
                              discordID: player2
                            }, {$inc: {
                             trophies: -user.trophies
                            }})


                          }
                        })



                 
                    } else if (n==1){
                 
        
                        playerOne = client.users.cache.get(player1)
                        playerTwo = client.users.cache.get(player2)     
                        client.users.cache.get(player1).send("You lost the coinflip against "+playerTwo.username+"#"+playerTwo.discriminator+" and lost 4 points").catch((e) => {
                          console.log(e)
                        });
                        
                        client.users.cache.get(player2).send("You won the coinflip against "+playerOne.username+"#"+playerOne.discriminator+" and gained 5 points").catch((e) => {
                          console.log(e)
                        });

                        db.collection("users").updateOne({
                          discordID: player2
                        }, {
                          $inc: {
                            trophies: 5,
                            wins: 1
                          }
                        })

                        db.collection("users").updateOne({
                          discordID: player1
                        }, {
                          $inc: {
                            trophies: -4,
                            losses: 1
                          }
                        })


                        db.collection("users").find({discordID: player1}).toArray((error,user) => {
                          console.log(user)
                          if(user.trophies < 0) {


                            db.collection("users").updateOne({
                              discordID: player1
                            },{ $inc: {
                             trophies: -user.trophies
                            }})


                          }
                        })

                  
                    }
        
        
                }
        
        
        
        
        
            } else {
              message.reply("You are aleady in the queue");
            }
          } else if (
            message.content.startsWith(prefix + "unqueue") ||
            message.content.startsWith(prefix + "uq")
          ) {
            if (Queue.has(sender)) {
              Queue.delete(sender);
              message.reply("You left the queue ");
            } else {
              message.reply("You aleady weren't in the queue");
            }
          } else if (message.content === prefix+"help") {
            message.reply("Just do cf.q and cf.score and get lucky")
          } else if (message.content === prefix+"score") {
            message.reply("You have "+userTrophies+" points and your win rate is "+wins/losses)
          } else if (message.content === prefix+"lb6699696") {
         db.collection("users").find().forEach(async (user) => {
          // console.log(user)
           console.log(client.users.cache.get(user.discordID))
          // message.reply("Name: "+client.users.cache.get(user.username)  )
         })

          }



       })
})
    }

 
});

client.login(process.env.TOKEN);
