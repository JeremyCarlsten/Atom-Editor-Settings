(function() {
  var Point, Range, actionUtils, editorUtils, emmet, insertSnippet, normalize, path, preprocessSnippet, resources, tabStops, utils, visualize, _ref;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  path = require('path');

  emmet = require('emmet');

  utils = require('emmet/lib/utils/common');

  tabStops = require('emmet/lib/assets/tabStops');

  resources = require('emmet/lib/assets/resources');

  editorUtils = require('emmet/lib/utils/editor');

  actionUtils = require('emmet/lib/utils/action');

  insertSnippet = function(snippet, editor) {
    var _ref1, _ref2, _ref3, _ref4;
    if ((_ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
      if ((_ref2 = _ref1.mainModule) != null) {
        _ref2.insert(snippet, editor);
      }
    }
    return editor.snippetExpansion = (_ref3 = atom.packages.getLoadedPackage('snippets')) != null ? (_ref4 = _ref3.mainModule) != null ? _ref4.getExpansions(editor)[0] : void 0 : void 0;
  };

  visualize = function(str) {
    return str.replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\s/g, '\\s');
  };

  normalize = function(text, editor) {
    return editorUtils.normalize(text, {
      indentation: editor.getTabText(),
      newline: '\n'
    });
  };

  preprocessSnippet = function(value) {
    var order, tabstopOptions;
    order = [];
    tabstopOptions = {
      tabstop: function(data) {
        var group, placeholder;
        group = parseInt(data.group, 10);
        if (group === 0) {
          order.push(-1);
          group = order.length;
        } else {
          if (order.indexOf(group) === -1) {
            order.push(group);
          }
          group = order.indexOf(group) + 1;
        }
        placeholder = data.placeholder || '';
        if (placeholder) {
          placeholder = tabStops.processText(placeholder, tabstopOptions);
        }
        if (placeholder) {
          return "${" + group + ":" + placeholder + "}";
        } else {
          return "$" + group;
        }
      },
      escape: function(ch) {
        if (ch === '$') {
          return '\\$';
        } else {
          return ch;
        }
      }
    };
    return tabStops.processText(value, tabstopOptions);
  };

  module.exports = {
    setup: function(editor, selectionIndex) {
      var buf, bufRanges;
      this.editor = editor;
      this.selectionIndex = selectionIndex != null ? selectionIndex : 0;
      buf = this.editor.getBuffer();
      bufRanges = this.editor.getSelectedBufferRanges();
      return this._selection = {
        index: 0,
        saved: new Array(bufRanges.length),
        bufferRanges: bufRanges,
        indexRanges: bufRanges.map(function(range) {
          return {
            start: buf.characterIndexForPosition(range.start),
            end: buf.characterIndexForPosition(range.end)
          };
        })
      };
    },
    exec: function(fn) {
      var ix, success;
      ix = this._selection.bufferRanges.length - 1;
      this._selection.saved = [];
      success = true;
      while (ix >= 0) {
        this._selection.index = ix;
        if (fn(this._selection.index) === false) {
          success = false;
          break;
        }
        ix--;
      }
      if (success && this._selection.saved.length > 1) {
        return this._setSelectedBufferRanges(this._selection.saved);
      }
    },
    _setSelectedBufferRanges: function(sels) {
      var filteredSels;
      filteredSels = sels.filter(function(s) {
        return !!s;
      });
      if (filteredSels.length) {
        return this.editor.setSelectedBufferRanges(filteredSels);
      }
    },
    _saveSelection: function(delta) {
      var i, range, _results;
      this._selection.saved[this._selection.index] = this.editor.getSelectedBufferRange();
      if (delta) {
        i = this._selection.index;
        delta = Point.fromObject([delta, 0]);
        _results = [];
        while (++i < this._selection.saved.length) {
          range = this._selection.saved[i];
          if (range) {
            _results.push(this._selection.saved[i] = new Range(range.start.translate(delta), range.end.translate(delta)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    selectionList: function() {
      return this._selection.indexRanges;
    },
    getCaretPos: function() {
      return this.getSelectionRange().start;
    },
    setCaretPos: function(pos) {
      return this.createSelection(pos);
    },
    getSelectionRange: function() {
      return this._selection.indexRanges[this._selection.index];
    },
    getSelectionBufferRange: function() {
      return this._selection.bufferRanges[this._selection.index];
    },
    createSelection: function(start, end) {
      var buf, sels;
      if (end == null) {
        end = start;
      }
      sels = this._selection.bufferRanges;
      buf = this.editor.getBuffer();
      sels[this._selection.index] = new Range(buf.positionForCharacterIndex(start), buf.positionForCharacterIndex(end));
      return this._setSelectedBufferRanges(sels);
    },
    getSelection: function() {
      return this.editor.getTextInBufferRange(this.getSelectionBufferRange());
    },
    getCurrentLineRange: function() {
      var index, lineLength, row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      lineLength = this.editor.lineTextForBufferRow(row).length;
      index = this.editor.getBuffer().characterIndexForPosition({
        row: row,
        column: 0
      });
      return {
        start: index,
        end: index + lineLength
      };
    },
    getCurrentLine: function() {
      var row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      return this.editor.lineTextForBufferRow(row);
    },
    getContent: function() {
      return this.editor.getText();
    },
    replaceContent: function(value, start, end, noIndent) {
      var buf, caret, changeRange, oldValue;
      if (end == null) {
        end = start == null ? this.getContent().length : start;
      }
      if (start == null) {
        start = 0;
      }
      value = normalize(value, this.editor);
      buf = this.editor.getBuffer();
      changeRange = new Range(Point.fromObject(buf.positionForCharacterIndex(start)), Point.fromObject(buf.positionForCharacterIndex(end)));
      oldValue = this.editor.getTextInBufferRange(changeRange);
      buf.setTextInRange(changeRange, '');
      caret = buf.positionForCharacterIndex(start);
      this.editor.setSelectedBufferRange(new Range(caret, caret));
      insertSnippet(preprocessSnippet(value), this.editor);
      this._saveSelection(utils.splitByLines(value).length - utils.splitByLines(oldValue).length);
      return value;
    },
    getGrammar: function() {
      return this.editor.getGrammar().scopeName.toLowerCase();
    },
    getSyntax: function() {
      var m, scope, sourceSyntax, syntax, _ref1;
      scope = this.getCurrentScope().join(' ');
      if (~scope.indexOf('xsl')) {
        return 'xsl';
      }
      if (!/\bstring\b/.test(scope) && /\bsource\.jsx?\b/.test(scope)) {
        return 'jsx';
      }
      sourceSyntax = (_ref1 = scope.match(/\bsource\.([\w\-]+)/)) != null ? _ref1[0] : void 0;
      if (!/\bstring\b/.test(scope) && sourceSyntax && resources.hasSyntax(sourceSyntax)) {
        syntax = sourceSyntax;
      } else {
        m = scope.match(/\b(source|text)\.[\w\-\.]+/);
        syntax = m != null ? m[0].split('.').reduceRight(function(result, token) {
          return result || (resources.hasSyntax(token) ? token : void 0);
        }, null) : void 0;
      }
      return actionUtils.detectSyntax(this, syntax || 'html');
    },
    getCurrentScope: function() {
      var range;
      range = this._selection.bufferRanges[this._selection.index];
      return this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
    },
    getProfileName: function() {
      if (this.getCurrentScope().some(function(scope) {
        return /\bstring\.quoted\b/.test(scope);
      })) {
        return 'line';
      } else {
        return actionUtils.detectProfile(this);
      }
    },
    getFilePath: function() {
      return this.editor.buffer.file.path;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvZW1tZXQvbGliL2VkaXRvci1wcm94eS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNklBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFpQixPQUFBLENBQVEsTUFBUixDQURqQixDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFjLE9BQUEsQ0FBUSxPQUFSLENBSGQsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVIsQ0FKZCxDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFjLE9BQUEsQ0FBUSwyQkFBUixDQUxkLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQWMsT0FBQSxDQUFRLDRCQUFSLENBTmQsQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVIsQ0FQZCxDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUixDQVJkLENBQUE7O0FBQUEsRUFVQSxhQUFBLEdBQWdCLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNkLFFBQUEsMEJBQUE7OzthQUFzRCxDQUFFLE1BQXhELENBQStELE9BQS9ELEVBQXdFLE1BQXhFOztLQUFBO1dBR0EsTUFBTSxDQUFDLGdCQUFQLDRHQUFnRixDQUFFLGFBQXhELENBQXNFLE1BQXRFLENBQThFLENBQUEsQ0FBQSxvQkFKMUY7RUFBQSxDQVZoQixDQUFBOztBQUFBLEVBZ0JBLFNBQUEsR0FBWSxTQUFDLEdBQUQsR0FBQTtXQUNWLEdBQ0UsQ0FBQyxPQURILENBQ1csS0FEWCxFQUNrQixLQURsQixDQUVFLENBQUMsT0FGSCxDQUVXLEtB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

//# sourceURL=/home/jeremycarlsten/.atom/packages/emmet/lib/editor-proxy.coffee
