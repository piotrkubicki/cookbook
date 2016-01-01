// contain main controller variables and functions
angular.module('main', ['routes', 'fileService'])

.controller('mainController', function(fileReader) {
  var self = this;
  // get recipes titles
  fileReader.readFile('index.txt').then(function(res){
    self.recipes = res.toString().split('\n');;
  });

});
