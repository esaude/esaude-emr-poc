const I18n = require('./i18n');

// Create the translator as a singleton to share the instance across the app
// Usage: declare it and use the translate function
// const t = require('./../translator')
// t.translate(key)
const translator = (function () {
  let instance;

  function init() {
    let i18n = new I18n();

    return {
      translate: function (key) {
        return i18n.t(key);
      },
    };
  };

  return {
    getInstance: function () {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
})();

module.exports = translator.getInstance();
