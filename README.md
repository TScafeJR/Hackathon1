# Runner
- [Introduction](https://github.com/TScafeJR/Runner/tree/tyrone#introduction)
- [About Our Application](https://github.com/TScafeJR/Runner/tree/tyrone#about-our-application)
- [Framework / Architecture](https://github.com/TScafeJR/Runner/tree/tyrone#frameworkarchitecture)
- [How To Run](https://github.com/TScafeJR/Runner/tree/tyrone#how-to-run)

## Introduction
Runner is a multi-platform health-oriented mobile application for use in the USA.

Runner serves as a platform that enables health minded users to find pick-up sport games, workout partners and running partners
in their area. Users can filter for workout partners based on other users' location, training levels, experience, ratings and activities of choice.

## About Our Application
Our team built this platform using [React Native](https://facebook.github.io/react-native/). Although this application supports deployment in Andriod and iOS environments, it was rarely tested in any Android enviornments. Beyond this, the primary testing enviornments were for iPhones 6S, 6S Plus, 7, 7S, 8 and X. All of these phones ran iOS 11.4 software and above.

## Framework / Architecture
This application uses a React Native framework on the front-end to enable rendering. It uses a NodeJS express server on the back-end to support route handling and various requests. Lastly, it uses a combination of MongoDB and PostgreSQL to manage database exchanges.

## How To Run
In order to run this application, a few steps are necessary:

1. Create ```env.sh``` file in the root directory

    Currently the ```env.sh``` file has the following environmental secrets that are necessary:
    * ```MONGODB_URI```: establishes connection to the MongoDB database

    Your file should look similar to this
    ```sh
    export MONGODB_URI=mongodb://<db username>:<db password>@ds<db information>.mlab.com:<db information>/<db name>
    ```
2. Create ```env.js``` file in the root directory to handle universal variables

    Currently the ```env.js``` file has the following variables that are necessary:
    * ```DOMAIN```: serves as an endpoint to handle the internal App requests
        * If you are running on a local machine ```http://localhost:3000``` works
        * If you set to some other remote endpoint like heroku you should use something like ```http://example-app.herokuapp.com```

    Your file should look similar to this
    ```javascript
    let DOMAIN;

    export default DOMAIN = `${your http endpoint}`
    ```
3. Run ```npm install``` in the root directory to download javascript dependencies for your server
4. Run ```source env.sh``` in the root directory to connect your environment variables to your application
5. Run ```npm install``` in the ```'/App'``` directory in order to download the React Native dependencies for the mobile application.
6. Start your server:
    * If you are running the server on your local machine you can run the command ```npm start``` in the root directory to start the server
    * If you are running the application using a remote server, you can go on to step 7
7. Your setup is complete. You can open the App in Expo or some other XDE