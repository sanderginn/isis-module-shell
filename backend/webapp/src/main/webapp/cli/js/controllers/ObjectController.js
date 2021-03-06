app.controller('ObjectController',
  ['$scope', '$stateParams', 'objects', '$q', '$rootScope', 'rootScopeSanitiser', 'errorService', '$timeout', 'speechService',
    function ($scope, $stateParams, objects, $q, $rootScope, rootScopeSanitiser, errorService, $timeout, speechService) {
      $scope.showProperties = false;
      $scope.showCollections = false;
      $scope.showActions = false;

      objects.getObject($stateParams.objectType, $stateParams.objectId).then(function (objectResponse) {
        $scope.domainType = objectResponse.domainType;
        $scope.instanceId = objectResponse.instanceId;
        $scope.title = objectResponse.title;

        $scope.properties = [];
        $scope.collections = [];
        $scope.actions = [];

        var collectionPromises = [];

        for (var member in objectResponse.members) {
          if (objectResponse.members[member].memberType === "property") {
            $scope.properties.push(objectResponse.members[member]);
          } else if (objectResponse.members[member].memberType === "collection") {
            collectionPromises.push(objects.getCollection(objectResponse.members[member].links[0].href));
          } else if (objectResponse.members[member].memberType === "action") {
            $scope.actions.push(objectResponse.members[member]);
          } else {
            errorService.throwError("Unknown memberType " + member.memberType);
          }
        }

        $q.all(collectionPromises).then(function (collectionResponses) {
          for (var collectionResponse in collectionResponses) {
            var collectionObject = {};
            var collectionId = collectionResponses[collectionResponse].id

            collectionObject[collectionId] = collectionResponses[collectionResponse].value;
            $scope.collections.push(collectionObject);

            var lastIndex = $scope.collections.length - 1;

            for (var key in $scope.collections[lastIndex][collectionId]) {
              $scope.collections[lastIndex][collectionId][key].objectType = objects.getObjectType($scope.collections[lastIndex][collectionId][key].href);
              $scope.collections[lastIndex][collectionId][key].objectId = objects.getObjectId($scope.collections[lastIndex][collectionId][key].href);
            }
          }

          $rootScope.collections = angular.copy($scope.collections);
        }, function (err) {
          errorService.throwError(err.data["x-ro-invalidReason"]);
        });

        $rootScope.domainType = angular.copy($scope.domainType);
        $rootScope.instanceId = angular.copy($scope.instanceId);
        $rootScope.title = angular.copy($scope.title);

        $rootScope.properties = angular.copy($scope.properties);
        $rootScope.actions = angular.copy($scope.actions);
        rootScopeSanitiser.sanitiseRootScope(['domainType', 'instanceId', 'title', 'properties', 'collections', 'actions']);

      });

      $scope.typeOf = function(val) {
        return typeof val;
      };

      $scope.$on('$showProperties', function() {
        $scope.showProperties = true;
        $scope.showCollections = false;
        $scope.showActions = false;
        speechService.speak("Output: " + document.getElementById("object-properties").innerText);
      });

      $scope.$on('$showCollections', function() {
        $scope.showCollections = true;
        $scope.showProperties = false;
        $scope.showActions = false;
        speechService.speak("Output: " + document.getElementById("object-collections").innerText);
      });

      $scope.$on('$showActions', function() {
        $scope.showActions = true;
        $scope.showProperties = false;
        $scope.showCollections = false;
        speechService.speak("Output: " + document.getElementById("object-actions").innerText);
      });

      $scope.$watch('title', function(oldValue, newValue) {
        if (oldValue !== newValue) {
          $timeout(function () {
            speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
          }, 0);
        }
      });
    }]);