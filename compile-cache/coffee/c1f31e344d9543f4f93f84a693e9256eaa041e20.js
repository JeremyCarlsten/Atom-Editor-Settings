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
          dirs: ['keymaps/**/*', 'lib/**/*', 'menus/**/*', 'spec/**/*', 'stylesheets/**/*', 'node_modules/atom-refactor/**/*', 'vender/coffeescript/lib/**/*'],
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvY29mZmVlLXJlZmFjdG9yL0dydW50ZmlsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0VBQUE7O0FBQUEsRUFBQSxPQUFzQyxPQUFBLENBQVEsTUFBUixDQUF0QyxFQUFFLGVBQUEsT0FBRixFQUFXLGdCQUFBLFFBQVgsRUFBcUIsZUFBQSxPQUFyQixFQUE4QixXQUFBLEdBQTlCLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsU0FBQyxRQUFELEdBQUE7V0FDYixRQUFRLENBQUMsS0FBVCxDQUFlLEdBQWYsQ0FBb0IsQ0FBQSxDQUFBLEVBRFA7RUFBQSxDQURmLENBQUE7O0FBQUEsRUFHQSxhQUFBLEdBQWdCLFNBQUMsUUFBRCxHQUFBO1dBQ2QsUUFBUSxDQUFDLEtBQVQsQ0FBZSxHQUFmLENBQW9CLENBQUEsQ0FBQSxFQUROO0VBQUEsQ0FIaEIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsS0FBRCxHQUFBO0FBQ2YsSUFBQSxLQUFLLENBQUMsVUFBTixDQUVFO0FBQUEsTUFBQSxHQUFBLEVBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFYLENBQW9CLGNBQXBCLENBQUw7QUFBQSxNQUVBLFNBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sQ0FDSixjQURJLEVBRUosVUFGSSxFQUdKLFlBSEksRUFJSixXQUpJLEVBS0osa0JBTEksRUFNSixpQ0FOSSxFQU9KLDhCQVBJLENBQU47QUFBQSxVQVNBLFVBQUEsRUFDRTtBQUFBLFlBQUEsT0FBQSxFQUFTLEtBQVQ7V0FWRjtTQURGO0FBQUEsUUFZQSxHQUFBLEVBQUssU0FBQSxHQUFBO2lCQUNILENBQUUsVUFBRixFQURHO1FBQUEsQ0FaTDtPQUhGO0tBRkYsQ0FBQSxDQUFBO0FBQUEsSUFvQkEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsY0FBbkIsQ0FwQkEsQ0FBQTtBQUFBLElBcUJBLEtBQUssQ0FBQyxZQUFOLENBQW1CLGtCQUFuQixDQXJCQSxDQUFBO0FBQUEsSUF1QkEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsVUFBbkIsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBUCxDQUFBO2FBQ0EsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFYLENBQ0U7QUFBQSxRQUFBLEdBQUEsRUFBSyxLQUFMO0FBQUEsUUFDQSxJQUFBLEVBQU0sQ0FBRSxNQUFGLENBRE47T0FERixFQUdFLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLEdBQUE7QUFDQSxRQUFBLElBQUcsV0FBSDtBQUNFLFVBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFYLENBQWlCLEdBQWpCLENBQUEsQ0FERjtTQUFBO0FBRUEsUUFBQSxJQUFHLGNBQUg7QUFDRSxVQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBVixDQUFrQixNQUFsQixDQUFBLENBREY7U0FGQTtlQUlBLElBQUEsQ0FBQSxFQUxBO01BQUEsQ0FIRixFQUY2QjtJQUFBLENBQS9CLENBdkJBLENBQUE7QUFBQSxJQW1DQSxLQUFLLENBQUMsWUFBTixDQUFtQixlQUFuQixFQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFQLENBQUE7YUFDQSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQVgsQ0FDRTtBQUFBLFFBQUEsR0FBQSxFQUFLLE1BQUw7QUFBQSxRQUNBLElBQUEsRUFBTSxDQUFFLFVBQUYsQ0FETjtPQURGLEVBR0UsU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLElBQWQsR0FBQTtBQUNBLFFBQUEsSUFBRyxXQUFIO0FBQ0UsVUFBQSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQVgsQ0FBaUIsR0FBakIsQ0FBQSxDQURGO1NBQUE7QUFFQSxRQUFBLElBQUcsY0FBSDtBQUNFLFVBQUEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFWLENBQWtCLE1BQWxCLENBQUEsQ0FERjtTQUZBO2VBSUEsSUFBQSxDQUFBLEVBTEE7TUFBQSxDQUhGLEVBRmtDO0lBQUEsQ0FBcEMsQ0FuQ0EsQ0FBQTtXQStDQSxLQUFLLENBQUMsWUFBTixDQUFtQixTQUFuQixFQUE4QixDQUM1QixVQUQ0QixFQUU1QixXQUY0QixDQUE5QixFQWhEZTtFQUFBLENBTmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/jeremycarlsten/.atom/packages/coffee-refactor/Gruntfile.coffee
