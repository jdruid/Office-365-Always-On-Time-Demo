/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/authHelper.js');
var dbHelper = new (require('../helpers/dbHelper'))();
var requestHelper = require('../helpers/requestHelper.js');
var subscriptionConfiguration = require('../constants').subscriptionConfiguration;

var eventSubject = "Travel Time";
var startTime = new Date(2016, 04, 14, 5, 30, 0, 0);
var endTime = new Date(2016, 04, 14, 6, 30, 0, 0);
var commuteTime = new Date(1800000)
var leaveByTime = new Date(2016, 04, 14, 9, 30, 0, 0); 

var calObject = {
    "start": startTime.toDateString,
    "end": endTime.toDateString,
    "subject": eventSubject,   
};


/* Redirect to start page */
router.get('/', function (req, res) {
  res.redirect('/index.html');
});

/* Start authentication flow */
router.get('/signin', function (req, res) {
  res.redirect(authHelper.getAuthUrl());
});

router.get('/walk', function (req, res) {
   res.redirect(
              '/walk.html'
            );
});


router.get('/drive', function (req, res) {
   res.redirect(
              '/drive.html'
            );
});


// This route gets called at the end of the authentication flow.
// It requests the subscription from Office 365, stores the subscription in a database,
// and redirects the browser to the dashboard.html page.
router.get('/callback', function (req, res, next) {
  var subscriptionId;
  var subscriptionExpirationDateTime;
  authHelper.getTokenFromCode(req.query.code, function (authenticationError, token) {
    if (token) {
      // Request this subscription to expire one day from now.
      // Note: 1 day = 86400000 milliseconds
      // The name of the property coming from the service might change from
      // subscriptionExpirationDateTime to expirationDateTime in the near future.
      subscriptionExpirationDateTime = new Date(Date.now() + 86400000).toISOString();
      subscriptionConfiguration.expirationDateTime = subscriptionExpirationDateTime;
      // Make the request to subscription service.
      requestHelper.postChunkData(
        '/beta/subscriptions',
        token.accessToken,
        JSON.stringify(subscriptionConfiguration),
        function (requestError, subscriptionData) {
          if (subscriptionData) {
            subscriptionData.userId = token.userId;
            subscriptionData.accessToken = token.accessToken;
            dbHelper.saveSubscription(subscriptionData, null);
            // The name of the property coming from the service might change from
            // subscriptionId to id in the near future.
            subscriptionId = subscriptionData.id;
            res.redirect(
              '/dashboard.html?subscriptionId=' + subscriptionId +
              '&userId=' + subscriptionData.userId
            );
          } else if (requestError) {
            res.status(500);
            next(requestError);
          }
        }
      );
    } else if (authenticationError) {
      res.status(500);
      next(authenticationError);
    }
  });
});

// This route signs out the users by performing these tasks
// Delete the subscription data from the database
// Redirect the browser to the logout endpoint.
router.get('/signout/:subscriptionId', function (req, res) {
  var redirectUri = req.protocol + '://' + req.hostname + ':' + req.app.settings.port;

  // Delete the subscription from Microsoft Graph
  dbHelper.getSubscription(req.params.subscriptionId, function (dbError, subscriptionData, next) {
    if (subscriptionData) {
      requestHelper.deleteData(
        '/beta/subscriptions/' + req.params.subscriptionId,
        subscriptionData.accessToken,
        function (error) {
          if (!error) {
            dbHelper.deleteSubscription(req.params.subscriptionId, null);
          }
        }
      );
    } else if (dbError) {
      res.status(500);
      next(dbError);
    }
  });

  res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' + redirectUri);
});

module.exports = router;
