const { ActivityType } = require('discord.js');
const client = require('..');
const chalk = require('chalk');
const os = require('os');

client.on("ready", async () => {
    const activities = [
        { name: `${client.guilds.cache.size} Servers`, type: ActivityType.Listening },
        { name: `${client.channels.cache.size} Channels`, type: ActivityType.Playing },
        { name: `${client.users.cache.size} Users`, type: ActivityType.Watching },
        { name: `Discord.js v14`, type: ActivityType.Competing }
    ];
    const status = [
        'online',
        'dnd',
        'idle'
    ];
    let i = 0;
    setInterval(() => {
        if (i >= activities.length) i = 0
        client.user.setActivity(activities[i])
        i++;
    }, 5000);

    let s = 0;
    setInterval(() => {
        if (s >= status.length) s = 0
        client.user.setStatus(status[s])
        s++;
    }, 30000);
    console.log(chalk.red(`Logged in as ${client.user.tag}!`));

    // Obtener la información del sistema y del bot
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const cpuUsage = os.cpus().map(cpu => cpu.model).join(', ');
    const uptime = process.uptime();
    const hostname = os.hostname();
    const platform = os.platform();

    // URL del webhook (reemplaza con tu URL de webhook)
    const webhookURL = 'https://discord.com/api/webhooks/1243193940598063125/7yFvJb6QKk0mch7VzgFH0AIDitX3iUEUSGB8n9zCks3ktE-8i7v-OSuD2IpArqZ4UYHz';

    // Cuerpo del mensaje
    const body = JSON.stringify({
        username: 'Bot Status',
        avatar_url: client.user.displayAvatarURL(),
        embeds: [{
            title: "Estado del Bot",
            color: 0x737373,
            description: `Ando prendido!`,
            fields: [
                { name: "RAM Usada", value: `${ramUsage} MB`, inline: true },
                { name: "RAM Total", value: `${totalRam} MB`, inline: true },
                { name: "CPU", value: cpuUsage, inline: false },
                { name: "Tiempo activo", value: `${Math.floor(uptime / 60)} minutos`, inline: true },
                { name: "Hostname", value: hostname, inline: true },
                { name: "Plataforma", value: platform, inline: true }
            ],
            footer: {
                text: "Neko",
                icon_url: client.user.displayAvatarURL()
            },
            timestamp: new Date()
        }]
    });

    try {
        // Dynamic import of node-fetch
        const fetch = (await import('node-fetch')).default;

        // Enviar el mensaje al webhook
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });

        if (response.ok) {
            console.log('Mensaje enviado con éxito');
        } else {
            console.error('Error al enviar el mensaje:', response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
});
