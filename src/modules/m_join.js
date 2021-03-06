const db = require('../db')

module.exports = (bot, logger, helper) => {
  bot.on('message', async (msg) => {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    if (!msg.new_chat_member) return
    const chatid = msg.chat.id
    let temp
    try {
      // eslint-disable-next-line
      let send;
      [send, temp] = await Promise.all([
        bot.sendChatAction(chatid, 'typing'),
        helper.getlang(msg, logger)
      ])
      if (msg.new_chat_member.id !== global.botinfo.id) {
        let value = await db.message.findOne({
          where: {
            id: chatid
          }
        })
        if (!value) {
          await bot.sendMessage(chatid, temp.text(msg.chat.type, 'message.join')
            .replace(/{roomid}/g, msg.chat.title)
            .replace(/{userid}/g, msg.new_chat_member.first_name), {
            reply_to_message_id: msg.message_id
          })
          logger.info('message: chat join, chatid: ' + chatid + ', userid: ' + msg.new_chat_member.id + ', username: ' + msg.from.username)
        } else {
          value = value.get({plain: true})
          let welcomeMessage
          if (value && value.welcomeMessage) {
            welcomeMessage = value.welcomeMessage
          } else {
            welcomeMessage = temp.text(msg.chat.type, 'message.join')
          }
          await bot.sendMessage(chatid, welcomeMessage
            .replace(/{roomid}/g, msg.chat.title)
            .replace(/{userid}/g, msg.new_chat_member.first_name), {
            reply_to_message_id: msg.message_id
          })
          logger.info('message: chat join, chatid: ' + chatid + ', userid: ' + msg.new_chat_member.id + ', username: ' + msg.from.username)
        }
      } else {
        await bot.sendChatAction(chatid, 'typing')
        await bot.sendMessage(chatid, '👋 ' + temp.text(msg.chat.type, 'message.botjoin'))
        logger.info('message: chat join, chatid: ' + chatid + ', i\'m join room!')
      }
    } catch (e) {
      logger.error('message: chat join, chatid: ' + chatid + ', userid: ' + msg.new_chat_member.id + ', username: ' + msg.from.username + ' status: error')
      logger.debug(e.stack)
    }
  })
}
