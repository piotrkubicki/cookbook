// contain main controller variables and functions
String.prototype.clean = function() {
  //return this.replace(/^\n+|\n+$/g, '');
  return this.replace(/\n$/gm, '');
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

angular.module('main', ['routes', 'fileService', 'ngAnimate', 'ngMaterial'])

.controller('mainController', function(fileReader, $mdDialog) {
  var self = this;
  var oldRecipe = {}; // used to store recipe name when updating
  self.recipe = {};
  self.showRecipe = true;
  self.showUpdateRecipe = false;
  self.recipes = [];

  // used to retrive all recipes titles from index.txt file
  var getRecipesTitles = function() {
    // get recipes titles
    fileReader.readFile('recipes.json').then(function(res) {
      if (res.toString() == '') return;
      self.recipes = JSON.parse(res);
    }, function(reason) {
      errorDialog('Error', 'index.txt not found', 'error label', 'OK');
    });
  }

  // used to retrive whole recipe
  self.getRecipe = function(recipe) {
    self.recipe = self.recipes[recipe];
  }

  self.addRecipe = function() {
    self.showRecipe = false;

    self.recipe = {
      name: '',
      ingridients: []
    };
  }

  self.changeRecipe = function() {
    self.showUpdateRecipe = true;
    self.showRecipe = false;
    oldRecipe = self.recipe;
  }

  self.addIngridient = function() {
    self.recipe.ingridients.push({
      name: '',
      value: ''
    });
  }

  self.removeIngridient = function(item) {
    self.recipe.ingridients.splice(item, 1);
  }

  self.saveRecipe = function() {
    if (self.recipe.name === '') {  // don't save if not title given
      errorDialog('Title required', 'Title field cannot be empty', 'error', 'OK');
      return;
    }

    if (self.recipe.ingridients.length == 0) {
      /*var confirm = $mdDialog.confirm()
        .title('No ingridients added')
        .textContent('You are going to save recipe without any ingridient added.\nWant to continue?')
        .ariaLabel('confirmLbl')
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function(res) {

      }, function(reason) {
        console.log(reason);
        return;
      });*/
      errorDialog('No ingridients added', 'Recipe must have at least one ingridient!', 'error', 'OK');
      return;
    }

    for (var i = 0; i < self.recipes.length; i++) {
      if (self.recipe.name == self.recipes[i].name) {
        var errorMsg = 'Recipe ' + self.recipe.name + ' already exists!\nPlease choose different name before continue.'
        errorDialog('Recipe exists', errorMsg, 'error', 'OK');
        return;
      }
    }

    self.recipes.push(self.recipe); // add recipe to recipes array


    var result = angular.toJson(self.recipes, 2); // change JSON into string

    fileReader.writeFile('recipes.json', result).then(function(res) {
      console.log(res);
      self.showRecipe = true;
      self.showUpdateRecipe = false;
    }, function(reason) {
      errorDialog('Saving error', 'The recipe can not be saved', 'error', 'OK');
      console.log(reason);
    });
  }

  self.updateRecipe = function() {
    var index = self.recipes.indexOf(oldRecipe);
    self.recipes.splice(index, 1);
    self.saveRecipe();
  }

  self.removeRecipe = function(recipe) {
    var index = self.recipes.indexOf(recipe); // return index of recipe to remove
    self.recipes.splice(index, 1);

    var result = angular.toJson(self.recipes, 2); // change JSON into string

    fileReader.writeFile('recipes.json', result).then(function(res) {
      self.recipe = {};
      console.log(res);
    }, function(reason) {
      errorDialog('Saving error', 'The recipe can not be saved', 'error', 'OK');
      console.log(reason);
    });
  }

  // display error dialog
  var errorDialog = function(errorTile, errorMessage, errorLabel, buttonMsg) {
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title(errorTile)
        .textContent(errorMessage)
        .ariaLabel(errorLabel)
        .ok(buttonMsg)
    );
  }

  // MAIN
  getRecipesTitles();
});
