(function() {
  var Ripper, packageManager,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Ripper = require('./ripper');

  packageManager = atom.packages;

  module.exports = {
    config: {
      'maxWorkChars': {
        title: 'disable in large files (chars)',
        type: 'integer',
        "default": 20000,
        order: 1
      }
    },
    activate: function() {
      if (__indexOf.call(packageManager.getAvailablePackageNames(), 'refactor') >= 0 && !packageManager.isPackageDisabled('refactor')) {
        return;
      }
      return atom.notifications.addWarning("Requires related package installation", {
        detail: "'coffee-refactor' package requires 'refactor' package.\nYou can install and activate packages using the preference pane."
      });
    },
    deactivate: function() {},
    serialize: function() {},
    Ripper: Ripper
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvY29mZmVlLXJlZmFjdG9yL2xpYi9jb2ZmZWVfcmVmYWN0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ1ksaUJBQW1CLEtBQTdCLFFBREYsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLE1BQUEsRUFDSTtBQUFBLE1BQUEsY0FBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQWMsZ0NBQWQ7QUFBQSxRQUNBLElBQUEsRUFBYyxTQURkO0FBQUEsUUFFQSxTQUFBLEVBQWMsS0FGZDtBQUFBLFFBR0EsS0FBQSxFQUFjLENBSGQ7T0FESjtLQURKO0FBQUEsSUFPQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFVLGVBQWMsY0FBYyxDQUFDLHdCQUFmLENBQUEsQ0FBZCxFQUFBLFVBQUEsTUFBQSxJQUNOLENBQUEsY0FBZSxDQUFDLGlCQUFmLENBQWlDLFVBQWpDLENBREw7QUFBQSxjQUFBLENBQUE7T0FBQTthQUdBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsdUNBQTlCLEVBQ0k7QUFBQSxRQUFBLE1BQUEsRUFBUSwwSEFBUjtPQURKLEVBSk07SUFBQSxDQVBWO0FBQUEsSUFnQkEsVUFBQSxFQUFZLFNBQUEsR0FBQSxDQWhCWjtBQUFBLElBaUJBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0FqQlg7QUFBQSxJQWtCQSxNQUFBLEVBQVEsTUFsQlI7R0FMSixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/jeremycarlsten/.atom/packages/coffee-refactor/lib/coffee_refactor.coffee
