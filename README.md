# EAL JS
Library to interact with EAL API from any JS based project.

## Installation

### With NPM
`npm install --save eal-js`

### With YARN
`yarn add eal-js`

## First steps

Import the package from your JS project:

```javascript
import EAL from 'eal-js'
```

Use it on your project:

```javascript
const EventManager = new EAL({
    user: 'YOUR_EAL_USERNAME',
    password: 'YOUR_EAL_PASSWORD',
    apiToken: 'YOUR_EAL_API_TOKEN'
});

// Adding an event
EventManager.addEvent({
    user: {
      id: 4903,
      username: 'myusername',
      email: 'user@mailinator.com'
    },
    business: {
      id: 601,
      name: 'Test Organization'
    },
    action: {
        datetime: (new Date()).toISOString(),
        name: 'My first action',
        category: 'General actions'
    }
});
```

## Supported methods

### :: addEvent
 - Description: adds a single event through EAL API.
 - Returns a Promise.
 - Params:
    ```
    {
        user: {                                                         //optional
            id,
            username,                                                   
            email,
            firstName,                                                   //optional
            lastName,                                                   //optional
            phone,                                                      //optional
            extraFields: {},                                            //optional
        },
        business: {
            id,
            name,
            email,                                                      //optional
            phone,                                                      //optional
            website,                                                    //optional
            extraFields: {}                                             //optional
        },
        action: {
            datetime,
            name,
            category,                                                   //optional
            object: {                                                   //optional
                id,
                className,
                before,                                                 //optional
                after,                                                  //optional
            },
            extraFields: {},                                            //optional
        }
    }
    ```
### :: addEvents
 - Description: adds multiple events through EAL API.
 - Returns a Promise.
 - Params:
    ```
    {
        user: {                                                         //optional
            id,
            username,                                                   
            email,
            firstName,                                                   //optional
            lastName,                                                   //optional
            phone,                                                      //optional
            extraFields: {},                                            //optional
        },
        business: {
            id,
            name,
            email,                                                      //optional
            phone,                                                      //optional
            website,                                                    //optional
            extraFields: {}                                             //optional
        },
        actions: [{
            datetime,
            name,
            category,                                                   //optional
            object: {                                                   //optional
                id,
                className,
                before,                                                 //optional
                after,                                                  //optional
            },
            extraFields: {},                                            //optional
        }]
    }
    ```
### :: resetSessionToken
 - Description: reset the EAL activity session token.
 - Returns nothing.
 - Params: none.