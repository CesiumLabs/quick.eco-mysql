### Quick.eco MySQL Manager
MySQL Manager for Quick.eco

![Quick.Eco](https://nodei.co/npm/quick.eco.png)

### Example
```js
const { EconomyManager } = require('quick.eco');
const { Client } = require('discord.js');
const client = new Client();
const eco = new EconomyManager({
    adapter: 'mysql',
    adapterOptions: {
        user: 'root',
        password: '',
        host: 'localhost',
        database: ''
    }    
});
 
client.on('ready', () => console.log('connected'));
 
client.on('message', (message) => {
    if(message.author.bot) return;
    if(!message.guild) return;
 
    if(message.content === '!bal') {
        let money = eco.fetchMoney(message.author.id);
        return message.channel.send(`${message.author} has ${money} coins.`);
    }
})
```

### Adapter Options
- User - MySQL Username
- Password - Password
- Host - MySQL Host
- Database - Database Name
- Port - Port
- Table - Table name
- additionalOptions - Additional Options to pass into MySQL

### Links
- **[Discord](https://discord.gg/uqB8kxh)**
- **[Quick.eco](https://npmjs.com/package/quick.eco)**
- **[DevSnowflake](https://github.com/DevSnowflake)**
- **[Website](https://snowflakedev.xyz/)**

**© Snowflake Studio ❄️ - 2020**