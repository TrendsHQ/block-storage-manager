module.exports = (operation, object, opts) => {
    console.log( opts.flag,operation);
    const args = opts.flag == 'pv' && operation == 'create' ? ['create', object.device] 
    : opts.flag == 'vg' && operation == 'create' ?  ['create', object.device, object.vg_name] 
    : opts.flag == 'lv' && operation == 'create' ? ['create',  object.vg_name, object.lv_name, object.rootDir, object.size] 
    : opts.flag == 'pv' && operation == 'remove' ? ['remove', object.device]
    : opts.flag == 'vg' && operation == 'remove' ? ['remove', object.device, object.vg_name] 
    : opts.flag == 'lv' && operation == 'remove' ? ['remove', object.vg_name, object.lv_name, object.rootDir]
    : opts.flag == 'pv' && !operation && object.size ? ['resize', object.device, object.size] 
    : opts.flag == 'vg' && operation == 'add' ? ['extend', object.device, object.vg_name]
    : opts.flag == 'vg' && object.activate && operation == 'change' ? ['change', object.device, object.vg_name, object.activate]
    : opts.flag == 'vg' && operation == 'split' ? ['split', object.device, object.vg_name, false, object.split_name]
    : opts.flag == 'vg' && operation == 'merge' ? ['merge', object.device, object.vg_name, false, object.merge_name]
    : opts.flag == 'vg' && operation == 'rename' ? ['rename', object.device, object.vg_name, false, object.new_name]
    : opts.flag == 'vg' && operation == 'remove' ? ['reduce', object.device, object.vg_name] 
    : opts.flag == 'lv' && !operation && object.size ? ['reduce', object.vg_name, object.lv_name, object.rootDir, object.size] 
    : opts.flag == 'lv' && operation == 'add' ? ['extend', object.vg_name, object.lv_name, object.rootDir, object.size]
    : opts.flag == 'lv' && operation == 'rename' ? ['rename', object.vg_name, object.lv_name, object.rootDir, object.size, object.type, object.new_name] 
    : opts.flag == 'lv' && operation == 'snapshot' ? ['snapshot', object.vg_name, object.lv_name, object.rootDir, object.size, object.type, object.new_name] : [];	
    return args;
}