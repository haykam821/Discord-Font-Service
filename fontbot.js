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
       fonts = importedJSON['fonts'];
       config = importedJSON['config'];
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
    fontname = array[i];
    // Fix array again
    array = array.join(' ').split('');
    // Convert to emoji!
    for (var i = 0; i < array.length; i++) {
        console.log(font['emojis'][array[i]])
        array[i] = font['emojis'][array[i]] == undefined ? array[i] : font['emojis'][array[i]]
    }
    return {
      font: font == fonts['default'] ? `Default (${fonts.default['font_name']})` : font['font_name'],
      text: array.join('‌'),
      color: parseInt(font['color']) == undefined ? config['fallback_color'] : parseInt(font['color'])
    }
  } catch (err) {
    return {
      font: 'None',
      text: `Fail. ${err}`,
      color: 0xFF1100
    }
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
        if (message.toLowerCase().startsWith('>fontify ')) {
            var result = parseToEmoji('>fontify',message);
            bot1.editMessage({
                channelID: channelID,
                messageID: event.d.id,
                message: message,
                embed: {color:result.color,description:result.text,footer:{text:`Font: ${result.font}`}},
            });
        }
        // Respond to commands using parse to emoji function, but output as raw
        if (message.toLowerCase().startsWith('>codeify')) {
            var result = parseToEmoji('>codeify',message);
            bot1.editMessage({
                channelID: channelID,
                messageID: event.d.id,
                message: message,
                embed: {color:result.color,description:`\`\`\`\n${result.text}\`\`\``,footer:{text:`Font: ${result.font}`}},
            });
        }
    }
  } catch (err) {
    console.log('Error: ' + err);
  }
});
