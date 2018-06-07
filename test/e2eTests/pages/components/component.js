// Represents a component of a page
// Many of the POC pages consist of multiple components.
// In many cases we want to test the same component on different pages.
// This class, and its subclasses, allow us to encapsulate functions that
// test a specific component so we don't have to rewrite them on each page. 
class Component {
  constructor() {
    this.I = actor()
  }

  // Creates a new instance of a component based on the component's name
  static create(componentName) {
    const ComponentClass = require(`./${componentName}Component`)
    return new ComponentClass()
  }

  // Copy properties from this component to the page 
  addToPage(page) {
    // Get all of the properties and functions on this component
    const componentProperties = Object.getOwnPropertyNames(this)
    const componentFunctions = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
    const componentPropertiesAndFunctions = componentProperties.concat(componentFunctions)

    // Filter out things we don't want to copy
    const ignoreList = ['I', 'constructor', 'create', 'addToPage']
    const propertiesAndFunctionsToCopy = componentPropertiesAndFunctions.filter(p => !ignoreList.includes(p))

    // Copy properties and functions on the component to the page
    propertiesAndFunctionsToCopy.forEach(p => page[p] = this[p])
  }
}

module.exports = Component
