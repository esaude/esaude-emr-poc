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

## Test

### Pre-Requirements
- apache2 web server

1. Run the task `grunt build`. A distribution package will be generated in your project root folder named `dist`.
2. Copy your `dist` into `/var/www/html/` and rename it to `poc`.
3. Copy `bahmni_config` folder in the root of your project, into `/var/www/html/`.
4. Copy the resources in `YOUR_PROJ_ROOT/app/commom/application/resources/` into `/var/www/html/poc/common/application/resources/`.
5. Install and and activate apache's `mod_proxy`, if not yet installed and activated. You can find more info [here](https://www.digitalocean.com/community/tutorials/how-to-use-apache-http-server-as-reverse-proxy-using-mod_proxy-extension)
6. Configure openmrs proxy and URL aliases in `/etc/apache2/sites-enabled/000-default.config`. Add the lines:
```
<VirtualHost>
  ...
  ProxyPass /openmrs http://localhost:8080/openmrs
  ProxyPassReverse /openmrs http://localhost:8080/openmrs

	Alias /poc /var/www/html/poc
	Alias /bahmni_config /var/www/html/bahmni_config
	Alias /images /var/www/html/poc/images

	Redirect permanent /home /poc/home/
	Redirect permanent /registration /poc/registration/

</VirtualHost>
```
7. Restart your apache2 server `service apache2 restart`.
8. Browse to http://localhost/poc/home

## Unit Testing

Running `grunt test` will run the unit tests with karma.
