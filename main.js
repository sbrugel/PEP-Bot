const Discord = require('discord.js');
const {MessageEmbed, Intents} = require('discord.js');
const config = require('./config.json');
const cron = require('cron');
const client = new Discord.Client({ 
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: [Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES, 
		Intents.FLAGS.GUILD_PRESENCES, 
		Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

client.once('ready', () => {
    console.log('Ready!');
    calendar();
    //fillPhotos();
    let job = new cron.CronJob('1 0 * * *', calendar); // new calendar post every day at 00:01
	job.start();
});

client.login(config.TOKEN);

async function calendar() {
	const d = new Date();
	let day = d.getDay();
    let guild = client.guilds.cache.get(config.GUILD_ID);
	let channel = guild.channels.cache.get(config.calendarChannel);
	switch (day) {
		case 0:
			channel.send({ content: 'https://cdn.discordapp.com/attachments/901837688586506260/901838879072591892/Scotrail_Sunday.mp4' });
            break;
		case 1:
            channel.send({ content: 'https://cdn.discordapp.com/attachments/901837688586506260/901838860588298300/Metropolitan_Monday.mp4' });
            break;
		case 2:
            channel.send({ content: 'https://cdn.discordapp.com/attachments/901837688586506260/901838885221449738/video0-28.mp4' });
            break;
		case 3:
            channel.send({ content: 'https://cdn.discordapp.com/attachments/901837688586506260/901838861242605628/Overhead_Wires_Wednesday.mp4' });
            break;
		case 4:
            channel.send({ content: 'https://cdn.discordapp.com/attachments/901837688586506260/901838876878979123/Third_Rail_Thursday.mp4' });
            break;
		case 5:
            channel.send({ content: 'https://cdn.discordapp.com/attachments/901837688586506260/901838856654045294/Freightliner_Friday.mp4' });
            break;
		case 6:
            channel.send({ content: 'https://cdn.discordapp.com/attachments/837687417216958535/868268181519732746/317dsprinsat.mp4' });
            break;
		default:
			break;
	}
}

client.on('messageReactionAdd', async (reaction, user) => {
    let guild = client.guilds.cache.get(config.GUILD_ID);
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
    }
    if (reaction.emoji.name === 'CWBsilver') {
        let channel = guild.channels.cache.get(config.silverQuotesChannel);
        // Now the message has been cached and is fully available
        if (reaction.count == 1) {
			var msg = '';
			if (reaction.message.content == '') {
				msg = 'No message content provided'
			} else {
				msg = reaction.message.content
			}
			try {
				const embed = new MessageEmbed()
					.setColor('#a1a1a1')
					.setTitle('Quote from ' + reaction.message.author.tag)
					.setDescription(msg)
					.setURL(reaction.message.url)
					.setImage(reaction.message.attachments.first(1)[0].url)
				channel.send({ embeds: [embed] });
			} catch (error) {
				const embed = new MessageEmbed()
					.setColor('#a1a1a1')
					.setTitle('Quote from ' + reaction.message.author.tag)
					.setURL(reaction.message.url)
					.setDescription(msg)
				channel.send({ embeds: [embed] });
			}
        }
    }
    if (reaction.emoji.name === 'CWBgold') {
        let channel = guild.channels.cache.get(config.goldQuotesChannel);
        if (reaction.count == 5) {
			var msg = '';
			if (reaction.message.content == '') {
				msg = 'No message content provided'
			} else {
				msg = reaction.message.content
			}

			try {
				const embed = new MessageEmbed()
					.setColor('#fffb00')
					.setTitle('Quote from ' + reaction.message.author.tag)
					.setDescription(msg)
					.setURL(reaction.message.url)
					.setImage(reaction.message.attachments.first(1)[0].url)
				channel.send({ embeds: [embed] });
			} catch (error) {
				const embed = new MessageEmbed()
					.setColor('#fffb00')
					.setTitle('Quote from ' + reaction.message.author.tag)
					.setURL(reaction.message.url)
					.setDescription(msg)
				channel.send({ embeds: [embed] });
			}
        }
    }
});


/* 
THE CODE BELOW IS FROM GUESS THE STATION, AN IN-BOT GAME THAT WAS IMPLENTED DURING DISCORD.JS V12.
IT IS CURRENTLY OUTDATED AND NEEDS RE-WORKING AND HAS BEEN ENTIRELY COMMENTED OUT AS SUCH.
Feel free to modify this at your time, and throw a pull request at me so I can integrate it into
the next version of the bot.
*/

/*
var usersInGame = [];
var usersCorrect = [];
var correct = 0;

var gameInSession = false;
var answer = null;

// these are all linked to each other
var stationPictures = [];
var stationName = [];
var difficulty = [];
var authors = [];
*/

/*
client.on('message', message => {
    // if command does not start with !gts then just return
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // !gts next - displays a picture of a station, waits for players to guess. ONLY WORKS WITH AT LEAST ONE PERSON IN THE GAME / THE HOST/ADMINS. Players can guess as many times as they like.
    // !gts guess [name] - guess the name of a station. If a player gets it right, the round ends
    // !gts giveup - if all players use this, then the station name is given, and the round ends

    // When a round ends, new players can join and the host/an admin can start the next round

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'gts') {
        if (!args.length) {
            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error')
                .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                .setDescription('You did not provide any arguments for this command. Please use \'!gts help\' in chat for help.')
                .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
    
            message.channel.send(embed);
            return;
        } else if (args[0] === 'join') {
            if (usersInGame.includes(message.author.id)) {
                message.channel.send(message.author.tag + ', you are already in this game!');
            } else if (answer != null) {
                message.channel.send(message.author.tag + ', there is currently a game in progress! You can join after this round.');
            } else {
                usersInGame.push(message.author.id);
                if (usersInGame.length == 1) {
                    gameInSession = true;
                    const embed = new Discord.MessageEmbed()
                        .setColor('#0000ff')
                        .setTitle('Guess the Station')
                        .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                        .setDescription(message.author.tag + ' has started a game of Guess the Station! **They are the host and can progress the game.** The host can start the next round using \'!gts next\'')
                        .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
            
                    message.channel.send(embed);
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#0000ff')
                        .setTitle('Guess the Station')
                        .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                        .setDescription(message.author.tag + ' has joined the current game of Guess the Station!\nThis game currently has ' + usersInGame.length + ' players. The host can start the next round using \'!gts next\'')
                        .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                    message.channel.send(embed);
                }
            }
            
        } else if (args[0] === 'leave') {
            var index = usersInGame.indexOf(message.author.id);
            if (answer != null) {
                message.channel.send(message.author.tag + ', there is currently a game in progress! You can leave after this round.');
            } else if (index == 0) {
                usersInGame.shift();
                if (usersInGame.length == 0) {
                    gameInSession = false;
                    const embed = new Discord.MessageEmbed()
                        .setColor('#0000ff')
                        .setTitle('Guess the Station')
                        .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                        .setDescription(message.author.tag + ' has left the game. **This game has now ended.**')
                        .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                    message.channel.send(embed);
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#0000ff')
                        .setTitle('Guess the Station')
                        .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                        .setDescription(message.author.tag + ' has left the game. This game currently has ' + usersInGame.length + ' players. **The host is now <@' + usersInGame[0] + '>.**')
                        .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                    message.channel.send(embed);
                }  
            } else if (index > 0) {
                usersInGame.splice(index, 1);
                const embed = new Discord.MessageEmbed()
                    .setColor('#0000ff')
                    .setTitle('Guess the Station')
                    .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                    .setDescription(message.author.tag + ' has left the game. This game currently has ' + usersInGame.length + ' players.')
                    .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                message.channel.send(embed);
            } else {
                message.channel.send(message.author.tag + ', you are not in this game!');
            }
        } else if (args[0] === 'next') {
            if (usersInGame[0] == message.author.id) {
                var index = Math.floor(Math.random() * Math.floor(stationPictures.length));
                answer = stationName[index];
                usersInGame.splice(index, 1);
                const embed = new Discord.MessageEmbed()
                    .setColor('#0000ff')
                    .setTitle('Guess the Station')
                    .setAuthor('PEP Bot')
                    .setDescription('What station is this? You have two minutes to submit as many guesses as you want using \'!gts guess [name]\' where [name] is your guess. **If you are a moderator or an admin, to make things fair please do NOT look at the guessing channel! DM the bot with your guess instead.** *If you are the host, use \'!gts end\' at the end of the two minute period (this is until I, the bot dev, can figure out multithreading... how fun.)* (Guesses are not case sensitive)\n**Difficulty:** ' + difficulty[index] + '\n**Photographer:** ' + authors[index] + '\n*Click the image to enlarge it*')
                    .setImage(stationPictures[index])
                client.channels.cache.get('763726347528044574').send(embed);
            } else {
                message.channel.send(message.author.tag + ', you are not the host!');
            }
        } else if (args[0] === 'guess') {
            if (!usersInGame.includes(message.author.id)) {
                message.channel.send(message.author.tag + ', you are not in the game! You can join after this round using \'!gts join\'');
                return;
            }
            if (answer != null) {
                var argsString = '';
                if (args.length > 2) { //multiworded station
                    for (var i = 1; i < args.length; i++) {
                        argsString = argsString + args[i];
                        if (i != args.length - 1) {
                            argsString = argsString + ' ';
                        }
                    }
                } else {
                    argsString = args[1];
                }
                // put it in a specific channel
                if (argsString.toUpperCase().includes(answer.toUpperCase())) {
                    correct++;
                    usersCorrect.push(message.author.id);
                    if (correct == usersInGame.length) {
                        const embed = new Discord.MessageEmbed()
                            .setColor('#0000ff')
                            .setTitle('Guess the Station')
                            .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                            .setDescription(message.author.tag + ' has got it right, congratulations!\n**The round has now ended as everyone guessed correctly, and the answer was ' + answer + '.** The host can start the next round using \'!gts next\'. New players can join using \'!gts join\' and leave using \'!gts leave\'')
                            .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                        answer = null;
                        usersCorrect = [];
                        correct = 0;
                        client.channels.cache.get('763726347528044574').send(embed);
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor('#0000ff')
                            .setTitle('Guess the Station')
                            .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                            .setDescription(message.author.tag + ' has got it right, congratulations!\n**' + correct + ' out of ' + usersInGame.length + ' have guessed correctly so far.**')
                            .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                            client.channels.cache.get('763726347528044574').send(embed);
                    }                    
                }
            }
        } else if (args[0] === 'end') {
            if (message.author.id == usersInGame[0] || message.author.id === '500456682938171394') {
                const embed = new Discord.MessageEmbed()
                            .setColor('#0000ff')
                            .setTitle('Guess the Station')
                            .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                            .setDescription('The round is over!\n**' + correct + ' out of ' + usersInGame.length + ' have guessed correctly. The answer was ' + answer + '.** The host can start the next round using \'!gts next\'. New players can join using \'!gts join\' and leave using \'!gts leave\'')
                            .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                client.channels.cache.get('763726347528044574').send(embed);
                answer = null;
                usersCorrect = [];
                correct = 0;
            }
        } else if (args[0] === 'clear') {
            if (message.author.id == usersInGame[0] || message.author.id === '500456682938171394') {
                answer = null;
                usersCorrect = [];
                usersInGame = [];
                message.channel.send('Cleared all players! **This game has now ended.**');
            }
        } else if (args[0] === 'forceskip') {
            if (message.author.id == usersInGame[0] || message.author.id === '500456682938171394') {
                const embed = new Discord.MessageEmbed()
                    .setColor('#0000ff')
                    .setTitle('Guess the Station')
                    .setAuthor('PEP Bot', 'https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                    .setDescription('Skipped... this station was ' + answer + '. \nThe host can start the next round using \'!gts next\'')
                    .setThumbnail('https://cdn.discordapp.com/attachments/584463281779900451/763455947435016192/DSC_0555.JPG')
                message.channel.send(embed);
                answer = null;
                usersCorrect = [];
            }
        }
        else if (args[0] === 'bleh') {
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0000ff')
                .setTitle('Guess the Station')
                .setDescription('Here are the rules and how to play guess the station!')
                .addFields(
                    { name: 'How to Play', value: 'The host will put the station you will need to guess in #gts-stations. Within 2 minutes after the next station is shown, you will guess the station in #gts-guesses using \'!gts guess [name]\' where [name] is the name of the station you are guessing. If you are right, the bot will congratulate you in #gts-stations! If not, you will receive no response and will need to keep trying.'},
                )
                .addFields(
                    { name: 'To Join', value: 'Use \'!gts join\' when the bot is online if there is no round currently in progress', inline: true },
                    { name: 'To Leave', value: 'Use \'!gts leave\' if there is no round currently in progress', inline: true },
                )
                .addFields(
                    { name: 'Host Command:', value: '\'!gts next\' will show the next station players need to guess.', inline: true },
                    { name: 'Host Command:', value: '\'!gts clear\' will clear the lobby.', inline: true },
                    { name: 'Host Command:', value: '\'!gts forceskip\' will skip the current station.', inline: true },
                )
            message.channel.send(exampleEmbed);
        }
    }
});

function fillPhotos() {
    pushPhoto('http://cynxs-stuff.com/media/chrome_o2Y6i7uUXa.png', 'Dalmuir', 'Easy', '6089Gardener on Flickr');
}

function pushPhoto(pic, name, diff, photographer) {
    stationPictures.push(pic);
    stationName.push(name);
    difficulty.push(diff);
    authors.push(photographer);
}
*/