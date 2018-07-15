'use strict';

var _lvm = require('./lvm');

var _lvm2 = _interopRequireDefault(_lvm);

var _linux = require('./linux');

var _linux2 = _interopRequireDefault(_linux);

var _flags = require('./flags');

var _flags2 = _interopRequireDefault(_flags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    lvm: _lvm2.default,
    linux: _linux2.default,
    flags: _flags2.default
};