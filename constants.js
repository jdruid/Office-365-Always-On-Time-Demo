exports.adalConfiguration = {
  authority: 'https://login.microsoftonline.com/common',
  clientID: '7dd0287a-e0ac-44f5-94de-878690e97ef6',
  clientSecret: '79UazSXH/H7i4ImKtVydFuTXnUKCF4y+Idc7bp/BdfM=',
  redirectUri: 'http://localhost:3000/callback'
};

exports.subscriptionConfiguration = {
  changeType: 'Created',
 notificationUrl: 'https://186bdf80.ngrok.io/listen',
  //resourceMail: 'me/mailFolders(\'Inbox\')/messages',
  resource: 'me/events',
  clientState: 'cLIENTsTATEfORvALIDATION'
};
