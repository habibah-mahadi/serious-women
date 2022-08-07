/*
Cloud function
- when visited the cloud function URL, our web browser does not execute any JS code or any functions
- web browser just receive the simple response (the simple string of text)
- what is executing the function we wrote here? 
not our PC or web browser, not Netlify server that hosts our HTML, CSS, JS. 
Netlify takes the function that we wrote and they send it over to a private and trustworthy environment over on Amazon Web Services (AWS)
Then Netlify sets up a convenient URL and whenever anyone sends a request to that URL, Netlify tells AWS to run and execute our function.

Callback - the function has done its job. 200 - success

- not being executed by web browser or static file host or on the server. AWS will take care of the hardware that our function runs on.
- we dont need to care about the environment in which it runs in. All we need to know is that it's going to be an environment that speaks 
the node language.
- the JS script below is intended for the node environment, not the web browser environment.

event parameter - contins information about the incoming request. we can use this param to extract the data that the user sent along
*/

exports.handler = function (event, context, callback) {
    const secretContent = `
    <h3>Welcome To The Secret Area</h3>
    <p>Here we can tell you that the sky is <strong>blue</strong>, and two plus two equals to four</p>
    `

    let body;

    if (event.body) {
        body = JSON.parse(event.body);
    } else {
        //if there is no incoming "body" data on the request 
        body = {}
    }

    if (body.password == "javascript") {
        callback(null, {
            statusCode: 200,
            body: secretContent
        });
    } else {
        callback(null, {
            statusCode: 401
        });
    }

    
}