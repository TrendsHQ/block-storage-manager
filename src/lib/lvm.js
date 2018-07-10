class FileSystem {
	constructor(){
	}
	makeFS(type = 'ext4', volume_group, block) {
		return `mkfs.${type} /dev/${volume_group}/${block}`;
	}
	mount(fs, volume_group, block) {
		return `mount /dev/${volume_group}/${block} ${fs}`;
	}
	unmount(fs){
		return `unmount ${fs}`
	}
  persistMount(device, fs, type) {
    return `echo \'${device} ${fs} ${type} rw,noatime 0 0\' | sudo tee --append /etc/fstab`;
  }
}

class lvmBuilder extends FileSystem {
  constructor(){
  	super();
  	this.phv_prefix = 'pv';
  	this.vg_prefix = 'vg';
  	this.lv_prefix = 'lv';
  }
  pv(operation = 'create', device){
  	device = device || '';
    return `${this.phv_prefix}${operation} ${device}`;
  }
  vg(operation = 'create', device, vg_name){
  	vg_name = vg_name || '';
  	device = device || '';
    return operation == 'create' ? `${this.vg_prefix}${operation} ${vg_name} ${device}`
    : `${this.vg_prefix}${operation} ${vg_name}`;
  }
  /* create, remove, extend */
  lv(operation = 'create', vg_name, lv_name, rootDir, size){
    vg_name = vg_name || '';
    var command  = '';
    if(operation == 'create') {
      command = ''+
      `${this.lv_prefix}${operation} -n ${lv_name} --size +${size} ${vg_name} -y && sudo ${this.makeFS('ext4', vg_name, lv_name)} && sudo ${this.mount(rootDir, vg_name, lv_name)}`+
      ' && '+this.persistMount(`/dev/${vg_name}/${lv_name}`, rootDir, 'ext4');
    }
  	return command;
    // return operation == 'create' ? `${this.lv_prefix}${operation} ${lv_name} --size +${size} ${vg_name} -y`
    // : operation == 'extend' ?  `${this.lv_prefix}${operation} -L+${size} ${lv_name} -y`
    // : `${this.lv_prefix}${operation} /dev/${lv_name}/${vg_name} -y`;
  }
}


export default lvmBuilder