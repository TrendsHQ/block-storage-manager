'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lib = require('./lib');

var _rxjsCompat = require('rxjs-compat');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 @opts.plugins: s3|ceph|linux|windows
*/
var storageManager = function (_lvm) {
	_inherits(storageManager, _lvm);

	function storageManager(opts) {
		_classCallCheck(this, storageManager);

		var _this = _possibleConstructorReturn(this, (storageManager.__proto__ || Object.getPrototypeOf(storageManager)).call(this));

		if (!opts.plugin || opts.plugin == 'linux') {
			_this.shell = new _lib.linux(opts.creds);
			_this.opts = opts;
		}
		/*else*/
		return _this;
	}
	/* Linear, Striped, mirrored(lvms) */


	_createClass(storageManager, [{
		key: 'Create',
		value: function Create(object, opts) {
			var args = _lib.flags.apply(this, ['create', object, opts]);

			return this.EXEC('' + this[opts.flag].apply(this, args));
		}
	}, {
		key: 'Update',
		value: function Update(object, opts, Callback) {
			// Not Implemented
			var args = _lib.flags.apply(this, [object.size && !opts.action ? null : opts.action, object, opts]);

			return this.EXEC('' + this[opts.flag].apply(this, args), Callback);
		}
	}, {
		key: 'Remove',
		value: function Remove(object, opts, Callback) {
			var args = _lib.flags.apply(this, ['remove', object, opts]);

			return this.EXEC('' + this[opts.flag].apply(this, args), Callback);
		}
	}, {
		key: 'Snapshot',
		value: function Snapshot(object, opts, Callback) {
			object.new_name = this.generateName();
			var args = _lib.flags.apply(this, ['snapshot', object, opts]);

			return this.EXEC('' + this[opts.flag].apply(this, args), Callback);
		}
	}, {
		key: 'EXEC',
		value: function EXEC(command, Callback) {
			var val = void 0;
			return !Callback ? this.shell.onRead(command) : this.shell.onRead(command).subscribe(function (x) {
				return !x ? Callback(null, 0) : Callback(null, x);
			}, function (e) {
				return Callback(e);
			}, function () {
				return Callback(null, val);
			});
		}
	}, {
		key: 'Move',
		value: function Move() {
			// Not Implemented
			return (0, _rxjsCompat.of)('Not Implemented');
		}
	}, {
		key: 'Read',
		value: function Read() {
			// Not Implemented
			return (0, _rxjsCompat.of)('Not Implemented');
		}
	}]);

	return storageManager;
}(_lib.lvm);

exports.default = storageManager;