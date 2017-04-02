(function () {
    var registers = {},
        memory = new Uint32Array(1000),
        flag = 0,
        entry_point = 0;

    //Populate the register with zeros
    for (var i = 0; i < 30; ++i) {
        registers[i] = 0
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/bin");

    xhr.onload = function () {
        if (this.status === 200) {
            for (var i = 0; i < xhr.responseText.length; ++i) {
                memory[i + entry_point] = xhr.responseText.charAt(i).charCodeAt()
            }

            console.log(memory)
            
            while (true) {
                var base = registers[13],
                    new_flag = 0;
                console.log(memory[base])

                switch (memory[base] ^ 0) {
                    // add r0 r1
                    case 12:
                        registers[memory[base + 1]] += registers[memory[base + 2]];
                        break;

                    // sub r0 r1 
                    case 76:
                        registers[memory[base + 1]] -= registers[memory[base + 2]];
                        break;

                    // mov r0 20
                    case 69:
                        registers[memory[base + 1]] = memory[base + 2];
                        break;

                    //mova r0 r1
                    case 79:
                        registers[memory[base + 1]] = memory[registers[base + 2]]
                        break;

                    // movt r0 r1
                    case 92:
                        memory[registers[base + 1]] = registers[base + 2]
                        break;

                    // xor r0 r2
                    case 90:
                        registers[memory[base + 1]] ^= registers[memory[base + 2]];
                        break;

                    // cmp r0 r1
                    case 41:
                        new_flag = registers[memory[base + 1]] == registers[memory[base + 2]];
                        break;

                    // jmp r0
                    case 29:
                        registers[13] = registers[memory[base + 1]] - 3
                        break;

                    // jnz r0
                    case 17:
                        if (flag != 0) {
                            registers[13] = registers[memory[base + 1]] - 3
                        } else {
                            registers[13]--
                        }
                        break;

                    // jz r0 
                    case 94:
                        if (flag == 0) {
                            registers[13] = registers[memory[base + 1]] - 3
                        } else {
                            registers[13]--
                        }
                        break;

                    // exec r0 r1
                    case 87:
                        var c = "";

                        for (var i = 0; i < registers[memory[base + 2]]; ++i) {
                            c += String.fromCharCode(memory[registers[base + 1] + i]);
                        }

                        memory.constructor.prototype.bind.apply(String.constructor, ['memcpy', c]).apply("String").apply("toString")
                        break;
                }
                if (memory[base] == undefined) {
                    break;
                }

                flag = new_flag;
                registers[13] += 3;
            }
        }
    };
    xhr.send();
})()