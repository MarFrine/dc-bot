const {QueryType} = require("discord-player")
const {CustomEmbed} = require("./cusomembed.js")
let thisEmbed = undefined

module.exports = {
    execute: async ({prefix, currentQueue, client, message, args, argsStart, queueFilters, acceptedFilters})=>{
        if(args[0] == "filters"){
            thisEmbed = new CustomEmbed(prefix, message, "info").embed
                .setTitle("Soundfilters")

            let embedDescription = "```"
            acceptedFilters.forEach((thisFilter)=>{
                embedDescription = embedDescription + thisFilter + "                                                                     "
            })
            embedDescription = embedDescription + "```"

            thisEmbed.setDescription(embedDescription)
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }

        if(args[0] == "-?"){
            thisEmbed = new CustomEmbed(prefix, message, "info").embed.setTitle(prefix + "filter").setDescription("```with " + prefix + "filter you can get the currently used soundfilter, set soundfilters, and remove the filter.```").addFields({ name: "Syntax   - get", value: "```" + prefix + "filter (get)```" }, { name: "Syntax   - set", value: "```" + prefix + "filter set yourfilter```" },{ name: "Syntax   - remove", value: "```" + prefix + "filter remove```" })
            //.setDescription("```" + prefix + "play plays the youtube video with the specified link or the specified search terms. You can add soundfilters by using your filters as the first argument (in brackets and seperated by commas). Get information about soundfilters with " + prefix + "filter -?```").addFields({ name: "Syntax", value: "```" + prefix + "play (filter:yourfilter) video-link || search terms```" })
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }

        if(!currentQueue.queue){
            thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: there is currently nothing playing!")
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }

        if(args[0] == "" || args[0] == "get"){
            let activeFilters = currentQueue.queue._activeFilters[0]
            console.log(currentQueue.queue._activeFilters)
            console.log(activeFilters)
            if(!activeFilters){
                thisEmbed = new CustomEmbed(prefix, message, "info").embed
                    .setDescription("no currently used soundfilter")
                return message.channel.send({embeds: [thisEmbed]})
                    .then(()=>{message.delete()})
            } else {
                thisEmbed = new CustomEmbed(prefix, message, "info").embed
                    .setDescription("currently used soundfilter: " + activeFilters)
                return message.channel.send({embeds: [thisEmbed]})
                    .then(()=>{message.delete()})
            }
        }

        

        if(args[0] == "set"){
            thisEmbed = new CustomEmbed(prefix, message, "success").embed
            const soundfilter = args[1]
            if(!acceptedFilters.includes(soundfilter)){
                thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: soundfilter " + soundfilter + " doesn't exist!")
                return message.channel.send({embeds:[thisEmbed]}).then(()=>{message.delete()})
            }
            currentQueue.queue.setFilters({[soundfilter]: true})
            thisEmbed.setDescription("filter " + soundfilter + " was added to the current song")
            return message.channel.send({embeds: [thisEmbed]})
            .then(()=>{message.delete()})
        }

        if(args[0] == "remove"){
            thisEmbed = new CustomEmbed(prefix, message, "success").embed

            if(!currentQueue.queue._activeFilters[0]){
                thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: no soundfilter in use!")
                return message.channel.send({embeds:[thisEmbed]}).then(()=>{message.delete()})
            }

            thisEmbed.setDescription("filter " + currentQueue.queue._activeFilters[0] + " was removed from the current song")
            currentQueue.queue.setFilters({[currentQueue.queue._activeFilters[0]]: false})
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
        }

        thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: " + args[0] + " is no valid argument.")
            return message.channel.send({embeds: [thisEmbed]})
                .then(()=>{message.delete()})
    }
}