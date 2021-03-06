'use strict'
const google = require('google-parser')
module.exports = {
  async search (keyword) {
    let res = await google.search(keyword + ' -site:ilbe.com')
    if (res === false) {
      return false
    }
    if (typeof res === 'undefined') {
      return undefined
    } else {
      let response = ''
      for (let i = 0; i < 3; i++) {
        if (typeof (res[i]) !== 'undefined') {
          let tempDesc = res[i].description
          if (tempDesc.length > 27) {
            tempDesc = tempDesc.substr(0, 30) + '...'
          }
          tempDesc.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
          response = response + '\n' + '<a href="' + res[i].link + '">' + res[i].title + '</a>' + '\n' +
            (!res[i].description ? '' : tempDesc + '\n\n')
        }
      }
      return response
    }
  },
  async image (keyword) {
    function getRandomIntInclusive (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    let res = await google.img(keyword + ' -site:ilbe.com')
    if (typeof res[0] === 'undefined') {
      return undefined
    } else {
      res.forEach((current, index, thisarr) => {
        if (current.url.match(/x-raw-image:\/\/\//)) {
          thisarr.splice(index, 1)
        }
      })
      let random = getRandomIntInclusive(0, (res.length < 20 ? res.length - 1 : 19))
      return {img: res[random].img, url: res[random].url}
    }
  }
}
