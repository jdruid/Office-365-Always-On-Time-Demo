exports.adalConfiguration = {
  authority: 'https://login.microsoftonline.com/common',
  clientID: '',
  clientSecret: '',
  redirectUri: 'http://localhost:3000/callback'
};

exports.subscriptionConfiguration = {
  changeType: 'Created',
 notificationUrl: 'https://186bdf80.ngrok.io/listen',
  //resourceMail: 'me/mailFolders(\'Inbox\')/messages',
  resource: 'me/events',
  clientState: 'cLIENTsTATEfORvALIDATION'
};
