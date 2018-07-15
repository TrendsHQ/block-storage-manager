'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ssh = require('ssh2');

var _ssh2 = _interopRequireDefault(_ssh);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _rxjsCompat = require('rxjs-compat');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Linux /*extends Client*/ = function () {
	function Linux(opts) {
		_classCallCheck(this, Linux);

		// super();
		this.creds = opts;
		this.Client = _shelljs2.default;
		if (!opts.local) {
			this.Client = new _ssh2.default();
			// this.getConnection()
		}
	}

	_createClass(Linux, [{
		key: 'getConnection',
		value: function getConnection() {
			this.Client.connect(this.creds);
			return this.Client.on;
		}
	}, {
		key: 'onRead',
		value: function onRead(_commands) {

			var self = this;
			return _rxjsCompat.Observable.create(function (observer) {
				self.getConnection();
				self.Client.on('ready', function () {
					// console.log('Client :: ready');
					self.Client.exec('sudo ' + _commands, { pty: true }, function (err, stream) {
						if (err) observer.error(err);

						stream.on('close', function (code, signal) {
							// console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
							self.Client.end();
							observer.complete();
						});
						stream.on('data', function (data) {
							observer.next(data);
							// console.log('STDOUT: ' + data);
						});
						stream.write(self.creds.username + '\n');
						// stream.end('exit');
					});
				});
			});
		}
	}, {
		key: 'Construct',
		value: function Construct() {
			return _rxjsCompat.Observable.create();
		}
	}]);

	return Linux;
}();

exports.default = Linux;