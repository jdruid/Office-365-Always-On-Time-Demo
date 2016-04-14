/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
// The contents of the outbound email message that will be sent to the user
var emailContent = '<html><head> <meta http-equiv=\'Content-Type\' content=\'text/html; charset=us-ascii\'> <title></title> </head><body style=\'font-family:calibri\'> <p>{{name}},</p> <p>This is a message from the Always On Time Service with meeting options</p> <ul><li> <a href=\'http://localhost:3000/walk\' target=\'_blank\'>Walk to location</a></li><li><a href=\'http://localhost:3000/drive\' target=\'blank\'>Drive to location</a></li> </body> </html>';

/**
 * Returns the outbound email message content with the supplied name populated in the text
 * @param {string} name The proper noun to use when addressing the email
 * @return {string} the formatted email body
 */
function getEmailContent(name) {
  return emailContent.replace('{{name}}', name);
}

/**
 * Wraps the email's message content in the expected [soon-to-deserialized JSON] format
 * @param {string} content the message body of the email message
 * @param {string} recipient the email address to whom this message will be sent
 * @return the message object to send over the wire
 */
function wrapEmail(content, recipient) {
  var emailAsPayload = {
    Message: {
      Subject: 'Office 365 Always On Time Service',
      Body: {
        ContentType: 'HTML',
        Content: content
      },
      ToRecipients: [
        {
          EmailAddress: {
            Address: recipient
          }
        }
      ]
    },
    SaveToSentItems: true
  };
  return emailAsPayload;
}

/**
 * Delegating method to wrap the formatted email message into a POST-able object
 * @param {string} name the name used to address the recipient
 * @param {string} recipient the email address to which the connect email will be sent
 */
function generatePostBody(name, recipient) {
  return wrapEmail(getEmailContent(name), recipient);
}

exports.generatePostBody = generatePostBody;