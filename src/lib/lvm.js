class FileSystem {
	constructor(){
    this.name = require('uuid/v1')
	}
	makeFS(type = 'ext4', volume_group, block) {
		return `mkfs.${type} /dev/${volume_group}/${block}`;
	}
	mount(fs, volume_group, block) {
		return `mount /dev/${volume_group}/${block} ${fs}`;
	}
	unmount(fs){
		return `umount ${fs}`
	}
  persistMount(device, fs, type) {
    return `echo \'${device} ${fs} ${type} rw,noatime 0 0\' | sudo tee --append /etc/fstab`;
  }
  clearMount(str) {
    return `sed -i -e "/${str}/d" /etc/fstab`;
  }
  generateName(){
    let name = this.name();
    return name.split('-')[name.split('-').length - 1];
  }
}

class lvmBuilder extends FileSystem {
  constructor(){
  	super();
  	this.phv_prefix = 'pv';
  	this.vg_prefix = 'vg';
  	this.lv_prefix = 'lv';
  }
  pv(operation = 'create', device, size){
  	device = device || '';
    return operation  == 'create' || operation == 'remove' ? `${this.phv_prefix}${operation} ${device}`
    : operation == 'resize' ? `${this.phv_prefix}${operation} --setphysicalvolumesize ${size} ${device}` : [];
  }
  vg(operation = 'create', device, vg_name, activate, scnd_vg_name){
  	vg_name = vg_name || '';
  	device = device || '';
    return operation == 'create' || operation == 'extend' || operation == 'reduce' ? `${this.vg_prefix}${operation} ${vg_name} ${device}`
    : activate ? `sudo ${this.vg_prefix}${operation} -a n ${vg_name}` 
    : operation == 'split' ? `sudo ${this.vg_prefix}${operation} ${vg_name} ${scnd_vg_name} ${device}` 
    : operation == 'merge' ? `sudo ${this.vg_prefix}${operation} ${vg_name} ${scnd_vg_name}`
    : operation == 'rename' ? `sudo ${this.vg_prefix}${operation} ${vg_name} ${scnd_vg_name}` : `sudo ${this.vg_prefix}${operation} ${vg_name}`;
  }
  /* Rough V1 */
  lv(operation = 'create', vg_name, lv_name, rootDir, size, type = 'ext4', new_name){
    vg_name = vg_name || '';
    var command  = '';
    if(operation == 'create') {
      command = ''+
      `${this.lv_prefix}${operation} -n ${lv_name} --size +${size} ${vg_name} -y && sudo ${this.makeFS('ext4', vg_name, lv_name)} && sudo ${this.mount(rootDir, vg_name, lv_name)}`+
      ' && '+this.persistMount(`/dev/${vg_name}/${lv_name}`, rootDir, 'ext4');
    }
    if(operation == 'remove') {
      rootDir = rootDir.split('/').join('\\/');
      const mount = `\\/dev\\/${vg_name}\\/${lv_name} ${rootDir} ${type} rw,noatime 0 0`;
      command = ''+
      `sudo ${this.unmount(rootDir)} && sudo ${this.clearMount(mount)} && sudo ${this.lv_prefix}${operation} /dev/${vg_name}/${lv_name} -y`;
    }
    if(operation == 'reduce' || operation == 'extend') {
      command = ''+
      `sudo ${this.lv_prefix}${operation} -L ${size} /dev/${vg_name}/${lv_name} -f`;
    }
    if(operation == 'rename') {
      command = ''+
      `sudo ${this.lv_prefix}${operation} /dev/${vg_name}/${lv_name} /dev/${vg_name}/${new_name}`
    }
    if(operation == 'snapshot') {
      command = ''+
      `sudo ${this.lv_prefix}create --size ${size} -s -n ${new_name} /dev/${vg_name}/${lv_name} && sudo ${this.mount(rootDir, vg_name, new_name)}`+
      ' && '+this.persistMount(`/dev/${vg_name}/${new_name}`, rootDir, 'ext4');
    }
  	return command;
  }
}


export default lvmBuilder