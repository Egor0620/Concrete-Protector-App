angular.module('estimateApp')
  .service('Lead', ['$q', 'Reference', 'Service', 'Person', 'Address', 'Phone', 'Project', 'ProjectDetail', 'LeadDetail', 'Note', 'ProjectDetailStyle',
    function ($q, Reference, Service, Person, Address, Phone, Project, ProjectDetail, LeadDetail, Note, ProjectDetailStyle) {
      'use strict';
      var service = this;

      var url = {
        search: 'api/v1/lead/search',
        add: 'api/v1/lead',
        update: 'api/v1/lead'
      };

      service.Statuses = Reference.Statuses;

      service.BestTimeToCalLOptions = [
        {key: 'Morning', time: 'Morning'},
        {key: 'Afternoon', time: 'Afternoon'},
        {key: 'Evening', time: 'Evening'}
      ];


      service.GetAll = function (hints) {
        var message = {},
          criteria = [],
          searchHints = {
            searchType: 'use',
            populate: true,
            status : 1
          };

        if (hints) {
          searchHints = hints;
        }
        message.hints = searchHints;
        message.criteria = criteria;
        return Service.Post(message, url.search);
      };

      service.Get = function (id, hints) {
        var message = {},
          criteria = [],
          searchHints = {
            searchType: 'use',
            populate: true
          };
        if (hints) {
          searchHints = hints;
        }

        criteria.push({'id': id});
        message.hints = searchHints;
        message.criteria = criteria;
        return Service.Post(message, url.search);
      };

      function buildNewProject(model, person, address) {
        var response = $q.defer();
        // the project will not have an address
        var saves = [];

        var newLead = {
          personid: person.id
        };
        saves.push(Service.Post(newLead, url.add));

        // if we have phones then save them
        if (model.hasphone) {
          saves.push(buildSavePhones(person.id, model.phones));
        }


        // if we have a detail then save it
        if (model.hasdetail === true) {
          var newDetail = {
            leadid: person.id,
            email: model.email,
            besttimetocall: model.besttimetocall,
            hearaboutus: model.hearaboutus,
            howcanwehelp: model.howcanwehelp
          };
          saves.push(LeadDetail.Add(newDetail));
        }


        $q.all(saves)
          .then(function (saveresult) {
            var projectSaves = [];
            // return response.resolve(saveresult);
            if (model.Systems && model.Systems.length > 0) {
              var newProject = {
                leadid: person.id,
                projectstatus :'estimate'
              };
              if (address) {
                newProject.addressid = address.id;
              }
              if (model.designconsultdate) {
                newProject.designconsultdate = model.designconsultdate;
              }

              Project.Add(newProject)
                .then(function (project) {
                  var projectDetailSaves = [];

                  // Save project details, this will be in iterative process as we have to save details for each projectdetail
                  _.each(model.Systems, function (system) {
                    var newProjectDetail = {
                      projectid: project.id,
                      systemid: system.System.id,
                      saleprice: system.System.saleprice,
                      area: system.System.coverage,
                      name: system.areaname,
                      arealength: system.length,
                      areawidth: system.width
                    };
                    projectDetailSaves.push(ProjectDetail.Add(newProjectDetail));
                  });

                  //
                  if (model.note) {
                    var newNote = {
                      fid: project.id,
                      body: model.note
                    };

                    projectDetailSaves.push(Note.Add(newNote));
                  }
                  //

                  $q.all(projectDetailSaves)
                    .then(function (projectdetails) {

                      var i = 0;
                      var projectDetailStyles = [];

                      _.each(model.Systems, function (system) {
                        var projectdetail = projectdetails[i];
                        var ingredients = system.System.ingredients;
                        _.each(ingredients, function (ingredient) {
                          var detailStyle = {
                            ingredientid: ingredient.id,
                            projectdetailid: projectdetail.id,
                            colorid: ingredient.selectedColor,
                            patternid: ingredient.selectedPattern
                          };
                          projectDetailStyles.push(ProjectDetailStyle.Add(detailStyle));
                        });
                        i += 1;
                      });

                      $q.all(projectDetailStyles)
                        .then(function (projectStyles) {
                          return response.resolve(projectStyles);
                        },
                        function (error) {
                          return response.reject(error);
                        });

                    },
                    function (error) {
                      return response.reject(error);
                    });


                }, function (error) {
                  return response.reject(error);
                });

            }
            else {
              response.resolve(saveresult);
            }

          },
          function (error) {
            return response.reject(error);
          });
        return response.promise;

      }

      service.Add = function (model) {
        var response = $q.defer();

        var newPerson = {
          firstname: model.firstname,
          lastname: model.lastname,
          company: model.company
        };

        Person.Add(newPerson)
          .then(function (person) {
            // save the address now so that we can use it with the project
            if (model.hasaddress === true) {
              var newAddressModel = buildAddress(person.id, model.addresses[0]);
              Address.Add(newAddressModel)
                .then(function (address) {
                  buildNewProject(model, person, address)
                    .then(function (success) {
                      return response.resolve(success);

                    }, function (error) {
                      return response.reject(error);
                    });

                },
                function (error) {
                  return response.reject(error);
                });
            }
            else {
              buildNewProject(model, person)
                .then(function (success) {
                  return response.resolve(success);
                }, function (error) {
                  return response.reject(error);
                });

            }
          },
          function (error) {
            return response.reject(error);
          });

        return response.promise;
      };

      service.Update = function (model) {
        var response = $q.defer();
        Service.Put(model, url.update)
          .then(function (result) {
            return response.resolve(result);
          },
          function (error) {
            return response.reject(error);
          });
        return response.promise;
      };

      function buildSaveAddresses(personId, addresses) {
        var response = $q.defer();
        var innerResponse = [],
          i = 0;
        _.each(addresses, function (address) {
          i = i + 1;

          var addressModel = {};

          if (!address.personid) {
            addressModel = buildAddress(personId, address);
            addressModel.personid = personId;
            addressModel.address1 = address.address1;
            addressModel.address2 = address.address2;
            addressModel.city = address.city;
            addressModel.state = address.state;
            addressModel.zip = address.zip;
            addressModel.type = address.type;
            addressModel.primary = address.primary;
            innerResponse.push(Address.Add(addressModel));
          } else {
            // These will be associations where the ingredient is not checked
            // we will remove these as they are not checked
            var action = '';

            if (address.extra && address.prime) {
              if (address.extra !== address.prime) {
                action = 'update';
              }
            }

            if (address.checked === false) {
              action = 'delete';
            }
            if (action === 'update') {
              addressModel.id = address.addressid;
              addressModel.version = address.addressversion;

              addressModel.address1 = address.address1;
              addressModel.address2 = address.address2;
              addressModel.city = address.city;
              addressModel.state = address.state;
              addressModel.zip = address.zip;
              addressModel.type = address.type;
              addressModel.primary = address.primary;

              innerResponse.push(Address.Update(addressModel));
            }
            if (action === 'delete') {
              innerResponse.push(Address.Remove(address.addressid));
            }

          }
        });
        if (i === addresses.length) {
          return response.resolve(innerResponse);
        }
        return response.promise;
      }

      function buildAddress(personId, address) {
        var result = {};
        result.personid = personId;
        result.address1 = address.address1;
        result.address2 = address.address2;
        result.city = address.city;
        result.state = address.state;
        result.zip = address.zip;
        result.type = address.type;
        result.primary = address.primary;
        return result;
      }

      function buildSavePhones(personId, phones) {
        var response = $q.defer();
        var innerResponse = [],
          i = 0;
        _.each(phones, function (phone) {
          i = i + 1;

          var phoneModel = {};

          if (!phone.personid) {
            phoneModel.personid = personId;
            phoneModel.number = phone.number;
            phoneModel.type = phone.type;
            phoneModel.primary = phone.primary;
            innerResponse.push(Phone.Add(phoneModel));
          } else {
            // These will be associations where the ingredient is not checked
            // we will remove these as they are not checked
            var action = '';

            if (phone.extra && phone.prime) {
              if (phone.extra !== phone.prime) {
                action = 'update';
              }
            }

            if (phone.checked === false) {
              action = 'delete';
            }
            if (action === 'update') {
              phoneModel.id = phone.addressid;
              phoneModel.version = phone.phoneversion;

              phoneModel.number = phone.number;
              phoneModel.type = phone.type;
              phoneModel.primary = phone.primary;

              innerResponse.push(Phone.Update(phoneModel));
            }
            if (action === 'delete') {
              innerResponse.push(Phone.Remove(phone.addressid));
            }

          }
        });
        if (i === phones.length) {
          return response.resolve(innerResponse);
        }
        return response.promise;
      }

      return service;
    }]);
