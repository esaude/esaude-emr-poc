# prototypes-poc

This project is a UI application for Point-of-Care base on OpenMRS and using [Bahmni code](https://github.com/Bhamni/openmrs-module-bahmniapps). 
The UI was designed for tablet like interface with touch screen and virtual keyboard.

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.0.

## Build & development

### Pre-Requirements
- Node.js
- Bower
- Grunt

1. Run npm install
2. Run npm install -g bower
3. Run npm install -g grunt
4. Run npm install -g grunt-cli
5. Run `grunt` for building node modules
6. Run `bower install` for building project dependencies
7. Install and run OpenMRS with eSaude implementation [here](https://github.com/esaude/esaude-emr) with Bahmni dependencies [here](https://s3-eu-west-1.amazonaws.com/esaude/openmrs-distro-esaude/openmrs-distro-esaude-modules.zip). Download and install Bahmni dependencies only if you're not running OpenMRS in [vargant box](https://github.com/esaude/openmrs-distro-esaude).
8. Upgrade OpenMRS (openmrs.war) to version 1.11.4, and OpenMRS Rest Web Services module to version 2.12. 
> This step should't be done manually, files must be replaced in amazon)
9. Change your grunt file to use the correct openmrs proxy:
```
proxies: [
    {
        context: '/openmrs',
        host: 'localhost',
        port: 8080,
        https: true,
        xforward: true
    }
]
```
10. Run `grunt serve` for preview.
11. Open your web browser with the address //http://loocalhost:9000/home

## Testing

Running `grunt test` will run the unit tests with karma.
