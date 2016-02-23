(function() {
  var EventEmitter2, ModuleManager, config, isFunction, packageManager, satisfies, workspace,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  satisfies = require('semver').satisfies;

  EventEmitter2 = require('eventemitter2').EventEmitter2;

  workspace = atom.workspace, config = atom.config, packageManager = atom.packages;

  isFunction = function(func) {
    return (typeof func) === 'function';
  };

  module.exports = ModuleManager = (function(_super) {
    __extends(ModuleManager, _super);

    ModuleManager.prototype.modules = {};

    ModuleManager.prototype.version = '0.0.0';

    function ModuleManager() {
      this.update = __bind(this.update, this);
      ModuleManager.__super__.constructor.apply(this, arguments);
      this.setMaxListeners(0);
      this.version = require('../package.json').version;
      this.update();
    }

    ModuleManager.prototype.destruct = function() {
      return delete this.modules;
    };

    ModuleManager.prototype.update = function() {
      var engines, metaData, name, requiredVersion, _i, _len, _ref, _results;
      this.modules = {};
      _ref = packageManager.getAvailablePackageMetadata();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        metaData = _ref[_i];
        name = metaData.name, engines = metaData.engines;
        if (!(!packageManager.isPackageDisabled(name) && ((requiredVersion = engines != null ? engines.refactor : void 0) != null) && satisfies(this.version, requiredVersion))) {
          continue;
        }
        _results.push(this.activate(name));
      }
      return _results;
    };

    ModuleManager.prototype.activate = function(name) {
      return packageManager.activatePackage(name).then((function(_this) {
        return function(pkg) {
          var Ripper, module, scopeName, _i, _len, _ref;
          Ripper = (module = pkg.mainModule).Ripper;
          if (!((Ripper != null) && Array.isArray(Ripper.scopeNames) && isFunction(Ripper.prototype.parse) && isFunction(Ripper.prototype.find))) {
            console.error("'" + name + "' should implement Ripper.scopeNames, Ripper.parse() and Ripper.find()");
            return;
          }
          _ref = Ripper.scopeNames;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            scopeName = _ref[_i];
            _this.modules[scopeName] = module;
          }
          return _this.emit('changed');
        };
      })(this));
    };

    ModuleManager.prototype.getModule = function(sourceName) {
      return this.modules[sourceName];
    };

    return ModuleManager;

  })(EventEmitter2);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvcmVmYWN0b3IvbGliL21vZHVsZV9tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFFLFlBQWMsT0FBQSxDQUFRLFFBQVIsRUFBZCxTQUFGLENBQUE7O0FBQUEsRUFDRSxnQkFBa0IsT0FBQSxDQUFRLGVBQVIsRUFBbEIsYUFERixDQUFBOztBQUFBLEVBRUUsaUJBQUEsU0FBRixFQUFhLGNBQUEsTUFBYixFQUErQixzQkFBVixRQUZyQixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO1dBQVUsQ0FBQyxNQUFBLENBQUEsSUFBRCxDQUFBLEtBQWlCLFdBQTNCO0VBQUEsQ0FKYixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLG9DQUFBLENBQUE7O0FBQUEsNEJBQUEsT0FBQSxHQUFTLEVBQVQsQ0FBQTs7QUFBQSw0QkFDQSxPQUFBLEdBQVMsT0FEVCxDQUFBOztBQUdhLElBQUEsdUJBQUEsR0FBQTtBQUNYLDZDQUFBLENBQUE7QUFBQSxNQUFBLGdEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBRCxDQUFpQixDQUFqQixDQURBLENBQUE7QUFBQSxNQUlFLElBQUMsQ0FBQSxVQUFZLE9BQUEsQ0FBUSxpQkFBUixFQUFaLE9BSkgsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQU5BLENBRFc7SUFBQSxDQUhiOztBQUFBLDRCQVlBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFJUixNQUFBLENBQUEsSUFBUSxDQUFBLFFBSkE7SUFBQSxDQVpWLENBQUE7O0FBQUEsNEJBa0JBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLGtFQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBQVgsQ0FBQTtBQUVBO0FBQUE7V0FBQSwyQ0FBQTs0QkFBQTtBQUVFLFFBQUUsZ0JBQUEsSUFBRixFQUFRLG1CQUFBLE9BQVIsQ0FBQTtBQUNBLFFBQUEsSUFBQSxDQUFBLENBQWdCLENBQUEsY0FBZSxDQUFDLGlCQUFmLENBQWlDLElBQWpDLENBQUQsSUFDQSx5RUFEQSxJQUVBLFNBQUEsQ0FBVSxJQUFDLENBQUEsT0FBWCxFQUFvQixlQUFwQixDQUZoQixDQUFBO0FBQUEsbUJBQUE7U0FEQTtBQUFBLHNCQUlBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUpBLENBRkY7QUFBQTtzQkFITTtJQUFBLENBbEJSLENBQUE7O0FBQUEsNEJBNkJBLFFBQUEsR0FBVSxTQUFDLElBQUQsR0FBQTthQUNSLGNBQ0EsQ0FBQyxlQURELENBQ2lCLElBRGpCLENBRUEsQ0FBQyxJQUZELENBRU0sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsR0FBRCxHQUFBO0FBRUosY0FBQSx5Q0FBQTtBQUFBLFVBQUUsU0FBVyxDQUFBLE1BQUEsR0FBUyxHQUFHLENBQUMsVUFBYixFQUFYLE1BQUYsQ0FBQTtBQUNBLFVBQUEsSUFBQSxDQUFBLENBQU8sZ0JBQUEsSUFDQSxLQUFLLENBQUMsT0FBTixDQUFjLE1BQU0sQ0FBQyxVQUFyQixDQURBLElBRUEsVUFBQSxDQUFXLE1BQU0sQ0FBQSxTQUFFLENBQUEsS0FBbkIsQ0FGQSxJQUdBLFVBQUEsQ0FBVyxNQUFNLENBQUEsU0FBRSxDQUFBLElBQW5CLENBSFAsQ0FBQTtBQUlFLFlBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBZSxHQUFBLEdBQUcsSUFBSCxHQUFRLHdFQUF2QixDQUFBLENBQUE7QUFDQSxrQkFBQSxDQUxGO1dBREE7QUFRQTtBQUFBLGVBQUEsMkNBQUE7aUNBQUE7QUFDRSxZQUFBLEtBQUMsQ0FBQSxPQUFRLENBQUEsU0FBQSxDQUFULEdBQXNCLE1BQXRCLENBREY7QUFBQSxXQVJBO2lCQVdBLEtBQUMsQ0FBQSxJQUFELENBQU0sU0FBTixFQWJJO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGTixFQURRO0lBQUEsQ0E3QlYsQ0FBQTs7QUFBQSw0QkErQ0EsU0FBQSxHQUFXLFNBQUMsVUFBRCxHQUFBO2FBQ1QsSUFBQyxDQUFBLE9BQVEsQ0FBQSxVQUFBLEVBREE7SUFBQSxDQS9DWCxDQUFBOzt5QkFBQTs7S0FGMEIsY0FQNUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/jeremycarlsten/.atom/packages/refactor/lib/module_manager.coffee
