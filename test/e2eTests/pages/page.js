const Component = require('./components/component');
const translator = require('./../translator');

/**
 * Represents a page on the POC website
 * A page consists of functions that help tests interact with the POC page
 * and can have multiple components which add common functionality.
 * Subclasses of Page pass in options that define when the page is loaded
 * and the names of the page's components, if any.
 * This class adds the component's properties
 * to the class instance which lets tests call component methods
 * on the instance as if they were one object. See Compoent for more details.
 */
class Page {
  constructor(options) {
    // Make sure the components array is inialized
    options.components = options.components || [];

    this.options = options;

    // Every page should have the header component
    if (!this.options.components.includes('header')) {
      this.options.components.push('header');
    }
  }

  /** Initializes the page */
  _init() {
    this.I = actor();

    // Add each component to this page
    this.options.components.forEach(name => this._addComponent(name));
  }

  /** Validates that the page is loaded */
  isLoaded() {
    this.I.waitForElement(this.options.isLoaded.element, 5);
    this.I.seeInCurrentUrl(this.options.isLoaded.urlPart);

    // If there is an overlay, wait for it
    this.I.waitForInvisible('#overlay', 10);
  }

  /**
   * Gets an instance of the component
   * and copies its properties and functions
   * to this page
   * @param {string} componentName - the name of the component to add
   */
  _addComponent(componentName) {
    const component = Component.create(componentName);
    component.addToPage(this);
  }

  /**
   * Translate using the default locale
   * @param {string} key - the key used to get the translated value
   */
  translate(key) {
    return translator.translate(key);
  }
}

module.exports = Page;
