require("dotenv").config()
const {Client, GatewayIntentBits, ActivityType, MessageEmbed } = require("discord.js")
const fs = require("fs")
const {REST} = require('@discordjs/rest');
const {Player, QueryType} = require("discord-player")
const {CustomEmbed} = require("./source/cusomembed.js")
let thisEmbed = undefined
const commandPlay = require("./source/play.js")
const commandPause = require("./source/pause.js")
const commandQueue = require("./source/queue.js")
const commandSkip = require("./source/skip.js")
const commandFilter = require("./source/filter.js")

const acceptedFilters = ["8D", "bassboost", "bassboost_high", "bassboost_low", "chorus", "chorus2d", "chorus3d", "compressor", "dim", "expander", "fadein", "flanger", "gate", "haas", "karaoke", "mcompand", "mono", "mstlr", "mstrr", "nightcore", "normalizer", "normalizer2", "phaser", "pulsator", "reverse", "softlimiter", "subboost", "surrounding", "treble", "tremolo", "vaporwave", "vibrato"]
const otherFilters = ["earrape"]

const prefix = "!"

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates], presence: { status: "online", activities: [{ name: prefix + "...", type: ActivityType.Listening }], }, failIfNotExists: false})

let currentQueue = {}
let queueFilters = []

client.player = new Player(client, {
    ytdlOptions:{
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

function updateFilters(){
    if(currentQueue.queue){
        console.log("update filters")
        acceptedFilters.forEach((thisFilter)=>{
            currentQueue.queue.setFilters({[thisFilter]: false})
        })
        queueFilters.shift()
        currentQueue.queue.setFilters({[queueFilters[0]]: true})
    }
}

client.player.on("trackEnd", ()=>{updateFilters()})

client.on("ready", ()=>{
    console.log("bot logged in as: " + client.user.username)
})

client.on("messageCreate", async (message)=>{
    if(message.author.bot == true){
        return console.log("bot kann keine befehle schicken")
    }
    if(message.content.startsWith(prefix)){
        const command = message.content.substring(prefix.length).split(" ")[0].toLowerCase()
        const args = message.content.substring(prefix.length + command.length+1).split(" ")
        const argsStart = prefix.length + command.length+1
        console.log("command: " + command, "|| args:", args)
        switch (command) {
            case "help":
                thisEmbed = new CustomEmbed(prefix, message, "info").embed
                    .addFields(
                    { name: prefix + "help", value: "```show this menu```" },
                    { name: prefix + "play", value: "```play a youtube video in the voicechat you are currently in```" },
                    { name: prefix + "pause || " + prefix + "resume", value: "```pauses or resumes the current song```" },
                    { name: prefix + "queue", value: "```shows the current queue```" },
                    { name: prefix + "skip", value: "```skips song(s)```" },
                    { name: prefix + "filter", value: "```shows the soundfilter that is used on the current song```" },
                    { name: "\u200B", value: "\u200B" },
                    { name: "further information", value: "```for further information on each command type -? as the argument (e.g. " + prefix + "play -?)```" },
                    { name: "\u200B", value: "\u200B" },
                    { name: "Problems?", value: "```Please report```", inline: true },
                    { name: "Discord:", value: "```MarFri#7203```", inline: true },
                )
                message.channel.send({embeds: [thisEmbed]})
                    .then(()=>{message.delete()})
                break;
            case "hi":
                thisEmbed = new CustomEmbed(prefix, message, "success").embed.setTitle("HI!")
                message.channel.send({embeds: [thisEmbed]})
                    .then(()=>{message.delete()})
                break;
            case "play":
                if(args[0] == ""){
                    thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: video-link or search terms required!")
                    return message.channel.send({embeds: [thisEmbed]})
                        .then(()=>{message.delete()})
                } else if(args[0] == "-?"){
                    thisEmbed = new CustomEmbed(prefix, message, "info").embed.setTitle(prefix + "play").setDescription("```" + prefix + "play plays the youtube video with the specified link or the specified search terms. You can add soundfilters to your song by adding the optional filter argment. Get more information about soundfilters with " + prefix + "filter filters```").addFields({ name: "Syntax", value: "```" + prefix + "play (filter:yourfilter) video-link || search terms```" })
                    //.setDescription("```" + prefix + "play plays the youtube video with the specified link or the specified search terms. You can add soundfilters by using your filters as the first argument (in brackets and seperated by commas). Get information about soundfilters with " + prefix + "filter -?```").addFields({ name: "Syntax", value: "```" + prefix + "play (filter:yourfilter) video-link || search terms```" })
                    message.channel.send({embeds: [thisEmbed]})
                        .then(()=>{message.delete()})
                } else {
                    currentQueue = await commandPlay.execute({client, message, args, argsStart, queueFilters, acceptedFilters})
                    if(currentQueue.queueFilters){
                        queueFilters = currentQueue.queueFilters
                    }
                    
                }
                break;
            case "queue":
                commandQueue.execute({prefix, currentQueue, message, args, queueFilters})
                break;
            case "pause":
                commandPause.execute({prefix, currentQueue, message, args})
                break;
            case "resume":
                commandPause.execute({prefix, currentQueue, message, args})
                break;
            case "skip":
                deleteQueue = await commandSkip.execute({prefix, currentQueue, message, args})
                if(deleteQueue == true){
                    currentQueue = {};
                }
                break;
            case "filter":
               commandFilter.execute({prefix, currentQueue, client, message, args, argsStart, queueFilters, acceptedFilters})
                
                break;
            default:
                thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: the command **" + prefix + command + "** does not exist!")
                message.channel.send({embeds: [thisEmbed]})
                    .then(()=>{message.delete()})
                break;
        }
    }
})

client.login(process.env.DISCORDJS_BOT_TOKEN)