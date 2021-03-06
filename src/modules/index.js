'use strict'
module.exports = async (bot, logger, helper) => {
  const glob = require('glob-promise')
  const path = require('path')

  try {
    let items = await glob(path.join(__dirname, './*_*.js'))

    for (let i in items) {
      require(items[i])(bot, logger, helper)
    }
    logger.debug('Module: Load complete')
  } catch (e) {
    logger.error(e)
  }
}
