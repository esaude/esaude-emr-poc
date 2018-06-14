/**
 * Module dependencies.
 */

var Mustache = require('mustache');
var util = require('util');
var fs = require('fs');
var path = require('path');

/**
 * I18n class.
 *
 * @param {Object} options
 * @api public
 */
function I18n(options) {
  this.options = util._extend(util._extend({}, this.defaults), options);
  this.loadTranslations();
}

/**
 * Load translations from directory.
 *
 * @api private
 */
I18n.prototype.loadTranslations = function () {
  var self = this;
  var translations = {};
  var llTranslations = {};
  var locale;
  var dirs = fs.readdirSync(this.options.directory);
  var obj = {};
  for (var i in dirs) {
    var name = this.options.directory + dirs[i];

    if (fs.statSync(name).isDirectory()) {
      var files = fs.readdirSync(name);
      files.forEach(function (file) {

        try {
          locale = path.basename(file).split('.').shift();
          if (locale.includes("pt")) {
            obj = Object.assign(obj, JSON.parse(fs.readFileSync(self.getDirectoryPath(dirs[i], locale))));
            translations[locale] = obj;
            llTranslations[locale.split('_')[0]] = locale;
          }

        } catch (err) {
          console.log(err);
        }
      });
    } else {
      dirs.push(name);
    }
  }

  this.translations = translations;
  this.llTranslations = llTranslations;
};

/**
 * Get all translations for locale.
 *
 * @param {String} locale
 * @return {Object}
 * @api private
 */
I18n.prototype.getTranslations = function (locale) {
  return this.translations[locale] || {};
};


/**
 * Translate a key.
 *
 * @param {String} locale
 * @param {String} key
 * @param {Object} view
 * @param {Object} options
 * @return {String}
 * @api public
 */
I18n.prototype.translate = I18n.prototype.t = function (locale, key, view, options) {
  var translations = this.getTranslations(locale);
  var value = Mustache.render(translations[key] || key, view, translations);
  return value;
};


/**
 * Get normalized path directory.
 *
 * @param {String} locale
 * @return {String}
 */
I18n.prototype.getDirectoryPath = function (module, locale) {
  return path.normalize(path.join(this.options.directory, module + '/' + locale + '.json'));
};


/**
 * Default options.
 */
I18n.prototype.defaults = {
  defaultLocale: 'locale_pt',
  directory: __dirname + '/../../../poc_config/openmrs/i18n/',
};

module.exports = I18n;
