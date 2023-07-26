/**
 * Created by tbbates on 7/10/14.
 */
'use strict';
module.exports = function (app) {
    var baseRoute = './routes/v1/',
        baseApi = '/api/v1/';

    require(baseRoute +'index')(app, '/');

    var modelRoutes = [
        'account',
        'address',
        'color',
        'contract',
        'contracttemplate',
        'ignore',
        'ingredient',
        'ingredientcolor',
        'ingredientpattern',
        'lead',
        'leaddetail',
        'note',
        'pattern',
        'person',
        'phone',
        'project',
        'projectdetail',
        'projectdetailstyle',
        'reference',
        'storage',
        'system',
        'systemdetail',
        'team',
        'teamdetail',
        'teamlead',
        'teamsystem'
    ];
    _.each(modelRoutes, function(route){
        require(baseRoute +route)(app, baseApi +route);
    });

};