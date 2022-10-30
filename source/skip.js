const {CustomEmbed} = require("./cusomembed.js")
let thisEmbed = undefined

module.exports = {
    execute: async ({prefix, currentQueue, message, args}) => {
        if(args[0] == "-?"){
            thisEmbed = new CustomEmbed(prefix, message, "info").embed
                .setTitle(prefix + "skip")
                .setDescription("```" + prefix + "skip skips the current song. Specify which song you want to skip to by using the tracknumber as the argument (the tracknumbers can be seen with the " + prefix + "queue command)```")
                .addFields({ name: "Syntax", value: "```" + prefix + "skip tracknumber(optional)```" })
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }

        //console.log(currentQueue.queue)

        if(!currentQueue.queue){
            thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: there is currently nothing playing!")
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }
        
        let deleteQueue = false
        thisEmbed = new CustomEmbed(prefix, message, "success").embed

        if(args[0] == ""){
            
            if(currentQueue.queue.tracks[0]){
                thisEmbed.addFields({name: "skipped", value: currentQueue.queue.previousTracks[currentQueue.queue.previousTracks.length-1].title})
                thisEmbed.addFields({name: "now Playing", value: currentQueue.queue.tracks[0].title})
            } else {
                thisEmbed.addFields({name: "skipped", value: currentQueue.queue.previousTracks[currentQueue.queue.previousTracks.length-1].title})
                deleteQueue = true
            }
            currentQueue.queue.skip()
        } else {
            if(!currentQueue.queue.tracks[args[0]-1]){
                thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: this tracknumber doesn't exist!")
                return message.channel.send({embeds: [thisEmbed]})
                    .then(()=>{message.delete()})
            }

            thisEmbed.setTitle("skipped " + args[0] + " songs")
            thisEmbed.addFields({name: "now Playing", value: currentQueue.queue.tracks[args[0]-1].title})

            currentQueue.queue.skipTo(args[0]-1)
        }

        await message.channel.send({embeds: [thisEmbed]}).then(()=>{message.delete()})
        return deleteQueue
    }
}