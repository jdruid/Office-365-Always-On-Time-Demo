/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var dbFile = './helpers/database.sqlite3';

function dbHelper() { }

/**
 * Create SQLite3 table Subscription.
 */
dbHelper.prototype.createDatabase = function createDatabase() {
  var dbExists = fs.existsSync(dbFile);
  var db = new sqlite3.Database(dbFile);
  var createSubscriptionStatement =
    'CREATE TABLE Subscription (' +
      'UserId TEXT NOT NULL, ' +
      'SubscriptionId TEXT NOT NULL, ' +
      'AccessToken TEXT NOT NULL, ' +
      'Resource TEXT NOT NULL, ' +
      'ChangeType TEXT NOT NULL, ' +
      'ClientState TEXT NOT NULL, ' +
      'NotificationUrl TEXT NOT NULL, ' +
      'SubscriptionExpirationDateTime TEXT NOT NULL' +
    ')';

  db.serialize(function createTable() {
    if (!dbExists) {
      db.run(
        createSubscriptionStatement,
        [],
        function callback(error) {
          if (error !== null) {
            throw error;
          }
        }
      );
    }
  });
  db.close();
};

dbHelper.prototype.getSubscription = function getSubscription(subscriptionId, callback) {
  var db = new sqlite3.Database(dbFile);
  var getUserDataStatement =
    'SELECT ' +
      'UserId as userId, ' +
      'SubscriptionId as subscriptionId, ' +
      'AccessToken as accessToken, ' +
      'Resource as resource, ' +
      'ChangeType as changeType, ' +
      'ClientState as clientState, ' +
      'NotificationUrl as notificationUrl, ' +
      'SubscriptionExpirationDateTime as subscriptionExpirationDateTime ' +
    'FROM Subscription ' +
    'WHERE SubscriptionId = $subscriptionId ' +
    'AND SubscriptionExpirationDateTime > datetime(\'now\')';

  db.serialize(function executeSelect() {
    db.get(
      getUserDataStatement,
      {
        $subscriptionId: subscriptionId
      },
      callback
    );
  });
};

dbHelper.prototype.saveSubscription =
  function saveSubscription(subscriptionData, callback) {
    var db = new sqlite3.Database(dbFile);
    var insertStatement =
      'INSERT INTO Subscription ' +
        '(UserId, SubscriptionId, AccessToken, Resource, ChangeType, ' +
        'ClientState, NotificationUrl, SubscriptionExpirationDateTime) ' +
        'VALUES ($userId, $subscriptionId, $accessToken, $resource, $changeType, ' +
        '$clientState, $notificationUrl, $subscriptionExpirationDateTime)';

    db.serialize(function executeInsert() {
      db.run(
        insertStatement,
        {
          $userId: subscriptionData.userId,
          $subscriptionId: subscriptionData.id,
          $accessToken: subscriptionData.accessToken,
          $resource: subscriptionData.resource,
          $clientState: subscriptionData.clientState,
          $changeType: subscriptionData.changeType,
          $notificationUrl: subscriptionData.notificationUrl,
          $subscriptionExpirationDateTime: subscriptionData.expirationDateTime
        },
          callback
      );
    });
  };

dbHelper.prototype.deleteSubscription =
  function deleteSubscription(subscriptionId, callback) {
    var db = new sqlite3.Database(dbFile);
    var deleteStatement = 'DELETE FROM Subscription WHERE ' +
                        'SubscriptionId = $subscriptionId';

    db.serialize(function executeDelete() {
      db.run(
        deleteStatement,
        {
          $subscriptionId: subscriptionId
        },
        callback
      );
    });
  };

module.exports = dbHelper;
