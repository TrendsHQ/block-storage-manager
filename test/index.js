import { Observable } from 'rxjs-compat';
var should = require('should');
var lvm = require('../');
var { local, remote } = require('./manual/config');
lvm = new lvm(remote);
// lvm.Create({device: '/dev/sdb'},  { flag: 'pv' }).subscribe(console.log);
describe("Block-Storage-Manager(Remote)", function() {
    describe("LVM", function() {
       it('Create Physical Volume', (done) => {
        let val = [];
        lvm.Create({device: '/dev/sdc'},  { flag: 'pv' }).subscribe(
                    (x) => {
                        val.push(x.toString().length < 3 ? null : x.toString())
                    },
                    e => done(e),
                    () => {
                        val = val.filter(x => x);
                        var lastIndex = val.length - 1;
                        val[lastIndex].match(/successfully created/g).length.should.be.exactly(1);
                        done(null, val)
                    }
                );
       });
       it('Remove Physical Volume', (done) => {
        let val = [];
        lvm.Remove({device: '/dev/sdc'},  { flag: 'pv' }).subscribe(
            (x) => {
                val.push(x.toString().length < 3 ? null : x.toString())
            },
            e => done(e),
            () => {
                val = val.filter(x => x);
                var lastIndex = val.length - 1;
                val[lastIndex].match(/successfully wiped/g).length.should.be.exactly(1);
                done(null, val)
            }
        );
       });
       
       it('Extend Physical Volume', (done) => {
        let val = [];
        lvm.Update({device:'/dev/sdb', size: '5GB'},{flag: 'pv'}).subscribe(
            (x) => {
                val.push(x.toString().length < 3 ? null : x.toString())
            },
            e => done(e),
            () => {
                val = val.filter(x => x);
                // var lastIndex = val.length - 1;
                // val[lastIndex].match(/successfully wiped/g).length.should.be.exactly(1);
                done(null, val)
            }
        );
       });
       it('Reduce Physical Volume', (done) => {
        let val = [];
        lvm.Update({device:'/dev/sdb', size: '2GB'},{flag: 'pv', action: 'reduce'}).subscribe(
            (x) => {
                val.push(x.toString().length < 3 ? null : x.toString())
            },
            e => done(e),
            () => {
                val = val.filter(x => x);
                // var lastIndex = val.length - 1;
                // val[lastIndex].match(/successfully wiped/g).length.should.be.exactly(1);
                done(null, val)
            }
        );
       });
    });
});