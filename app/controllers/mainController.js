// contain main controller variables and functions
String.prototype.clean = function() {
  //return this.replace(/^\n+|\n+$/g, '');
  return this.replace(/\n$/gm, '');
};

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
      self.recipes = [];
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] != '') {
          self.recipes.push(temp[i]);
        }
      }
      console.log(self.recipes);
    }, function(reason) {
      console.log(reason);
    });
  }

  // used to retrive whole recipe
  self.getRecipe = function(recipe) {
    var temp = recipe.replace('\n', '').trim(0, -1) + '.txt';
    fileReader.readFile(temp).then(function(res) {
      var temp = res.toString().split('\n');
      self.recipe = {
        name: recipe,
        ingridients: []
      };
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] != '') {
          self.recipe.ingridients.push(temp[i]);
        }
      }
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
          temp += self.ingridients[i].name + ' ' + self.ingridients[i].value + '\n';
        }
      }

      fileReader.writeFile(self.title + '.txt', temp).then(function(res) {
        console.log(res);
        getRecipesTitles();
        self.showRecipe = true;
      });
    });
  }

  self.removeRecipe = function(fileName) {
    fileReader.removeFile(fileName + '.txt').then(function(res) {
      fileReader.readFile('index.txt').then(function(data) {
        var temp = data.toString();
        temp = temp.replace(fileName, '');

        temp = temp.clean();
        fileReader.writeFile('index.txt', temp).then(function(result) {
          getRecipesTitles();
        }, function(reason) {
          console.log(reason);
        });
      }, function(reason) {
        console.log(reason);
      });
    }, function(reason) {
      console.log(reason);
    });
  }

  // MAIN
  getRecipesTitles();
});
