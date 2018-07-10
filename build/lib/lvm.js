'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileSystem = function () {
  function FileSystem() {
    _classCallCheck(this, FileSystem);
  }

  _createClass(FileSystem, [{
    key: 'makeFS',
    value: function makeFS() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ext4';
      var volume_group = arguments[1];
      var block = arguments[2];

      return 'mkfs.' + type + ' /dev/' + volume_group + '/' + block;
    }
  }, {
    key: 'mount',
    value: function mount(fs, volume_group, block) {
      return 'mount /dev/' + volume_group + '/' + block + ' ' + fs;
    }
  }, {
    key: 'unmount',
    value: function unmount(fs) {
      return 'unmount ' + fs;
    }
  }, {
    key: 'persistMount',
    value: function persistMount(device, fs, type) {
      return 'echo \'' + device + ' ' + fs + ' ' + type + ' rw,noatime 0 0\' | sudo tee --append /etc/fstab';
    }
  }]);

  return FileSystem;
}();

var lvmBuilder = function (_FileSystem) {
  _inherits(lvmBuilder, _FileSystem);

  function lvmBuilder() {
    _classCallCheck(this, lvmBuilder);

    var _this = _possibleConstructorReturn(this, (lvmBuilder.__proto__ || Object.getPrototypeOf(lvmBuilder)).call(this));

    _this.phv_prefix = 'pv';
    _this.vg_prefix = 'vg';
    _this.lv_prefix = 'lv';
    return _this;
  }

  _createClass(lvmBuilder, [{
    key: 'pv',
    value: function pv() {
      var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'create';
      var device = arguments[1];

      device = device || '';
      return '' + this.phv_prefix + operation + ' ' + device;
    }
  }, {
    key: 'vg',
    value: function vg() {
      var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'create';
      var device = arguments[1];
      var vg_name = arguments[2];

      vg_name = vg_name || '';
      device = device || '';
      return operation == 'create' ? '' + this.vg_prefix + operation + ' ' + vg_name + ' ' + device : '' + this.vg_prefix + operation + ' ' + vg_name;
    }
    /* create, remove, extend */

  }, {
    key: 'lv',
    value: function lv() {
      var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'create';
      var vg_name = arguments[1];
      var lv_name = arguments[2];
      var rootDir = arguments[3];
      var size = arguments[4];

      vg_name = vg_name || '';
      var command = '';
      if (operation == 'create') {
        command = '' + ('' + this.lv_prefix + operation + ' -n ' + lv_name + ' --size +' + size + ' ' + vg_name + ' -y && sudo ' + this.makeFS('ext4', vg_name, lv_name) + ' && sudo ' + this.mount(rootDir, vg_name, lv_name)) + ' && ' + this.persistMount('/dev/' + vg_name + '/' + lv_name, rootDir, 'ext4');
      }
      return command;
      // return operation == 'create' ? `${this.lv_prefix}${operation} ${lv_name} --size +${size} ${vg_name} -y`
      // : operation == 'extend' ?  `${this.lv_prefix}${operation} -L+${size} ${lv_name} -y`
      // : `${this.lv_prefix}${operation} /dev/${lv_name}/${vg_name} -y`;
    }
  }]);

  return lvmBuilder;
}(FileSystem);

exports.default = lvmBuilder;