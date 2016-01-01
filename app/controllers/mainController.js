// contain main controller variables and functions
angular.module('mainScreenService', ['routes', 'fileService'])

.service('mainScreen', function(fileReader, $q) {

  var buildMenu = function() {
    // get recipes titles
    var deferred = $q.defer();
    fileReader.readFile('index.txt').then(function(res){
      recipes = res.toString().split('\n');
      deferred.resolve(recipes);
    });
    return deferred.promise;
  }

  var buildMainScreen = function() {
    buildMenu().then(function(res) {
      return res;
    })
  }

  return {
    buildMenu: buildMenu,
    buildMainScreen: buildMainScreen
  }

});
