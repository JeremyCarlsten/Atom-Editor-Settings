Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.provide = provide;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

'use babel';
'use strict';
/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module */

// TODO: Resource IDs
// TODO: #ifdef macros

// Some of this files' contents are based on atom/autocomplete-css.
// See https://github.com/atom/autocomplete-css.

function provide() {
    return _provider2['default'];
}

var config = {
    headerpaths: {
        title: 'Header Paths',
        type: 'string',
        'default': "{{{LIB}}}/default.h{{{AND}}}" + "{{{HOME}}}/Library/Application Support/Pebble SDK/SDKs/" + "current/sdk-core/pebble/aplite/include/pebble.h{{{AND}}}" + "{{{HOME}}}/Library/Application Support/Pebble SDK/SDKs/" + "current/sdk-core/pebble/aplite/include/pebble_worker.h{{{AND}}}" + "{{{HOME}}}/Library/Application Support/Pebble SDK/SDKs/" + "current/sdk-core/pebble/aplite/include/pebble_fonts.h{{{AND}}}" + "{{{HOME}}}/Library/Application Support/Pebble SDK/SDKs/" + "current/sdk-core/pebble/aplite/include/gcolor_definitions.h{{{AND}}}" + "{{{LIB}}}/unsupported.h",
        description: "{{{AND}}} and {{{HOME}}} are replaced.\n\n" + "You'll need to change this on linux: " + "try `pebble sdk include-path [aplite/basalt/chalk]`\n\n" + "After changing this, either run `pb-completions:force-reload` " + "or restart atom via window:reload (`cmd-alt-ctrl-l` on mac)"
    },
    ignoreditems: {
        title: 'Ignored Items',
        type: 'string',
        'default': '[{"type": ["define"], "regex": "GColor.*ARGB8"}]',
        description: "Input a JSON array containing objects:.\n\n" + "type: array of types this applies to (define/function/enum).\n\n" + "regex: what the line is matched to.\n\n" + "fnregex: what the filename is matched to.\n\n" + "ALL characteristics (type, regex, fnregex) must match for the " + "line to be ignored."
    }
};
exports.config = config;
var defaultPath = config.headerpaths['default'];
var defaultIgnored = config.ignoreditems['default'];

atom.menu.add([{
    label: 'Packages',
    submenu: [{
        label: 'Pb-Completions',
        submenu: [{
            label: 'Reload All Completions',
            command: 'pb-completions:force-reload'
        }, {
            label: 'Reload All Completions (including Documentation)',
            command: 'force-reload-(including-documentation)'
        }]
    }]
}]);
// Add the the reloading menu item

function getHeaderPaths() {
    if (atom.config.get('pb-completions.headerpaths') === undefined) {
        // I'm not sure why this is necessary.
        // I just know that for some reason, it is.
        // It's a HACK, I guess.
        return defaultPath;
    }
    return atom.config.get('pb-completions.headerpaths');
}
function getIgnores() {
    if (atom.config.get('pb-completions.ignoreditems') === undefined) {
        // I'm not sure why this is necessary.
        // I just know that for some reason, it is.
        // It's a HACK, I guess.
        return JSON.parse(defaultIgnored);
    }
    return JSON.parse(atom.config.get('pb-completions.ignoreditems'));
}

atom.commands.add('atom-workspace', 'pb-completions:force-reload', function () {
    _provider2['default'].init(getHeaderPaths(), getIgnores());
    _provider2['default'].forceReload();
});

atom.commands.add('atom-workspace', 'pb-completions:force-reload-(including-documentation)', function () {
    _provider2['default'].init(getHeaderPaths(), getIgnores());
    _provider2['default'].discardHeadersAndForceReload();
});
// Add the the reloading command

function reinitProvider() {
    _provider2['default'].init(getHeaderPaths(), getIgnores());
    _provider2['default'].maybeReload();
}

atom.config.onDidChange('pb-completions.headerpaths', reinitProvider);
atom.config.onDidChange('pb-completions.ignoreditems', reinitProvider);
reinitProvider();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2plcmVteWNhcmxzdGVuLy5hdG9tL3BhY2thZ2VzL3BiLWNvbXBsZXRpb25zL2xpYi9wYi1jb21wbGV0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O3dCQWdHcUIsWUFBWTs7OztBQWhHakMsV0FBVyxDQUFDO0FBQ1osWUFBWSxDQUFDOzs7Ozs7Ozs7OztBQVdOLFNBQVMsT0FBTyxHQUFHO0FBQ3RCLGlDQUFnQjtDQUNuQjs7QUFFTSxJQUFNLE1BQU0sR0FBRztBQUNsQixlQUFXLEVBQUU7QUFDVCxhQUFLLEVBQUUsY0FBYztBQUNyQixZQUFJLEVBQUUsUUFBUTtBQUNkLG1CQUFTLDhCQUE4QixHQUVuQyx5REFBeUQsR0FDekQsMERBQTBELEdBRTFELHlEQUF5RCxHQUN6RCxpRUFBaUUsR0FFakUseURBQXlELEdBQ3pELGdFQUFnRSxHQUVoRSx5REFBeUQsR0FDekQsc0VBQXNFLEdBRXRFLHlCQUF5QjtBQUM3QixtQkFBVyxFQUFFLDRDQUE0QyxHQUNyRCx1Q0FBdUMsR0FDdkMseURBQXlELEdBQ3pELGdFQUFnRSxHQUNoRSw2REFBNkQ7S0FDcEU7QUFDRCxnQkFBWSxFQUFFO0FBQ1YsYUFBSyxFQUFFLGVBQWU7QUFDdEIsWUFBSSxFQUFFLFFBQVE7QUFDZCxtQkFBUyxrREFBa0Q7QUFDM0QsbUJBQVcsRUFBRSw2Q0FBNkMsR0FDdEQsa0VBQWtFLEdBQ2xFLHlDQUF5QyxHQUN6QywrQ0FBK0MsR0FDL0MsZ0VBQWdFLEdBQzVELHFCQUFxQjtLQUNoQztDQUNKLENBQUM7O0FBQ0YsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsV0FBUSxDQUFDO0FBQzdDLElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxZQUFZLFdBQVEsQ0FBQzs7QUFJakQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FDVjtBQUNJLFNBQUssRUFBRSxVQUFVO0FBQ2pCLFdBQU8sRUFBRSxDQUFDO0FBQ04sYUFBSyxFQUFFLGdCQUFnQjtBQUN2QixlQUFPLEVBQUUsQ0FBQztBQUNOLGlCQUFLLEVBQUUsd0JBQXdCO0FBQy9CLG1CQUFPLEVBQUUsNkJBQTZCO1NBQ3pDLEVBQ0Q7QUFDSSxpQkFBSyxFQUFFLGtEQUFrRDtBQUN6RCxtQkFBTyxFQUFFLHdDQUF3QztTQUNwRCxDQUFDO0tBQ0wsQ0FBQztDQUNMLENBQ0osQ0FBQyxDQUFDOzs7QUFJSCxTQUFTLGNBQWMsR0FBRztBQUN0QixRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLEtBQUssU0FBUyxFQUFFOzs7O0FBSTdELGVBQU8sV0FBVyxDQUFDO0tBQ3RCO0FBQ0QsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0NBQ3hEO0FBQ0QsU0FBUyxVQUFVLEdBQUc7QUFDbEIsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxLQUFLLFNBQVMsRUFBRTs7OztBQUk5RCxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDckM7QUFDRCxXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO0NBQ3JFOztBQUlELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLDZCQUE2QixFQUFFLFlBQVc7QUFDMUUsMEJBQVMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDOUMsMEJBQVMsV0FBVyxFQUFFLENBQUM7Q0FDMUIsQ0FBQyxDQUFDOztBQUVILElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHVEQUF1RCxFQUFFLFlBQVc7QUFDcEcsMEJBQVMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDOUMsMEJBQVMsNEJBQTRCLEVBQUUsQ0FBQztDQUMzQyxDQUFDLENBQUM7OztBQUdILFNBQVMsY0FBYyxHQUFHO0FBQ3RCLDBCQUFTLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLDBCQUFTLFdBQVcsRUFBRSxDQUFDO0NBQzFCOztBQUVELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLDRCQUE0QixFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3RFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLDZCQUE2QixFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZFLGNBQWMsRUFBRSxDQUFDIiwiZmlsZSI6Ii9ob21lL2plcmVteWNhcmxzdGVuLy5hdG9tL3BhY2thZ2VzL3BiLWNvbXBsZXRpb25zL2xpYi9wYi1jb21wbGV0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cbi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGdsb2JhbCBsb2NhbFN0b3JhZ2UsIGNvbnNvbGUsIGF0b20sIG1vZHVsZSAqL1xuXG4vLyBUT0RPOiBSZXNvdXJjZSBJRHNcbi8vIFRPRE86ICNpZmRlZiBtYWNyb3NcblxuLy8gU29tZSBvZiB0aGlzIGZpbGVzJyBjb250ZW50cyBhcmUgYmFzZWQgb24gYXRvbS9hdXRvY29tcGxldGUtY3NzLlxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F1dG9jb21wbGV0ZS1jc3MuXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlKCkge1xuICAgIHJldHVybiBwcm92aWRlcjtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgICBoZWFkZXJwYXRoczoge1xuICAgICAgICB0aXRsZTogJ0hlYWRlciBQYXRocycsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBkZWZhdWx0OiBcInt7e0xJQn19fS9kZWZhdWx0Lmh7e3tBTkR9fX1cIiArXG5cbiAgICAgICAgICAgIFwie3t7SE9NRX19fS9MaWJyYXJ5L0FwcGxpY2F0aW9uIFN1cHBvcnQvUGViYmxlIFNESy9TREtzL1wiICtcbiAgICAgICAgICAgIFwiY3VycmVudC9zZGstY29yZS9wZWJibGUvYXBsaXRlL2luY2x1ZGUvcGViYmxlLmh7e3tBTkR9fX1cIiArXG5cbiAgICAgICAgICAgIFwie3t7SE9NRX19fS9MaWJyYXJ5L0FwcGxpY2F0aW9uIFN1cHBvcnQvUGViYmxlIFNESy9TREtzL1wiICtcbiAgICAgICAgICAgIFwiY3VycmVudC9zZGstY29yZS9wZWJibGUvYXBsaXRlL2luY2x1ZGUvcGViYmxlX3dvcmtlci5oe3t7QU5EfX19XCIgK1xuXG4gICAgICAgICAgICBcInt7e0hPTUV9fX0vTGlicmFyeS9BcHBsaWNhdGlvbiBTdXBwb3J0L1BlYmJsZSBTREsvU0RLcy9cIiArXG4gICAgICAgICAgICBcImN1cnJlbnQvc2RrLWNvcmUvcGViYmxlL2FwbGl0ZS9pbmNsdWRlL3BlYmJsZV9mb250cy5oe3t7QU5EfX19XCIgK1xuXG4gICAgICAgICAgICBcInt7e0hPTUV9fX0vTGlicmFyeS9BcHBsaWNhdGlvbiBTdXBwb3J0L1BlYmJsZSBTREsvU0RLcy9cIiArXG4gICAgICAgICAgICBcImN1cnJlbnQvc2RrLWNvcmUvcGViYmxlL2FwbGl0ZS9pbmNsdWRlL2djb2xvcl9kZWZpbml0aW9ucy5oe3t7QU5EfX19XCIgK1xuXG4gICAgICAgICAgICBcInt7e0xJQn19fS91bnN1cHBvcnRlZC5oXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcInt7e0FORH19fSBhbmQge3t7SE9NRX19fSBhcmUgcmVwbGFjZWQuXFxuXFxuXCIgK1xuICAgICAgICAgICAgXCJZb3UnbGwgbmVlZCB0byBjaGFuZ2UgdGhpcyBvbiBsaW51eDogXCIgK1xuICAgICAgICAgICAgXCJ0cnkgYHBlYmJsZSBzZGsgaW5jbHVkZS1wYXRoIFthcGxpdGUvYmFzYWx0L2NoYWxrXWBcXG5cXG5cIiArXG4gICAgICAgICAgICBcIkFmdGVyIGNoYW5naW5nIHRoaXMsIGVpdGhlciBydW4gYHBiLWNvbXBsZXRpb25zOmZvcmNlLXJlbG9hZGAgXCIgK1xuICAgICAgICAgICAgXCJvciByZXN0YXJ0IGF0b20gdmlhIHdpbmRvdzpyZWxvYWQgKGBjbWQtYWx0LWN0cmwtbGAgb24gbWFjKVwiXG4gICAgfSxcbiAgICBpZ25vcmVkaXRlbXM6IHtcbiAgICAgICAgdGl0bGU6ICdJZ25vcmVkIEl0ZW1zJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6ICdbe1widHlwZVwiOiBbXCJkZWZpbmVcIl0sIFwicmVnZXhcIjogXCJHQ29sb3IuKkFSR0I4XCJ9XScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIklucHV0IGEgSlNPTiBhcnJheSBjb250YWluaW5nIG9iamVjdHM6LlxcblxcblwiICtcbiAgICAgICAgICAgIFwidHlwZTogYXJyYXkgb2YgdHlwZXMgdGhpcyBhcHBsaWVzIHRvIChkZWZpbmUvZnVuY3Rpb24vZW51bSkuXFxuXFxuXCIgK1xuICAgICAgICAgICAgXCJyZWdleDogd2hhdCB0aGUgbGluZSBpcyBtYXRjaGVkIHRvLlxcblxcblwiICtcbiAgICAgICAgICAgIFwiZm5yZWdleDogd2hhdCB0aGUgZmlsZW5hbWUgaXMgbWF0Y2hlZCB0by5cXG5cXG5cIiArXG4gICAgICAgICAgICBcIkFMTCBjaGFyYWN0ZXJpc3RpY3MgKHR5cGUsIHJlZ2V4LCBmbnJlZ2V4KSBtdXN0IG1hdGNoIGZvciB0aGUgXCIgK1xuICAgICAgICAgICAgICAgIFwibGluZSB0byBiZSBpZ25vcmVkLlwiXG4gICAgfVxufTtcbnZhciBkZWZhdWx0UGF0aCA9IGNvbmZpZy5oZWFkZXJwYXRocy5kZWZhdWx0O1xudmFyIGRlZmF1bHRJZ25vcmVkID0gY29uZmlnLmlnbm9yZWRpdGVtcy5kZWZhdWx0O1xuXG5cblxuYXRvbS5tZW51LmFkZChbXG4gICAge1xuICAgICAgICBsYWJlbDogJ1BhY2thZ2VzJyxcbiAgICAgICAgc3VibWVudTogW3tcbiAgICAgICAgICAgIGxhYmVsOiAnUGItQ29tcGxldGlvbnMnLFxuICAgICAgICAgICAgc3VibWVudTogW3tcbiAgICAgICAgICAgICAgICBsYWJlbDogJ1JlbG9hZCBBbGwgQ29tcGxldGlvbnMnLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdwYi1jb21wbGV0aW9uczpmb3JjZS1yZWxvYWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnUmVsb2FkIEFsbCBDb21wbGV0aW9ucyAoaW5jbHVkaW5nIERvY3VtZW50YXRpb24pJyxcbiAgICAgICAgICAgICAgICBjb21tYW5kOiAnZm9yY2UtcmVsb2FkLShpbmNsdWRpbmctZG9jdW1lbnRhdGlvbiknXG4gICAgICAgICAgICB9XVxuICAgICAgICB9XVxuICAgIH1cbl0pO1xuICAgIC8vIEFkZCB0aGUgdGhlIHJlbG9hZGluZyBtZW51IGl0ZW1cblxuXG5mdW5jdGlvbiBnZXRIZWFkZXJQYXRocygpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdwYi1jb21wbGV0aW9ucy5oZWFkZXJwYXRocycpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gSSdtIG5vdCBzdXJlIHdoeSB0aGlzIGlzIG5lY2Vzc2FyeS5cbiAgICAgICAgLy8gSSBqdXN0IGtub3cgdGhhdCBmb3Igc29tZSByZWFzb24sIGl0IGlzLlxuICAgICAgICAvLyBJdCdzIGEgSEFDSywgSSBndWVzcy5cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRQYXRoO1xuICAgIH1cbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdwYi1jb21wbGV0aW9ucy5oZWFkZXJwYXRocycpO1xufVxuZnVuY3Rpb24gZ2V0SWdub3JlcygpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdwYi1jb21wbGV0aW9ucy5pZ25vcmVkaXRlbXMnKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIEknbSBub3Qgc3VyZSB3aHkgdGhpcyBpcyBuZWNlc3NhcnkuXG4gICAgICAgIC8vIEkganVzdCBrbm93IHRoYXQgZm9yIHNvbWUgcmVhc29uLCBpdCBpcy5cbiAgICAgICAgLy8gSXQncyBhIEhBQ0ssIEkgZ3Vlc3MuXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlZmF1bHRJZ25vcmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXRvbS5jb25maWcuZ2V0KCdwYi1jb21wbGV0aW9ucy5pZ25vcmVkaXRlbXMnKSk7XG59XG5cbmltcG9ydCBwcm92aWRlciBmcm9tICcuL3Byb3ZpZGVyJztcblxuYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ3BiLWNvbXBsZXRpb25zOmZvcmNlLXJlbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgIHByb3ZpZGVyLmluaXQoZ2V0SGVhZGVyUGF0aHMoKSwgZ2V0SWdub3JlcygpKTtcbiAgICBwcm92aWRlci5mb3JjZVJlbG9hZCgpO1xufSk7XG5cbmF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdwYi1jb21wbGV0aW9uczpmb3JjZS1yZWxvYWQtKGluY2x1ZGluZy1kb2N1bWVudGF0aW9uKScsIGZ1bmN0aW9uKCkge1xuICAgIHByb3ZpZGVyLmluaXQoZ2V0SGVhZGVyUGF0aHMoKSwgZ2V0SWdub3JlcygpKTtcbiAgICBwcm92aWRlci5kaXNjYXJkSGVhZGVyc0FuZEZvcmNlUmVsb2FkKCk7XG59KTtcbiAgICAvLyBBZGQgdGhlIHRoZSByZWxvYWRpbmcgY29tbWFuZFxuXG5mdW5jdGlvbiByZWluaXRQcm92aWRlcigpIHtcbiAgICBwcm92aWRlci5pbml0KGdldEhlYWRlclBhdGhzKCksIGdldElnbm9yZXMoKSk7XG4gICAgcHJvdmlkZXIubWF5YmVSZWxvYWQoKTtcbn1cblxuYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3BiLWNvbXBsZXRpb25zLmhlYWRlcnBhdGhzJywgcmVpbml0UHJvdmlkZXIpO1xuYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3BiLWNvbXBsZXRpb25zLmlnbm9yZWRpdGVtcycsIHJlaW5pdFByb3ZpZGVyKTtcbnJlaW5pdFByb3ZpZGVyKCk7XG4iXX0=
//# sourceURL=/home/jeremycarlsten/.atom/packages/pb-completions/lib/pb-completions.js
