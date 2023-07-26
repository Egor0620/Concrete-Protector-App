/**
 * Created by tbbates on 1/24/15.
 */
'use strict';
module.exports = function(){
    var Q = require('q');

    var baseOptions = {};
    baseOptions.OpeningTags = '<html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"></head><body>';
    baseOptions.EmailWidth = '800px';
    baseOptions.HeaderRowBegin = '<div style="width: ' + baseOptions.EmailWidth + '; font-weight:bold; padding-top: 15px;">';
    baseOptions.RowBegin = '<div style=" margin-left: 50px; width: ' + baseOptions.EmailWidth + '; ">';
    baseOptions.RowEnd = '</div>';
    baseOptions.ReportWidth = baseOptions.EmailWidth;
    baseOptions.ClosingTags = '</body></html>';

    function forgotPassword(emailAddress, salutation, newPassword){

        var deferred = Q.defer(),
            errorMessage = {},
            result = '';

        try {
            // add the opening body tags
            result += baseOptions.OpeningTags;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;

            if(salutation){
                result += baseOptions.RowBegin;
                result += 'Dear ' + salutation + ',';
                result += baseOptions.RowEnd;
            }
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + 'Thank you for contacting Coatings Estimator to reset your password.' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + 'Here is your login information.' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + 'Username: ' + emailAddress + '<br /> Password: ' + newPassword + '<br />' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.ClosingTags;

            deferred.resolve(result);


        }
        catch (e) {
            errorMessage.message = e;
            errorMessage.code = 500;
            deferred.reject(errorMessage);
        }
        return deferred.promise;
    }

    function feedback(senderEmail, senderName, suggestion){

        var deferred = Q.defer(),
            errorMessage = {},
            result = '';

        try {
            // add the opening body tags
            result += baseOptions.OpeningTags;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + 'Name: '+ senderName + baseOptions.RowEnd;
            result += baseOptions.RowBegin + 'Email: '+ senderEmail + baseOptions.RowEnd;
            result += baseOptions.RowBegin + 'Suggestion:' +suggestion + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.ClosingTags;

            deferred.resolve(result);


        }
        catch (e) {
            errorMessage.message = e;
            errorMessage.code = 500;
            deferred.reject(errorMessage);
        }
        return deferred.promise;
    }

    function newRegistration(account, person){

        var deferred = Q.defer(),
            errorMessage = {},
            result = '';

        try {
            // add the opening body tags
            result += baseOptions.OpeningTags;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.RowBegin + 'Name: '+ person.firstname + ' ' + person.lastname + baseOptions.RowEnd;
            if(person.company){
                result += baseOptions.RowBegin + 'Company: '+ person.company  + baseOptions.RowEnd;
            }
            result += baseOptions.RowBegin + 'Username: '+ account.username  + baseOptions.RowEnd;
            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;

            result += baseOptions.RowBegin + '&nbsp;' + baseOptions.RowEnd;
            result += baseOptions.ClosingTags;

            deferred.resolve(result);


        }
        catch (e) {
            errorMessage.message = e;
            errorMessage.code = 500;
            deferred.reject(errorMessage);
        }
        return deferred.promise;
    }

    return{
        ForgotPassword: forgotPassword,
        Feedback: feedback,
        NewRegistration: newRegistration
    };
};