var Discord = require('discord.io');
var request = require('request');

// Define the bot instance
var bot = new Discord.Client({
    autorun: true,
    token: ""
});

// Reconnect the bot if they somehow get disconnected
bot.on('disconnect', function(errMsg, code) {
  bot.connect()
});

// Make sure the emojis are fresh from the repo
function getEmojiFonts(){
  request('https://github.com/haykam821/Discord-Font-Service/raw/master/index.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
       importedJSON = JSON.parse(body);
       fonts = importedJSON;
    }
  })
};

setInterval(getEmojiFonts,3000);

// Define fonts in case it hasn't loaded yet
var fonts = {};

// Define a function to convert from text to letter emoji
function parseToEmoji(cmd, message) {
  try {
    array = message.toLowerCase().replace(cmd + ' ', '').split(' ');
    font = fonts[message.replace('font:', '').split(' ')[message.split(' ').length - 1]] == undefined ? fonts['default'] : fonts[message.replace('font:', '').split(' ')[message.split(' ').length - 1]]
    // Font setup
    if (array[array.length - 1].startsWith('font:')) {
        array.pop();
    } else {
        font = fonts['default'];
    };
    // Fix array again
    array = array.join(' ').split('');
    // Convert to emoji!
    for (var i = 0; i < array.length; i++) {
        console.log(font[1][array[i]])
        array[i] = font[1][array[i]] == undefined ? array[i] : font[1][array[i]]
    }
    return array.join('‌');
  } catch (err) {
    return `Fail. ${err}`;
  }
}

// Define a function that allows checking commands easily
function cmd(message, cmdname) {
  return message.toLowerCase().startsWith(cmdname);
}

// Message handling
bot.on('message', function(user, userID, channelID, message, event) {
  try {
    if (userID == bot.id) {
        // Respond to commands using parse to emoji function
        if (message.toLowerCase().startsWith('>e ')) {
            bot.editMessage({
                channelID: channelID,
                messageID: event.d.id,
                message: message,
                embed: {description:parseToEmoji('>e', message)},
            });
        }
        // Respond to commands using parse to emoji function, but output as raw
        if (message.toLowerCase().startsWith('>er ')) {
            bot.editMessage({
                channelID: channelID,
                messageID: event.d.id,
                message: message,
                embed: {description:`\`\`\`\n${parseToEmoji('>er',message)}\`\`\``},
            });
        }
    }
  } catch (err) {
    console.log('Error (bot 1): ' + err);
  }
});