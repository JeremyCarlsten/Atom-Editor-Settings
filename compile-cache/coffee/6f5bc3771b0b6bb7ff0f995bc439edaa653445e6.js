(function() {
  var dirname, extname, filename, firstDirname, secondDirname, sep, _ref;

  _ref = require('path'), dirname = _ref.dirname, filename = _ref.filename, extname = _ref.extname, sep = _ref.sep;

  firstDirname = function(filepath) {
    return filepath.split(sep)[0];
  };

  secondDirname = function(filepath) {
    return filepath.split(sep)[1];
  };

  module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      esteWatch: {
        options: {
          dirs: ['keymaps/**/*', 'lib/**/*', 'menus/**/*', 'spec/**/*', 'styles/**/*', 'node_modules/atom-refactor/**/*', 'vender/coffeescript/lib/**/*'],
          livereload: {
            enabled: false
          }
        },
        '*': function() {
          return ['apm:test'];
        }
      }
    });
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-este-watch');
    grunt.registerTask('apm:test', function() {
      var done;
      done = this.async();
      return grunt.util.spawn({
        cmd: 'apm',
        args: ['test']
      }, function(err, result, code) {
        if (err != null) {
          grunt.util.error(err);
        }
        if (result != null) {
          grunt.log.writeln(result);
        }
        return done();
      });
    });
    grunt.registerTask('cake:generate', function() {
      var done;
      done = this.async();
      return grunt.util.spawn({
        cmd: 'cake',
        args: ['generate']
      }, function(err, result, code) {
        if (err != null) {
          grunt.util.error(err);
        }
        if (result != null) {
          grunt.log.writeln(result);
        }
        return done();
      });
    });
    return grunt.registerTask('default', ['apm:test', 'esteWatch']);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvcmVmYWN0b3IvR3J1bnRmaWxlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRUFBQTs7QUFBQSxFQUFBLE9BQXNDLE9BQUEsQ0FBUSxNQUFSLENBQXRDLEVBQUUsZUFBQSxPQUFGLEVBQVcsZ0JBQUEsUUFBWCxFQUFxQixlQUFBLE9BQXJCLEVBQThCLFdBQUEsR0FBOUIsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxTQUFDLFFBQUQsR0FBQTtXQUNiLFFBQVEsQ0FBQyxLQUFULENBQWUsR0FBZixDQUFvQixDQUFBLENBQUEsRUFEUDtFQUFBLENBRGYsQ0FBQTs7QUFBQSxFQUdBLGFBQUEsR0FBZ0IsU0FBQyxRQUFELEdBQUE7V0FDZCxRQUFRLENBQUMsS0FBVCxDQUFlLEdBQWYsQ0FBb0IsQ0FBQSxDQUFBLEVBRE47RUFBQSxDQUhoQixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxLQUFELEdBQUE7QUFDZixJQUFBLEtBQUssQ0FBQyxVQUFOLENBRUU7QUFBQSxNQUFBLEdBQUEsRUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVgsQ0FBb0IsY0FBcEIsQ0FBTDtBQUFBLE1BRUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxPQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxDQUNKLGNBREksRUFFSixVQUZJLEVBR0osWUFISSxFQUlKLFdBSkksRUFLSixhQUxJLEVBTUosaUNBTkksRUFPSiw4QkFQSSxDQUFOO0FBQUEsVUFTQSxVQUFBLEVBQ0U7QUFBQSxZQUFBLE9BQUEsRUFBUyxLQUFUO1dBVkY7U0FERjtBQUFBLFFBWUEsR0FBQSxFQUFLLFNBQUEsR0FBQTtpQkFDSCxDQUFFLFVBQUYsRUFERztRQUFBLENBWkw7T0FIRjtLQUZGLENBQUEsQ0FBQTtBQUFBLElBb0JBLEtBQUssQ0FBQyxZQUFOLENBQW1CLGNBQW5CLENBcEJBLENBQUE7QUFBQSxJQXFCQSxLQUFLLENBQUMsWUFBTixDQUFtQixrQkFBbkIsQ0FyQkEsQ0FBQTtBQUFBLElBdUJBLEtBQUssQ0FBQyxZQUFOLENBQW1CLFVBQW5CLEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsS0FBRCxDQUFBLENBQVAsQ0FBQTthQUNBLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBWCxDQUNFO0FBQUEsUUFBQSxHQUFBLEVBQUssS0FBTDtBQUFBLFFBQ0EsSUFBQSxFQUFNLENBQUUsTUFBRixDQUROO09BREYsRUFHRSxTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsSUFBZCxHQUFBO0FBQ0EsUUFBQSxJQUFHLFdBQUg7QUFDRSxVQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBWCxDQUFpQixHQUFqQixDQUFBLENBREY7U0FBQTtBQUVBLFFBQUEsSUFBRyxjQUFIO0FBQ0UsVUFBQSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQVYsQ0FBa0IsTUFBbEIsQ0FBQSxDQURGO1NBRkE7ZUFJQSxJQUFBLENBQUEsRUFMQTtNQUFBLENBSEYsRUFGNkI7SUFBQSxDQUEvQixDQXZCQSxDQUFBO0FBQUEsSUFtQ0EsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsZUFBbkIsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBUCxDQUFBO2FBQ0EsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFYLENBQ0U7QUFBQSxRQUFBLEdBQUEsRUFBSyxNQUFMO0FBQUEsUUFDQSxJQUFBLEVBQU0sQ0FBRSxVQUFGLENBRE47T0FERixFQUdFLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLEdBQUE7QUFDQSxRQUFBLElBQUcsV0FBSDtBQUNFLFVBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFYLENBQWlCLEdBQWpCLENBQUEsQ0FERjtTQUFBO0FBRUEsUUFBQSxJQUFHLGNBQUg7QUFDRSxVQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBVixDQUFrQixNQUFsQixDQUFBLENBREY7U0FGQTtlQUlBLElBQUEsQ0FBQSxFQUxBO01BQUEsQ0FIRixFQUZrQztJQUFBLENBQXBDLENBbkNBLENBQUE7V0ErQ0EsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsU0FBbkIsRUFBOEIsQ0FDNUIsVUFENEIsRUFFNUIsV0FGNEIsQ0FBOUIsRUFoRGU7RUFBQSxDQU5qQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/jeremycarlsten/.atom/packages/refactor/Gruntfile.coffee
