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

  var writeFile = function(fileName, text) {
    var deferred = $q.defer();
    fs.writeFile(path + fileName, text, function(err) {
      if (err) deferred.reject(err.toString());

      deferred.resolve('success');
    });

    return deferred.promise;
  }

  var appendFile = function(fileName, text) {
    var deferred = $q.defer();
    fs.appendFile(path + fileName, text, function(err) {
      if (err) deferred.reject(err.toString());

      deferred.resolve('success');
    });

    return deferred.promise;
  }


  return {
    readFile: readFile,
    writeFile: writeFile,
    appendFile: appendFile
  }
});
