class Kernel{
	constructor(kexts){
		this.kexts = kexts;
		this.tasks = [];
	}

	newTask(src) {
		this.tasks.push({
			worker : new Worker(src),
			pid : 0,
		})
	}

	handleMessage(m, pid){
		this.kexts.forEach(k => {
			if(!k.messageCallback(m, pid))
				return;
		})

		this.tasks[m.port].postMessage({
			origin: pid,
			data : m,
		});
	}
}

export {Kernel}