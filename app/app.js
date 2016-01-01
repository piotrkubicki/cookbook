// combine all aplication controllers
angular.module('app', ['mainScreenService'])

.controller('mainController', function(mainScreen) {
  var self = this;

  mainScreen.buildMainScreen();
});
