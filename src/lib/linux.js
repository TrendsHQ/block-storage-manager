import ssh from 'ssh2';
import shell from 'shelljs';
import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

class Linux /*extends Client*/ {
	constructor(opts){
	  // super();
	  this.creds = opts;
	  this.Client = shell;
	  if(!opts.local) {
        this.Client = new ssh()
        this.getConnection()
      }	
	}
	getConnection() {
		this.Client.connect(this.creds);
		return this.Client.on;
	}
	onRead(_commands) {
		console.log('call');
		const self = this;
		return Observable.create((observer) => {
			self.Client.on('ready', function() {
			  // console.log('Client :: ready');
			  self.Client.exec(`sudo ${_commands}`, {pty:true}, function(err, stream) {
			    if(err) observer.error(err);
			   
			    stream.on('close',function(code, signal) {
			      // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
			      self.Client.end();
			      observer.complete();
			    })
			    stream.on('data', function(data) {
			      observer.next(data);
			      // console.log('STDOUT: ' + data);
			    });
			    stream.write('node3' + '\n');
			    // stream.end('exit');
			  });
			})
	    });
	}
}

export default Linux;