angular.module('estimateApp')
    .constant('Config', {
        'AppStart': 'AppStart',
        'AuthTokenName': 'AuthToken',
        'AuthExpiration': 'AuthExpiration',
        'AuthRoles': 'AuthRoles',
        'AuthUserName': 'AuthUserName',
        'AuthId': 'AuthId',
        'WebServiceEndpoint': 'http://localhost:5000/',
        //'WebServiceEndpoint': 'https://artapi1.natomis.com/',
        'Http200': 'HTTP:200',
        'Http401': 'HTTP:401',
        'Http403': 'HTTP:403',
        'Http500': 'HTTP:500',
        'SetTitleEvent': 'SetTitleEvent',
        'AjaxActivity': 'AjaxActivity',
        'StoreInit': 'StoreInit',
        'SubscriptionPurchased': 'SubscriptionPurchased',
        'SubscriptionExpired':'SubscriptionExpired',
        'ProductSetup': 'ProductSetup',
        'UserAuthenticated':'UserAuthenticated'
    });