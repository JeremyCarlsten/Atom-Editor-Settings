var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';
'use strict';
var PbColorProvider = (function () {
    function PbColorProvider() {
        _classCallCheck(this, PbColorProvider);

        this.colordata = JSON.parse(_fs2['default'].readFileSync(_path2['default'].resolve(__dirname, './color_definitions.json')));
    }

    _createClass(PbColorProvider, [{
        key: 'cssClassForString',
        value: function cssClassForString(str) {
            str = str.replace(/ARGB8/, '');
            if (!str.includes('GColor')) {
                return '';
            }
            if (str in this.colordata) {
                return this.colordata[str];
            } else if (str.includes('GColorClear')) {
                return 'clear';
            }
            return '';
        }
    }]);

    return PbColorProvider;
})();

module.exports.PbColorProvider = PbColorProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2plcmVteWNhcmxzdGVuLy5hdG9tL3BhY2thZ2VzL3BiLWNvbXBsZXRpb25zL2xpYi9jb2xvci1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2tCQU1lLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztBQVB2QixXQUFXLENBQUM7QUFDWixZQUFZLENBQUM7SUFRUCxlQUFlO0FBQ04sYUFEVCxlQUFlLEdBQ0g7OEJBRFosZUFBZTs7QUFFYixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQ3ZCLGdCQUFHLFlBQVksQ0FBQyxrQkFBSyxPQUFPLENBQUMsU0FBUyxFQUFFLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdFOztpQkFKQyxlQUFlOztlQUtBLDJCQUFDLEdBQUcsRUFBRTtBQUNuQixlQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDL0IsZ0JBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3pCLHVCQUFPLEVBQUUsQ0FBQzthQUNiO0FBQ0QsZ0JBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDdkIsdUJBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBRTthQUMvQixNQUFNLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNwQyx1QkFBTyxPQUFPLENBQUM7YUFDbEI7QUFDRCxtQkFBTyxFQUFFLENBQUM7U0FDYjs7O1dBaEJDLGVBQWU7OztBQWtCckIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDIiwiZmlsZSI6Ii9ob21lL2plcmVteWNhcmxzdGVuLy5hdG9tL3BhY2thZ2VzL3BiLWNvbXBsZXRpb25zL2xpYi9jb2xvci1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cbi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGdsb2JhbCBsb2NhbFN0b3JhZ2UsIGNvbnNvbGUsIGF0b20sIG1vZHVsZSAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNsYXNzIFBiQ29sb3JQcm92aWRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29sb3JkYXRhID0gSlNPTi5wYXJzZShcbiAgICAgICAgICAgIGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9jb2xvcl9kZWZpbml0aW9ucy5qc29uJykpKTtcbiAgICB9XG4gICAgY3NzQ2xhc3NGb3JTdHJpbmcoc3RyKSB7XG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9BUkdCOC8sICcnKTtcbiAgICAgICAgaWYgKCFzdHIuaW5jbHVkZXMoJ0dDb2xvcicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0ciBpbiB0aGlzLmNvbG9yZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuKHRoaXMuY29sb3JkYXRhW3N0cl0pO1xuICAgICAgICB9IGVsc2UgaWYgKHN0ci5pbmNsdWRlcygnR0NvbG9yQ2xlYXInKSkge1xuICAgICAgICAgICAgcmV0dXJuICdjbGVhcic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzLlBiQ29sb3JQcm92aWRlciA9IFBiQ29sb3JQcm92aWRlcjtcbiJdfQ==
//# sourceURL=/home/jeremycarlsten/.atom/packages/pb-completions/lib/color-provider.js
