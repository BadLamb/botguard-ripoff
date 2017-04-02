var vm = () => {
	var r = new Array(30).fill(null),
		memory = [],
		zeroFlag = 0,
		messageQueue = [];

	const MAGIC_CRYPTO = 0;

	fetch('http://localhost:8000/bin')
	.then((resp) => {
		for(var chr of resp)
			memory.push(chr);

		var m = memory;

		var intructions = {
			// add r0 r1
			0: b => r[m[b + 1]] += r[m[b + 2]],
			// sub r0 r1
			1: b => r[m[b + 1]] -= r[m[b + 2]],
			// mov r0 20
			2: b => r[m[b + 1]] = m[b + 2],
			// mova r0 r1
			3: b => r[m[b + 1]] = m[r[b+2]],
			// movt r0 r1
			4: b => m[r[b+1]] = r[b+2],
			// xor r0 r2
			5: b => r[m[b+1]] ^= r[m[b+2]],
			// cmp r0 r1
			6: b => zeroFlag = r[m[b + 1]] == r[m[b+2]],
			// jnz address
			8: b => r[13] = zeroFlag ? r[13] : r[m[b+2]],
			// jz address
			9: b => r[13] = zeroFlag ? r[m[b+2]] : r[13],
			// exec len code
			10: b => {
				memory.constructor.prototype.bind.apply(String.constructor, ['ReactDOM', m.splice(b + 2, b + 2 + m[b + 1]).map(e => String.charCodeAt(e ^ 0)).join('')]).apply("DiffCalcultor").apply("VirtualDom")
				r[13] += m[b+1]
			},
			//TODO ipc "jsobject to send" 
			11: b => {},
		}

		for(;;){
			intructions[memory][r[13]](r[13])

			r[13] += 3
		}
	})
}