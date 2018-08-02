const I18n = require('./i18n');

/**
 * This class provides translations for strings based on i18n.
 * @example
 *  const t = require('./../translator')
 *  t.translate(key)
 */
class Translator {
    /** Creates a new instance of I18n */
    constructor() {
        this._i18n = new I18n();
    }

    /**
     * Translates the given key into an appropriate string.
     * All keys can be found in /poc_config/openmrs/i18n
     * @param {string} key - the key for the translated value
     */
    translate (key) {
        return this._i18n.t(key);
    }
}

module.exports = new Translator();
