// Represents a page on the POC website
// A page can consist of multiple components
// Subclasses of Page pass in options that define when the page is loaded
// and the names of page components, if any.
// This class adds the component's properties
// to the class instance which lets tests call component methods
// on the instance as if they were one object
//
// For example, when the patientSearch component is added to a page
// tests can call page.search(...)
class Page {
	constructor(options) {
		this.options = options
	}

	_init() {
		this.I = actor()

		// Add each component to this page
		if(this.options.components) {
			this.options.components.forEach(name => this._addComponent(name))
		}
	}

	// Validates that the page is loaded
	isLoaded() {
		this.I.waitForElement(this.options.isLoaded.element, 5)
		this.I.seeInCurrentUrl(this.options.isLoaded.urlPart)
	}

	// Gets an instance of each component
	// initializes is and copies its properties
	// to this page. In effect, this function
	// makes the component part of the page
	_addComponent(componentName) {
		const component = require(`./components/${componentName}`)
		component._init()
		for(const key in component) {
			if(key !== '_init')
				this[key] = component[key]
		}
	}
}

module.exports = Page
