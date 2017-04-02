var t = 0;
var responseQueue = [];

var vm = () => {
    var r = new Array(30).fill(null),
        memory = [],
        zeroFlag = 0,
        messageQueue = [];

    const MAGIC_CRYPTO = 0;
    r[13] = 0;
    for (var chr of resp)
        memory.push(chr.charCodeAt());

    var m = memory;

    var instructions = {
        // add r0 r1
        0: b => r[m[b + 1]] += r[m[b + 2]],
        // sub r0 r1
        1: b => r[m[b + 1]] -= r[m[b + 2]],
        // mov r0 20
        2: b => r[m[b + 1]] = m[b + 2],
        // mova r0 r1
        3: b => r[m[b + 1]] = m[r[b + 2]],
        // movt r0 r1
        4: b => m[r[b + 1]] = r[b + 2],
        // xor r0 r2
        5: b => r[m[b + 1]] ^= r[m[b + 2]],
        // cmp r0 r1
        6: b => zeroFlag = r[m[b + 1]] == r[m[b + 2]],
        // jnz address
        8: b => r[13] = zeroFlag ? r[13] : r[m[b + 2]],
        // jz address
        9: b => r[13] = zeroFlag ? r[m[b + 2]] : r[13],
        // exec len code
        10: b => {
            eval(m.splice(b + 2, m[b + 1] + b)
                  .map(c => String.fromCharCode(c))
                  .join(''));
        },
        //TODO ipc "jsobject to send" 
        11: b => {},
    }

    for (;;) {
        if (instructions[memory[r[13]]] != null) {
            instructions[memory[r[13]]](r[13])
            r[13] += 3
        }else{
        	break;
        }

        t = 0 + new Date()
    }
}

this.onMessage = (msg) => {
	if(msg.type == 'ping'){
		// Respond with latest instruction timestamp
	}else{
		responseQueue.push(msg)
	}
}

vm()