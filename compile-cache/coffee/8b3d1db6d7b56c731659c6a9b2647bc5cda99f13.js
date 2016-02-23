(function() {
  var CompositeDisposable, config, debounce, save, _;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('lodash');

  config = require('./config.coffee');

  debounce = 'atom-idle-autosave.debounce';

  save = function(editor) {
    if (editor.getPath()) {
      return editor.save();
    }
  };

  module.exports = {
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.debouncedSave = _.debounce(save, atom.config.get(debounce));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.subscriptions.add(editor.onDidChange(_this.debouncedSave.bind(_this, editor)));
        };
      })(this)));
      return this.subscriptions.add(atom.config.onDidChange(debounce, (function(_this) {
        return function() {
          _this.deactivate();
          return _this.activate();
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    config: config
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvYXRvbS1pZGxlLWF1dG9zYXZlL2xpYi9hdG9tLWlkbGUtYXV0b3NhdmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxpQkFBUixDQUZULENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsNkJBSlgsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxTQUFDLE1BQUQsR0FBQTtBQUNMLElBQUEsSUFBaUIsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFqQjthQUFBLE1BQU0sQ0FBQyxJQUFQLENBQUEsRUFBQTtLQURLO0VBQUEsQ0FOUCxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixDQUFDLENBQUMsUUFBRixDQUFXLElBQVgsRUFBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLFFBQWhCLENBQWpCLENBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFDbkQsS0FBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE1BQU0sQ0FBQyxXQUFQLENBQW1CLEtBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixLQUFwQixFQUEwQixNQUExQixDQUFuQixDQUFuQixFQURtRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQW5CLENBRkEsQ0FBQTthQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsUUFBeEIsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNuRCxVQUFBLEtBQUMsQ0FBQSxVQUFELENBQUEsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxRQUFELENBQUEsRUFGbUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFuQixFQU5RO0lBQUEsQ0FBVjtBQUFBLElBVUEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRFU7SUFBQSxDQVZaO0FBQUEsSUFhQSxNQUFBLEVBQVEsTUFiUjtHQVZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/jeremycarlsten/.atom/packages/atom-idle-autosave/lib/atom-idle-autosave.coffee
