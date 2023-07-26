var config = {};
config.appVersion = '1.0.0';
config.appName = 'Artistic Inc API Server';
config.appPort = 5000;
config.AIAccess = 'Some Value';
//config.username = 'dbreader';
//config.password = 'dbreaderpassword';
config.username = 'postgres';
config.password = 'dbMaster';
config.database = 'concrete';
config.host = 'localhost';
config.port = 5432;
config.dialect = 'postgres';
config.jwtSecret = '3053bbc07fe64088578013f3296d9e74e17197f247f134ccd8a224fa6ac0423b2ba3c6c3a526f15bca006165240815391e879d4d6067d47db0a8159ef53328fac4e9dcb67f9f30ce7bb0e315958326c4a2640068cd59ac8602f7ec67b45e003694a2a6384c59dc3157a143f89860f0d245c2f89dc49840e6a15aedef5ac3dd64';
config.jwtKey = '725d812f8d7a26d66ff01e494af8097a388a373753cb51003e23fc7d8fb0632796cb4f1aaadad6bd0a7052ae2560af9e68bf2d9ad1f00d1873e9f1a183dfa539bf9c34ac53913434ea6f8cab654325b91d9425f3925e440282e14ceeb3f23c8fd91dfa61369ddee2ff2deeb21b7084ae86f54e275c5d25c8ec1e727564a5b6f2';
config.tokenExpiresIn = 10080; // this is the length of time a token is valid in minutes, default to a week
//config.tokenExpiresIn = 10; // this is the length of time a token is valid in minutes, default to a week
config.tokenRenewIn = 50; // if your token will expire with in tokenRenewIn minutes, it will be renewed during the post

//rackspace
config.storage = {
    username : 'bstallter',
    apiKey : '5621fdf861864de0aa4fd029767c022a',
    container : 'ce-filepool',
    provider : 'rackspace',
    region : 'IAD'
};

config.mailgun = {
    api_key: 'key-061710f7633b3b2e2971afade78b48ea',
    domain: 'sandboxa8b6f44a159048db93fd39fc8acbd3fa.mailgun.org'
}

config.smtp = {
    username: '',
    password: '',
    server: '',
    port: ''
};

config.senderemail = 'noreply@coatingsestimator.com';
config.suggestionemail = 'web@theconcreteprotector.com';
config.registrationemail = 'web@theconcreteprotector.com';

module.exports = config;
