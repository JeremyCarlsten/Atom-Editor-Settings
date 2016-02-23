function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _fuzzaldrin = require('fuzzaldrin');

var _fuzzaldrin2 = _interopRequireDefault(_fuzzaldrin);

var _colorProvider = require('./color-provider');

var _colorProvider2 = _interopRequireDefault(_colorProvider);

'use babel';
'use strict';

var colorProvider = new _colorProvider2['default'].PbColorProvider();
var packageInfo = JSON.parse(_fs2['default'].readFileSync(_path2['default'].resolve(__dirname, '../package.json')));

localStorage.PbCompletionsStoredItem_Suggestions = localStorage.PbCompletionsStoredItem_Suggestions || JSON.stringify([]);
localStorage.PbCompletionsStoredItem_Hashes = localStorage.PbCompletionsStoredItem_Hashes || JSON.stringify([]);
localStorage.PbCompletionsStoredItem_LastVersion = localStorage.PbCompletionsStoredItem_LastVersion || packageInfo.version;

localStorage.PbCompletionsStoredItem_NextFetch = localStorage.PbCompletionsStoredItem_NextFetch || 0;
localStorage.PbCompletionsStoredItem_Symbols = localStorage.PbCompletionsStoredItem_Symbols || [];

// Useful for debugging:
// localStorage.PbCompletionsStoredItem_Suggestions = JSON.stringify([]);
// localStorage.PbCompletionsStoredItem_Hashes = JSON.stringify([]);

var headerLocations = [];
var ignoredItems = [];

module.exports = {
    init: function init(path, ignore) {
        headerLocations = path.replace(/\{\{\{HOME\}\}\}/g, _os2['default'].homedir()).replace(/\{\{\{LIB\}\}\}/g, __dirname).split("{{{AND}}}");
        ignoredItems = ignore;
    },
    selector: '.source.c, .source.h',
    disableForSelector: '.source.c .comment, .source.h .comment',
    inclusionPriority: 10,
    suggestionPriority: 1,
    excludeLowerPriority: false,

    getSuggestions: function getSuggestions(obj) {
        var prefix = obj.prefix,
            validPath = false,
            pathArr = obj.editor.getPath();
        if (pathArr !== undefined) {
            pathArr = pathArr.split(_path2['default'].sep);
            for (var i = pathArr.length - 1; i > 1; i--) {
                var searchpath = pathArr.slice(0, i);
                searchpath.push('appinfo.json');
                searchpath = searchpath.join(_path2['default'].sep);
                if (_fs2['default'].existsSync(searchpath)) {
                    validPath = true;
                }
            }
        } else {
            return new Promise(function (resolve) {
                return resolve([]);
            });
        }
        if (validPath) {
            return new Promise(function (resolve) {
                var data = JSON.parse(localStorage.PbCompletionsStoredItem_Suggestions);
                var allItems = [];
                for (var k_itemList in data) {
                    allItems = allItems.concat(data[k_itemList]);
                }
                var possible = _fuzzaldrin2['default'].filter(allItems, prefix, { key: 'displayText' });
                return resolve(possible);
            });
        } else {
            return new Promise(function (resolve) {
                return resolve([]);
            });
        }
    },

    snippetize: function snippetize(str) {
        if (str === undefined) return '';
        var tmp = str.substr(1, str.length - 2);
        tmp = tmp.replace(/[\s\n]+/g, ' ');
        tmp = tmp.replace(/^void$/, '');
        if (tmp !== '') {
            var _ret = (function () {
                var counter = 1;
                var args = tmp.split(',').map(function (x) {
                    return x.trim();
                });
                args = args.map(function (x) {
                    return '${' + counter++ + ':' + x + '}';
                });
                // console.log('(' + args.join(', ') + ')');
                return {
                    v: '(' + args.join(', ') + ')'
                };
            })();

            if (typeof _ret === 'object') return _ret.v;
        } else {
            return '()${1:}';
        }
    },

    listify: function listify(str) {
        if (str === undefined) return [];
        var tmp = str.substr(1, str.length - 2);
        var args = tmp.split(',').map(function (x) {
            return x.trim();
        });
        return args;
    },

    processData: function processData(fn, out, data, options, parent_data) {
        if (!('regex' in options) || !('callback' in options) || !('type' in options)) {
            console.log(options);
            throw "Some options missing from (regex/callback/type)";
        }
        var regex = new RegExp(options.regex[0], options.regex[1]),
            matches = data.match(regex);
        for (var match in matches) {
            var regex2 = new RegExp(options.regex[0], options.regex[1]),
                temp = regex2.exec(matches[match]);
            if (temp !== null) {
                var ignore = false;
                for (var ignoredItem in ignoredItems) {
                    // Note: this section is extensively commented for
                    //      debugging purposes.
                    var ignoreWithThisRule = true,
                        igitem = ignoredItems[ignoredItem],
                        regex_ig_fn = new RegExp(igitem.fnregex, 'gm');
                    // If the type isn't fitting, can't match (ergo don't ignore)
                    if (igitem.type.indexOf(options.type) != -1) {
                        // Type is in the list.
                    } else {
                            ignoreWithThisRule = false;
                        }
                    // If the text regex doesn't match, don't ignore
                    // If it does match and ignoring until now; ignore.
                    // If regex is missing, don't alter state.
                    if (igitem.regex === undefined) {
                        // Test missing.
                    } else if (matches[match].match(new RegExp(igitem.regex, 'gm'))) {
                            // Matches.
                            // console.error("Matches ", matches[match]);
                        } else {
                                // Doesn't match.
                                ignoreWithThisRule = false;
                            }
                    // If the filename regex doesn't match, don't ignore
                    // If it does match and ignoring until now; ignore.
                    // If regex is missing, don't alter state.
                    if (igitem.fnregex === undefined) {
                        // Test missing.
                    } else if (fn.match(new RegExp(igitem.fnregex, 'gm'))) {
                            // Matches.
                            // console.error("Matches ", fn);
                        } else {
                                // Doesn't match.
                                ignoreWithThisRule = false;
                            }
                    ignore |= ignoreWithThisRule;
                }
                if (!ignore) {
                    out.push(options.callback(temp, parent_data));
                } else {
                    // console.error(temp, parent_data);
                }
            }
        }
    },
    processDataFromEnumeration: function processDataFromEnumeration(fn, out, data, options) {
        if (!('enumerationregex' in options) || !('regex' in options) || !('callback' in options) || !('type' in options)) {
            console.log(options);
            throw "Some options missing from " + "(enumerationregex/regex/callback/type)";
        }
        var enumerationregex = new RegExp(options.enumerationregex[0], options.enumerationregex[1]),
            matches = data.match(enumerationregex);
        for (var match in matches) {
            if ('parentDataCallback' in options) {
                enumerationregex = new RegExp(options.enumerationregex[0], options.enumerationregex[1]);
                var _data = enumerationregex.exec(matches[match]);
                module.exports.processData(fn, out, matches[match], options, options.parentDataCallback(_data));
            } else {
                module.exports.processData(fn, out, matches[match], options);
            }
        }
    },

    applyDocsInfo: function applyDocsInfo(out, name, documentation) {
        var documentationItem = documentation.filter(function (x) {
            return x.name == name;
        })[0];
        if (typeof documentationItem != 'undefined') {
            out.descriptionMoreURL = documentationItem ? 'https://developer.getpebble.com' + documentationItem.url : undefined;
            if (out.description) {
                out.description += ' — ' + documentationItem.summary.replace(/&lt;\/?.+?&gt;/g, '');
            } else {
                out.description = documentationItem.summary.replace(/&lt;\/?.+?&gt;/g, '');
            }
        }
    },

    applyArgsInfo: function applyArgsInfo(out, argString, returns) {
        var args = module.exports.listify(argString),
            varLength = true;
        if (args.length == 1 && args[0] == 'void') {
            args = [];
        }
        if (args[args.length - 1] == '...') {
            args.pop();
            varLength = true;
        }
        if (args.length !== 0) {
            out.description = 'Takes ' + args.length + (varLength ? '+' : '') + ' ' + ('argument' + (args.length == 1 ? '' : 's') + '; ') + ('returns ' + returns);
        }
    },

    reloadSuggestions: function reloadSuggestions(fn, data, documentation) {
        var suggestions = [];
        module.exports.processData(fn, suggestions, data, {
            regex: ["^#define\\s+(\\w+)(\\(.+?\\))?", "gm"],
            callback: function callback(result) {
                var colorData = colorProvider.cssClassForString(result[1]);
                var out = {
                    'snippet': result[1] + module.exports.snippetize(result[2]),
                    'displayText': result[1],
                    'leftLabel': '#define',
                    'type': result[2] === undefined ? 'constant' : 'function'
                };
                if (colorData == 'clear') {
                    out.leftLabel = undefined;
                    out.rightLabelHTML = '· <span class="pb-swatch" ' + 'style="background-color: white;' + 'background-image: linear-gradient(' + 'to bottom right, white 45%, red 45%,' + 'red 55%, white 55%);' + 'display: inline-block;' + 'vertical-align: middle;' + 'height: 14px;' + 'width: 14px;' + 'border: 1px solid black;' + 'border-radius: 50%;">&nbsp;</span>';
                    out.description = 'Transparent. See all the colors here: ';
                    out.descriptionMoreURL = 'https://developer.getpebble.com/more/color-picker/';
                } else if (colorData !== '') {
                    out.leftLabel = undefined;
                    out.rightLabelHTML = '· <span class="pb-swatch" ' + 'style="background-color:' + colorData + ';' + 'display: inline-block;' + 'vertical-align: middle;' + 'height: 14px;' + 'width: 14px;' + 'border: 1px solid black;' + 'border-radius: 50%;">&nbsp;</span>';
                    out.description = colorData + '. See all the colors here: ';
                    out.descriptionMoreURL = 'https://developer.getpebble.com/more/color-picker/';
                } else {
                    module.exports.applyArgsInfo(out, result[2]);
                    module.exports.applyDocsInfo(out, result[1], documentation);
                }
                return out;
            },
            type: 'define'
        });
        module.exports.processData(fn, suggestions, data, {
            // If you need help debugging this regex:
            //      Just replace // with /, then apply regexr. Good luck!
            regex: ["^((?:const\\s?|struct\\s?)*\\s?\\w+\\*?)?\\s+\\*?" + "\\s?(\\w+) ?(\\([^\\\\\\/\\(\\)]*\\));", "gm"],
            callback: function callback(result) {
                var out = {
                    'snippet': result[2] + module.exports.snippetize(result[3]),
                    'displayText': result[2],
                    'leftLabel': result[1],
                    'type': 'function'
                };
                module.exports.applyArgsInfo(out, result[3], result[1]);
                module.exports.applyDocsInfo(out, result[2], documentation);
                return out;
            },
            type: 'function'
        });
        module.exports.processDataFromEnumeration(fn, suggestions, data, {
            // If you need help debugging this regex:
            //      Just replace // with /, then apply regexr. Good luck!
            enumerationregex: ["typedef\\s+enum\\s*{([\\s\\S]*?)}\\s*(.*);", "gm"],
            parentDataCallback: function parentDataCallback(data) {
                return data[2];
            },
            regex: ["^\\s*(\\w+)", "gm"],
            callback: function callback(result, parent_result) {
                var out = {
                    'text': result[1],
                    'leftLabel': parent_result,
                    'type': 'const',
                    'description': 'Part of enum ' + parent_result
                };
                module.exports.applyDocsInfo(out, result[1], documentation);
                return out;
            },
            type: 'enum'
        });
        return suggestions;
    },

    reloadWarnSuggestions: function reloadWarnSuggestions(fn, data, documentation) {
        var suggestions = [];
        module.exports.processData(fn, suggestions, data, {
            regex: ["^#define\\s+(\\w+)(\\(.+?\\))?", "gm"],
            callback: function callback(result) {
                var colorData = colorProvider.cssClassForString(result[1]);
                var out = {
                    'snippet': '${1:-}',
                    'type': 'class', //because colors
                    'displayText': result[1],
                    'leftLabelHTML': '<span style="color: red;' + 'text-shadow: 0 0 1px red;">Unsupported</span>',
                    'iconHTML': '<i class="icon-circle-slash"></i>'
                };
                return out;
            },
            type: 'define'
        });
        return suggestions;
    },

    reloadHeaders: function reloadHeaders() {
        atom.notifications.addInfo('pb-completions: Reloading headers.', { icon: 'ellipsis' });
        var suggestions = {},
            hashes = JSON.parse(localStorage.PbCompletionsStoredItem_Hashes),
            documentation = JSON.parse(localStorage.PbCompletionsStoredItem_Symbols);
        for (var headerLocKey in headerLocations) {
            var _location = headerLocations[headerLocKey],
                data = undefined;
            try {
                data = _fs2['default'].readFileSync(_location, 'utf8');
            } catch (e) {
                console.log('pb-completions provider can\'t load file: ' + e);
                atom.notifications.addWarning('pb-completions: Can\'t read header', {
                    dismissable: true,
                    detail: _location
                });
                continue;
            }
            var hash = _crypto2['default'].createHash('sha256').update(data).digest('hex');
            if (hashes.indexOf(hash) < 0) {
                if (_location.includes('unsupported')) {
                    suggestions[hash] = module.exports.reloadWarnSuggestions(_location, data, documentation);
                } else {
                    suggestions[hash] = module.exports.reloadSuggestions(_location, data, documentation);
                }
                hashes.push(hash);
            }
        }
        localStorage.PbCompletionsStoredItem_Hashes = JSON.stringify(hashes);
        localStorage.PbCompletionsStoredItem_Suggestions = JSON.stringify(suggestions);
        atom.notifications.addSuccess('pb-completions: Reloaded headers.', { icon: 'check', detail: 'Locations:\n' + headerLocations.join('\n') });
    },

    reload: function reload() {
        var symbols = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        if (symbols) {
            atom.notifications.addInfo('pb-completions: Fetching new symbols file', {});
            var req = _https2['default'].request({
                hostname: 'developer.getpebble.com',
                path: '/docs/symbols.json',
                method: 'get'
            }, function (response) {
                var str = '';
                response.on('data', function (data) {
                    str += data;
                });
                response.on('end', function () {
                    var data = JSON.parse(str);
                    data = data.filter(function (x) {
                        return x.language == 'c';
                    });
                    localStorage.PbCompletionsStoredItem_Symbols = JSON.stringify(data);
                    atom.notifications.addSuccess('pb-completions: Fetched new symbols file! Reloading...', {});
                    module.exports.reloadHeaders();
                });
            });
            req.on('error', function (err) {
                atom.notifications.addWarning('pb-completions: Failed fetching new symbols file! Reloading headers anyway...', {});
                localStorage.PbCompletionsStoredItem_NextFetch = 0;
                module.exports.reloadHeaders();
            });
            req.end();
        } else {
            module.exports.reloadHeaders();
        }
    },

    maybeReload: function maybeReload() {
        var hashes = JSON.parse(localStorage.PbCompletionsStoredItem_Hashes);
        var requireReload = false;
        if (localStorage.PbCompletionsStoredItem_NextFetch < new Date().getTime() / 1000) {
            localStorage.PbCompletionsStoredItem_NextFetch = new Date().getTime() / 1000 + 60 * 60 * 24 * 3;
            console.log('pb-completions: Docs are old. Reloading...');
            localStorage.PbCompletionsStoredItem_LastVersion = packageInfo.version;
            module.exports.reload(true);
            console.log('pb-completions: Reloaded.');
            return;
        } else if (packageInfo.version != localStorage.PbCompletionsStoredItem_LastVersion) {
            localStorage.PbCompletionsStoredItem_LastVersion = packageInfo.version;
            console.log('pb-completions: Version has changed. Reloading...');
            module.exports.reload();
            console.log('pb-completions: Reloaded.');
            return;
        }
        for (var headerLocKey in headerLocations) {
            var _location2 = headerLocations[headerLocKey];
            var data = undefined;
            try {
                data = _fs2['default'].readFileSync(_location2, 'utf8');
            } catch (e) {
                console.log('pb-completions provider can\'t load file: ' + e);
                atom.notifications.addWarning('pb-completions: Can\'t read header', {
                    dismissable: true,
                    detail: _location2
                });
                continue;
            }
            var hash = _crypto2['default'].createHash('sha256').update(data).digest('hex');
            if (hashes.indexOf(hash) < 0) {
                requireReload = true;
                continue;
            }
        }
        if (requireReload) {
            console.log('pb-completions: Files have changed. Reloading...');
            module.exports.reload();
            console.log('pb-completions: Reloaded.');
        }
    },

    forceReload: function forceReload() {
        console.log('pb-completions: Reloading...');
        localStorage.PbCompletionsStoredItem_Suggestions = JSON.stringify([]);
        localStorage.PbCompletionsStoredItem_Hashes = JSON.stringify([]);
        module.exports.reload();
        console.log('pb-completions: Reloaded.');
    },

    discardHeadersAndForceReload: function discardHeadersAndForceReload() {
        console.log('pb-completions: Purged documentation data. Reloading all...');
        localStorage.PbCompletionsStoredItem_Suggestions = JSON.stringify([]);
        localStorage.PbCompletionsStoredItem_Hashes = JSON.stringify([]);
        module.exports.reload(true);
        console.log('pb-completions: Reloaded.');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2plcmVteWNhcmxzdGVuLy5hdG9tL3BhY2thZ2VzL3BiLWNvbXBsZXRpb25zL2xpYi9wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBS2UsSUFBSTs7OztrQkFDSixJQUFJOzs7O29CQUNGLE1BQU07Ozs7cUJBQ0wsT0FBTzs7OztzQkFDTixRQUFROzs7OzBCQUNKLFlBQVk7Ozs7NkJBQ1Isa0JBQWtCOzs7O0FBWDdDLFdBQVcsQ0FBQztBQUNaLFlBQVksQ0FBQzs7QUFZYixJQUFJLGFBQWEsR0FBRyxJQUFJLDJCQUFlLGVBQWUsRUFBRSxDQUFDO0FBQ3pELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQ3BCLGdCQUFHLFlBQVksQ0FBQyxrQkFBSyxPQUFPLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVyRSxZQUFZLENBQUMsbUNBQW1DLEdBQUcsWUFBWSxDQUFDLG1DQUFtQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUgsWUFBWSxDQUFDLDhCQUE4QixHQUFHLFlBQVksQ0FBQyw4QkFBOEIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hILFlBQVksQ0FBQyxtQ0FBbUMsR0FBRyxZQUFZLENBQUMsbUNBQW1DLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQzs7QUFFM0gsWUFBWSxDQUFDLGlDQUFpQyxHQUFHLFlBQVksQ0FBQyxpQ0FBaUMsSUFBSSxDQUFDLENBQUM7QUFDckcsWUFBWSxDQUFDLCtCQUErQixHQUFHLFlBQVksQ0FBQywrQkFBK0IsSUFBSSxFQUFFLENBQUM7Ozs7OztBQU1sRyxJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDekIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDOztBQUV0QixNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2IsUUFBSSxFQUFBLGNBQUMsSUFBSSxFQUFFLE1B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QyxDQUFDO0FBQ3RFLG9CQUFZLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRSxjQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3hCLGVBQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztLQUM1Qzs7QUFFRCxnQ0FBNEIsRUFBQSx3Q0FBRztBQUMzQixlQUFPLENBQUMsR0FBRyxDQUFDLDZEQUE2RCxDQUFDLENBQUM7QUFDM0Usb0JBQVksQ0FBQyxtQ0FBbUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RFLG9CQUFZLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRSxjQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixlQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7S0FDNUM7Q0FDSixDQUFDIiwiZmlsZSI6Ii9ob21lL2plcmVteWNhcmxzdGVuLy5hdG9tL3BhY2thZ2VzL3BiLWNvbXBsZXRpb25zL2xpYi9wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cbi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGdsb2JhbCBsb2NhbFN0b3JhZ2UsIGNvbnNvbGUsIGF0b20sIG1vZHVsZSAqL1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgZnV6emFsZHJpbiBmcm9tICdmdXp6YWxkcmluJztcbmltcG9ydCBjb2xvcl9wcm92aWRlciBmcm9tICcuL2NvbG9yLXByb3ZpZGVyJztcblxudmFyIGNvbG9yUHJvdmlkZXIgPSBuZXcgY29sb3JfcHJvdmlkZXIuUGJDb2xvclByb3ZpZGVyKCk7XG52YXIgcGFja2FnZUluZm8gPSBKU09OLnBhcnNlKFxuICAgICAgICBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL3BhY2thZ2UuanNvbicpKSk7XG5cbmxvY2FsU3RvcmFnZS5QYkNvbXBsZXRpb25zU3RvcmVkSXRlbV9TdWdnZXN0aW9ucyA9IGxvY2FsU3RvcmFnZS5QYkNvbXBsZXRpb25zU3RvcmVkSXRlbV9TdWdnZXN0aW9ucyB8fCBKU09OLnN0cmluZ2lmeShbXSk7XG5sb2NhbFN0b3JhZ2UuUGJDb21wbGV0aW9uc1N0b3JlZEl0ZW1fSGFzaGVzID0gbG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX0hhc2hlcyB8fCBKU09OLnN0cmluZ2lmeShbXSk7XG5sb2NhbFN0b3JhZ2UuUGJDb21wbGV0aW9uc1N0b3JlZEl0ZW1fTGFzdFZlcnNpb24gPSBsb2NhbFN0b3JhZ2UuUGJDb21wbGV0aW9uc1N0b3JlZEl0ZW1fTGFzdFZlcnNpb24gfHwgcGFja2FnZUluZm8udmVyc2lvbjtcblxubG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX05leHRGZXRjaCA9IGxvY2FsU3RvcmFnZS5QYkNvbXBsZXRpb25zU3RvcmVkSXRlbV9OZXh0RmV0Y2ggfHwgMDtcbmxvY2FsU3RvcmFnZS5QYkNvbXBsZXRpb25zU3RvcmVkSXRlbV9TeW1ib2xzID0gbG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX1N5bWJvbHMgfHwgW107XG5cbi8vIFVzZWZ1bCBmb3IgZGVidWdnaW5nOlxuLy8gbG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX1N1Z2dlc3Rpb25zID0gSlNPTi5zdHJpbmdpZnkoW10pO1xuLy8gbG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX0hhc2hlcyA9IEpTT04uc3RyaW5naWZ5KFtdKTtcblxudmFyIGhlYWRlckxvY2F0aW9ucyA9IFtdO1xudmFyIGlnbm9yZWRJdGVtcyA9IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0KHBhdGgsIGlnbm9yZSkge1xuICAgICAgICBoZWFkZXJMb2NhdGlvbnMgPSBwYXRoXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xce1xce1xce0hPTUVcXH1cXH1cXH0vZywgb3MuaG9tZWRpcigpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHtMSUJcXH1cXH1cXH0vZywgX19kaXJuYW1lKVxuICAgICAgICAgICAgICAgIC5zcGxpdChcInt7e0FORH19fVwiKTtcbiAgICAgICAgaWdub3JlZEl0ZW1zID0gaWdub3JlO1xuICAgIH0sXG4gICAgc2VsZWN0b3I6ICcuc291cmNlLmMsIC5zb3VyY2UuaCcsXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5jIC5jb21tZW50LCAuc291cmNlLmggLmNvbW1lbnQnLFxuICAgIGluY2x1c2lvblByaW9yaXR5OiAxMCxcbiAgICBzdWdnZXN0aW9uUHJpb3JpdHk6IDEsXG4gICAgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IGZhbHNlLFxuXG4gICAgZ2V0U3VnZ2VzdGlvbnMob2JqKSB7XG4gICAgICAgIGxldCBwcmVmaXggPSBvYmoucHJlZml4LFxuICAgICAgICAgICAgdmFsaWRQYXRoID0gZmFsc2UsXG4gICAgICAgICAgICBwYXRoQXJyID0gb2JqLmVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGlmIChwYXRoQXJyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBhdGhBcnIgPSBwYXRoQXJyLnNwbGl0KHBhdGguc2VwKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBwYXRoQXJyLmxlbmd0aCAtIDE7IGkgPiAxOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VhcmNocGF0aCA9IHBhdGhBcnIuc2xpY2UoMCwgaSk7XG4gICAgICAgICAgICAgICAgc2VhcmNocGF0aC5wdXNoKCdhcHBpbmZvLmpzb24nKTtcbiAgICAgICAgICAgICAgICBzZWFyY2hwYXRoID0gc2VhcmNocGF0aC5qb2luKHBhdGguc2VwKTtcbiAgICAgICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhzZWFyY2hwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZFBhdGggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbGlkUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX1N1Z2dlc3Rpb25zKTtcbiAgICAgICAgICAgICAgICBsZXQgYWxsSXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrX2l0ZW1MaXN0IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsSXRlbXMgPSBhbGxJdGVtcy5jb25jYXQoZGF0YVtrX2l0ZW1MaXN0XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBwb3NzaWJsZSA9IGZ1enphbGRyaW4uZmlsdGVyKGFsbEl0ZW1zLCBwcmVmaXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2tleTogJ2Rpc3BsYXlUZXh0J30pO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHBvc3NpYmxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzbmlwcGV0aXplKHN0cikge1xuICAgICAgICBpZiAoc3RyID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIGxldCB0bXAgPSBzdHIuc3Vic3RyKDEsIHN0ci5sZW5ndGggLSAyKTtcbiAgICAgICAgdG1wID0gdG1wLnJlcGxhY2UoL1tcXHNcXG5dKy9nLCAnICcpO1xuICAgICAgICB0bXAgPSB0bXAucmVwbGFjZSgvXnZvaWQkLywgJycpO1xuICAgICAgICBpZiAodG1wICE9PSAnJykge1xuICAgICAgICAgICAgbGV0IGNvdW50ZXIgPSAxO1xuICAgICAgICAgICAgbGV0IGFyZ3MgPSB0bXAuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG4gICAgICAgICAgICBhcmdzID0gYXJncy5tYXAoeCA9PiAnJHsnICsgKGNvdW50ZXIrKykgKyAnOicgKyB4ICsgJ30nKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCcoJyArIGFyZ3Muam9pbignLCAnKSArICcpJyk7XG4gICAgICAgICAgICByZXR1cm4gJygnICsgYXJncy5qb2luKCcsICcpICsgJyknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICcoKSR7MTp9JztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBsaXN0aWZ5KHN0cikge1xuICAgICAgICBpZiAoc3RyID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIGxldCB0bXAgPSBzdHIuc3Vic3RyKDEsIHN0ci5sZW5ndGggLSAyKTtcbiAgICAgICAgbGV0IGFyZ3MgPSB0bXAuc3BsaXQoJywnKS5tYXAoeCA9PiB4LnRyaW0oKSk7XG4gICAgICAgIHJldHVybiBhcmdzO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzRGF0YShmbiwgb3V0LCBkYXRhLCBvcHRpb25zLCBwYXJlbnRfZGF0YSkge1xuICAgICAgICBpZiAoISgncmVnZXgnIGluIG9wdGlvbnMpIHx8XG4gICAgICAgICAgICAhKCdjYWxsYmFjaycgaW4gb3B0aW9ucykgfHxcbiAgICAgICAgICAgICEoJ3R5cGUnIGluIG9wdGlvbnMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbiAgICAgICAgICAgIHRocm93IFwiU29tZSBvcHRpb25zIG1pc3NpbmcgZnJvbSAocmVnZXgvY2FsbGJhY2svdHlwZSlcIjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVnZXggPSBuZXcgUmVnRXhwKG9wdGlvbnMucmVnZXhbMF0sIG9wdGlvbnMucmVnZXhbMV0pLFxuICAgICAgICAgICAgbWF0Y2hlcyA9IGRhdGEubWF0Y2gocmVnZXgpO1xuICAgICAgICBmb3IgKHZhciBtYXRjaCBpbiBtYXRjaGVzKSB7XG4gICAgICAgICAgICBsZXQgcmVnZXgyID0gbmV3IFJlZ0V4cChvcHRpb25zLnJlZ2V4WzBdLCBvcHRpb25zLnJlZ2V4WzFdKSxcbiAgICAgICAgICAgICAgICB0ZW1wID0gcmVnZXgyLmV4ZWMobWF0Y2hlc1ttYXRjaF0pO1xuICAgICAgICAgICAgaWYgKHRlbXAgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgaWdub3JlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWdub3JlZEl0ZW0gaW4gaWdub3JlZEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdGU6IHRoaXMgc2VjdGlvbiBpcyBleHRlbnNpdmVseSBjb21tZW50ZWQgZm9yXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgZGVidWdnaW5nIHB1cnBvc2VzLlxuICAgICAgICAgICAgICAgICAgICBsZXQgaWdub3JlV2l0aFRoaXNSdWxlID0gdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlnaXRlbSA9IGlnbm9yZWRJdGVtc1tpZ25vcmVkSXRlbV0sXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdleF9pZ19mbiA9IG5ldyBSZWdFeHAoaWdpdGVtLmZucmVnZXgsICdnbScpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdHlwZSBpc24ndCBmaXR0aW5nLCBjYW4ndCBtYXRjaCAoZXJnbyBkb24ndCBpZ25vcmUpXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZ2l0ZW0udHlwZS5pbmRleE9mKG9wdGlvbnMudHlwZSkgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFR5cGUgaXMgaW4gdGhlIGxpc3QuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZ25vcmVXaXRoVGhpc1J1bGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdGV4dCByZWdleCBkb2Vzbid0IG1hdGNoLCBkb24ndCBpZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaXQgZG9lcyBtYXRjaCBhbmQgaWdub3JpbmcgdW50aWwgbm93OyBpZ25vcmUuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHJlZ2V4IGlzIG1pc3NpbmcsIGRvbid0IGFsdGVyIHN0YXRlLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaWdpdGVtLnJlZ2V4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRlc3QgbWlzc2luZy5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaGVzW21hdGNoXS5tYXRjaChuZXcgUmVnRXhwKGlnaXRlbS5yZWdleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdnbScpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWF0Y2hlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJNYXRjaGVzIFwiLCBtYXRjaGVzW21hdGNoXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IG1hdGNoLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWdub3JlV2l0aFRoaXNSdWxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGZpbGVuYW1lIHJlZ2V4IGRvZXNuJ3QgbWF0Y2gsIGRvbid0IGlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpdCBkb2VzIG1hdGNoIGFuZCBpZ25vcmluZyB1bnRpbCBub3c7IGlnbm9yZS5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgcmVnZXggaXMgbWlzc2luZywgZG9uJ3QgYWx0ZXIgc3RhdGUuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZ2l0ZW0uZm5yZWdleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXN0IG1pc3NpbmcuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm4ubWF0Y2gobmV3IFJlZ0V4cChpZ2l0ZW0uZm5yZWdleCwgJ2dtJykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYXRjaGVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIk1hdGNoZXMgXCIsIGZuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgbWF0Y2guXG4gICAgICAgICAgICAgICAgICAgICAgICBpZ25vcmVXaXRoVGhpc1J1bGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZ25vcmUgfD0gaWdub3JlV2l0aFRoaXNSdWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWlnbm9yZSkge1xuICAgICAgICAgICAgICAgICAgICBvdXQucHVzaChvcHRpb25zLmNhbGxiYWNrKHRlbXAsIHBhcmVudF9kYXRhKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcih0ZW1wLCBwYXJlbnRfZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBwcm9jZXNzRGF0YUZyb21FbnVtZXJhdGlvbihmbiwgb3V0LCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICghKCdlbnVtZXJhdGlvbnJlZ2V4JyBpbiBvcHRpb25zKSB8fFxuICAgICAgICAgICAgISgncmVnZXgnIGluIG9wdGlvbnMpIHx8XG4gICAgICAgICAgICAhKCdjYWxsYmFjaycgaW4gb3B0aW9ucykgfHxcbiAgICAgICAgICAgICEoJ3R5cGUnIGluIG9wdGlvbnMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbiAgICAgICAgICAgIHRocm93IFwiU29tZSBvcHRpb25zIG1pc3NpbmcgZnJvbSBcIiArXG4gICAgICAgICAgICAgICAgICBcIihlbnVtZXJhdGlvbnJlZ2V4L3JlZ2V4L2NhbGxiYWNrL3R5cGUpXCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVudW1lcmF0aW9ucmVnZXggPSBuZXcgUmVnRXhwKG9wdGlvbnMuZW51bWVyYXRpb25yZWdleFswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZW51bWVyYXRpb25yZWdleFsxXSksXG4gICAgICAgICAgICBtYXRjaGVzID0gZGF0YS5tYXRjaChlbnVtZXJhdGlvbnJlZ2V4KTtcbiAgICAgICAgZm9yIChsZXQgbWF0Y2ggaW4gbWF0Y2hlcykge1xuICAgICAgICAgICAgaWYgKCdwYXJlbnREYXRhQ2FsbGJhY2snIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBlbnVtZXJhdGlvbnJlZ2V4ID0gbmV3IFJlZ0V4cChvcHRpb25zLmVudW1lcmF0aW9ucmVnZXhbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lbnVtZXJhdGlvbnJlZ2V4WzFdKTtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IGVudW1lcmF0aW9ucmVnZXguZXhlYyhtYXRjaGVzW21hdGNoXSk7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMucHJvY2Vzc0RhdGEoZm4sIG91dCwgbWF0Y2hlc1ttYXRjaF0sIG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBhcmVudERhdGFDYWxsYmFjayhkYXRhKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLnByb2Nlc3NEYXRhKGZuLCBvdXQsIG1hdGNoZXNbbWF0Y2hdLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhcHBseURvY3NJbmZvKG91dCwgbmFtZSwgZG9jdW1lbnRhdGlvbikge1xuICAgICAgICBsZXQgZG9jdW1lbnRhdGlvbkl0ZW0gPSBkb2N1bWVudGF0aW9uXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC5uYW1lID09IG5hbWUpXG4gICAgICAgICAgICBbMF07XG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnRhdGlvbkl0ZW0gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG91dC5kZXNjcmlwdGlvbk1vcmVVUkwgPSBkb2N1bWVudGF0aW9uSXRlbSA/XG4gICAgICAgICAgICAgICAgJ2h0dHBzOi8vZGV2ZWxvcGVyLmdldHBlYmJsZS5jb20nICsgZG9jdW1lbnRhdGlvbkl0ZW0udXJsIDpcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAob3V0LmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgb3V0LmRlc2NyaXB0aW9uICs9ICcg4oCUICcgKyBkb2N1bWVudGF0aW9uSXRlbS5zdW1tYXJ5XG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mbHQ7XFwvPy4rPyZndDsvZywgJycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXQuZGVzY3JpcHRpb24gPSBkb2N1bWVudGF0aW9uSXRlbS5zdW1tYXJ5XG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mbHQ7XFwvPy4rPyZndDsvZywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFwcGx5QXJnc0luZm8ob3V0LCBhcmdTdHJpbmcsIHJldHVybnMpIHtcbiAgICAgICAgbGV0IGFyZ3MgPSBtb2R1bGUuZXhwb3J0cy5saXN0aWZ5KGFyZ1N0cmluZyksXG4gICAgICAgICAgICB2YXJMZW5ndGggPSB0cnVlO1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT0gMSAmJiBhcmdzWzBdID09ICd2b2lkJykge1xuICAgICAgICAgICAgYXJncyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPT0gJy4uLicpIHtcbiAgICAgICAgICAgIGFyZ3MucG9wKCk7XG4gICAgICAgICAgICB2YXJMZW5ndGggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgb3V0LmRlc2NyaXB0aW9uID0gYFRha2VzICR7YXJncy5sZW5ndGh9JHt2YXJMZW5ndGggPyAnKycgOiAnJ30gYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXJndW1lbnQke2FyZ3MubGVuZ3RoID09IDEgPyAnJyA6ICdzJ307IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHJldHVybnMgJHtyZXR1cm5zfWA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVsb2FkU3VnZ2VzdGlvbnMoZm4sIGRhdGEsIGRvY3VtZW50YXRpb24pIHtcbiAgICAgICAgbGV0IHN1Z2dlc3Rpb25zID0gW107XG4gICAgICAgIG1vZHVsZS5leHBvcnRzLnByb2Nlc3NEYXRhKGZuLCBzdWdnZXN0aW9ucywgZGF0YSwge1xuICAgICAgICAgICAgcmVnZXg6IFtcIl4jZGVmaW5lXFxcXHMrKFxcXFx3KykoXFxcXCguKz9cXFxcKSk/XCIsIFwiZ21cIl0sXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbG9yRGF0YSA9IGNvbG9yUHJvdmlkZXIuY3NzQ2xhc3NGb3JTdHJpbmcocmVzdWx0WzFdKTtcbiAgICAgICAgICAgICAgICBsZXQgb3V0ID0ge1xuICAgICAgICAgICAgICAgICAgICAnc25pcHBldCc6IHJlc3VsdFsxXSArIG1vZHVsZS5leHBvcnRzLnNuaXBwZXRpemUocmVzdWx0WzJdKSxcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXlUZXh0JzogcmVzdWx0WzFdLFxuICAgICAgICAgICAgICAgICAgICAnbGVmdExhYmVsJzogJyNkZWZpbmUnLFxuICAgICAgICAgICAgICAgICAgICAndHlwZSc6IChyZXN1bHRbMl0gPT09IHVuZGVmaW5lZCA/ICdjb25zdGFudCcgOiAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGNvbG9yRGF0YSA9PSAnY2xlYXInKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dC5sZWZ0TGFiZWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIG91dC5yaWdodExhYmVsSFRNTCA9ICfCtyA8c3BhbiBjbGFzcz1cInBiLXN3YXRjaFwiICcrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RvIGJvdHRvbSByaWdodCwgd2hpdGUgNDUlLCByZWQgNDUlLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyZWQgNTUlLCB3aGl0ZSA1NSUpOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGlzcGxheTogaW5saW5lLWJsb2NrOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVydGljYWwtYWxpZ246IG1pZGRsZTsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodDogMTRweDsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoOiAxNHB4OycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVyOiAxcHggc29saWQgYmxhY2s7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXItcmFkaXVzOiA1MCU7XCI+Jm5ic3A7PC9zcGFuPic7XG4gICAgICAgICAgICAgICAgICAgIG91dC5kZXNjcmlwdGlvbiA9ICdUcmFuc3BhcmVudC4gU2VlIGFsbCB0aGUgY29sb3JzIGhlcmU6ICc7XG4gICAgICAgICAgICAgICAgICAgIG91dC5kZXNjcmlwdGlvbk1vcmVVUkwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgJ2h0dHBzOi8vZGV2ZWxvcGVyLmdldHBlYmJsZS5jb20vbW9yZS9jb2xvci1waWNrZXIvJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yRGF0YSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0LmxlZnRMYWJlbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgb3V0LnJpZ2h0TGFiZWxIVE1MID0gJ8K3IDxzcGFuIGNsYXNzPVwicGItc3dhdGNoXCIgJytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOicgKyBjb2xvckRhdGEgKyAnOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGlzcGxheTogaW5saW5lLWJsb2NrOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmVydGljYWwtYWxpZ246IG1pZGRsZTsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodDogMTRweDsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoOiAxNHB4OycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVyOiAxcHggc29saWQgYmxhY2s7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXItcmFkaXVzOiA1MCU7XCI+Jm5ic3A7PC9zcGFuPic7XG4gICAgICAgICAgICAgICAgICAgIG91dC5kZXNjcmlwdGlvbiA9IGNvbG9yRGF0YSArICcuIFNlZSBhbGwgdGhlIGNvbG9ycyBoZXJlOiAnO1xuICAgICAgICAgICAgICAgICAgICBvdXQuZGVzY3JpcHRpb25Nb3JlVVJMID1cbiAgICAgICAgICAgICAgICAgICAgICAgICdodHRwczovL2RldmVsb3Blci5nZXRwZWJibGUuY29tL21vcmUvY29sb3ItcGlja2VyLyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMuYXBwbHlBcmdzSW5mbyhvdXQsIHJlc3VsdFsyXSk7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLmFwcGx5RG9jc0luZm8ob3V0LCByZXN1bHRbMV0sIGRvY3VtZW50YXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6ICdkZWZpbmUnXG4gICAgICAgIH0pO1xuICAgICAgICBtb2R1bGUuZXhwb3J0cy5wcm9jZXNzRGF0YShmbiwgc3VnZ2VzdGlvbnMsIGRhdGEsIHtcbiAgICAgICAgICAgIC8vIElmIHlvdSBuZWVkIGhlbHAgZGVidWdnaW5nIHRoaXMgcmVnZXg6XG4gICAgICAgICAgICAvLyAgICAgIEp1c3QgcmVwbGFjZSAvLyB3aXRoIC8sIHRoZW4gYXBwbHkgcmVnZXhyLiBHb29kIGx1Y2shXG4gICAgICAgICAgICByZWdleDogW1wiXigoPzpjb25zdFxcXFxzP3xzdHJ1Y3RcXFxccz8pKlxcXFxzP1xcXFx3K1xcXFwqPyk/XFxcXHMrXFxcXCo/XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIlxcXFxzPyhcXFxcdyspID8oXFxcXChbXlxcXFxcXFxcXFxcXC9cXFxcKFxcXFwpXSpcXFxcKSk7XCIsIFwiZ21cIl0sXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgbGV0IG91dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3NuaXBwZXQnOiByZXN1bHRbMl0gKyBtb2R1bGUuZXhwb3J0cy5zbmlwcGV0aXplKHJlc3VsdFszXSksXG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5VGV4dCc6IHJlc3VsdFsyXSxcbiAgICAgICAgICAgICAgICAgICAgJ2xlZnRMYWJlbCc6IHJlc3VsdFsxXSxcbiAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBtb2R1bGUuZXhwb3J0cy5hcHBseUFyZ3NJbmZvKG91dCwgcmVzdWx0WzNdLCByZXN1bHRbMV0pO1xuICAgICAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLmFwcGx5RG9jc0luZm8ob3V0LCByZXN1bHRbMl0sIGRvY3VtZW50YXRpb24pO1xuICAgICAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogJ2Z1bmN0aW9uJ1xuICAgICAgICB9KTtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMucHJvY2Vzc0RhdGFGcm9tRW51bWVyYXRpb24oZm4sIHN1Z2dlc3Rpb25zLCBkYXRhLCB7XG4gICAgICAgICAgICAvLyBJZiB5b3UgbmVlZCBoZWxwIGRlYnVnZ2luZyB0aGlzIHJlZ2V4OlxuICAgICAgICAgICAgLy8gICAgICBKdXN0IHJlcGxhY2UgLy8gd2l0aCAvLCB0aGVuIGFwcGx5IHJlZ2V4ci4gR29vZCBsdWNrIVxuICAgICAgICAgICAgZW51bWVyYXRpb25yZWdleDogW1widHlwZWRlZlxcXFxzK2VudW1cXFxccyp7KFtcXFxcc1xcXFxTXSo/KX1cXFxccyooLiopO1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ21cIl0sXG4gICAgICAgICAgICBwYXJlbnREYXRhQ2FsbGJhY2s6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVsyXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWdleDogW1wiXlxcXFxzKihcXFxcdyspXCIsIFwiZ21cIl0sXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzdWx0LCBwYXJlbnRfcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgbGV0IG91dCA9ICB7XG4gICAgICAgICAgICAgICAgICAgICd0ZXh0JzogcmVzdWx0WzFdLFxuICAgICAgICAgICAgICAgICAgICAnbGVmdExhYmVsJzogcGFyZW50X3Jlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnY29uc3QnLFxuICAgICAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiBgUGFydCBvZiBlbnVtICR7cGFyZW50X3Jlc3VsdH1gXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBtb2R1bGUuZXhwb3J0cy5hcHBseURvY3NJbmZvKG91dCwgcmVzdWx0WzFdLCBkb2N1bWVudGF0aW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6ICdlbnVtJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zO1xuICAgIH0sXG5cbiAgICByZWxvYWRXYXJuU3VnZ2VzdGlvbnMoZm4sIGRhdGEsIGRvY3VtZW50YXRpb24pIHtcbiAgICAgICAgbGV0IHN1Z2dlc3Rpb25zID0gW107XG4gICAgICAgIG1vZHVsZS5leHBvcnRzLnByb2Nlc3NEYXRhKGZuLCBzdWdnZXN0aW9ucywgZGF0YSwge1xuICAgICAgICAgICAgcmVnZXg6IFtcIl4jZGVmaW5lXFxcXHMrKFxcXFx3KykoXFxcXCguKz9cXFxcKSk/XCIsIFwiZ21cIl0sXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbG9yRGF0YSA9IGNvbG9yUHJvdmlkZXIuY3NzQ2xhc3NGb3JTdHJpbmcocmVzdWx0WzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgb3V0ID0ge1xuICAgICAgICAgICAgICAgICAgICAnc25pcHBldCc6ICckezE6LX0nLFxuICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdjbGFzcycsIC8vYmVjYXVzZSBjb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXlUZXh0JzogcmVzdWx0WzFdLFxuICAgICAgICAgICAgICAgICAgICAnbGVmdExhYmVsSFRNTCc6ICc8c3BhbiBzdHlsZT1cImNvbG9yOiByZWQ7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtc2hhZG93OiAwIDAgMXB4IHJlZDtcIj5VbnN1cHBvcnRlZDwvc3Bhbj4nLFxuICAgICAgICAgICAgICAgICAgICAnaWNvbkhUTUwnOiAnPGkgY2xhc3M9XCJpY29uLWNpcmNsZS1zbGFzaFwiPjwvaT4nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6ICdkZWZpbmUnXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnM7XG4gICAgfSxcblxuICAgIHJlbG9hZEhlYWRlcnMoKSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdwYi1jb21wbGV0aW9uczogUmVsb2FkaW5nIGhlYWRlcnMuJyxcbiAgICAgICAge2ljb246ICdlbGxpcHNpcyd9KTtcbiAgICAgICAgbGV0IHN1Z2dlc3Rpb25zID0ge30sXG4gICAgICAgICAgICBoYXNoZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5QYkNvbXBsZXRpb25zU3RvcmVkSXRlbV9IYXNoZXMpLFxuICAgICAgICAgICAgZG9jdW1lbnRhdGlvbiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX1N5bWJvbHMpO1xuICAgICAgICBmb3IgKGxldCBoZWFkZXJMb2NLZXkgaW4gaGVhZGVyTG9jYXRpb25zKSB7XG4gICAgICAgICAgICBsZXQgbG9jYXRpb24gPSBoZWFkZXJMb2NhdGlvbnNbaGVhZGVyTG9jS2V5XSxcbiAgICAgICAgICAgICAgICBkYXRhO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGxvY2F0aW9uLCAndXRmOCcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBwYi1jb21wbGV0aW9ucyBwcm92aWRlciBjYW4ndCBsb2FkIGZpbGU6ICR7ZX1gKTtcbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgICAgICAgICAgICAgJ3BiLWNvbXBsZXRpb25zOiBDYW5cXCd0IHJlYWQgaGVhZGVyJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGRhdGEpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgICAgICBpZiAoaGFzaGVzLmluZGV4T2YoaGFzaCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmluY2x1ZGVzKCd1bnN1cHBvcnRlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zW2hhc2hdID1cbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLnJlbG9hZFdhcm5TdWdnZXN0aW9ucyhsb2NhdGlvbiwgZGF0YSwgZG9jdW1lbnRhdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnNbaGFzaF0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMucmVsb2FkU3VnZ2VzdGlvbnMobG9jYXRpb24sIGRhdGEsIGRvY3VtZW50YXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBoYXNoZXMucHVzaChoYXNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2UuUGJDb21wbGV0aW9uc1N0b3JlZEl0ZW1fSGFzaGVzID0gSlNPTi5zdHJpbmdpZnkoaGFzaGVzKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX1N1Z2dlc3Rpb25zID0gSlNPTi5zdHJpbmdpZnkoc3VnZ2VzdGlvbnMpO1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygncGItY29tcGxldGlvbnM6IFJlbG9hZGVkIGhlYWRlcnMuJyxcbiAgICAgICAge2ljb246ICdjaGVjaycsIGRldGFpbDogJ0xvY2F0aW9uczpcXG4nICsgaGVhZGVyTG9jYXRpb25zLmpvaW4oJ1xcbicpfSk7XG4gICAgfSxcblxuICAgIHJlbG9hZChzeW1ib2xzPWZhbHNlKSB7XG4gICAgICAgIGlmIChzeW1ib2xzKSB7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygncGItY29tcGxldGlvbnM6IEZldGNoaW5nIG5ldyBzeW1ib2xzIGZpbGUnLCB7fSk7XG4gICAgICAgICAgICBsZXQgcmVxID0gaHR0cHMucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgaG9zdG5hbWU6ICdkZXZlbG9wZXIuZ2V0cGViYmxlLmNvbScsXG4gICAgICAgICAgICAgICAgcGF0aDogJy9kb2NzL3N5bWJvbHMuanNvbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzdHIgPSAnJztcbiAgICAgICAgICAgICAgICByZXNwb25zZS5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSBkYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShzdHIpO1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIoKHgpID0+IHgubGFuZ3VhZ2UgPT0gJ2MnKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX1N5bWJvbHMgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ3BiLWNvbXBsZXRpb25zOiBGZXRjaGVkIG5ldyBzeW1ib2xzIGZpbGUhIFJlbG9hZGluZy4uLicsIHt9KTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMucmVsb2FkSGVhZGVycygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdwYi1jb21wbGV0aW9uczogRmFpbGVkIGZldGNoaW5nIG5ldyBzeW1ib2xzIGZpbGUhIFJlbG9hZGluZyBoZWFkZXJzIGFueXdheS4uLicsIHt9KTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuUGJDb21wbGV0aW9uc1N0b3JlZEl0ZW1fTmV4dEZldGNoID0gMDtcbiAgICAgICAgICAgICAgICBtb2R1bGUuZXhwb3J0cy5yZWxvYWRIZWFkZXJzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlcS5lbmQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLnJlbG9hZEhlYWRlcnMoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBtYXliZVJlbG9hZCgpIHtcbiAgICAgICAgbGV0IGhhc2hlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX0hhc2hlcyk7XG4gICAgICAgIGxldCByZXF1aXJlUmVsb2FkID0gZmFsc2U7XG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuUGJDb21wbGV0aW9uc1N0b3JlZEl0ZW1fTmV4dEZldGNoIDwgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5QYkNvbXBsZXRpb25zU3RvcmVkSXRlbV9OZXh0RmV0Y2ggPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSArIDYwKjYwKjI0KjM7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGItY29tcGxldGlvbnM6IERvY3MgYXJlIG9sZC4gUmVsb2FkaW5nLi4uJyk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuUGJDb21wbGV0aW9uc1N0b3JlZEl0ZW1fTGFzdFZlcnNpb24gPSBwYWNrYWdlSW5mby52ZXJzaW9uO1xuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMucmVsb2FkKHRydWUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3BiLWNvbXBsZXRpb25zOiBSZWxvYWRlZC4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChwYWNrYWdlSW5mby52ZXJzaW9uICE9IGxvY2FsU3RvcmFnZS5QYkNvbXBsZXRpb25zU3RvcmVkSXRlbV9MYXN0VmVyc2lvbikge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX0xhc3RWZXJzaW9uID0gcGFja2FnZUluZm8udmVyc2lvbjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwYi1jb21wbGV0aW9uczogVmVyc2lvbiBoYXMgY2hhbmdlZC4gUmVsb2FkaW5nLi4uJyk7XG4gICAgICAgICAgICBtb2R1bGUuZXhwb3J0cy5yZWxvYWQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwYi1jb21wbGV0aW9uczogUmVsb2FkZWQuJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaGVhZGVyTG9jS2V5IGluIGhlYWRlckxvY2F0aW9ucykge1xuICAgICAgICAgICAgbGV0IGxvY2F0aW9uID0gaGVhZGVyTG9jYXRpb25zW2hlYWRlckxvY0tleV07XG4gICAgICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhsb2NhdGlvbiwgJ3V0ZjgnKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncGItY29tcGxldGlvbnMgcHJvdmlkZXIgY2FuXFwndCBsb2FkIGZpbGU6ICcgKyBlKTtcbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgICAgICAgICAgICAgJ3BiLWNvbXBsZXRpb25zOiBDYW5cXCd0IHJlYWQgaGVhZGVyJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGRhdGEpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgICAgICBpZiAoaGFzaGVzLmluZGV4T2YoaGFzaCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZVJlbG9hZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcXVpcmVSZWxvYWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwYi1jb21wbGV0aW9uczogRmlsZXMgaGF2ZSBjaGFuZ2VkLiBSZWxvYWRpbmcuLi4nKTtcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLnJlbG9hZCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3BiLWNvbXBsZXRpb25zOiBSZWxvYWRlZC4nKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBmb3JjZVJlbG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3BiLWNvbXBsZXRpb25zOiBSZWxvYWRpbmcuLi4nKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX1N1Z2dlc3Rpb25zID0gSlNPTi5zdHJpbmdpZnkoW10pO1xuICAgICAgICBsb2NhbFN0b3JhZ2UuUGJDb21wbGV0aW9uc1N0b3JlZEl0ZW1fSGFzaGVzID0gSlNPTi5zdHJpbmdpZnkoW10pO1xuICAgICAgICBtb2R1bGUuZXhwb3J0cy5yZWxvYWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3BiLWNvbXBsZXRpb25zOiBSZWxvYWRlZC4nKTtcbiAgICB9LFxuXG4gICAgZGlzY2FyZEhlYWRlcnNBbmRGb3JjZVJlbG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3BiLWNvbXBsZXRpb25zOiBQdXJnZWQgZG9jdW1lbnRhdGlvbiBkYXRhLiBSZWxvYWRpbmcgYWxsLi4uJyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5QYkNvbXBsZXRpb25zU3RvcmVkSXRlbV9TdWdnZXN0aW9ucyA9IEpTT04uc3RyaW5naWZ5KFtdKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLlBiQ29tcGxldGlvbnNTdG9yZWRJdGVtX0hhc2hlcyA9IEpTT04uc3RyaW5naWZ5KFtdKTtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMucmVsb2FkKHRydWUpO1xuICAgICAgICBjb25zb2xlLmxvZygncGItY29tcGxldGlvbnM6IFJlbG9hZGVkLicpO1xuICAgIH1cbn07XG4iXX0=
//# sourceURL=/home/jeremycarlsten/.atom/packages/pb-completions/lib/provider.js
