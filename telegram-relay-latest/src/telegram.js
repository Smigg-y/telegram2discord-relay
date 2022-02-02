const { Telegraf } = require('telegraf');
const bus = require('./messagebus');
const { ImgurClient } = require('imgur');
const { telegram_token, telegram_channels, discord_channels, imgur_application } = require('./../config.json');

const bot = new Telegraf(telegram_token);
const client = new ImgurClient({ clientId: imgur_application });

var chDef = 0;
bot.on('message', async (ctx) => {
    const {
        text,
        photo,
        caption,
        document,
        from: { first_name, username },
        chat: { id, title },
    } = ctx.message;

    let nameUser = username === undefined ? first_name : username;
    let defCaption = caption === undefined ? '' : caption

    try {
        const userProfile = await ctx.telegram.getUserProfilePhotos(ctx.message.from.id);
        const userProfileLink = await ctx.telegram.getFileLink(userProfile.photos[1][1].file_id);
 
        const profileImage = await client.upload({
            image: userProfileLink.href
        });
        
        var userImage = profileImage.data.link;
    } catch(err) {
        console.log(err);
    };

    if(discord_channels.length < 1) {
        for(var key in telegram_channels) {
            if(id === telegram_channels[key]) {
                chDef = key;
            };
        };
    } else {
        chDef = 0;
    };
    
    if(text !== undefined) {
        bus.emit('message', text, nameUser, userImage, title, chDef);
    };

    if(photo !== undefined) {
        const sentImage = await ctx.telegram.getFileLink(photo[1].file_id);
        const uploadImage = await client.upload({
            image: sentImage.href
        });
 
        let uploadedImage = uploadImage.data.link;

        bus.emit('image', uploadedImage, defCaption, nameUser, userImage, title, chDef);
    };

    if(document !== undefined) {
        if(document.file_size <= 800000) {
            const sentDoc = await ctx.telegram.getFileLink(document.file_id);
            let uploadedDoc = sentDoc.href;

            bus.emit('doc', uploadedDoc, defCaption, nameUser, userImage, title, chDef);
        }
    };
});

module.exports = () => {
    bot.launch();
    console.log('Telegram Bot: [ONLINE]');
};