// contain main controller variables and functions
angular.module('main', ['routes', 'fileService', 'ngAnimate'])

.controller('mainController', function(fileReader) {
  var self = this;
  self.recipes = [];
  self.showRecipe = true;
  self.ingridients = [];
  self.title;
  // used to retrive all recipes titles from index.txt file
  var getRecipesTitles = function() {
    // get recipes titles
    fileReader.readFile('index.txt').then(function(res) {
      var temp = res.toString().split('\n');
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] != '') {
          self.recipes.push(temp[i]);
        }
      }

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
    self.ingridients = [];
    self.title = '';
    self.showRecipe = !self.showRecipe;
  }

  self.addIngridient = function() {
    self.ingridients.push({
      name: '',
      value: ''
    });
  }

  self.removeIngridient = function(item) {
    self.ingridients.splice(item, 1);
  }

  self.saveRecipe = function() {
    if (self.title === '') {
      self.showRecipe = true;
      return;
    }

    fileReader.appendFile('index.txt', '\n' + self.title).then(function(res) {
      var temp = '';
      for (var i = 0; i < self.ingridients.length; i++) {
        if (self.ingridients[i].name != '' && self.ingridients[i].value != ''){
          temp += self.ingridients[i].name + self.ingridients[i].value + '\n';
        }
      }

      fileReader.writeFile(self.title + '.txt', temp).then(function(res) {
        console.log(res);
        getRecipesTitles();
        self.showRecipe = true;
      });
    });
  }

  // MAIN
  getRecipesTitles();
});
