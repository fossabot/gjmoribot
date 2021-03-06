module.exports = (bot, logger, helper) => {
  bot.on('inline_query', async (msg) => {
    const q = {
      id: msg.id, query: msg.query
    }

    const match = q.query.match(/^(?:([photo|image|img|짤|사진|이미지]+)(?:| (.*)+))$/)
    if (match) {
      const google = require('google-parser')
      let temp
      try {
        temp = await helper.getlang(msg, logger)
        if (typeof match[2] === 'undefined' || match[2] === '') {
          try {
            await bot.answerInlineQuery(q.id, [{
              type: 'article',
              title: '@' + global.botinfo.username + ' (photo|image|img) (keyword)',
              id: 'help',
              input_message_content: {
                message_text: '@' + global.botinfo.username + ' (photo|image|img) (keyword)',
                parse_mode: 'HTML',
                disable_web_page_preview: true
              },
              reply_markup: {
                inline_keyboard: [[{
                  text: '🖼',
                  switch_inline_query_current_chat: 'img '
                }]]
              }
            }], {
              cache_time: 3
            })
            logger.info('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: not valid, response: help')
          } catch (e) {
            logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: valid')
            logger.debug(e.stack)
          }
        } else {
          try {
            let res = await google.img(match[2])
            if (typeof res[0] === 'undefined') {
              try {
                await bot.answerInlineQuery(q.id, [{
                  type: 'article',
                  title: 'not found',
                  id: 'not found',
                  input_message_content: {
                    message_text: temp.group('command.img.not_found'),
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                  }
                }], {
                  cache_time: 3
                })
                logger.info('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: valid')
              } catch (e) {
                logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
                logger.debug(e.stack)
              }
            } else {
              let results = []
              for (let i in res) {
                if (!res[i].img.match(/x-raw-image:\/\/\//)) {
                  results.push({
                    type: 'photo',
                    photo_url: res[i].img,
                    thumb_url: res[i].img,
                    id: q.id + '/photo/' + i,
                    reply_markup: {
                      inline_keyboard: [[{
                        text: temp.inline('command.img.visit_page'),
                        url: res[i].url
                      }, {
                        text: temp.inline('command.img.view_image'),
                        url: res[i].img
                      }],
                      [{
                        text: temp.inline('command.img.another'),
                        switch_inline_query_current_chat: 'img ' + match[2]
                      }]]
                    }
                  })
                }
              }
              results.splice(50)
              try {
                await bot.answerInlineQuery(q.id, results, {
                  cache_time: 3
                })
                logger.info('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: valid')
              } catch (e) {
                try {
                  logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
                  logger.debug(e.stack)
                  await bot.answerInlineQuery(q.id, [{
                    type: 'article',
                    title: 'error',
                    id: 'error',
                    input_message_content: {
                      message_text: temp.group('command.img.error')
                        .replace(/{botid}/g, '@' + global.botinfo.username)
                        .replace(/{keyword}/g, match[2]),
                      parse_mode: 'HTML',
                      disable_web_page_prefiew: true},
                    reply_markup: {
                      inline_keyboard: [[{
                        text: '@' + global.botinfo.username + ' img ' + match[2],
                        switch_inline_query_current_chat: 'img ' + match[2]
                      }]]
                    }
                  }], {
                    cache_time: 0
                  })
                } catch (e) {
                  logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error send error')
                  logger.debug(e.stack)
                }
              }
            }
          } catch (e) {
            try {
              logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
              logger.debug(e.stack)
              await bot.answerInlineQuery(q.id, [{
                type: 'article',
                title: 'error',
                id: 'error',
                input_message_content: {
                  message_text: temp.group('command.img.error')
                    .replace(/{botid}/g, '@' + global.botinfo.username)
                    .replace(/{keyword}/g, match[2]),
                  parse_mode: 'HTML',
                  disable_web_page_preview: true},
                reply_markup: {
                  inline_keyboard: [[{
                    text: '@' + global.botinfo.username + ' img ' + match[2],
                    switch_inline_query_current_chat: 'img ' + match[2]
                  }]]
                }
              }], {
                cache_time: 3
              })
            } catch (e) {
              logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error send error')
              logger.debug(e.stack)
            }
          }
        }
      } catch (e) {
        logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
        logger.debug(e.stack)
      }
    }
  })
}
