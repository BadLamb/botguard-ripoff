fs = require('fs')

DEBUG_MODE = false
MAGIC_CRYPTO = 0
EOF = 255

const opCodes = {
    'movt': 92,
    'mova': 79,
    'mov': 69,
    'add': 12,
    'sub': 76,
    'xor': 90,
    'cmp': 41,
    'jmp': 29,
    'jnz': 17,
    'jz': 94,
    'exec': 87,
}

console.log(Object.values(opCodes))

var unusedOpCodes = Array.apply(null, {length: 100})
                         .map(Number.call, Number)
                         .filter(e => !e)

console.log(unusedOpCodes)

fs.readFile('test.asm', 'utf8', (err, data) => {
    var lines = data.split('\n')

    var bytecode = []

    lines.forEach(line => {
        var i = line.split(' ').filter(e => e !== '')

        // Check for inline number and mov the inline value to 16
        if (i.length > 2 && !i[2].includes('r') && i[0] != 'mov') {
            bytecode.push([opCodes['mov'] ^ MAGIC_CRYPTO, 16, parseInt(i[2])])
            i[2] = 'r16'
        }

        // Check if instruction is valid
        if (!(i[0] in opCodes)) {
            console.log('Unknown instruction:', i[0])
            return
        }

        // Push bytecode
        var toPush = [opCodes[i[0]] ^ MAGIC_CRYPTO, parseInt(i[1].replace('r', ''))]

        if (i.length > 2)
            toPush.push(parseInt(i[2].replace('r', '')))

        bytecode.push(toPush)
    })

    bytecode.push(EOF)
    console.log(bytecode)
})

function RandomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}