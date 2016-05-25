<br/><br/><br/>
<img src="https://s3-eu-west-1.amazonaws.com/esaude/images/esaude-site-header.png" alt="OpenMRS"/>
<br/><br/><br/>

# eSaude EMR Point of Care

[![Build Status](https://img.shields.io/travis/esaude/esaude-emr-poc/master.svg)](https://travis-ci.org/esaude/esaude-emr-poc)
[![Code Quality](https://img.shields.io/codacy/10ea6c2d88674139b37cae5fa73cc8f6/master.svg)](https://www.codacy.com/app/psbrandt/esaude-esaude-emr-poc)
[![Test Coverage](https://api.codacy.com/project/badge/coverage/10ea6c2d88674139b37cae5fa73cc8f6)](https://coveralls.io/github/esaude/esaude-emr-poc)
[![Dependency Status](https://gemnasium.com/badges/github.com/esaude/esaude-emr-poc.svg)](https://gemnasium.com/github.com/esaude/esaude-emr-poc)
[![eSaude Version](https://omrs-shields.psbrandt.io/custom/esaude/v1.2.0/brightgreen?logo=esaude)](http://www.esaude.org/technical-resources/esaude-emr-versions)
[![eSaude Slack](https://slack.esaude.org/badge.svg)](https://slack.esaude.org)

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
        host: 'localhost',      // or your DOCKER_HOST if you're using Docker
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

To deploy eSaude EMR POC to a staging or production, it is necessary deploy the distributable package to a web server such as Apache or Nginx.

The latest build from the master branch can be downloaded [here](https://bintray.com/artifact/download/esaude/poc/esaude-emr-poc-master.zip).

To build the distributable package from source, follow the steps described in the **Package Managers & Dependencies** section above and then execute the following to build the package:

````bash
grunt build:package
````

This will create an archive called `esaude-emr-poc-master.zip`, which can be deployed to your web server.

### Apache Configuration

Install Apache Web Server. On Ubuntu/Debian this can be done by executing the following command:

````bash
sudo apt-get install apache2
````

Make sure that the `mod_proxy` and `mod_proxy_http` modules are loaded. See [here](https://www.digitalocean.com/community/tutorials/how-to-use-apache-http-server-as-reverse-proxy-using-mod_proxy-extension) for detailed instructions.

Extract the contents of the distributable package to Apache's `DocumentRoot`. On Ubuntu this can be done as follows:

````bash
unzip /tmp/esaude-emr-poc-master.zip -d /var/www/html/
````

Finally, configure the required `Alias` and `Proxy` directives in Apache by using the following `VirtualHost` file (e.g. `/etc/apache2/sites-enabled/000-default`)

````aconf
<VirtualHost *:80>
  DocumentRoot /var/www/html

  ProxyPass /openmrs http://YOUR_ESAUDE_PLATFORM_SERVER:8080/openmrs
  ProxyPassReverse /openmrs http://YOUR_ESAUDE_PLATFORM_SERVER:8080/openmrs

  Alias /poc /var/www/html/poc
  Alias /poc_config /var/www/html/poc_config
  Alias /images /var/www/html/poc/images

  Redirect permanent /home /poc/home/
  Redirect permanent /registration /poc/registration/
  Redirect permanent /vitals /poc/vitals/
  Redirect permanent /clinic /poc/clinic/
  Redirect permanent /common /poc/common/

  RedirectMatch ^/$ /home
</VirtualHost>
````

Make sure you replace `YOUR_ESAUDE_PLATFORM_SERVER` with the correct location of the eSaude EMR Platform instance you will be connecting to.

Restart Apache for the changes to take effect:

````bash
sudo service apache2 restart
````

Navigate to [http://YOUR_SERVER/poc/home](http://localhost/poc/home) to access the POC system.
