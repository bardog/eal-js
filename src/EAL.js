import AsyncStorage from '@callstack/async-storage';
import axios from 'axios';
import get from 'lodash.get';

import {baseUrl, endpoints} from './config';
import {generateToken} from './utils';

class EAL {
    constructor ({user, password, apiKey}) {
        if (!user || !password || !apiKey) {
            throw 'The credentials provided are not valid. Please provide user, password and apiKey to connect.';
        }

        this.user = user;
        this.password = password;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.sessionToken = '';
        
        AsyncStorage.getItem('eal_token')
            .then(sessionToken => {
                this.sessionToken = sessionToken;
            })
            .catch(() => {
                AsyncStorage.setItem('eal_token', this.sessionToken)
                    .then(() => {
                        this.sessionToken = generateToken();
                    })
                    .catch(() => {
                        throw 'Cannot store sessionToken on local storage.';
                    });
            });
        
        return this;
    }

    resetSessionToken () {
        AsyncStorage.setItem('eal_token', this.sessionToken)
            .then(() => {
                this.sessionToken = generateToken();
            })
            .catch(() => {
                throw 'Cannot store sessionToken on local storage.';
            });
    }

    checkParams (params, uniqueAction) {
        const {user, business, action, actions} = params;
        const requiredPaths = [
            ...user ? ['user.id', 'user.username', 'user.email'] : [],
            ...business ? ['business.id', 'business.name'] : [],
            ...uniqueAction ? ['action', 'action.datetime', 'action.name'] : [],
            ...(action && action.object) ? ['action.object.id', 'action.object.className'] : []
        ];
        let validParams = true;
        let validActions = true;
        const errors = [];

        requiredPaths.forEach(path => {
            const validParam = !!get(params, path, false);
            
            if (!validParam) {
                validParams = false;
                errors.push(`Param with path "${path}" is required.`);
            }
        });

        if (!uniqueAction) {
            //Validate actions array if exists
            actions.forEach(action => {
                if (!action.datetime) {
                    validActions = false;
                    errors.push(`Check your actions, some of them are losing "datetime" field.`);
                } 
                
                if (!action.name) {
                    validActions = false;
                    errors.push(`Check your actions, some of them are losing "name" field.`);
                }
            });
        }

        if (!validParams || !validActions) {
            throw errors.join('\n');
        }
    }

    addEvents (params) {
        const uniqueAction = false;

        this.checkParams(params, uniqueAction);
        this.addEventGeneric(params, uniqueAction);
    }

    addEvent (params) {
        const uniqueAction = true;

        this.checkParams(params, uniqueAction);
        this.addEventGeneric(params, uniqueAction);
    }

    addEventGeneric (params, uniqueAction) {
        const {user = {}, business = {}, action = {}, actions = []} = params;
        const {
            id: userId,
            username: userName,
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            phone: userPhone,
            ...userExtraFields
        } = user;
        const {
            id: businessId,
            name: businessName,
            email: businessEmail,
            phone: businessPhone,
            website: businessWebsite,
            ...businessExtraFields
        } = business;
        const {
            name: actionName,
            datetime: actionDatetime,
            category: actionCategory,
            object = {},
            ...actionExtraFields
        } = action;
        const {
            id: objectId,
            before: objectBefore,
            after: objectAfter,
            className: objectClassName
        } = object;

        return axios({
            url: uniqueAction ? endpoints.addEvent : endpoints.addEvents,
            method: 'POST',
            baseURL: this.baseUrl,
            data: {
                user: {
                    id: userId,
                    username: userName,
                    email: userEmail,
                    first_name: userFirstName,
                    last_name: userLastName,
                    phone: userPhone,
                    extra_fields: userExtraFields
                },
                business: {
                    id: businessId,
                    name: businessName,
                    email: businessEmail,
                    phone: businessPhone,
                    website: businessWebsite,
                    extra_fields: businessExtraFields
                },
                session_token: this.sessionToken,
                ...uniqueAction ? {
                    action: {
                        name: actionName,
                        datetime: actionDatetime,
                        category: actionCategory,
                        extra_fields: actionExtraFields,
                        object: {
                            id: objectId,
                            before: objectBefore,
                            after: objectAfter,
                            class_name: objectClassName
                        }
                    }
                } : {
                    actions: actions.map(action => ({
                        name: action.name,
                        datetime: action.datetime,
                        category: action.category,
                        extra_fields: action.extraFields,
                        ...action.object ? {
                            object: {
                                id: object.id,
                                class_name: object.className,
                                before: object.before,
                                after: object.after,
                            }
                        } : {}
                    }))
                }
            },
            params: {
                api_key: this.apiKey
            },
            auth: {
                user: this.user,
                password: this.password
            }
        });
    }
}

export default EAL;