// bot.js

const { Telegraf } = require('telegraf');

// Создаем экземпляр бота, вставьте свой токен
const bot = new Telegraf('7011061165:AAEHA457c900gzmMW2JAxk4tf_UpYj1vZSw');

// Обработка команды /start
bot.start((ctx) => {
    // Получаем полный текст сообщения
    const messageText = ctx.message.text;

    // Извлекаем параметр start из ссылки
    const match = messageText.match(/\/start\s+(\S+)/);
    const startParam = match ? match[1] : null;

    // Ответ пользователю
    if (startParam) {
        ctx.reply(`Параметр start: ${startParam}`);
    } else {
        ctx.reply('Параметр start не найден.');
    }
});

// Запуск бота
bot.launch().then(() => {
    console.log('Бот запущен');
});

// Обработка ошибок
process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception', err);
});

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
