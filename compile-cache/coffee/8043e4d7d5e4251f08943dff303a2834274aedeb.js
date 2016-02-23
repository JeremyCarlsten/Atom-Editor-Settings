(function() {
  var LocationDataUtil, Range;

  Range = require('atom').Range;

  module.exports = LocationDataUtil = (function() {
    function LocationDataUtil() {}

    LocationDataUtil.locationDataToRange = function(_arg) {
      var first_column, first_line, last_column, last_line;
      first_line = _arg.first_line, first_column = _arg.first_column, last_line = _arg.last_line, last_column = _arg.last_column;
      if (last_line == null) {
        last_line = first_line;
      }
      if (last_column == null) {
        last_column = first_column;
      }
      return new Range([first_line, first_column], [last_line, last_column + 1]);
    };

    LocationDataUtil.rangeToLocationData = function(_arg) {
      var end, start;
      start = _arg.start, end = _arg.end;
      return {
        first_line: start.row,
        first_column: start.column,
        last_line: end.row,
        last_column: end.column - 1
      };
    };

    LocationDataUtil.isEqualsLocationData = function(a, b) {
      return a.first_line === b.first_line && a.first_column === b.first_column && a.last_line === b.last_line && a.last_column === b.last_column;
    };

    LocationDataUtil.isContains = function(_arg, _arg1) {
      var column, first_column, first_line, last_column, last_line, row;
      first_line = _arg.first_line, first_column = _arg.first_column, last_line = _arg.last_line, last_column = _arg.last_column;
      row = _arg1.row, column = _arg1.column;
      last_column++;
      if ((first_line === row && row === last_line)) {
        return (first_column <= column && column <= last_column);
      } else if ((first_line === row && row < last_line)) {
        return first_column <= column;
      } else if ((first_line < row && row === last_line)) {
        return column <= last_column;
      } else if ((first_line < row && row < last_line)) {
        return true;
      } else {
        return false;
      }
    };

    return LocationDataUtil;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvY29mZmVlLXJlZmFjdG9yL2xpYi9sb2NhdGlvbl9kYXRhX3V0aWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBOztBQUFBLEVBQUUsUUFBVSxPQUFBLENBQVEsTUFBUixFQUFWLEtBQUYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007a0NBRUY7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLG1CQUFELEdBQXNCLFNBQUMsSUFBRCxHQUFBO0FBQ2xCLFVBQUEsZ0RBQUE7QUFBQSxNQURxQixrQkFBQSxZQUFZLG9CQUFBLGNBQWMsaUJBQUEsV0FBVyxtQkFBQSxXQUMxRCxDQUFBOztRQUFBLFlBQWE7T0FBYjs7UUFDQSxjQUFlO09BRGY7YUFFSSxJQUFBLEtBQUEsQ0FBTSxDQUFFLFVBQUYsRUFBYyxZQUFkLENBQU4sRUFBb0MsQ0FBRSxTQUFGLEVBQWEsV0FBQSxHQUFjLENBQTNCLENBQXBDLEVBSGM7SUFBQSxDQUF0QixDQUFBOztBQUFBLElBS0EsZ0JBQUMsQ0FBQSxtQkFBRCxHQUFzQixTQUFDLElBQUQsR0FBQTtBQUNsQixVQUFBLFVBQUE7QUFBQSxNQURxQixhQUFBLE9BQU8sV0FBQSxHQUM1QixDQUFBO2FBQUE7QUFBQSxRQUFBLFVBQUEsRUFBYSxLQUFLLENBQUMsR0FBbkI7QUFBQSxRQUNBLFlBQUEsRUFBYyxLQUFLLENBQUMsTUFEcEI7QUFBQSxRQUVBLFNBQUEsRUFBWSxHQUFHLENBQUMsR0FGaEI7QUFBQSxRQUdBLFdBQUEsRUFBYyxHQUFHLENBQUMsTUFBSixHQUFhLENBSDNCO1FBRGtCO0lBQUEsQ0FMdEIsQ0FBQTs7QUFBQSxJQVdBLGdCQUFDLENBQUEsb0JBQUQsR0FBdUIsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO2FBQ25CLENBQUMsQ0FBQyxVQUFGLEtBQWdCLENBQUMsQ0FBQyxVQUFsQixJQUNBLENBQUMsQ0FBQyxZQUFGLEtBQWtCLENBQUMsQ0FBQyxZQURwQixJQUVBLENBQUMsQ0FBQyxTQUFGLEtBQWUsQ0FBQyxDQUFDLFNBRmpCLElBR0EsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsQ0FBQyxDQUFDLFlBSkE7SUFBQSxDQVh2QixDQUFBOztBQUFBLElBb0JBLGdCQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsSUFBRCxFQUF1RCxLQUF2RCxHQUFBO0FBQ1QsVUFBQSw2REFBQTtBQUFBLE1BRFksa0JBQUEsWUFBWSxvQkFBQSxjQUFjLGlCQUFBLFdBQVcsbUJBQUEsV0FDakQsQ0FBQTtBQUFBLE1BRGtFLFlBQUEsS0FBSyxlQUFBLE1BQ3ZFLENBQUE7QUFBQSxNQUFBLFdBQUEsRUFBQSxDQUFBO0FBQ0EsTUFBQSxJQUFHLENBQUEsVUFBQSxLQUFjLEdBQWQsSUFBYyxHQUFkLEtBQXFCLFNBQXJCLENBQUg7ZUFDSSxDQUFBLFlBQUEsSUFBZ0IsTUFBaEIsSUFBZ0IsTUFBaEIsSUFBMEIsV0FBMUIsRUFESjtPQUFBLE1BRUssSUFBRyxDQUFBLFVBQUEsS0FBYyxHQUFkLElBQWMsR0FBZCxHQUFvQixTQUFwQixDQUFIO2VBQ0QsWUFBQSxJQUFnQixPQURmO09BQUEsTUFFQSxJQUFHLENBQUEsVUFBQSxHQUFhLEdBQWIsSUFBYSxHQUFiLEtBQW9CLFNBQXBCLENBQUg7ZUFDRCxNQUFBLElBQVUsWUFEVDtPQUFBLE1BRUEsSUFBRyxDQUFBLFVBQUEsR0FBYSxHQUFiLElBQWEsR0FBYixHQUFtQixTQUFuQixDQUFIO2VBQ0QsS0FEQztPQUFBLE1BQUE7ZUFHRCxNQUhDO09BUkk7SUFBQSxDQXBCYixDQUFBOzs0QkFBQTs7TUFMSixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/jeremycarlsten/.atom/packages/coffee-refactor/lib/location_data_util.coffee
