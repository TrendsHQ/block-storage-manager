import { lvm, linux, flags } from './lib';
import { of } from 'rxjs-compat';
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
	/* Linear, Striped, mirrored(lvms) */
	Create(object, opts) {
	  const args = flags.apply(this, ['create', object, opts]);
    
	  return this.EXEC(`${this[opts.flag].apply(this, args)}`)
	}
    Update(object, opts, Callback) {
		// Not Implemented
		const args = flags.apply(this, [object.size && !opts.action ? null : opts.action , object, opts]);
		
		return this.EXEC(`${this[opts.flag].apply(this, args)}`, Callback)
	}
	Remove(object, opts, Callback) {
		const args = flags.apply(this, ['remove', object, opts]);
        
		return this.EXEC(`${this[opts.flag].apply(this, args)}`, Callback);
	}
	Snapshot(object, opts, Callback) {
		object.new_name = this.generateName();
		const args = flags.apply(this, ['snapshot', object, opts]);
        
		return this.EXEC(`${this[opts.flag].apply(this, args)}`, Callback);
	}
	EXEC(command, Callback) {
		let val;
		return !Callback ? this.shell.onRead(command)
		: this.shell.onRead(command).subscribe(
			x => !x ? Callback(null, 0) : Callback(null,x),
			e => Callback(e),
			() => Callback(null, val)
		);
	}
	Move() {
		// Not Implemented
		return of('Not Implemented')
	}
	Read() {
		// Not Implemented
		return of('Not Implemented');
	}
}

export default storageManager; 