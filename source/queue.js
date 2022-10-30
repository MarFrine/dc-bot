const {CustomEmbed} = require("./cusomembed.js")
let thisEmbed = undefined

module.exports = {
    execute: async ({prefix, currentQueue, message, args}) => {
        if(args[0] == "-?"){
            thisEmbed = new CustomEmbed(prefix, message, "info").embed
                .setTitle(prefix + "queue")
                .setDescription("```" + prefix + "queue shows the current and all the queued songs```")
                .addFields({ name: "Syntax", value: "```" + prefix + "queue```" })
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }

        if(!currentQueue.queue.previousTracks[currentQueue.queue.previousTracks.length-1]){
            thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: there is currently no queue!")
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }

        thisEmbed = new CustomEmbed(prefix, message, "info").embed
            .setTitle("Queue")
        if(currentQueue.queue.connection.paused == true){
            thisEmbed.setDescription("**playing on resume:** ```" + currentQueue.queue.previousTracks[currentQueue.queue.previousTracks.length-1].title + "```")
        } else {
            thisEmbed.setDescription("**currently playing:** ```" + currentQueue.queue.previousTracks[currentQueue.queue.previousTracks.length-1].title + "```")
        }
        //thisEmbed.addFields({name: "currently playing", value: currentQueue.currentTrack.title})
        let nextSongs = ""
        for(let i = 0; i < currentQueue.queue.tracks.length; i++){
            let songName = currentQueue.queue.tracks[i].title
            if(songName.length >= 50){
                songName = songName.slice(0, 42)
                songName = songName + "..."
            }
            nextSongs = nextSongs + (i+1) + ". " + songName + " >> (" + currentQueue.queue.tracks[i].duration + ")                                                                                                                                "
        }              
        if(nextSongs != ""){
            thisEmbed.addFields({name: "next songs", value: "```" + nextSongs + "```"})
        }
        message.channel.send({embeds: [thisEmbed]})
        .then(()=>{message.delete()})
    }
}