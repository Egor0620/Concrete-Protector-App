angular.module('estimateApp')
    .constant('Config', {
        'AppStart': 'AppStart',
        'AuthTokenName': 'AuthToken',
        'AuthExpiration': 'AuthExpiration',
        'AuthRoles': 'AuthRoles',
        'AuthUserName': 'AuthUserName',
        'AuthId': 'AuthId',
        'WebServiceEndpoint': 'http://192.168.1.100:5000/',
        'WebStorageEndpoint': 'http://192.168.1.100:3333/',

        //'WebServiceEndpoint': 'http://104.239.230.5:5000/',
        //'WebStorageEndpoint': 'http://104.239.230.5:3333/',


        //'WebServiceEndpoint': 'http://162.242.248.168:5000/',

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
        'UserAuthenticated':'UserAuthenticated',

    /*
      Limitation.....
     */
        'SystemLimitation': 'SystemLimitation',

    /*

     */
        'SystemLimitationCount': 2,
        'ColorLimitationCount': 5,
        'IngredientLimitationCount': 5,
        'PatternLimitationCount': 5,
        'Purchased': false,
    });
