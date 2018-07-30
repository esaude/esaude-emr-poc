const translator = require('./../../translator');

/**
 * Represents a component of a page.
 * Many of the POC pages consist of multiple components.
 * In many cases we want to test the same component on different pages.
 * This class, and its subclasses, allow us to encapsulate functions that
 * test a specific component so we don't have to rewrite them on each page.
 * When a new page is defined is includes a list of components
 * that are added to the page. For example, lets say we define a new page
 * foo that has a component bar. Let's also say that the component bar defines
 * a function called hello. Because all properties of the components are added
 * to the page, callers can now call foo.hello(). This makes is easy to share
 * functionality across pages, and for tests to assumme functions are available
 * on the pages they're testing.
 */
class Component {
  constructor() {
    this.I = actor();
  }

  /** Creates a new instance of a component based on the component's name */
  static create(componentName) {
    const ComponentClass = require(`./${componentName}Component`);
    return new ComponentClass();
  }

  /**
   * Copy properties from this component to the page.
   * excluding [I, constructor, create, and addToPage]
   * @param {Page} page - the page that this component's properties are added to
   */
  addToPage(page) {
    // Get all of the properties and functions on this component
    const componentProperties = Object.getOwnPropertyNames(this);
    const componentFunctions = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    const componentPropertiesAndFunctions = componentProperties.concat(componentFunctions);

    // Filter out things we don't want to copy
    const ignoreList = ['I', 'constructor', 'create', 'addToPage'];
    const propertiesAndFunctionsToCopy = componentPropertiesAndFunctions.filter(p => !ignoreList.includes(p));

    // Copy properties and functions on the component to the page
    propertiesAndFunctionsToCopy.forEach(p => page[p] = this[p]);
  }

  /**
   * Get the translated value associated with the given key
   * @param {string} key - the key used to get the translated value
   */
  translate(key) {
    return translator.translate(key);
  }
}

module.exports = Component;
