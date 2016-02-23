(function() {
  var spawn;

  spawn = require('child_process').spawn;

  module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      esteWatch: {
        options: {
          dirs: ['keymaps/**/*', 'lib/**/*', 'menus/**/*', 'spec/**/*', 'styles/**/*', 'node_modules/atom-refactor/**/*'],
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
    return grunt.registerTask('default', ['apm:test', 'esteWatch']);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvanMtcmVmYWN0b3IvR3J1bnRmaWxlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxLQUFBOztBQUFBLEVBQUUsUUFBVSxPQUFBLENBQVEsZUFBUixFQUFWLEtBQUYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsS0FBRCxHQUFBO0FBQ2YsSUFBQSxLQUFLLENBQUMsVUFBTixDQUVFO0FBQUEsTUFBQSxHQUFBLEVBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFYLENBQW9CLGNBQXBCLENBQUw7QUFBQSxNQUVBLFNBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sQ0FDSixjQURJLEVBRUosVUFGSSxFQUdKLFlBSEksRUFJSixXQUpJLEVBS0osYUFMSSxFQU1KLGlDQU5JLENBQU47QUFBQSxVQVFBLFVBQUEsRUFDRTtBQUFBLFlBQUEsT0FBQSxFQUFTLEtBQVQ7V0FURjtTQURGO0FBQUEsUUFXQSxHQUFBLEVBQUssU0FBQSxHQUFBO2lCQUNILENBQUUsVUFBRixFQURHO1FBQUEsQ0FYTDtPQUhGO0tBRkYsQ0FBQSxDQUFBO0FBQUEsSUFtQkEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsY0FBbkIsQ0FuQkEsQ0FBQTtBQUFBLElBb0JBLEtBQUssQ0FBQyxZQUFOLENBQW1CLGtCQUFuQixDQXBCQSxDQUFBO0FBQUEsSUFzQkEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsVUFBbkIsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBUCxDQUFBO2FBQ0EsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFYLENBQ0U7QUFBQSxRQUFBLEdBQUEsRUFBSyxLQUFMO0FBQUEsUUFDQSxJQUFBLEVBQU0sQ0FBRSxNQUFGLENBRE47T0FERixFQUdFLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLEdBQUE7QUFDQSxRQUFBLElBQUcsV0FBSDtBQUNFLFVBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFYLENBQWlCLEdBQWpCLENBQUEsQ0FERjtTQUFBO0FBRUEsUUFBQSxJQUFHLGNBQUg7QUFDRSxVQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBVixDQUFrQixNQUFsQixDQUFBLENBREY7U0FGQTtlQUlBLElBQUEsQ0FBQSxFQUxBO01BQUEsQ0FIRixFQUY2QjtJQUFBLENBQS9CLENBdEJBLENBQUE7V0FrQ0EsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsU0FBbkIsRUFBOEIsQ0FDNUIsVUFENEIsRUFFNUIsV0FGNEIsQ0FBOUIsRUFuQ2U7RUFBQSxDQUZqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/jeremycarlsten/.atom/packages/js-refactor/Gruntfile.coffee
