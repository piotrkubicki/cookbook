// contain main controller variables and functions
String.prototype.clean = function() {
  //return this.replace(/^\n+|\n+$/g, '');
  return this.replace(/\n$/gm, '');
};

angular.module('main', ['routes', 'fileService', 'ngAnimate', 'ngMaterial'])

.controller('mainController', function(fileReader, $mdDialog) {
  var self = this;
  self.recipes = [];
  self.showRecipe = true;
  self.showUpdateRecipe = false;
  self.recipe = {
    ingridients: []
  }

  self.title;
  // used to retrive all recipes titles from index.txt file
  var getRecipesTitles = function() {
    // get recipes titles
    fileReader.readFile('index.txt').then(function(res) {
      var temp = res.toString().split('\n');
      self.recipes = [];
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] != '') {
          self.recipes.push(temp[i]);
        }
      }
      console.log(self.recipes);
    }, function(reason) {
      errorDialog('Error', 'index.txt not found', 'error label', 'OK');
    });
  }

  // used to retrive whole recipe
  self.getRecipe = function(recipe) {
    var temp = recipe.replace('\n', '').trim(0, -1) + '.txt';
    fileReader.readFile(temp).then(function(res) {
      var temp = res.toString().split(' ');

      self.recipe = {
        name: recipe,
        ingridients: []
      };
      for (var i = 0; i < temp.length; i += 2) {
        if (temp[i] != '') {
          var ingridient = {
            name: temp[i],
            value: temp[i + 1]
          }
          self.recipe.ingridients.push(ingridient);
        }
      }
    }, function(reason) {
      errorDialog('Error', reason, 'error', 'OK');
    });
  }

  self.addRecipe = function() {
    self.ingridients = [];
    self.title = '';
    self.showRecipe = !self.showRecipe;
  }

  self.changeRecipe = function() {
    self.showUpdateRecipe = !self.showUpdateRecipe;
    self.addRecipe();
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
    if (self.title === '') {
      self.showRecipe = true;
      return;
    }

    fileReader.appendFile('index.txt', '\n' + self.title).then(function(res) {
      var temp = '';
      for (var i = 0; i < self.recipe.ingridients.length; i++) {
        if (self.recipe.ingridients[i].name != '' && self.recipe.ingridients[i].value != ''){
          temp += self.recipe.ingridients[i].name + ' ' + self.recipe.ingridients[i].value + ' ';
        }
      }

      fileReader.writeFile(self.title + '.txt', temp).then(function(res) {
        console.log(res);
        getRecipesTitles();
        self.showRecipe = true;
      }, function(reason) {
        errorDialog('Error', reason, 'error', 'OK');
      });
    }, function(reason) {
      errorDialog('Error', reason, 'error', 'OK');
    });
  }

  self.updateRecipe = function() {
    if (self.recipe.name === '') {
      self.showRecipe = true;
      return;
    }

    var temp = '';
    for (var i = 0; i < self.recipe.ingridients.length; i++) {
      if (self.recipe.ingridients[i].name != '' && self.recipe.ingridients[i].value != ''){
        temp += self.recipe.ingridients[i].name + ' ' + self.recipe.ingridients[i].value + ' ';
      }
    }

    fileReader.writeFile(self.recipe.name + '.txt', temp).then(function(res) {
      getRecipesTitles();
      self.changeRecipe();
    }, function(reason) {
      errorDialog('Error', reason, 'error', 'OK');
    });
  }

  self.removeRecipe = function(fileName) {
    fileReader.removeFile(fileName + '.txt').then(function(res) {
      fileReader.readFile('index.txt').then(function(data) {
        var temp = data.toString();
        temp = temp.replace(fileName, '');

        temp = temp.clean();
        fileReader.writeFile('index.txt', temp).then(function(result) {
          self.recipe = [];
          getRecipesTitles();
        }, function(reason) {
          errorDialog('Error', reason, 'error', 'OK');
        });
      }, function(reason) {
        errorDialog('Error', reason, 'error', 'OK');
      });
    }, function(reason) {
      errorDialog('Error', reason, 'error', 'OK');
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
