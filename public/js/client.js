/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var socket = io.connect('http://localhost:3001'); // eslint-disable-line no-undef
var subscriptionId;
var userId;

// Socket `notification_received` event handler.
socket.on('notification_received', function (mailData) {
  var listItem;
  var primaryText;
  var secondaryText;
  
  console.log(mailData);

  listItem = document.createElement('div');
  listItem.className = 'ms-ListItem is-selectable';
  listItem.onclick = function () {
    window.open(mailData.webLink, 'outlook');
  };

  primaryText = document.createElement('span');
  primaryText.className = 'ms-ListItem-primaryText';
  primaryText.innerText = mailData.organizer.emailAddress.name;
  secondaryText = document.createElement('span');
  secondaryText.className = 'ms-ListItem-secondaryText';
  secondaryText.innerText = mailData.subject + " " + mailData.location.displayName;
  listItem.appendChild(primaryText);
  listItem.appendChild(secondaryText);

  document.getElementById('notifications').appendChild(listItem);
});

//New Method for EMAIL Action
// Socket `action_notification_received` event handler.
socket.on('action_notification_received', function (mailData) {
  var listItem;
  var primaryText;
  var secondaryText;

  listItem = document.createElement('div');
  listItem.className = 'ms-ListItem is-selectable';
  listItem.onclick = function () {
    window.open(mailData.webLink, 'outlook');
  };

  primaryText = document.createElement('span');
  primaryText.className = 'ms-ListItem-primaryText';
  primaryText.innerText = mailData.sender.emailAddress.name;
  secondaryText = document.createElement('span');
  secondaryText.className = 'ms-ListItem-secondaryText';
  secondaryText.innerText = mailData.subject;
  listItem.appendChild(primaryText);
  listItem.appendChild(secondaryText);

  document.getElementById('action_notifications').appendChild(listItem);
});

// When the page first loads, create the socket room.
subscriptionId = getQueryStringParameter('subscriptionId');
socket.emit('create_room', subscriptionId);
document.getElementById('subscriptionId').innerHTML = subscriptionId;

// The page also needs to send the userId to properly
// sign out the user.
userId = getQueryStringParameter('userId');
document.getElementById('userId').innerHTML = userId;
document.getElementById('signOutButton').onclick = function () {
  location.href = '/signout/' + subscriptionId;
};

function getQueryStringParameter(paramToRetrieve) {
  var params = document.URL.split('?')[1].split('&');
  var i;
  var singleParam;

  for (i = 0; i < params.length; i = i + 1) {
    singleParam = params[i].split('=');
    if (singleParam[0] === paramToRetrieve) {
      return singleParam[1];
    }
  }
  return null;
}
