const Component = require('./components/component')

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
		// Make sure the components array is inialized
		options.components = options.components || []

		this.options = options

		// Every page should have the header component
		if(!this.options.components.includes('header')) {
			this.options.components.push('header')
		}
	}

	_init() {
		this.I = actor()

		// Add each component to this page
		this.options.components.forEach(name => this._addComponent(name))
	}

	// Validates that the page is loaded
	isLoaded() {
		this.I.waitForElement(this.options.isLoaded.element, 5)
		this.I.seeInCurrentUrl(this.options.isLoaded.urlPart)
	}

	// Gets an instance of the component
	// and copies its properties and functions
	// to this page
	_addComponent(componentName) {
		const component = Component.create(componentName)
		component.addToPage(this)
	}
}

module.exports = Page
