'use babel';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var activate = function activate() {
	if (atom.packages.isPackageLoaded('refactor')) return;
	atom.notifications.addWarning('js-refactor package requires refactor package', {
		detail: 'You can install and activate refactor package using the preference pane.'
	});
};

exports.activate = activate;

var _ripper = require('./ripper');

var _ripper2 = _interopRequireDefault(_ripper);

exports.Ripper = _ripper2['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2plcmVteWNhcmxzdGVuLy5hdG9tL3BhY2thZ2VzL2pzLXJlZmFjdG9yL2xpYi9qc19yZWZhY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7O0FBRUosSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLEdBQVM7QUFDN0IsS0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsRUFBRSxPQUFNO0FBQ3JELEtBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUM1QiwrQ0FBK0MsRUFDL0M7QUFDQyxRQUFNLEVBQUUsMEVBQTBFO0VBQ2xGLENBQ0QsQ0FBQTtDQUNELENBQUE7Ozs7c0JBRWtCLFVBQVU7Ozs7UUFBdEIsTUFBTSIsImZpbGUiOiIvaG9tZS9qZXJlbXljYXJsc3Rlbi8uYXRvbS9wYWNrYWdlcy9qcy1yZWZhY3Rvci9saWIvanNfcmVmYWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgY29uc3QgYWN0aXZhdGUgPSAoKSA9PiB7XG5cdGlmIChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZCgncmVmYWN0b3InKSkgcmV0dXJuXG5cdGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuXHRcdCdqcy1yZWZhY3RvciBwYWNrYWdlIHJlcXVpcmVzIHJlZmFjdG9yIHBhY2thZ2UnLFxuXHRcdHtcblx0XHRcdGRldGFpbDogJ1lvdSBjYW4gaW5zdGFsbCBhbmQgYWN0aXZhdGUgcmVmYWN0b3IgcGFja2FnZSB1c2luZyB0aGUgcHJlZmVyZW5jZSBwYW5lLidcblx0XHR9XG5cdClcbn1cblxuZXhwb3J0IFJpcHBlciBmcm9tICcuL3JpcHBlcidcbiJdfQ==
//# sourceURL=/home/jeremycarlsten/.atom/packages/js-refactor/lib/js_refactor.js
