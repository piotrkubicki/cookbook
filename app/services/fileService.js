const fs = require('fs');
const path = 'app/assets/recipes/';

angular.module('fileService', [])

.service('fileReader', function($q) {

  var readFile = function(fileName) {
    var deferred = $q.defer();
    var file = fs.readFile(path + fileName, function(err, res) {
      if (err) deferred.reject(err);

      deferred.resolve(res);
    });
    return deferred.promise;
  }

  return {
    readFile: readFile
  }
});
