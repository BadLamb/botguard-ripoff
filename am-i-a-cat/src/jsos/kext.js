class Kext{
	messageCallback(mes, pid) {
		if(mes.type !== 45346415)
			return 1;

		mes.d.map((e, i) => {
			e ^ (i + 543)
		}).join('')
	}
}