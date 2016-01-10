// contain main controller variables and functions
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
  self.overlay = false;
  self.recipes = [];
  self.menu = [];
  self.shoppingList = [];
  self.recipeFilter;
  self.returnToRecipes = function() {
    self.tabIndex = 0;
  }
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
  self.getRecipe = function(recipeId, index) {
    self.recipe = self.recipes[recipeId];
    //console.log(recipeId);
    self.selectedIndex = index;
  }

  self.addRecipe = function() {
    self.showRecipe = !self.showRecipe;
    self.overlay = !self.overlay;

    self.recipe = {
      name: '',
      ingridients: []
    };
  }

  self.showOverlay = function(show) {
    if (show) {
      self.overlay = true;
    }
    else {
      self.overlay = false;
    }
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
      errorDialog('Recipe name required', 'Recipe name field cannot be empty', 'error', 'OK');
      return;
    }

    // capitalize first characters
    self.recipe._id = self.recipes.length;
    self.recipe.name = self.recipe.name.capitalize();
    for (var i = 0; i < self.recipe.ingridients.length;) { // increment only if not empty
      if (self.recipe.ingridients[i].name == '' || self.recipe.ingridients[i].value == '') {
        self.recipe.ingridients.splice(i, 1);
      }
      else {
        self.recipe.ingridients[i].name = self.recipe.ingridients[i].name.capitalize();
        i++;
      }
    }

    if (self.recipe.ingridients.length == 0 || (self.recipe.ingridients.length == 1 && self.recipe.ingridients[0].name == '')) {
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
      //console.log(res);
      self.showRecipe = true;
      self.showUpdateRecipe = false;
    }, function(reason) {
      errorDialog('Saving error', 'The recipe can not be saved', 'error', 'OK');
      console.log(reason);
    });

    self.showOverlay(false);
  }

  self.updateRecipe = function() {
    var index = self.recipes.indexOf(oldRecipe);
    self.recipes.splice(index, 1);
    self.saveRecipe();
  }

  self.removeRecipe = function(recipe) {
    var index = self.recipes.indexOf(recipe); // return index of recipe to remove
    self.recipes.splice(index, 1);

    // update recipe _id
    for (var i = index; i < self.recipes.length; i++) {
      self.recipes[i]._id = parseInt(self.recipes[i]._id) - 1;
    }

    var result = angular.toJson(self.recipes, 2); // change JSON into string

    fileReader.writeFile('recipes.json', result).then(function(res) {
      self.recipe = {};
      console.log(res);
    }, function(reason) {
      errorDialog('Saving error', 'The recipe can not be saved', 'error', 'OK');
      console.log(reason);
    });
  }

  self.addDiner = function() {
    self.menu.push(self.recipe);

    // check if ingridient exists
    for (var i = 0; i < self.recipe.ingridients.length; i++) {
      var exists = false; // true if ingridient already exists in shoppingList.values array
        for (var j = 0; j < self.shoppingList.length; j++) {
          if (self.shoppingList[j].name == self.recipe.ingridients[i].name) {
            exists = true;
            self.shoppingList[j].values.push(self.recipe.ingridients[i].value);
          }
        }
        if (!exists) { // add ingridient if name not duplacated in shoppingList array
          self.shoppingList.push({
            name: self.recipe.ingridients[i].name,
            values: [
              self.recipe.ingridients[i].value
            ]
          });
        }
    }
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
})

// theme
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('myTheme')
        .primaryPalette('light-green')
        .accentPalette('lime')
        .warnPalette('red');
    $mdThemingProvider.setDefaultTheme('myTheme');
});
