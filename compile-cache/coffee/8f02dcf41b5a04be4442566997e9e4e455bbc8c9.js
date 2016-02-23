(function() {
  var EventEmitter2, Watcher, d,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter2 = require('eventemitter2').EventEmitter2;

  d = (require('debug'))('watcher');

  module.exports = Watcher = (function(_super) {
    __extends(Watcher, _super);

    function Watcher(moduleManager, editor) {
      this.moduleManager = moduleManager;
      this.editor = editor;
      this.onCursorMovedAfter = __bind(this.onCursorMovedAfter, this);
      this.onCursorMoved = __bind(this.onCursorMoved, this);
      this.onBufferChanged = __bind(this.onBufferChanged, this);
      this.abort = __bind(this.abort, this);
      this.createErrors = __bind(this.createErrors, this);
      this.onParseEnd = __bind(this.onParseEnd, this);
      this.parse = __bind(this.parse, this);
      this.verifyGrammar = __bind(this.verifyGrammar, this);
      this.onDestroyed = __bind(this.onDestroyed, this);
      this.destruct = __bind(this.destruct, this);
      Watcher.__super__.constructor.call(this);
      this.editor.onDidDestroy(this.onDestroyed);
      this.editor.onDidStopChanging(this.onBufferChanged);
      this.editor.onDidChangeCursorPosition(this.onCursorMoved);
      this.verifyGrammar();
      this.moduleManager.on('changed', this.verifyGrammar);
    }

    Watcher.prototype.destruct = function() {
      this.removeAllListeners();
      this.deactivate();
      this.moduleManager.off('changed', this.verifyGrammar);
      delete this.moduleManager;
      delete this.editor;
      return delete this.module;
    };

    Watcher.prototype.onDestroyed = function() {
      if (!this.eventDestroyed) {
        return;
      }
      return this.emit('destroyed', this);
    };


    /*
    Grammar valification process
    1. Detect grammar changed.
    2. Destroy instances and listeners.
    3. Exit process when the language plugin of the grammar can't be found.
    4. Create instances and listeners.
     */

    Watcher.prototype.verifyGrammar = function() {
      var module, scopeName;
      scopeName = this.editor.getGrammar().scopeName;
      module = this.moduleManager.getModule(scopeName);
      d('verify grammar', scopeName, module);
      if (module === this.module) {
        return;
      }
      this.deactivate();
      if (module == null) {
        return;
      }
      this.module = module;
      return this.activate();
    };

    Watcher.prototype.activate = function() {
      this.ripper = new this.module.Ripper();
      this.eventCursorMoved = true;
      this.eventDestroyed = true;
      this.eventBufferChanged = true;
      d('activate and parse');
      return this.parse();
    };

    Watcher.prototype.deactivate = function() {
      var _ref;
      this.cursorMoved = false;
      this.eventCursorMoved = false;
      this.eventDestroyed = false;
      this.eventBufferChanged = false;
      clearTimeout(this.bufferChangedTimeoutId);
      clearTimeout(this.cursorMovedTimeoutId);
      if ((_ref = this.ripper) != null) {
        _ref.destruct();
      }
      delete this.bufferChangedTimeoutId;
      delete this.cursorMovedTimeoutId;
      delete this.module;
      delete this.ripper;
      delete this.renamingCursor;
      return delete this.renamingMarkers;
    };


    /*
    Reference finder process
    1. Stop listening cursor move event and reset views.
    2. Parse.
    3. Show errors and exit process when compile error is thrown.
    4. Show references.
    5. Start listening cursor move event.
     */

    Watcher.prototype.parse = function() {
      var text;
      d('parse');
      this.eventCursorMoved = false;
      text = this.editor.buffer.getText();
      if (text !== this.cachedText) {
        this.destroyReferences();
        this.destroyErrors();
        this.cachedText = text;
        this.ripper.parse(text, this.onParseEnd);
      } else {
        this.onParseEnd();
      }
      return this.eventCursorMoved = true;
    };

    Watcher.prototype.onParseEnd = function(errors) {
      if (errors != null) {
        return this.createErrors(errors);
      } else {
        return this.createReferences();
      }
    };

    Watcher.prototype.destroyErrors = function() {
      var marker, _i, _len, _ref;
      d('destroy errors');
      if (this.errorMarkers == null) {
        return;
      }
      _ref = this.errorMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      return delete this.errorMarkers;
    };

    Watcher.prototype.createErrors = function(errors) {
      var marker, message, range;
      d('create errors');
      return this.errorMarkers = (function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = errors.length; _i < _len; _i++) {
          _ref = errors[_i], range = _ref.range, message = _ref.message;
          marker = this.editor.markBufferRange(range);
          d('marker', range, marker);
          this.editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'refactor-error'
          });
          this.editor.decorateMarker(marker, {
            type: 'line-number',
            "class": 'refactor-error'
          });
          _results.push(marker);
        }
        return _results;
      }).call(this);
    };

    Watcher.prototype.destroyReferences = function() {
      var marker, _i, _len, _ref;
      if (this.referenceMarkers == null) {
        return;
      }
      _ref = this.referenceMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      return delete this.referenceMarkers;
    };

    Watcher.prototype.createReferences = function() {
      var marker, range, ranges;
      ranges = this.ripper.find(this.editor.getSelectedBufferRange().start);
      if (!((ranges != null) && ranges.length > 0)) {
        return;
      }
      return this.referenceMarkers = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = ranges.length; _i < _len; _i++) {
          range = ranges[_i];
          marker = this.editor.markBufferRange(range);
          this.editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'refactor-reference'
          });
          _results.push(marker);
        }
        return _results;
      }).call(this);
    };


    /*
    Renaming life cycle.
    1. When detected rename command, start renaming process.
    2. When the cursors move out from the symbols, abort and exit renaming process.
    3. When detected done command, exit renaming process.
     */

    Watcher.prototype.rename = function() {
      var cursor, marker, range, ranges;
      if (!this.isActive()) {
        return false;
      }
      cursor = this.editor.getLastCursor();
      ranges = this.ripper.find(cursor.getBufferPosition());
      if (!((ranges != null) && ranges.length > 0)) {
        return false;
      }
      this.destroyReferences();
      this.eventBufferChanged = false;
      this.eventCursorMoved = false;
      this.renamingCursor = cursor;
      this.renamingMarkers = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = ranges.length; _i < _len; _i++) {
          range = ranges[_i];
          this.editor.addSelectionForBufferRange(range);
          marker = this.editor.markBufferRange(range);
          this.editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'refactor-reference'
          });
          _results.push(marker);
        }
        return _results;
      }).call(this);
      this.eventCursorMoved = false;
      this.eventCursorMoved = 'abort';
      return true;
    };

    Watcher.prototype.abort = function() {
      var isMarkerContainsCursor, isMarkersContainsCursors, marker, markerRange, selectedRange, selectedRanges, _i, _j, _len, _len1, _ref;
      if (!(this.isActive() && (this.renamingCursor != null) && (this.renamingMarkers != null))) {
        return;
      }
      selectedRanges = this.editor.getSelectedBufferRanges();
      isMarkersContainsCursors = true;
      _ref = this.renamingMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        markerRange = marker.getBufferRange();
        isMarkerContainsCursor = false;
        for (_j = 0, _len1 = selectedRanges.length; _j < _len1; _j++) {
          selectedRange = selectedRanges[_j];
          isMarkerContainsCursor || (isMarkerContainsCursor = markerRange.containsRange(selectedRange));
          if (isMarkerContainsCursor) {
            break;
          }
        }
        isMarkersContainsCursors && (isMarkersContainsCursors = isMarkerContainsCursor);
        if (!isMarkersContainsCursors) {
          break;
        }
      }
      if (isMarkersContainsCursors) {
        return;
      }
      return this.done();
    };

    Watcher.prototype.done = function() {
      var marker, _i, _len, _ref;
      if (!(this.isActive() && (this.renamingCursor != null) && (this.renamingMarkers != null))) {
        return false;
      }
      this.eventCursorMoved = false;
      this.editor.setCursorBufferPosition(this.renamingCursor.getBufferPosition());
      delete this.renamingCursor;
      _ref = this.renamingMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      delete this.renamingMarkers;
      d('done and reparse');
      this.parse();
      this.eventBufferChanged = true;
      this.eventCursorMoved = true;
      return true;
    };


    /*
    User events
     */

    Watcher.prototype.onBufferChanged = function() {
      if (!this.eventBufferChanged) {
        return;
      }
      d('buffer changed');
      return this.parse();
    };

    Watcher.prototype.onCursorMoved = function() {
      if (!this.eventCursorMoved) {
        return;
      }
      if (this.eventCursorMoved === 'abort') {
        return this.abort();
      } else {
        clearTimeout(this.cursorMovedTimeoutId);
        return this.cursorMovedTimeoutId = setTimeout(this.onCursorMovedAfter, 100);
      }
    };

    Watcher.prototype.onCursorMovedAfter = function() {
      this.destroyReferences();
      return this.createReferences();
    };


    /*
    Utility
     */

    Watcher.prototype.isActive = function() {
      return (this.module != null) && atom.workspace.getActivePaneItem() === this.editor;
    };

    Watcher.prototype.rangeToRows = function(_arg) {
      var end, pixel, point, raw, rowRange, start, _i, _ref, _ref1, _results;
      start = _arg.start, end = _arg.end;
      _results = [];
      for (raw = _i = _ref = start.row, _ref1 = end.row; _i <= _ref1; raw = _i += 1) {
        rowRange = this.editor.buffer.rangeForRow(raw);
        point = {
          left: raw === start.row ? start : rowRange.start,
          right: raw === end.row ? end : rowRange.end
        };
        pixel = {
          tl: this.editorView.pixelPositionForBufferPosition(point.left),
          br: this.editorView.pixelPositionForBufferPosition(point.right)
        };
        pixel.br.top += this.editorView.lineHeight;
        _results.push(pixel);
      }
      return _results;
    };

    return Watcher;

  })(EventEmitter2);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvcmVmYWN0b3IvbGliL3dhdGNoZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUUsZ0JBQWtCLE9BQUEsQ0FBUSxlQUFSLEVBQWxCLGFBQUYsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxDQUFDLE9BQUEsQ0FBUSxPQUFSLENBQUQsQ0FBQSxDQUFrQixTQUFsQixDQURKLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosOEJBQUEsQ0FBQTs7QUFBYSxJQUFBLGlCQUFFLGFBQUYsRUFBa0IsTUFBbEIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGdCQUFBLGFBQ2IsQ0FBQTtBQUFBLE1BRDRCLElBQUMsQ0FBQSxTQUFBLE1BQzdCLENBQUE7QUFBQSxxRUFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxpREFBQSxDQUFBO0FBQUEsTUFBQSx1Q0FBQSxDQUFBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixJQUFDLENBQUEsV0FBdEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQTBCLElBQUMsQ0FBQSxlQUEzQixDQUpBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxNQUFNLENBQUMseUJBQVIsQ0FBa0MsSUFBQyxDQUFBLGFBQW5DLENBTEEsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLGFBQUQs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

//# sourceURL=/home/jeremycarlsten/.atom/packages/refactor/lib/watcher.coffee
