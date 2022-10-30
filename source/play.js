
const {QueryType} = require("discord-player")
const {CustomEmbed} = require("./cusomembed.js")
let thisEmbed = undefined


module.exports = {
    execute: async ({prefix, client, message, args, argsStart, queueFilters, acceptedFilters}) => {
        // Make sure the user is inside a voice channel
		if (!message.member.voice.channel){
            thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: you need to be in a voice channel to use this command")
            return message.channel.send({embeds:[thisEmbed]}).then(()=>{message.delete()})
        }

        // Create a play queue for the server
		const queue = await client.player.createQueue(message.guild);

        
        let soundfilter = undefined
        let url = undefined
        if(args[0].startsWith("filter:")){
            soundfilter = args[0].substring(7)
            if(!acceptedFilters.includes(soundfilter)){
                thisEmbed = new CustomEmbed(prefix, message, "error").embed.setDescription("Error: soundfilter " + soundfilter + " doesn't exist!")
                return message.channel.send({embeds:[thisEmbed]}).then(()=>{message.delete()})
            }
            queueFilters.push(soundfilter)
            url = args[1]
            argsStart += args[0].length
        } else {
            queueFilters.push("")
            url = args[0]
        }
        console.log(queueFilters)
            
        // Search for the song using the discord-player
        let result = await client.player.search(url, {
            requestedBy: message.author,
            searchEngine: QueryType.YOUTUBE_VIDEO
        })

        // finish if no tracks were found
         if (result.tracks.length === 0){
            //if no video was found with link use search
            let searchTerm = message.content.substring(argsStart)
            result = await client.player.search(searchTerm, {
                requestedBy: message.author,
                searchEngine: QueryType.YOUTUBE_SEARCH
            })

            if (result.tracks.length === 0){
                thisEmbed = new CustomEmbed(prefix, message, "success").setDescription("Error: no matching video found!")
                return message.channel.send({embeds: [thisEmbed]}).then(()=>{message.delete()})
            }
        }
        
        // Wait until you are connected to the channel
		if (!queue.connection){
            await queue.connect(message.member.voice.channel)
        }

        // Add the track to the queue
        const song = result.tracks[0]
        await queue.addTrack(song)
        thisEmbed = new CustomEmbed(prefix, message, "success").embed
            .setDescription("**[" + song.title + "](" + song.url + ")** was added to queue")
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setFooter({text: "Duration: " + song.duration})


        // Play the song
        if (!queue.playing){
            queue.setFilters({[queueFilters[0]]: true})
            await queue.play()
        }

        //console.log(queue)

        // Respond with the embed containing information about the player
        await message.channel.send({
            embeds: [thisEmbed]
        }).then(()=>{message.delete()})
        return {queue: queue, tracks: queue.tracks, currentTrack: queue.previousTracks[queue.previousTracks.length-1], queueFilters: queueFilters}
    }
    
}

