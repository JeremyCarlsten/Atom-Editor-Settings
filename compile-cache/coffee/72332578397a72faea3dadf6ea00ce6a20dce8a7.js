(function() {
  var cache, fibonacci, index, _i;

  cache = [0, 1];

  fibonacci = function(n) {
    if (cache[n] != null) {
      return cache[n];
    }
    return cache[n] = fibonacci(n - 1) + fibonacci(n - 2);
  };

  for (index = _i = 0; _i <= 10; index = ++_i) {
    console.log(index, fibonacci(index));
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvY29mZmVlLXJlZmFjdG9yL3NwZWMvZml4dHVyZXMvZmlib25hY2NpLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxDQUFFLENBQUYsRUFBSyxDQUFMLENBQVIsQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxTQUFDLENBQUQsR0FBQTtBQUNWLElBQUEsSUFBbUIsZ0JBQW5CO0FBQUEsYUFBTyxLQUFNLENBQUEsQ0FBQSxDQUFiLENBQUE7S0FBQTtXQUNBLEtBQU0sQ0FBQSxDQUFBLENBQU4sR0FBVyxTQUFBLENBQVUsQ0FBQSxHQUFJLENBQWQsQ0FBQSxHQUFtQixTQUFBLENBQVUsQ0FBQSxHQUFJLENBQWQsRUFGcEI7RUFBQSxDQURaLENBQUE7O0FBSUEsT0FBYSxzQ0FBYixHQUFBO0FBQ0UsSUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosRUFBbUIsU0FBQSxDQUFVLEtBQVYsQ0FBbkIsQ0FBQSxDQURGO0FBQUEsR0FKQTtBQUFBIgp9

//# sourceURL=/home/jeremycarlsten/.atom/packages/coffee-refactor/spec/fixtures/fibonacci.coffee
