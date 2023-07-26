var app;

app = angular.module('estimateApp', [
    'ui.router',
    'ngCordova',
    'ui.bootstrap',
    'restangular'
]);

// add our constants
app.constant('_', window._);

app.constant('AccessLevels', {
    anon: 'anon',
    user: 'user',
    administrator: 'administrator',
    subscriber: 'subscriber',
    concreteprotector: 'concreteprotector'
});

app.config(['$stateProvider',
    '$urlRouterProvider',
    'RestangularProvider',
    '$locationProvider',
    '$httpProvider',
    'AccessLevels',
    'Config',
    'datepickerConfig',
    function ($stateProvider, $urlRouterProvider, RestangularProvider, $locationProvider, $httpProvider, AccessLevels, Config, datepickerConfig) {
        'use strict';
        $urlRouterProvider.otherwise('/login');

        datepickerConfig.showWeeks = false;

        var index = {
            name: 'index',
            url: '/',
            views: {
                '@': {
                    templateUrl: 'views/common/_layout.html'
                },
                'content@index': {
                    templateUrl: 'views/common/navigation.html',
                    controller: 'MainCtrl'
                },
                'header@index': {
                    controller: 'HeaderCtrl',
                    templateUrl: 'views/common/_header.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: ''

            }
        };
        var login = {
            name: 'index.login',
            url: 'login',
            views: {
                'content@index': {
                    controller: 'LoginCtrl',
                    templateUrl: 'views/account/login.html'
                },
                'header@index': {
                    controller: 'HeaderCtrl',
                    templateUrl: 'views/common/_headerTitleOnly.html'
                }
            },
            data: {
                access: [AccessLevels.anon],
                pageTitle: 'Login'
            }
        };
        var register = {
            name: 'index.register',

            url: 'register',
            views: {
                'content@index': {
                    controller: 'RegisterCtrl',
                    templateUrl: 'views/account/register.html'
                },
                'header@index': {
                    controller: 'HeaderCtrl',
                    templateUrl: 'views/common/_headerTitleOnly.html'
                }
            },
            data: {
                access: [AccessLevels.anon],
                pageTitle: 'Register'
            }
        };
        var changepassword = {
            name: 'index.changepassword',

            url: 'changepassword',
            views: {
                'content@index': {
                    controller: 'ChangePasswordCtrl',
                    templateUrl: 'views/account/changepassword.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Change Password'
            }
        };
        var feedback = {
            name: 'index.feedback',

            url: 'feedback',
            views: {
                'content@index': {
                    controller: 'FeedbackCtrl',
                    templateUrl: 'views/account/feedback.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Feedback'
            }
        };
        var forgotpassword = {
            name: 'index.forgotpassword',

            url: 'forgotpassword',
            views: {
                'content@index': {
                    controller: 'RegisterCtrl',
                    templateUrl: 'views/account/forgotpassword.html'
                },
                'header@index': {
                    controller: 'HeaderCtrl',
                    templateUrl: 'views/common/_headerTitleOnly.html'
                }
            },
            data: {
                access: [AccessLevels.anon],
                pageTitle: 'Forgot Password'
            }
        };

        var leads = {
            name: 'index.leads',
            url: 'leads/:status',
            views: {
                'content@index': {
                    controller: 'LeadsCtrl',
                    templateUrl: 'views/lead/leads.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Leads'
            }
        };

        var lead = {
            name: 'index.lead',
            url: 'lead/:id',
            views: {
                'content@index': {
                    controller: 'LeadCtrl',
                    templateUrl: 'views/lead/lead.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Lead'
            }
        };
        var newLead = {
            name: 'index.newlead',
            url: 'newlead',
            views: {
                'content@index': {
                    controller: 'NewLeadCtrl',
                    templateUrl: 'views/lead/newlead.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'New Lead'
            }
        };

        var project = {
            name: 'index.project',
            url: 'project/:leadid/:projectid',

            views: {
                'content@index': {
                    controller: 'ProjectCtrl',
                    templateUrl: 'views/lead/project.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Project'
            }
        };

        var projects = {
            name: 'index.projects',
            url: 'projects/:status/:time',
            views: {
                'content@index': {
                    controller: 'ProjectsCtrl',
                    templateUrl: 'views/lead/projects.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Projects'
            }
        };

        var settings = {
            name: 'index.settings',

            url: 'settings',
            views: {
                'content@index': {
                    controller: 'SettingsCtrl',
                    templateUrl: 'views/common/settings.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Settings'
            }
        };

        var systems = {
            name: 'index.systems',

            url: 'systems',
            resolve: {
                models: ['System', function (Service) {
                    return Service.GetAll({'type': 'maintain'});
                }]
            },
            views: {
                'content@index': {
                    templateUrl: 'views/common/list.html',
                    controller: ['$scope', '$state', 'models', function ($scope, $state, models) {
                        $scope.Models = models;
                        $scope.goto = function (id) {
                            $state.go(system.name, {id: id});
                        };
                        $scope.newmodel = newsystem.name;
                    }]
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'Systems'
            }
        };
        var newsystem = {
            name: 'index.newsystem',
            url: 'system/',

            views: {
                'content@index': {
                    controller: 'SystemCtrl',
                    templateUrl: 'views/system/system.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'New System'
            }
        };
        var system = {
            name: 'index.system',
            url: 'system/:id',
            views: {
                'content@index': {
                    controller: 'SystemCtrl',
                    templateUrl: 'views/system/system.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'Edit System'
            }
        };

        var colors = {
            name: 'index.colors',

            url: 'colors',
            resolve: {
                models: ['Color', function (Service) {
                    return Service.Get();
                }]
            },
            views: {
                'content@index': {
                    templateUrl: 'views/common/list.html',
                    controller: ['$scope', '$state', 'models', function ($scope, $state, models) {
                        $scope.Models = models;
                        $scope.goto = function (id) {
                            $state.go(color.name, {id: id});
                        };
                        $scope.newmodel = newcolor.name;
                    }]
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'Colors'
            }
        };
        var newcolor = {
            name: 'index.newcolor',
            url: 'color/',

            views: {
                'content@index': {
                    controller: 'ColorCtrl',
                    templateUrl: 'views/system/color.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator],
                pageTitle: 'New Color'
            }
        };
        var color = {
            name: 'index.color',
            url: 'color/:id',

            views: {
                'content@index': {
                    controller: 'ColorCtrl',
                    templateUrl: 'views/system/color.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator],
                pageTitle: 'Edit Color'
            }
        };

        var ingredients = {
            name: 'index.ingredients',

            url: 'ingredients',

            resolve: {
                models: ['Ingredient', function (Service) {
                    return Service.Get();
                }]
            },
            views: {
                'content@index': {
                    templateUrl: 'views/common/list.html',
                    controller: ['$scope', '$state', 'models', function ($scope, $state, models) {
                        $scope.Models = models;
                        $scope.goto = function (id) {
                            $state.go(ingredient.name, {id: id});
                        };
                        $scope.newmodel = newingredient.name;
                    }]
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator],
                pageTitle: 'Ingredients'
            }
        };
        var newingredient = {
            name: 'index.newingredient',
            url: 'ingredient/',

            views: {
                'content@index': {
                    controller: 'IngredientCtrl',
                    templateUrl: 'views/system/ingredient.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator],
                pageTitle: 'New Ingredient'
            }
        };
        var ingredient = {
            name: 'index.ingredient',
            url: 'ingredient/:id',

            views: {
                'content@index': {
                    controller: 'IngredientCtrl',
                    templateUrl: 'views/system/ingredient.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator],
                pageTitle: 'Edit Ingredient'
            }
        };

        var patterns = {
            name: 'index.patterns',

            url: 'patterns',
            resolve: {
                models: ['Pattern', function (Service) {
                    return Service.Get();
                }]
            },
            views: {
                'content@index': {
                    templateUrl: 'views/common/list.html',
                    controller: ['$scope', '$state', 'models', function ($scope, $state, models) {
                        $scope.Models = models;
                        $scope.goto = function (id) {
                            $state.go(pattern.name, {id: id});
                        };
                        $scope.newmodel = newpattern.name;
                    }]
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator],
                pageTitle: 'Patterns'
            }
        };
        var newpattern = {
            name: 'index.newpattern',
            url: 'pattern/',

            views: {
                'content@index': {
                    controller: 'PatternCtrl',
                    templateUrl: 'views/system/pattern.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator],
                pageTitle: 'New Pattern'
            }
        };
        var pattern = {
            name: 'index.pattern',
            url: 'pattern/:id',

            views: {
                'content@index': {
                    controller: 'PatternCtrl',
                    templateUrl: 'views/system/pattern.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator],
                pageTitle: 'Edit Pattern'
            }
        };

        var team = {
            name: 'index.team',
            url: 'team',

            views: {
                'content@index': {
                    controller: 'TeamCtrl',
                    templateUrl: 'views/team/team.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'My Team'
            }
        };

        var subscribe = {
            name: 'index.subscribe',
            url: 'subscribe',
            views: {
                'content@index': {
                    controller: 'SubscribeCtrl',
                    templateUrl: 'views/account/subscribe.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Subscribe'
            }
        };

        var contracttemplates = {
            name: 'index.contracttemplates',
            url: 'contracttemplates',
            resolve: {
                models: ['ContractTemplate', function (Service) {
                    var criteria = {},
                        hints = {};
                    hints.storageType = 'contracttemplatelayout';
                    hints.searchType = 'use';
                    return Service.Search(criteria, hints);
                }]
            },
            views: {
                'content@index': {
                    templateUrl: 'views/common/list.html',
                    controller: ['$scope', '$state', 'models', function ($scope, $state, models) {
                        $scope.Models = models;
                        $scope.goto = function (id) {
                            $state.go(contracttemplate.name, {id: id});
                        };
                        $scope.newmodel = newcontracttemplate.name;
                    }]
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'Templates'
            }
        };
        var newcontracttemplate = {
            name: 'index.newcontracttemplate',
            url: 'contracttemplate/',

            views: {
                'content@index': {
                    controller: 'ContractTemplateCtrl',
                    templateUrl: 'views/contracttemplate/template.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'New Template'
            }
        };
        var contracttemplate = {
            name: 'index.contracttemplate',
            url: 'contracttemplate/:id',

            views: {
                'content@index': {
                    controller: 'ContractTemplateCtrl',
                    templateUrl: 'views/contracttemplate/template.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'Edit Template'
            }
        };

        var contracttemplatelayouts = {
            name: 'index.contracttemplatelayouts',
            url: 'contracttemplatelayouts',
            resolve: {
                models: ['Storage', function (Service) {

                    var criteria = {},
                        hints = {};
                    hints.storageType = 'contracttemplatelayout';
                    hints.searchType = 'use';
                    return Service.Search(criteria, hints);
                }]
            },
            views: {
                'content@index': {
                    templateUrl: 'views/common/list.html',
                    controller: ['$scope', '$state', 'models', function ($scope, $state, models) {
                        $scope.Models = models;
                        $scope.goto = function (id) {
                            $state.go(contracttemplatelayout.name, {id: id});
                        };
                        $scope.newmodel = newcontracttemplatelayout.name;
                    }]
                }
            },
            data: {
                access: [AccessLevels.administrator],
                pageTitle: 'Layouts'
            }
        };
        var newcontracttemplatelayout = {
            name: 'index.newcontracttemplatelayout',
            url: 'contracttemplatelayout/',

            views: {
                'content@index': {
                    controller: 'ContractTemplateLayoutCtrl',
                    templateUrl: 'views/contracttemplate/layout.html'
                }
            },
            data: {
                access: [AccessLevels.administrator],
                pageTitle: 'New Layout'
            }
        };
        var contracttemplatelayout = {
            name: 'index.contracttemplatelayout',
            url: 'contracttemplatelayout/:id',
            views: {
                'content@index': {
                    controller: 'ContractTemplateLayoutCtrl',
                    templateUrl: 'views/contracttemplate/layout.html'
                }
            },
            data: {
                access: [AccessLevels.administrator],
                pageTitle: 'Edit Layout'
            }
        };

        var preferences = {
            name: 'index.preferences',
            url: 'preferences',
            views: {
                'content@index': {
                    templateUrl: 'views/preference/preferences.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Preferences'

            }
        };

        var preference = {
            name: 'index.preference',
            url: 'preference/:type',
            resolve: {
                ignores: ['$stateParams', 'Ignore', function ($stateParams, Service) {
                    var criteria = {},
                        hints = {};
                    hints.searchType = 'maintain';
                    hints.ignoreType = $stateParams.type;
                    return Service.Search(criteria, hints);
                }],
                helper: function () {
                    return {
                        text: 'show or hide systems, <br/><i class="fa fa-check"></i> = hidden'
                    };
                }
            },
            views: {
                'content@index': {
                    controller: 'PreferenceCtrl',
                    templateUrl: 'views/preference/preference.html'
                }
            },
            data: {
                access: [AccessLevels.user],
                pageTitle: 'Preference'
            }
        };

        var contracts = {
            name: 'index.contracts',
            url: 'contracts/:projectid',
            resolve: {
                models: ['$stateParams','Contract', function ($stateParams,Service) {
                    var criteria = [];
                    criteria.push({projectid: $stateParams.projectid});
                    var hints = {};
                    hints.searchType = 'maintain';
                    return Service.Search(criteria, hints);
                }]
            },
            views: {
                'content@index': {
                    templateUrl: 'views/lead/contracts.html',
                    controller: ['$scope', '$state','$stateParams', 'models', function ($scope, $state,$stateParams, models) {
                        $scope.Models = models;

                        if(models.length === 0){
                            $state.go(newcontract.name, {projectid: $stateParams.projectid});
                        }

                        $scope.goto = function (id) {
                            $state.go(contract.name, {id: id});
                        };
                        $scope.projectid = $stateParams.projectid;

                    }]
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'Contracts'
            }
        };

        var newcontract = {
            name: 'index.newcontract',
            url: 'newcontract/:projectid',
            resolve: {
                project: ['$stateParams','Project', function ($stateParams,Service) {
                    var criteria = [];
                    criteria.push({id: $stateParams.projectid});
                    var hints = {};
                    hints.searchType = 'use';
                    hints.populate = true;
                    return Service.Search(criteria, hints);
                }]
            },
            views: {
                'content@index': {
                    controller: 'NewContractCtrl',
                    templateUrl: 'views/lead/newcontract.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'New Contract'
            }
        };

        var contract = {
            name: 'index.contract',
            url: 'contract/:contractid',
            views: {
                'content@index': {
                    controller: 'ContractCtrl',
                    templateUrl: 'views/lead/contract.html'
                }
            },
            data: {
                access: [AccessLevels.concreteprotector, AccessLevels.administrator, AccessLevels.subscriber],
                pageTitle: 'Edit Contract'
            }
        };

        $stateProvider.state(index);

        $stateProvider.state(leads);
        $stateProvider.state(lead);
        $stateProvider.state(newLead);

        $stateProvider.state(project);
        $stateProvider.state(projects);

        $stateProvider.state(login);
        $stateProvider.state(changepassword);
        $stateProvider.state(forgotpassword);
        $stateProvider.state(register);

        $stateProvider.state(settings);
        $stateProvider.state(feedback);
        $stateProvider.state(systems);
        $stateProvider.state(newsystem);
        $stateProvider.state(system);

        $stateProvider.state(colors);
        $stateProvider.state(newcolor);
        $stateProvider.state(color);

        $stateProvider.state(ingredients);
        $stateProvider.state(newingredient);
        $stateProvider.state(ingredient);

        $stateProvider.state(patterns);
        $stateProvider.state(newpattern);
        $stateProvider.state(pattern);

        $stateProvider.state(team);
        $stateProvider.state(subscribe);

        $stateProvider.state(contracttemplatelayouts);
        $stateProvider.state(newcontracttemplatelayout);
        $stateProvider.state(contracttemplatelayout);

        $stateProvider.state(contracttemplates);
        $stateProvider.state(newcontracttemplate);
        $stateProvider.state(contracttemplate);
        $stateProvider.state(preferences);
        $stateProvider.state(preference);

        $stateProvider.state(contracts);
        $stateProvider.state(newcontract);
        $stateProvider.state(contract);


        /* wait until we need this
         $stateProvider.state(contracts);
         $stateProvider.state(newcontract);
         $stateProvider.state(contract);
         */
        RestangularProvider.setDefaultHeaders({'Concrete-Access': 'Yes'});
        RestangularProvider.setBaseUrl(Config.WebServiceEndpoint);
        RestangularProvider.setDefaultHttpFields({
            withCredentials: true
        });
        $httpProvider.interceptors.push('HttpInterceptor');


    }]).run(['$rootScope', '$state', '$stateParams', '$window', 'Authorization', 'Config', 'Log',
    function ($rootScope, $state, $stateParams, $window, Authorization, Config, Log) {
        'use strict';

        //$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {

            Authorization.CheckToken();

            if (!Authorization.IsAuthorized(toState.data.access)) {
                event.preventDefault();
                $state.go('index.login');
            }
            var pageTitle = toState.data.pageTitle;
            $rootScope.$broadcast(Config.SetTitleEvent, pageTitle);
        });

        //https://github.com/angular-ui/ui-router/issues/92
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            // to be used for back button //won't work when page is reloaded.
            $rootScope.appTargetStateName = fromState.name;
            $rootScope.appTargetStateParams = fromParams;
            Log.Log('changed state to ' + toState.name);
        });
        //back button function called from back button's ng-click="back()"
        $rootScope.back = function () {
            if ($rootScope.appTargetStateName) {
                $state.go($rootScope.appTargetStateName, $rootScope.appTargetStateParams);
            }

        };
        //

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$broadcast(Config.AppStart);


    }]);
