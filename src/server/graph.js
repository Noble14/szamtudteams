var config = require('config');
const { Client, LogLevel } = require('@microsoft/microsoft-graph-client');
const msal = require('@azure/msal-node');
const jwt = require('jsonwebtoken');

const msalClient = new msal.ConfidentialClientApplication({
    auth: {
        clientId: config.get("tab.appId"),
        clientSecret: config.get("tab.clientSecret")
    }
});
function authUser(tid, token) {

    var promise = new Promise((resolve, reject)=> {
        msalClient.acquireTokenOnBehalfOf({
            authority: `https://login.microsoftonline.com/${tid}`,
            oboAssertion: token,
            skipCache: false
        }).then(result => {
            jwt.verify(result.accessToken, config.get("tab.clientSecret"), (err, decoded) => {
                if (err) {
                    console.log('Token verification failed: ' + err.message)
                    reject(err)
                } else {
                    console.log('Token verified:'  + JSON.stringify(decoded))
                    resolve(true)
                }
            })
        })
    })
    return promise
}

function getProfile(tid, token) {
    var scopes = ["https://graph.microsoft.com/User.Read"];
    var oboPromise = new Promise((resolve, reject) => {
        msalClient.acquireTokenOnBehalfOf({
            authority: `https://login.microsoftonline.com/${tid}`,
            oboAssertion: token,
            scopes: scopes,
            skipCache: false
        }).then(result => {
            //console.log("msal token" )
            //console.log(JSON.stringify(result, null, 2))

            fetch("https://graph.microsoft.com/v1.0/me/",
                {
                    method: 'GET',
                    headers: {
                        "accept": "application/json",
                        "authorization": "bearer " + result.accessToken
                    },
                    mode: 'cors',
                    cache: 'default'
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw (`Error ${response.status}: ${response.statusText}`);
                    }
                })
                .then((profile) => {
                    resolve(profile);
                })
        }).catch(error => {
            console.log(error)
            reject({ "error": error.errorCode });
        });
    });
    return oboPromise;
}

function startMeeting(tid, token, onlineMeeting) {
    var scopes = ["https://graph.microsoft.com/OnlineMeetings.ReadWrite"];
    var promise = new Promise((resolve, reject) => {
        msalClient.acquireTokenOnBehalfOf({
            authority: `https://login.microsoftonline.com/${tid}`,
            oboAssertion: token,
            scopes: scopes,
        }).then(result => {
            const client = Client.init({
                defaultVersion: "v1.0",
                debugLogging: true,
                authProvider: (done) => {
                    done(null, result.accessToken);
                },
            });
            client
                .api("/me/onlineMeetings")
                .post(onlineMeeting)
                .then(response => {
                    if (response.ok)
                        return response.json()
                    else
                        throw (`Error ${response.status}: ${response.statusText}`);})
                .then(x => resolve(x))
        })
        .catch(err => {
            console.error("error creating online meeting: ", err)
            reject("error: " + error)
        })
    })
    return promise;
}

module.exports = {
    getProfile,
    startMeeting,
    authUser
}