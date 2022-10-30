const {EmbedBuilder} = require("discord.js")

module.exports = {
    CustomEmbed: class {
        constructor(prefix, message, type){
            this.embed = new EmbedBuilder()
            .setAuthor({ name: "@" + message.author.username, iconURL: "https://cdn.discordapp.com/avatars/" + message.author.id + "/" + message.author.avatar + ".png?size=2048"})
            if(type == "error"){
                this.embed.setColor("#FF0000")
                this.embed.setFooter({ text: "(when you're having issues try " + prefix + "help)"})
            }else if(type == "success"){
                this.embed.setColor("#008600")
            }else if(type == "info"){
                this.embed.setColor("#5050FF")
            }
        }
    }
}