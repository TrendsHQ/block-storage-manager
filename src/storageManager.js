import lvm from './lib/lvm';
import linux from './lib/linux';

/*
 @opts.plugins: s3|ceph|linux|windows
*/
class storageManager extends lvm {
	constructor(opts){
      super();
      if(!opts.plugin || opts.plugin == 'linux'){
          this.shell = new linux(opts.creds);
	      this.opts = opts;
      }
      /*else*/
	}
	Create(object, opts) {
	  const self = this;
	  const args = opts.flag == 'pv' ? ['create', object.device] 
	  : opts.flag == 'vg' ?  ['create', object.device, object.vg_name] 
	  : opts.flag == 'lv' ? ['create',  object.vg_name, object.lv_name, object.rootDir, object.size] : [];	

	  return this.shell.onRead(`${this[opts.flag].apply(this, args)}`)
	}
}

export default storageManager; 