Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.providingFunction = providingFunction;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';
'use strict';var config = {
    verbose: {
        title: "Verbosity",
        type: "integer",
        'default': 0,
        minimum: 0,
        maximum: 4,
        order: 0
    },
    phoneip: {
        title: "Phone IP",
        type: "string",
        'default': '[...]',
        order: 1
    }
};

exports.config = config;

var PbBuilder = (function () {
    function PbBuilder() {
        _classCallCheck(this, PbBuilder);
    }

    _createClass(PbBuilder, [{
        key: 'getNiceName',
        value: function getNiceName() {
            return "Pebble Build";
        }
    }, {
        key: 'isEligible',
        value: function isEligible() {
            // Based on code from: https://github.com/AtomBuild/atom-build-cargo/
            /*
                Copyright (c) 2015 Alexander Olsson
                 Permission is hereby granted, free of charge, to any person
                obtaining a copy of this software and associated documentation files
                (the "Software"), to deal in the Software without restriction,
                including without limitation the rights to use, copy, modify, merge,
                publish, distribute, sublicense, and/or sell copies of the Software,
                and to permit persons to whom the Software is furnished to do so,
                subject to the following conditions:
                 The above copyright notice and this permission notice shall be
                included in all copies or substantial portions of the Software.
                 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
                BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
                ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
                CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                THE SOFTWARE.
            */
            return _fs2['default'].existsSync(atom.project.getPaths()[0] + '/appinfo.json');
        }
    }, {
        key: 'settings',
        value: function settings() {
            var verbose = atom.config.get('pb-build.verbose');
            verbose = verbose ? '-' + new Array(verbose + 1).join('v') : '';
            var buildCmd = "echo Starting build in `pwd`; pebble build " + verbose;
            return [{ "name": "Pebble Tool: Build & Install to Aplite",
                "exec": buildCmd + " && " + "pebble install --emulator aplite " + verbose,
                "cwd": "{PROJECT_PATH}" }, { "name": "Pebble Tool: Build & Install to Basalt",
                "exec": buildCmd + " && " + "pebble install --emulator basalt " + verbose,
                "cwd": "{PROJECT_PATH}" }, { "name": "Pebble Tool: Build & Install to Chalk",
                "exec": buildCmd + " && " + "pebble install --emulator chalk " + verbose,
                "cwd": "{PROJECT_PATH}" }, { "name": "Pebble Tool: Build",
                "exec": buildCmd,
                "cwd": "{PROJECT_PATH}" }, { "name": "Pebble Tool: Build & Install via CloudPebble",
                "exec": buildCmd + " && " + "pebble install --cloudpebble " + verbose,
                "cwd": "{PROJECT_PATH}" }, { "name": "Pebble Tool: Build & Install to Phone",
                "exec": buildCmd + " && " + "pebble install --phone " + verbose + atom.config.get('pb-build.phoneip'),
                "cwd": "{PROJECT_PATH}" }];
        }
    }]);

    return PbBuilder;
})();

function providingFunction() {
    return PbBuilder;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2plcmVteWNhcmxzdGVuLy5hdG9tL3BhY2thZ2VzL3BiLWJ1aWxkL2xpYi9wYi1idWlsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tCQUtlLElBQUk7Ozs7QUFMbkIsV0FBVyxDQUFDO0FBQ1osWUFBWSxDQUFDLEFBTU4sSUFBTSxNQUFNLEdBQUc7QUFDbEIsV0FBTyxFQUFFO0FBQ0wsYUFBSyxFQUFFLFdBQVc7QUFDbEIsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxDQUFDO0FBQ1YsZUFBTyxFQUFFLENBQUM7QUFDVixlQUFPLEVBQUUsQ0FBQztBQUNWLGFBQUssRUFBRSxDQUFDO0tBQ1g7QUFDRCxXQUFPLEVBQUU7QUFDTCxhQUFLLEVBQUUsVUFBVTtBQUNqQixZQUFJLEVBQUUsUUFBUTtBQUNkLG1CQUFTLE9BQU87QUFDaEIsYUFBSyxFQUFFLENBQUM7S0FDWDtDQUNKLENBQUM7Ozs7SUFFSSxTQUFTO2FBQVQsU0FBUzs4QkFBVCxTQUFTOzs7aUJBQVQsU0FBUzs7ZUFDQSx1QkFBRztBQUNWLG1CQUFPLGNBQWMsQ0FBQztTQUN6Qjs7O2VBRVMsc0JBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QlQsbUJBQU8sZ0JBQUcsVUFBVSxDQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLG1CQUFnQixDQUFDO1NBQ3RFOzs7ZUFFTyxvQkFBRztBQUNQLGdCQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2xELG1CQUFPLEdBQUcsT0FBTyxHQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFJLEVBQUUsQ0FBQztBQUNsRSxnQkFBSSxRQUFRLEdBQUcsNkNBQTZDLEdBQUcsT0FBTyxDQUFDO0FBQ3ZFLG1CQUFPLENBQUMsRUFBQyxNQUFNLEVBQUUsd0NBQXdDO0FBQzdDLHNCQUFNLEVBQUUsUUFBUSxHQUFHLE1BQU0sR0FDckIsbUNBQW1DLEdBQUcsT0FBTztBQUNqRCxxQkFBSyxFQUFFLGdCQUFnQixFQUFDLEVBRTVCLEVBQUMsTUFBTSxFQUFFLHdDQUF3QztBQUM3QyxzQkFBTSxFQUFFLFFBQVEsR0FBRyxNQUFNLEdBQ3JCLG1DQUFtQyxHQUFHLE9BQU87QUFDakQscUJBQUssRUFBRSxnQkFBZ0IsRUFBQyxFQUU1QixFQUFDLE1BQU0sRUFBRSx1Q0FBdUM7QUFDNUMsc0JBQU0sRUFBRSxRQUFRLEdBQUcsTUFBTSxHQUNyQixrQ0FBa0MsR0FBRyxPQUFPO0FBQ2hELHFCQUFLLEVBQUUsZ0JBQWdCLEVBQUMsRUFFNUIsRUFBQyxNQUFNLEVBQUUsb0JBQW9CO0FBQ3pCLHNCQUFNLEVBQUUsUUFBUTtBQUNoQixxQkFBSyxFQUFFLGdCQUFnQixFQUFDLEVBRTVCLEVBQUMsTUFBTSxFQUFFLDhDQUE4QztBQUNuRCxzQkFBTSxFQUFFLFFBQVEsR0FBRyxNQUFNLEdBQ3JCLCtCQUErQixHQUFHLE9BQU87QUFDN0MscUJBQUssRUFBRSxnQkFBZ0IsRUFBQyxFQUU1QixFQUFDLE1BQU0sRUFBRSx1Q0FBdUM7QUFDNUMsc0JBQU0sRUFBRSxRQUFRLEdBQUcsTUFBTSxHQUNyQix5QkFBeUIsR0FBRyxPQUFPLEdBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0FBQ3ZDLHFCQUFLLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO1NBQ3pDOzs7V0FsRUMsU0FBUzs7O0FBcUVSLFNBQVMsaUJBQWlCLEdBQUc7QUFDaEMsV0FBTyxTQUFTLENBQUM7Q0FDcEIiLCJmaWxlIjoiL2hvbWUvamVyZW15Y2FybHN0ZW4vLmF0b20vcGFja2FnZXMvcGItYnVpbGQvbGliL3BiLWJ1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4ndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuLyogZ2xvYmFsIGxvY2FsU3RvcmFnZSwgY29uc29sZSwgYXRvbSwgbW9kdWxlICovXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICAgIHZlcmJvc2U6IHtcbiAgICAgICAgdGl0bGU6IFwiVmVyYm9zaXR5XCIsXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiLFxuICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICBtYXhpbXVtOiA0LFxuICAgICAgICBvcmRlcjogMFxuICAgIH0sXG4gICAgcGhvbmVpcDoge1xuICAgICAgICB0aXRsZTogXCJQaG9uZSBJUFwiLFxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBkZWZhdWx0OiAnWy4uLl0nLFxuICAgICAgICBvcmRlcjogMVxuICAgIH1cbn07XG5cbmNsYXNzIFBiQnVpbGRlciB7XG4gICAgZ2V0TmljZU5hbWUoKSB7XG4gICAgICAgIHJldHVybiBcIlBlYmJsZSBCdWlsZFwiO1xuICAgIH1cblxuICAgIGlzRWxpZ2libGUoKSB7XG4gICAgICAgIC8vIEJhc2VkIG9uIGNvZGUgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL0F0b21CdWlsZC9hdG9tLWJ1aWxkLWNhcmdvL1xuICAgICAgICAvKlxuICAgICAgICAgICAgQ29weXJpZ2h0IChjKSAyMDE1IEFsZXhhbmRlciBPbHNzb25cblxuICAgICAgICAgICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAgICAgICAgICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gICAgICAgICAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gICAgICAgICAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICAgICAgICAgICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAgICAgICAgICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gICAgICAgICAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuICAgICAgICAgICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAgICAgICAgICAgIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gICAgICAgICAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICAgICAgICAgICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gICAgICAgICAgICBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICAgICAgICAgICAgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICAgICAgICAgICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gICAgICAgICAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICAgICAgICAgICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gICAgICAgICAgICBUSEUgU09GVFdBUkUuXG4gICAgICAgICovXG4gICAgICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGAke2F0b20ucHJvamVjdC5nZXRQYXRocygpWzBdfS9hcHBpbmZvLmpzb25gKTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncygpIHtcbiAgICAgICAgdmFyIHZlcmJvc2UgPSBhdG9tLmNvbmZpZy5nZXQoJ3BiLWJ1aWxkLnZlcmJvc2UnKTtcbiAgICAgICAgdmVyYm9zZSA9IHZlcmJvc2UgPyAoJy0nICsgbmV3IEFycmF5KHZlcmJvc2UgKyAxKS5qb2luKCd2JykpIDogJyc7XG4gICAgICAgIHZhciBidWlsZENtZCA9IFwiZWNobyBTdGFydGluZyBidWlsZCBpbiBgcHdkYDsgcGViYmxlIGJ1aWxkIFwiICsgdmVyYm9zZTtcbiAgICAgICAgcmV0dXJuIFt7XCJuYW1lXCI6IFwiUGViYmxlIFRvb2w6IEJ1aWxkICYgSW5zdGFsbCB0byBBcGxpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJleGVjXCI6IGJ1aWxkQ21kICsgXCIgJiYgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwZWJibGUgaW5zdGFsbCAtLWVtdWxhdG9yIGFwbGl0ZSBcIiArIHZlcmJvc2UsXG4gICAgICAgICAgICAgICAgICAgIFwiY3dkXCI6IFwie1BST0pFQ1RfUEFUSH1cIn0sXG5cbiAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiUGViYmxlIFRvb2w6IEJ1aWxkICYgSW5zdGFsbCB0byBCYXNhbHRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJleGVjXCI6IGJ1aWxkQ21kICsgXCIgJiYgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwZWJibGUgaW5zdGFsbCAtLWVtdWxhdG9yIGJhc2FsdCBcIiArIHZlcmJvc2UsXG4gICAgICAgICAgICAgICAgICAgIFwiY3dkXCI6IFwie1BST0pFQ1RfUEFUSH1cIn0sXG5cbiAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiUGViYmxlIFRvb2w6IEJ1aWxkICYgSW5zdGFsbCB0byBDaGFsa1wiLFxuICAgICAgICAgICAgICAgICAgICBcImV4ZWNcIjogYnVpbGRDbWQgKyBcIiAmJiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBlYmJsZSBpbnN0YWxsIC0tZW11bGF0b3IgY2hhbGsgXCIgKyB2ZXJib3NlLFxuICAgICAgICAgICAgICAgICAgICBcImN3ZFwiOiBcIntQUk9KRUNUX1BBVEh9XCJ9LFxuXG4gICAgICAgICAgICAgICAge1wibmFtZVwiOiBcIlBlYmJsZSBUb29sOiBCdWlsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImV4ZWNcIjogYnVpbGRDbWQsXG4gICAgICAgICAgICAgICAgICAgIFwiY3dkXCI6IFwie1BST0pFQ1RfUEFUSH1cIn0sXG5cbiAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiUGViYmxlIFRvb2w6IEJ1aWxkICYgSW5zdGFsbCB2aWEgQ2xvdWRQZWJibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJleGVjXCI6IGJ1aWxkQ21kICsgXCIgJiYgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwZWJibGUgaW5zdGFsbCAtLWNsb3VkcGViYmxlIFwiICsgdmVyYm9zZSxcbiAgICAgICAgICAgICAgICAgICAgXCJjd2RcIjogXCJ7UFJPSkVDVF9QQVRIfVwifSxcblxuICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJQZWJibGUgVG9vbDogQnVpbGQgJiBJbnN0YWxsIHRvIFBob25lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZXhlY1wiOiBidWlsZENtZCArIFwiICYmIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGViYmxlIGluc3RhbGwgLS1waG9uZSBcIiArIHZlcmJvc2UgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdwYi1idWlsZC5waG9uZWlwJyksXG4gICAgICAgICAgICAgICAgICAgIFwiY3dkXCI6IFwie1BST0pFQ1RfUEFUSH1cIn1dO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGluZ0Z1bmN0aW9uKCkge1xuICAgIHJldHVybiBQYkJ1aWxkZXI7XG59XG4iXX0=
//# sourceURL=/home/jeremycarlsten/.atom/packages/pb-build/lib/pb-build.js
