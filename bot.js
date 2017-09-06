const Discord = require('discord.js');
const self = new Discord.Client();
const config = require('./config.json');
const prefix = config.prefix
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
const hastebin = require('hastebin-gen');

self.on('ready', () => {
        console.log("Logged in as " + self.user.tag + "!\nPrefix: " + prefix);
});

self.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
if (message.author.tag != self.user.tag){return;}

  if (message.content === (prefix + 'ping')) {
    message.delete()
    message.channel.send('Pong! ' + Math.round(self.ping) + "ms");
  }
  if (message.content === (prefix + 'about')) {
    if (message.guild.me.permissions.has("EMBED_LINKS")) {
        message.delete()
        message.channel.send(new Discord.RichEmbed().setTitle("Gallium's Discord Selfbot").addField("Features:","-Group DM Commands, great for mobile users.\n-Configurability: Choose your prefix! Don't want to use embeds? Turn 'em off! (coming soon)").setColor(message.guild.me.displayColor)).catch((err) => {
          console.log("ERROR: Insufficient Permissions\n Client does not have permission Embed Links.")
          message.channel.send("⚠ Something went wrong. Check your console.")
        })
    }
}
if (command === 'eval') {
  const args = message.content.split(" ").slice(1);
try {
const code = args.join(" ");
let evaled = eval(code);

if (typeof evaled !== "string")
evaled = require("util").inspect(evaled);
var evalOut = (clean(evaled))
if (evalOut.length > 2000) {
hastebin(evalOut, "js").then(r => {
message.channel.send("Output larger than 2000 characters, posted to " + r + " ."); //https://hastebin.com/someurl.js
}).catch(console.error);
}
else {
  if (message.channel.type === "text"){
   var color = message.guild.me.displayColor
  }
    else {
      var color = 0xFF0000
    }
  
  message.delete()
message.channel.send(new Discord.RichEmbed().addField("Input", "```xl\n " + code + "\n```").addField("Output","```xl\n" + evalOut + "\n```").setColor(color)).catch((err) => {
  console.log("ERROR: Insufficient Permissions\n Client does not have permission Embed Links.")
  message.channel.send("⚠ Something went wrong. Check your console.")
})
}
} catch (err) {
  message.channel.send(new Discord.RichEmbed().addField("`ERROR`","\`\`\`xl\n" + clean(err) + "\n\`\`\`").setColor(color))
}
}
if (command === "remove") {
  if (message.channel.type !== "group") {
    message.channel.send("⚠ This command only works in group DMs.")
  }
  else {
    message.channel.removeUser(message.mentions.users.first()).catch((err) => {
      message.channel.send("⚠ You can't remove people from this Group DM. Are you the owner?")
    });
  }
}
if (command === "groupname") {
  let newName = args.join(" ");  
  if (message.channel.type !== "group") {
    message.channel.send("⚠ This command only works in group DMs.")
  }
  else {
    message.channel.setName(newName)
  }
}
if (command === "emote" || command === "emoji") {
  if (message.channel.type === "text"){
    var color = message.guild.me.displayColor
   }
     else {
       var color = 0xFF0000
     }
  let emote = args[0].split(":")
  let emoteID = emote[2].slice(0, -1)
  message.channel.send(new Discord.RichEmbed().setTitle("Info About Emote **" + self.emojis.get(emoteID).name + "**:").addField("Server",self.emojis.get(emoteID).guild).addField("ID","`" + emote.join(":") + "`").setColor(color).setThumbnail(self.emojis.get(emoteID).url)).catch((err) => {
    console.log("ERROR: Insufficient Permissions\n Client does not have permission Embed Links.")
    message.channel.send("⚠ Something went wrong. Check your console.")
  })
}

});

self.login(config.token)