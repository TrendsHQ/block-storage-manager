'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lvm2 = require('./lib/lvm');

var _lvm3 = _interopRequireDefault(_lvm2);

var _linux = require('./lib/linux');

var _linux2 = _interopRequireDefault(_linux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
			_this.shell = new _linux2.default(opts.creds);
			_this.opts = opts;
		}
		/*else*/
		return _this;
	}

	_createClass(storageManager, [{
		key: 'Create',
		value: function Create(object, opts) {
			var self = this;
			var args = opts.flag == 'pv' ? ['create', object.device] : opts.flag == 'vg' ? ['create', object.device, object.vg_name] : opts.flag == 'lv' ? ['create', object.vg_name, object.lv_name, object.rootDir, object.size] : [];

			return this.shell.onRead('' + this[opts.flag].apply(this, args));
		}
	}]);

	return storageManager;
}(_lvm3.default);

exports.default = storageManager;