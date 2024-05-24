const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');

module.exports = (client) => {
    client.distube = new DisTube(client, {
        emitNewSongOnly: false,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        savePreviousSongs: true,
        emitAddSongWhenCreatingQueue: false,
        searchSongs: 0,
        nsfw: false,
        emptyCooldown: 25,
        ytdlOptions: {
            highWaterMark: 1024 * 1024 * 64,
            quality: "highestaudio",
            format: "audioonly",
            liveBuffer: 60000,
            dlChunkSize: 1024 * 1024 * 4,
        },
        plugins: [
            new SpotifyPlugin({
                parallel: true,
                emitEventsAfterFetching: true,
            }),
            new SoundCloudPlugin(),
        ],
    });

    client.distube.on("playSong", (queue, song) => {
        const embed = new EmbedBuilder()
            .setDescription(`\n<:logo1:1104791779317907496><:logo2:1104791792903262309> **| Sistema de Música** \n<:logo3:1104791808002768957><:logo4:1104791819910397993> **| Reproduciendo**\n\n<:numeral:1104223855255506965> ${song.name}\n<:esperando:1104793092411887786> ${song.formattedDuration}\n\n_La canción se está reproduciendo ahora mismo!_`)
            .setThumbnail('https://cdn.discordapp.com/attachments/1072297927986393138/1101221170872864808/logo_MDPRP.png')
            .setColor('#737373')
            .setFooter({
                text: "MDP Roleplay",
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('pause')
                    .setLabel('Pausar')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel('Saltar')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('Detener')
                    .setStyle(ButtonStyle.Danger)
            );

        queue.textChannel.send({
            embeds: [embed],
            components: [row]
        });
    });

    client.distube.on("addSong", (queue, song) => {
        const embed = new EmbedBuilder()
            .setDescription(`\n<:logo1:1104791779317907496><:logo2:1104791792903262309> **| Sistema de Música** \n<:logo3:1104791808002768957><:logo4:1104791819910397993> **| Canción agregada**\n\n<:tilde:1104790645857603705> ${song.name}\n<:esperando:1104793092411887786> ${song.formattedDuration}\n\n_La canción se agregó con éxito, espera que termine la actual!_`)
            .setThumbnail('https://cdn.discordapp.com/attachments/1072297927986393138/1101221170872864808/logo_MDPRP.png')
            .setColor('#737373')
            .setFooter({
                text: "MDP Roleplay",
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('playNow')
                    .setLabel('Reproducir Ahora')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('remove')
                    .setLabel('Eliminar')
                    .setStyle(ButtonStyle.Secondary)
            );

        queue.textChannel.send({
            embeds: [embed],
            components: [row]
        });
    });

    client.distube.on("initQueue", (queue) => {
        queue.autoplay = true;
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        const queue = client.distube.getQueue(interaction.guildId);

        if (!queue) {
            await interaction.reply({ content: '¡No hay canciones en la cola!', ephemeral: true });
            return;
        }

        if (interaction.customId === 'pause') {
            if (queue.paused) {
                queue.resume();
                await interaction.reply({ content: '¡Canción reanudada!', ephemeral: true });
            } else {
                queue.pause();
                await interaction.reply({ content: '¡Canción pausada!', ephemeral: true });
            }
        } else if (interaction.customId === 'skip') {
            queue.skip();
            await interaction.reply({ content: '¡Canción saltada!', ephemeral: true });
        } else if (interaction.customId === 'stop') {
            queue.stop();
            await interaction.reply({ content: '¡Música detenida!', ephemeral: true });
        } else if (interaction.customId === 'playNow') {
            // Implementa la lógica para reproducir la canción añadida inmediatamente si es necesario
            await interaction.reply({ content: '¡Reproduciendo la canción ahora!', ephemeral: true });
        } else if (interaction.customId === 'remove') {
            // Implementa la lógica para eliminar la canción añadida si es necesario
            await interaction.reply({ content: '¡Canción eliminada!', ephemeral: true });
        }
    });
};
