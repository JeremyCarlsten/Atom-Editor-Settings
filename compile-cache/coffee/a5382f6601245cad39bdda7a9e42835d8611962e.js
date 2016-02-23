(function() {
  var Main, ModuleManager, Watcher, d, packageManager,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Watcher = require('./watcher');

  ModuleManager = require('./module_manager');

  packageManager = atom.packages;

  d = (require('debug'))('refactor');

  module.exports = new (Main = (function() {
    function Main() {
      this.onDone = __bind(this.onDone, this);
      this.onRename = __bind(this.onRename, this);
      this.onDestroyed = __bind(this.onDestroyed, this);
      this.onCreated = __bind(this.onCreated, this);
    }

    Main.prototype.renameCommand = 'refactor:rename';

    Main.prototype.doneCommand = 'refactor:done';

    Main.prototype.config = {
      highlightError: {
        type: 'boolean',
        "default": true
      },
      highlightReference: {
        type: 'boolean',
        "default": true
      }
    };


    /*
    Life cycle
     */

    Main.prototype.activate = function(state) {
      d('activate');
      this.moduleManager = new ModuleManager;
      this.watchers = [];
      atom.workspace.observeTextEditors(this.onCreated);
      atom.commands.add('atom-text-editor', this.renameCommand, this.onRename);
      return atom.commands.add('atom-text-editor', this.doneCommand, this.onDone);
    };

    Main.prototype.deactivate = function() {
      var watcher, _i, _len, _ref;
      this.moduleManager.destruct();
      delete this.moduleManager;
      _ref = this.watchers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watcher = _ref[_i];
        watcher.destruct();
      }
      delete this.watchers;
      atom.workspaceView.off(this.renameCommand, this.onRename);
      return atom.workspaceView.off(this.doneCommand, this.onDone);
    };

    Main.prototype.serialize = function() {};


    /*
    Events
     */

    Main.prototype.onCreated = function(editor) {
      var watcher;
      watcher = new Watcher(this.moduleManager, editor);
      watcher.on('destroyed', this.onDestroyed);
      return this.watchers.push(watcher);
    };

    Main.prototype.onDestroyed = function(watcher) {
      watcher.destruct();
      return this.watchers.splice(this.watchers.indexOf(watcher), 1);
    };

    Main.prototype.onRename = function(e) {
      var isExecuted, watcher, _i, _len, _ref;
      isExecuted = false;
      _ref = this.watchers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watcher = _ref[_i];
        isExecuted || (isExecuted = watcher.rename());
      }
      d('rename', isExecuted);
      if (isExecuted) {
        return;
      }
      return e.abortKeyBinding();
    };

    Main.prototype.onDone = function(e) {
      var isExecuted, watcher, _i, _len, _ref;
      isExecuted = false;
      _ref = this.watchers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watcher = _ref[_i];
        isExecuted || (isExecuted = watcher.done());
      }
      if (isExecuted) {
        return;
      }
      return e.abortKeyBinding();
    };

    return Main;

  })());

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvcmVmYWN0b3IvbGliL3JlZmFjdG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQ0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFWSxpQkFBbUIsS0FBN0IsUUFGRixDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLENBQUMsT0FBQSxDQUFRLE9BQVIsQ0FBRCxDQUFBLENBQWtCLFVBQWxCLENBSEosQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ0EsR0FBQSxDQUFBLENBQVU7Ozs7OztLQUVSOztBQUFBLG1CQUFBLGFBQUEsR0FBZSxpQkFBZixDQUFBOztBQUFBLG1CQUNBLFdBQUEsR0FBYSxlQURiLENBQUE7O0FBQUEsbUJBR0EsTUFBQSxHQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FKRjtLQUpGLENBQUE7O0FBWUE7QUFBQTs7T0FaQTs7QUFBQSxtQkFnQkEsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxDQUFBLENBQUUsVUFBRixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxhQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBRlosQ0FBQTtBQUFBLE1B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

//# sourceURL=/home/jeremycarlsten/.atom/packages/refactor/lib/refactor.coffee
