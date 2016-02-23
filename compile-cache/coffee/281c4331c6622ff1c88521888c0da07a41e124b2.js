(function() {
  var Context, Range, Ripper, d, parse,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Context = require('../vender/esrefactor').Context;

  parse = require('./parser').parse;

  Range = require('atom').Range;

  d = (require('debug'))('ripper');

  module.exports = Ripper = (function() {
    Ripper.locToRange = function(_arg) {
      var end, start;
      start = _arg.start, end = _arg.end;
      return new Range([start.line - 1, start.column], [end.line - 1, end.column]);
    };

    Ripper.scopeNames = ['source.js', 'source.js.jsx', 'source.babel'];

    Ripper.prototype.parseOptions = {
      loc: true,
      range: true,
      tokens: true,
      tolerant: true,
      sourceType: 'module',
      allowReturnOutsideFunction: true,
      features: {
        'es7.asyncFunctions': true,
        'es7.exponentiationOperator': true,
        'es7.objectRestSpread': true,
        'es7.decorators': true,
        'es7.exportExtensions': true,
        'es7.trailingFunctionCommas': true
      }
    };

    function Ripper() {
      this.context = new Context;
    }

    Ripper.prototype.destruct = function() {
      return delete this.context;
    };

    Ripper.prototype.parse = function(code, callback) {
      var column, err, line, lineNumber, loc, message, rLine, result, _ref;
      try {
        d('parse', code);
        rLine = /.*(?:\r?\n|\n?\r)/g;
        this.lines = ((function() {
          var _results;
          _results = [];
          while ((result = rLine.exec(code)) != null) {
            _results.push(result[0].length);
          }
          return _results;
        })());
        this.parseError = null;
        this.context.setCode(code, this.parseOptions);
        if (callback) {
          return callback();
        }
      } catch (_error) {
        err = _error;
        _ref = this.parseError = err, loc = _ref.loc, message = _ref.message;
        if ((loc != null) && (message != null)) {
          line = loc.line, column = loc.column;
          lineNumber = line - 1;
          if (callback) {
            return callback([
              {
                range: new Range([lineNumber, column], [lineNumber, column + 1]),
                message: message
              }
            ]);
          }
        } else {
          d('unknown error', err);
          if (callback) {
            return callback();
          }
        }
      }
    };

    Ripper.prototype.find = function(_arg) {
      var column, declaration, identification, pos, ranges, reference, references, row, _i, _len;
      row = _arg.row, column = _arg.column;
      if (this.parseError != null) {
        return;
      }
      d('find', row, column);
      pos = 0;
      while (--row >= 0) {
        pos += this.lines[row];
      }
      pos += column;
      identification = this.context.identify(pos);
      d('identification at', pos, identification);
      if (!identification) {
        return [];
      }
      declaration = identification.declaration, references = identification.references;
      if ((declaration != null) && !(__indexOf.call(references, declaration) >= 0)) {
        references.unshift(declaration);
      }
      ranges = [];
      for (_i = 0, _len = references.length; _i < _len; _i++) {
        reference = references[_i];
        ranges.push(Ripper.locToRange(reference.loc));
      }
      return ranges;
    };

    return Ripper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvanMtcmVmYWN0b3IvbGliL3JpcHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFFLFVBQVksT0FBQSxDQUFRLHNCQUFSLEVBQVosT0FBRixDQUFBOztBQUFBLEVBQ0UsUUFBVSxPQUFBLENBQVEsVUFBUixFQUFWLEtBREYsQ0FBQTs7QUFBQSxFQUVFLFFBQVUsT0FBQSxDQUFRLE1BQVIsRUFBVixLQUZGLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksQ0FBQyxPQUFBLENBQVEsT0FBUixDQUFELENBQUEsQ0FBa0IsUUFBbEIsQ0FISixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLElBQUEsTUFBQyxDQUFBLFVBQUQsR0FBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsVUFBQTtBQUFBLE1BRGMsYUFBQSxPQUFPLFdBQUEsR0FDckIsQ0FBQTthQUFJLElBQUEsS0FBQSxDQUFNLENBQUUsS0FBSyxDQUFDLElBQU4sR0FBYSxDQUFmLEVBQWtCLEtBQUssQ0FBQyxNQUF4QixDQUFOLEVBQXdDLENBQUUsR0FBRyxDQUFDLElBQUosR0FBVyxDQUFiLEVBQWdCLEdBQUcsQ0FBQyxNQUFwQixDQUF4QyxFQURPO0lBQUEsQ0FBYixDQUFBOztBQUFBLElBR0EsTUFBQyxDQUFBLFVBQUQsR0FBYSxDQUNYLFdBRFcsRUFFWCxlQUZXLEVBR1gsY0FIVyxDQUhiLENBQUE7O0FBQUEscUJBU0EsWUFBQSxHQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssSUFBTDtBQUFBLE1BQ0EsS0FBQSxFQUFPLElBRFA7QUFBQSxNQUVBLE1BQUEsRUFBUSxJQUZSO0FBQUEsTUFHQSxRQUFBLEVBQVUsSUFIVjtB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

//# sourceURL=/home/jeremycarlsten/.atom/packages/js-refactor/lib/ripper.coffee
