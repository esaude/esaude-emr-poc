<br/><br/><br/>
<img src="https://s3-eu-west-1.amazonaws.com/esaude/images/esaude-site-header.png" alt="OpenMRS"/>
<br/><br/><br/>

# eSaude EMR Point of Care

[![Build Status](https://img.shields.io/travis/esaude/poc-ui-prototype/master.svg)](https://travis-ci.org/esaude/poc-ui-prototype)
[![Code Quality](https://img.shields.io/codacy/1fdea88d8c7d4c63bc73f42d6e17d3a2/master.svg)](https://www.codacy.com/app/psbrandt/esaude-poc-ui-prototype)
[![Test Coverage](https://api.codacy.com/project/badge/coverage/1fdea88d8c7d4c63bc73f42d6e17d3a2)](https://coveralls.io/github/esaude/poc-ui-prototype)
[![Dependencies](https://img.shields.io/david/esaude/esaude-emr-poc.svg)](https://david-dm.org/esaude/poc-ui-prototype)
[![eSaude Version](https://omrs-shields.psbrandt.io/custom/esaude/v1.2.0/brightgreen?logo=esaude)](http://www.esaude.org/technical-resources/esaude-emr-versions)

This project is an AngularJS application for point of care based on OpenMRS and using [Bahmni code](https://github.com/Bhamni/openmrs-module-bahmniapps).
The UI was designed for tablet-like interfaces with touch screen and virtual keyboard.

A demo of the system can be found [here](http://metadata.esaude.org/home).

## Setup (Development Environment)

The following instructions explain how to manually get eSaude EMR POC up and running natively in your local environment. If you would prefer to set up an environment automatically using Docker, see [the esaude-poc-docker repository](https://github.com/esaude/esaude-poc-docker).

### Prerequisites

#### Package Managers & Dependencies

In order to build and test the application, you need to have [Node.js](https://nodejs.org/) installed. [Download](https://nodejs.org/en/download/) or install it via a [package manager](https://nodejs.org/en/download/package-manager/). On Ubuntu/Debian the installation can be done like [this](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions):

````bash
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
````  

You will then have to install [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/). This can be done as follows:

````bash
npm install -g bower
npm install -g grunt
npm install -g grunt-cli
````

Clone this repository and change to its directory:

````bash
git clone https://github.com/esaude/poc-ui-prototype.git
cd poc-ui-prototype
````

Finally, install the Node.js and Bower dependencies:

````bash
npm install
bower install
````

#### eSaude EMR Platform

The POC systems runs on top of eSaude EMR Platform. The install instructions can be found [here](https://sites.google.com/site/openmrsmozambique/technical-resources/esaude-emr-install-guide).

### Configuration

In order for Grunt to forward the REST calls made to the OpenMRS platform to the correct location, you will need to configure the `proxies` section of `Gruntfile.js` as follows:

```js
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

If you are running the platform with Docker, you should replace `localhost` with the IP of your `DOCKER_HOST`.

### Running

Run the development server as follows:

````bash
grunt serve
````

Access the server by navigating to http://localhost:9000/home in your browser.

## Unit Testing

Running `grunt test` will run the unit tests with karma.

## Setup (Staging & Production)

To deploy eSaude EMR POC to a staging or production, it is necessary deploy the distributable to a web server such as Apache or Nginx.

To start, follow the steps described in the **Package Managers & Dependencies** section above and then execute the following to build the distributable:

````bash
grunt build
````

This will create a directory called `dist`, which can be deployed to your web server.

### Apache Configuration

Install Apache Web Server. On Ubuntu/Debian this can be done by executing the following command:

````bash
sudo apt-get install apache2
````

Make sure that the `mod_proxy` and `mod_proxy_http` modules are loaded. See [here](https://www.digitalocean.com/community/tutorials/how-to-use-apache-http-server-as-reverse-proxy-using-mod_proxy-extension) for detailed instructions.

Copy the contents of the distributable to a directory named `poc` in Apache's `DocumentRoot`. On Ubuntu this can be done as follows:

````bash
mkdir /var/www/html/poc
cp dist/* /var/www/html/poc/
````

Then copy the `bahmni_config` directory in this repository to the `DocumentRoot`:

````bash
cp -r bahmni_config /var/www/html
````

Next, configure which applications are shown on the home screen by copying the appropriate `app.json` file the correct location on the server:

````bash
mkdir -p /var/www/html/poc/common/application/resources
cp app/commom/application/resources/* /var/www/html/poc/common/application/resources/
````

Finally, configure the required `Alias` and `Proxy` directives in Apache by using the following `VirtualHost` file (e.g. `/etc/apache2/sites-enabled/000-default`)

````aconf
<VirtualHost *:80>
  DocumentRoot /var/www/html

  ProxyPass /openmrs http://YOUR_ESAUDE_PLATFORM_SERVER:8080/openmrs
  ProxyPassReverse /openmrs http://YOUR_ESAUDE_PLATFORM_SERVER:8080/openmrs

  Alias /poc /var/www/html/poc
  Alias /bahmni_config /var/www/html/bahmni_config
  Alias /images /var/www/html/poc/images

  Redirect permanent /home /poc/home/
  Redirect permanent /registration /poc/registration/
</VirtualHost>
````
Make sure you replace `YOUR_ESAUDE_PLATFORM_SERVER` with the correct location of the eSaude EMR Platform instance you will be connecting to.

Restart Apache for the changes to take effect:

````bash
sudo service apache2 restart
````

Navigate to [http://YOUR_SERVER/poc/home](http://localhost/poc/home) to access the POC system.
