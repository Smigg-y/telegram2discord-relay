const { Telegraf } = require('telegraf');
const bus = require('./messagebus');
const { ImgurClient } = require('imgur');
const { telegram_token, telegram_channels, imgur_application } = require('./../config.json');

const bot = new Telegraf(telegram_token);
const client = new ImgurClient({ clientId: imgur_application });

bot.on('message', async (ctx) => {
    const {
        text,
        photo,
        caption,
        from: { first_name, username },
        chat: { id, title },
    } = ctx.message;

    let nameUser = username === undefined ? first_name : username;

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

    if(photo !== undefined) {
        const sentImage = await ctx.telegram.getFileLink(photo[1].file_id);
        const uploadImage = await client.upload({
            image: sentImage.href
        });
 
        var uploadedImage = uploadImage.data.link;
    };

    for(var key in telegram_channels) {
        if(id === telegram_channels[key]) {
            var chDef = key;
        };
    };
    
    if(text !== undefined) {
        bus.emit('message', text, nameUser, userImage, title, chDef);
    };

    if(photo !== undefined) {
        let defCaption = caption === undefined ? '' : caption
        bus.emit('image', uploadedImage, defCaption, nameUser, userImage, title, chDef)
    };
});

module.exports = () => {
    bot.launch();
    console.log('Telegram Bot: [ONLINE]');
};