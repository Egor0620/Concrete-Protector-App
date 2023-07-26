angular.module('estimateApp')
    .controller('NewContractCtrl', [
        '$rootScope', '$scope', 'Lead', 'Color', 'Pattern','Address', '$q', 'project','Contract','ContractTemplate','Storage', '$stateParams', 'ContractTemplate', 'System', 'Project', '$compile', '$timeout', '$http', 'Utility', '$cordovaCamera', 'uiHelper', '$ionicPopup', 'LocalService','Config',
        function ($rootScope, $scope, Lead, Color, Pattern, Address, $q, project, Contract, ContractTemplate, Storage, $stateParams, Service, System, Project, $compile, $timeout, $http, Utility, $cordovaCamera, uiHelper, $ionicPopup, LocalService, Config) {
            "use strict";

            $scope.getDate = function() {
              var today = new Date();
              var dd = today.getDate();
              var mm = today.getMonth() + 1; //January is 0!
              var yyyy = today.getFullYear();

              if (dd < 10) {
                dd = '0' + dd
              }

              if (mm < 10) {
                mm = '0' + mm
              }

              return mm + '/' + dd + '/' + yyyy;
            }

            $scope.init = function() {


              //$scope.leadid = $rootScope.leadid;
              $scope.isNew = false;
              $scope.Project ={};
              $scope.model = {};
              $scope.model.showPreview = false;
              $scope.model.enableDiscountByPercentage = false;
              $scope.model.enableDiscountByAmount = false;
              $scope.model.discount = 0.0;
              $scope.model.title = 'Installation Estimate / Purchase Agreement';

              $scope.leadid = $stateParams.leadid;
              $scope.projectid = $stateParams.projectid;
              $('#signature').jSignature({
                width:'100%',
                height:'100%',
                UndoButton: true,
                lineWidth: 3,
                color:'#00f'
              });

              $('div.contract-form textarea').focus(function() {
                $('div.contract-form div.bottom-space').show();
              }).blur(function() {
                $('div.contract-form div.bottom-space').hide();
              })


              var icons = {
                header: "ui-icon-circle-arrow-e",
                activeHeader: "ui-icon-circle-arrow-s"
              };

              $("div.contract").accordion({
                  icons: icons,
                  collapsible: true,
                  heightStyle: "content",
                  active: false
                });

              $scope.model.date = $scope.getDate();


                ContractTemplate.Search([],{storageType: 'contracttemplatelayout', searchType: 'use'})
                    .then(function(contractTemplates){
                            $scope.ContractTemplates = contractTemplates;
                    }, function(error){
                       var e = 'do something with the error ' + error;
                    });

                Contract.ProjectDetails(project)
                    .then(function(results){
                        $scope.Project = results;
                    });
               // Load project details...
              $scope.loadLeadAndAddress();
              //$scope.loadProjectDetail();
            };

          $scope.onChangeDiscountMode = function(mode) {
            if (mode == 0)
              $scope.model.enableDiscountByAmount = false;
            else if (mode == 1)
              $scope.model.enableDiscountByPercentage = false;
          }

        $scope.onClickLogo = function() {
          //$scope.model.errors = [];

          if (navigator && navigator.camera) {

            var cameraOptions = {
              quality: 30,
              destinationType: Camera.DestinationType.DATA_URL,
              encodingType: Camera.EncodingType.PNG,
              correctOrientation: true,
              targetWidth: 800,
              targetHeight: 600
            };

            $cordovaCamera.getPicture(cameraOptions)
              .then(function(imageData) {
                Storage.UploadImage({img:imageData}).then(function(path) {
                  $scope.model.logo = Config.WebStorageEndpoint + path;
                }, function(error) {

                });

              }, function(error) {
                Reference.ProcessError(error, $scope.AreaImage.errors);
            });

          }
          else {
            alert("This device doesn't support Camera.");
          }
        }


          $scope.TemplateChange = function(id) {
            $scope.selectedTemplate = {id: id};


            var promises = [];
            var headerhints = {
              populate: true,
              searchType: 'use',
              storageType: 'contracttemplateheader'
            };
            var termhints = {
              populate: true,
              searchType: 'use',
              storageType: 'contracttemplateterm'
            };
            var footerhints = {
              populate: true,
              searchType: 'use',
              storageType: 'contracttemplatefooter'
            };
            var criteria = {fid: id};

            // get contracttemplate
            promises.push(Service.Get(id));

            // get contracttemplateheader
            //promises.push(Storage.Search(criteria, headerhints));

            // get contracttemplatefooter
            //promises.push(Storage.Search(criteria, footerhints));

            // get contracttemplateterm
            //promises.push(Storage.Search(criteria, termhints));

            $q.all(promises)
              .then(function (promiseResults) {
                $scope.updateTemplate(promiseResults);

              }, function (error) {
                Reference.ProcessError(error, $scope.errors);
              });
          };

          $scope.updateTemplate = function(ret) {
              var template = ret[0][0];

              $scope.model.logo = template.headerImgSize == 0 ? "" : Config.WebStorageEndpoint + template.headerid + ".png";
              //$scope.model.footer = ret[0][0].footerImgSize == 0 ? "" : Config.WebStorageEndpoint + ret[0][0].footerid + ".png";
              var term = null;

              try {
                term = JSON.parse(template.term);
              } catch (e) {
                console.warn(e);
                uiHelper.showNoty('Template has not been loaded. term data is corrupted or unknown format.', 'error');
              }

              if (term != null) {
                $scope.model.term = term;
                uiHelper.showNoty('Template has been loaded successfully.');
              }
          };

          $scope.loadLeadAndAddress = function() {
            var promises = [];
            var hints = {
              searchType: 'use',
              populate: true
            };
            var searchType = {
              'type': 'use',
              'populate': ['systemdetail', 'ingredient']
            };

            promises.push(Lead.Get($scope.leadid, hints));
            var addresscriteria = [{'personid': $scope.leadid}];

            promises.push(Address.Search(addresscriteria));

            if ($scope.isNew === false) {
              promises.push(Project.Search([{id: $scope.projectid}]));
            }

            promises.push(System.GetAll(searchType));
            promises.push(Color.Get());
            promises.push(Pattern.Get());

            $q.all(promises)
              .then(function (promiseResults) {
                populateLead(promiseResults);

              }, function (error) {
                $scope.errors = error;
              });

            function populateLead(model) {
              //
              // 0: Lead
              // 1: Address
              // 2: Project
              // 3: Systems
              //
              $scope.model.lead = model[0][0];
              var address = model[1][0];
              var projects = model[2][0];
              var systems = model[3];
              var colors = model[4];
              var patterns = model[5];

              var systemsInLead = [];

              console.log(projects);

              for (var i in projects.details) {
                var detail = projects.details[i];

                for (var j=0; j<systems.length; j++) {
                  if (systems[j].id == detail.systemid) {
                    detail.system = systems[j];

                    for (var k in detail.styles) {
                      var style = detail.styles[k];
                      //var colors = detail.system.ingredients[k].colors;
                      //var patterns = detail.system.ingredients[k].patterns;

                      for (var l=0; l<colors.length; l++) {
                        if (style.colorid == colors[l].id)
                          style.color = colors[l];
                      }

                      for (var m=0; m<patterns.length; m++) {
                        if (style.patternid == patterns[m].id)
                          style.pattern = patterns[m];
                      }
                    }
                  }
                }
              }

              $scope.model.projects = projects;
              if (typeof(address) == 'undefined') {
                uiHelper.showNoty('Address is not defined for this project.', 'error');
              }
              else {
                $scope.model.address = address.address1 + ", " + address.address2 + " " + address.city + ", " + address.state + " " + address.zip;
              }

              if (typeof($scope.model.lead.person) == 'undefined') {
                uiHelper.showNoty('Person info is not defined for this project.', 'error');
              }
              else {
                $scope.model.lead.person.name = $scope.model.lead.person.firstname +  " " + $scope.model.lead.person.lastname;
              }

              $scope.model.systems = model[3];
            }

            function ensureProject(project){
              var response = $q.defer();
              if (project.id && project.id.length === 36) {
                response.resolve(project);
              }
              else{
                saveProject(project)
                  .then(function(result){
                    return response.resolve(result);
                  }, function(error){
                    response.reject(error);
                  });
              }
              return response.promise;
            }
          };

          $scope.loadProjectDetail = function() {
            var promises = [];
            var hints = {
              searchType: 'use',
              populate: true
            };
            var searchType = {
              'type': 'use',
              'populate': ['systemdetail', 'ingredient']
            };

            promises.push(Project.Search([{id: $scope.projectid}]));
            //promises.push(Lead.Get($scope.leadid, hints));
            promises.push(System.GetAll(searchType));
            //var addresscriteria = [{'personid': $scope.leadid}];

            /*
            promises.push(Address.Search(addresscriteria));

            if ($scope.isNew === false) {
              promises.push(Project.Search([{id: $scope.projectid}]));
            }
            */

            $q.all(promises)
              .then(function (promiseResults) {
                //populateLead(promiseResults[0][0]);
                $scope.Systems = promiseResults[1];
                $scope.Addresses = promiseResults[2];
                if (promiseResults.length > 3) {
                  populateProject(promiseResults[3][0]);
                }
                else {
                  populateProject({
                    leadid: $scope.Lead.id
                  });
                }
              }, function (error) {
                $scope.errors = error;
              });

            function populateLead(model) {
              $scope.Lead = model;
            }

            function ensureProject(project){
              var response = $q.defer();
              if (project.id && project.id.length === 36) {
                response.resolve(project);
              }
              else{
                saveProject(project)
                  .then(function(result){
                    return response.resolve(result);
                  }, function(error){
                    response.reject(error);
                  });
              }
              return response.promise;
            }
          }

          $scope.validate = function(model, errors) {
            model.projectid = $scope.projectid;
            model.version = 1;
            model.signatureid = $scope.selectedTemplate.id;
            model.signaturedate = new Date();
            model.templateid = $scope.selectedTemplate.id;
            model.termid = $scope.selectedTemplate.id;
            model.headerid = $scope.selectedTemplate.id;
            model.footerid = $scope.selectedTemplate.id;
            model.price = 100;
            //model.discount = "";
            model.status = "00";
          };

          $scope.save = function() {
            $scope.saving = true;
            var errors = [];
            var model = $scope.model;
            model.errors = [];

            $scope.validate(model, errors);

            if (errors.length > 0) {
              model.errors = errors;
              model.error = errors.join(', ');
              return model.error;
            }

            model.error = [];
            model.errors = [];

            if ($scope.isNew) {
              Service.Update(model)
                .then(function (result) {
                  $scope.saving = false;
                  $rootScope.back();
                },
                function (error) {
                  $scope.saving = false;
                  model.errors = error;
                  model.error = model.errors.join(', ');

                }
              );

            }
            else {
              Service.Add(model)
                .then(function (result) {
                  $scope.saving = false;
                  $rootScope.back();
                },
                function (error) {
                  $scope.saving = false;
                  model.errors = error;
                  model.error = model.errors.join(', ');

                }
              );
            }
          }

          $scope.sendEmail = function() {
            var contractHtmlBody = "";
            var totalPrice = $scope.Project.totalcost;
            var discountedPriceByPercentage = accounting.formatMoney(totalPrice - (totalPrice * ($scope.model.discountPercentage/100)));
            var discountedPriceByAmount = accounting.formatMoney((totalPrice - $scope.model.discountAmount));

            $scope.model.showPreview = false;


            if ($scope.model.enableDiscountByPercentage) {
              $scope.model.discountContent = '<div>Discount ' + $scope.model.discountPercentage  + ' %</div>' +
                '<div>Net Price&nbsp;$&nbsp;' + discountedPriceByPercentage + '</div><br>';
            }
            else if ($scope.model.enableDiscountByAmount) {
              $scope.model.discountContent = '<div>Discount&nbsp;$&nbsp;'  + $scope.model.discountAmount  +  ' </div>' +
                '<div>Net Price&nbsp;$&nbsp;' + discountedPriceByAmount + '</div><br>';
            }
            else {
              $scope.model.discountContent = '';
            }


            $http.get("views/lead/contract_preview.html").then( function(result) {

              $(".contract_preview").html("");

              $(".contract_preview").append($compile(result.data)($scope));

              $timeout(function() {
                var model = {
                  subject: 'Contract from ',
                  htmlBody: $(".contract_preview").html(),
                  emailTo: $scope.model.lead.detail.email,
                  //emailTo: 'wangyinxing19@gmail.com'
                };

                Contract.sendContractViaEmail(model)
                  .then(function(result) {
                    if (typeof($scope.model.lead.detail.email) != 'undefined')
                      uiHelper.showNoty('Contract has been sent to customer : ' + $scope.model.lead.detail.email);
                    else
                      uiHelper.showNoty("Contract has not been sent to app owner due to missing of email.", "error");

                    var loginDetail = JSON.parse(LocalService.Get('loginDetail'));
                    var email = loginDetail.username;

                    var model = {
                      subject: 'Contract from ',
                      htmlBody: $(".contract_preview").html(),
                      emailTo: email,
                      //emailTo: 'wangyinxing19@gmail.com'
                    };

                    Contract.sendContractViaEmail(model)
                      .then(function(result) {
                        if (typeof(email) != 'undefined')
                          uiHelper.showNoty('Contract has been sent to app owner : ' + email);
                        else
                          uiHelper.showNoty("Contract has not been sent to app owner due to missing of email.", "error");
                      }, function(error) {

                      });


                  },
                  function (error) {

                  });

              }, 0);


            }, function(error) {

            });
          };


          $scope.sendAsEmail = function() {
            var signData = $('#signature').jSignature("getData");

            var isNotSigned = $('#signature').find('input[type="button"]').css('display') == 'none';

            /*
            if (isNotSigned) {
              uiHelper.showNoty('Please sign on signature box in Date by signature line section before sending email.', 'error');
              return;
            }
            */

            Storage.UploadImage({img:signData}).then(function(path) {
              $scope.model.signature = Config.WebStorageEndpoint + path;

              $scope.sendEmail();
            }, function(error) {
              console.log(error);
            });
          };

        }]);
