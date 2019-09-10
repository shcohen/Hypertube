const l = require('./languageCodes');

module.exports = {
  getLanguageName: (code) => {
    return l[code] ? l[code][4] : code;
  }
};