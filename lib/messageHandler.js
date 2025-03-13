module.exports = (message) => {
    if (message.body.toLowerCase() === 'hello') {
        message.reply('👋 Hi there! How can I assist you?');
    }
};
