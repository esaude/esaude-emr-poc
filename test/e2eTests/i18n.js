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
  this.loadTranslations(this.options.locale);
}

/**
 * Load translations from directory.
 *
 * @api private
 */
I18n.prototype.loadTranslations = function (locale) {
  var self = this;
  var translations = {};
  var llTranslations = {};

  // Get the subdirectories from the base directory
  var dirs = fs.readdirSync(this.options.directory);

  for (var i in dirs) {
    var name = this.options.directory + dirs[i];

    // Each subdirectory represents a module and has it's own locale files
    if (fs.statSync(name).isDirectory()) {
      var files = fs.readdirSync(name);

      files.forEach((file) => {

        try {
          fileName = path.basename(file).split('.').shift();

          // Make sure to get the file for the selected locale
          if (fileName == locale) {
            // Get the file's translations
            const filePath = self.getDirectoryPath(dirs[i], locale);
            const fileJson = fs.readFileSync(filePath);
            const fileTranslations = JSON.parse(fileJson); // eslint-disable-line angular/json-functions

            // Update our saved dictionary of translations
            let existingTranslations = translations[locale] || {};
            translations[locale] = Object.assign(existingTranslations, fileTranslations);
            llTranslations[locale.split('_')[0]] = locale;
          }

        } catch (err) {
          // eslint-disable-next-line angular/log
          console.log(err);
          throw err;
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
 * @param {String} key
 * @param {Object} view
 * @return {String}
 * @api public
 */
I18n.prototype.translate = I18n.prototype.t = function (key, view) {
  var translations = this.getTranslations(this.options.locale);
  var value = Mustache.render(translations[key] || key, view, translations);
  return value;
};

/**
 * Get normalized path directory.
 *
 * @param {String} module
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
  locale: 'locale_pt',
  directory: __dirname + '/../../poc_config/openmrs/i18n/',
};

module.exports = I18n;
