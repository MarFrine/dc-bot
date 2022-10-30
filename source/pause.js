const {CustomEmbed} = require("./cusomembed.js")
let thisEmbed = undefined

module.exports = {
    execute: async ({prefix, currentQueue, message, args}) => {
        if(args[0] == "-?"){
            thisEmbed = new CustomEmbed(prefix, message, "info").embed
                .setTitle(prefix + "pause || " + prefix + "resume")
                .setDescription("```" + prefix + "pause || " + prefix + "resume pauses or resumes the current song```")
                .addFields({ name: "Syntax", value: "```" + prefix + "pause // " + prefix + "resume```" })
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }

        if(!currentQueue.queue.previousTracks[currentQueue.queue.previousTracks.length-1]){
            thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: there is no current song!")
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }
        
        thisEmbed = new CustomEmbed(prefix, message, "success").embed
        if(currentQueue.queue.connection.paused == false){
            currentQueue.queue.setPaused(true)
            thisEmbed
                .setDescription("current song is now paused!")
        } else {
            currentQueue.queue.setPaused(false)
            thisEmbed
                .setDescription("current  song continues playing")
        }

        await message.channel.send({embeds: [thisEmbed]}).then(()=>{message.delete()})
    }
}
