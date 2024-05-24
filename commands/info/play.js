const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "play",
    aliases: ["play"],
    cooldown: 3000,
    desc: "Sirve para reproducir una canción",
    async run(client, message, args, prefix) {

        if(!args.length) return message.reply(`<:cruz:1104223759877025833> Tienes que especificar el nombre de una canción`);
        if(!message.member.voice?.channel) return message.reply(`<:cruz:1104223759877025833> Tienes que estar en un canal de voz para ejecutar este comando!`);
        if(message.guild.members.me.voice?.channel && message.member.voice?.channel.id != message.guild.members.me.voice?.channel.id) return message.reply(`Necesito que estes en un canal de voz asi puedo entrar y reproducir la musica!`);
        client.distube.play(message.member.voice?.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        });
        message.reply(`<a:check:1104223750884446270> Buscando: **${args.join(" ")}**...`);
    }
}