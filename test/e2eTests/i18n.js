const Mustache = require('mustache');
const util = require('util');
const fs = require('fs');
const path = require('path');

/**
 * I18n class.
 *
 * @param {Object} options
 */
class I18n {
 
  /**
   * Loads the given options that are later used to
   * generate the appropriate translations.
   * @param {object} options - The options used to generate translations
   */
  constructor(options) {
    const defaults = {
      locale: 'locale_pt',
      directory: __dirname + '/../../poc_config/openmrs/i18n/',
    }

    this.options = util._extend(util._extend({}, defaults), options);
    this.loadTranslations(this.options.locale);
  }

  /**
   * Load translations from directory.
   *
   * @api private
   */
  loadTranslations (locale) {
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
            const localeInFilename = path.basename(file).split('.').shift();
  
            // Make sure to get the file for the selected locale
            if (localeInFilename == locale) {
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
  }
  
  /**
   * Get all translations for locale.
   *
   * @param {String} locale
   * @return {Object}
   * @api private
   */
  getTranslations (locale) {
    return this.translations[locale] || {};
  }

  /**
   * Translate a key.
   *
   * @param {String} key
   * @param {Object} view
   * @return {String}
   * @api public
   */
  t(key, view) {
    return this.translate(key, view);
  }
  
  /**
   * Translate a key.
   *
   * @param {String} key
   * @param {Object} view
   * @return {String}
   * @api public
   */
  translate (key, view) {
    var translations = this.getTranslations(this.options.locale);
    var value = Mustache.render(translations[key] || key, view, translations);
    return value;
  }
  
  /**
   * Get normalized path directory.
   *
   * @param {String} module
   * @param {String} locale
   * @return {String}
   */
  getDirectoryPath (module, locale) {
    return path.normalize(path.join(this.options.directory, module + '/' + locale + '.json'));
  } 
}
module.exports = I18n;
