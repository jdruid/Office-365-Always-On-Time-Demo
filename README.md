# Microsoft Graph Webhooks Sample for Node.js
[![Build Status](https://travis-ci.org/OfficeDev/Microsoft-Graph-Nodejs-Webhooks.svg)](https://travis-ci.org/OfficeDev/Microsoft-Graph-Nodejs-Webhooks)

This Node.js sample shows how to start getting notifications from Microsoft Graph. The following are common tasks that a web application performs with Microsoft Graph webhooks.

* Sign-in your users with their work or school account to get an access token.
* Use the access token to create a webhook subscription.
* Send back a validation token to confirm the notification URL.
* Listen for notifications from Microsoft Graph.
* Request for more information in Microsoft Office 365 using data in the notification.
  
![Microsoft Graph Webhook Sample for Node.js screenshot](/readme-images/Microsoft-Graph-NodeJs-Webhooks.png)

The previous screenshot shows the app in action. After your app gets a subscription, your app gets a notification when events happen in user data. Your app can then react to the event. This sample writes a list item for every notification received by the notification URL.

## Prerequisites

To use the Webhook sample, you need the following:

* [Node.js](https://nodejs.org/) version 4 or 5.
* An app registered in Microsoft Azure. You can use the [Office 365 app registration tool](http://dev.office.com/app-registration). It simplifies app registration. Use the following parameters:

|     Parameter   |              Value             |
|----------------:|:-------------------------------|
|        App type | Web App                        |
|     Sign on URL | http://localhost:3000          |
|    Redirect URI | http://localhost:3000/callback |
| App permissions | Mail.Read                      |
  
  Copy and store the **Client ID** and **Client Secret** values.
     
## Configure a tunnel for your localhost

The sample uses *localhost* as the development server. For this reason, we need a tunnel that can forward requests from a URL on the Internet to our *localhost*. If for any reason, you don't want to use a tunnel, see [Hosting without a tunnel](https://github.com/OfficeDev/Microsoft-Graph-Nodejs-Webhooks/wiki/Hosting-the-sample-without-a-tunnel). If you want a detailed explanation about why to use a tunnel, see [Why do I have to use a tunnel?](https://github.com/OfficeDev/Microsoft-Graph-Nodejs-Webhooks/wiki/Why-do-I-have-to-use-a-tunnel)

For this sample, we use [ngrok](https://ngrok.com/) to create the tunnel. To configure ngrok:

1. [Download](https://ngrok.com/download) and unzip the ngrok binaries for your platform.
2. Type the following command:
    
    `ngrok http 3000`
    
3. Take note of the *https public URL* that ngrok provides for you. This is an example:

    `https://NGROK_ID.ngrok.io`

You'll need the *NGROK_ID* value in the next section.

## Configure and run the web app

1. Use a text editor to open `constants.js`.
2. Replace *ENTER_YOUR_CLIENT_ID* with the client ID of your registered Azure application.
3. Replace *ENTER_YOUR_SECRET* with the client secret of your registered Azure application.
4. Replace *NGROK_ID* with the value in *https public URL* from the previous section.
5. Install the dependencies running the following command:
    ```
    npm install
    ```

6. Start the application with the following command:
    ```
    npm start
    ```
    > Note: You can also make the application wait for a debugger. To wait for a debugger, use the following command instead:
    ```
    npm run debug
    ```
    You can attach the debugger included in Microsoft Visual Studio Code. For more information, see [Debugging in Visual Studio Code](https://code.visualstudio.com/Docs/editor/debugging).
    
7. Open a browser and go to http://localhost:3000. 

## Questions and comments

We'd love to get your feedback about the Microsoft Graph Webhook sample. You can send your questions and suggestions to us in the [Issues](https://github.com/OfficeDev/Microsoft-Graph-NodeJs-Webhooks/issues) section of this repository.

Office 365 development questions? Post them to [Stack Overflow](http://stackoverflow.com/questions/tagged/Office365+API). Make sure to tag your questions or comments with [Office365] and [API].
  
## Additional resources

* [Overview of Microsoft Graph](http://graph.microsoft.io/)
* [Subscription reference documentation](https://graph.microsoft.io/en-us/docs/api-reference/beta/resources/subscription)

## Copyright
Copyright (c) 2016 Microsoft. All rights reserved.
