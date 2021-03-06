# Telegram to Discord relay
###### Basic relay between platforms, easily setup and capable of sending messages to multiple Discord channels for different Telegram Groups

## Setup

```console
cd telegram-relay-latest
npm install
```

Add your information to [`config.json`](https://github.com/Smigg-y/telegram2discord-relay/blob/main/telegram-relay-latest/config.json)[^1]

```json
{
    "discord_token": "Discord Bot Token",
    "discord_channels": [
        "Discord Channel 1",
        "Discord Channel 2"
    ],

    "telegram_token": "Telegram Bot Token",
    "telegram_channels": [
        -100,
        -100
    ],

    "imgur_application": "Imgur Application ID"
}
```

## Usage
```console
npm start
```

[^1]: Inside of the config file you will see two arrays, `discord_channels` and `telegram_channels`, these are used to allow the relay to work in multiple telegram groups and for multiple discord channels. If you are only going to use one discord channel then you do not need to have more than one entry in the array, however if you're going to use multiple you must have mutliple telegram channels. The first entry in the `telegram_channels` array is linked to the first entry of the `discord_channels` array and any messages received in the first telegram channel will be sent to the first discord channel and so on.
