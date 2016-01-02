// contain main controller variables and functions
angular.module('main', ['routes', 'fileService'])

.controller('mainController', function(fileReader) {
  var self = this;
  self.showRecipe = true;
  // used to retrive all recipes titles from index.txt file
  var getRecipesTitles = function() {
    // get recipes titles
    fileReader.readFile('index.txt').then(function(res) {
      self.recipes = res.toString().split('\n');
    }, function(reason) {
      console.log(reason);
    });
  }

  // used to retrive whole recipe
  self.getRecipe = function(recipe) {
    var recipe = recipe.replace('\n', '').trim(0, -1) + '.txt';

    console.log(recipe[recipe.length - 1]);
    fileReader.readFile(recipe).then(function(res) {
      self.recipe = res.toString();
    }, function(reason) {
      console.log(reason);
    });
  }

  self.addRecipe = function() {
    self.showRecipe = !self.showRecipe
  }

  // MAIN
  getRecipesTitles();
});
