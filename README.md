# NHS-WhatsThePlan

## **Software System Manual**

##### Greetings engineer, this manual will guide you step-by-step through setting up the development environment for the _What&#39;s The Plan_ app.

## **Prerequisite Installations**

- **Install NodeJS and NPM (Node Package Manager)**
 [https://nodejs.org/en/](https://nodejs.org/en/)

- **Install Git**
 [https://www.atlassian.com/git/tutorials/install-git](https://www.atlassian.com/git/tutorials/install-git)

## **Core Installations**

- **Install Ionic JS framework**
Open up terminal (Linux and Mac users) or command prompt (Windows users) and enter the following command:
```npm install -g ionic@2.1.17```
This will install the appropriate version of Ionic globally.

- **Download the project folder**
Open up terminal or command prompt, change directory to an appropriate development location and enter the following command:
```git clone https://github.com/bymi15/NHS-WhatsThePlan.git```

    **OR**

    Unzip the source code file and move the App folder to an appropriate location where development can take place.

- **Install the node modules**
Open up terminal or command prompt and change directory to the project App folder, for instance:
```cd location/to/project/App```
Make sure the _package.json_ file is present in the current directory and enter the following command:
```npm install --save-dev```

## **Project Directory Structure**
- **Index page**
../App/www/index.html
../App/www/main.html

- **Views**
../App/www/views

- **Controllers**
../App/www/js/controllers.js

- **Models**
../App/www/js/services.js

- **Directives**
../App/www/js/directives.js

- **Routes**
../App/www/js/routes.js

- **Unit / Integration Tests**
../App/tests

- **Libraries**
../App/www/lib

## **Running the app**

All commands should be executed from the App parent directory.

- **Web simulation** (Google Chrome recommended)
```ionic serve --lab```

- **Android**
Make sure the Android device is connected.
```ionic run android```

- **IOS**
To deploy on an IOS device, XCode is required. For more information visit: [http://ionicframework.com/docs/v1/guide/testing.html](http://ionicframework.com/docs/v1/guide/testing.html)

## **Testing the app**

All commands should be executed from the App parent directory.

- **Executing the automated tests using Gulp**
```gulp test```

    The test report should be generated in:
    ```../App/tests/units.html```

## **Firebase configuration**

The firebase configuration is specified in:

```../App/www/lib/firebase/initFirebase.js```
