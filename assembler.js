fs = require('fs')

const DEBUG_MODE = true,
      MAGIC_CRYPTO = 0,
      STRING_CRYPTO = 0,
      EOF = 255;

const opCodes = {
    'movt': 4,
    'mova': 3,
    'mov': 2,
    'add': 0,
    'sub': 1,
    'xor': 5,
    'cmp': 6,
    'jmp': 7,
    'jnz': 8,
    'jz': 9,
    'exec': 10,
};

const antiNodeJs = [
    'typeof require === \'undefined\' ?',
    'typeof process !== \'undefined\' && process.release.name === \'node\' ?',
    'typeof module !== \'undefined\' && this.module !== module ? 1 : 0',
];

var unusedOpCodes = new Array(100).fill(null)
                        .map(Number.call, Number)
                        .filter(e => !Object.values(opCodes).includes(e));

fs.readFile('test.asm', 'utf8', (err, data) => {
    var lines = data.split('\n');

    var bytecode = [];
    var byteLenght = data.split('\n').length * 3

    lines.forEach(line => {
        var i = line.split(' ').filter(e => e !== '');

        for(var i=0; i < RandomInt())

        // Check if line is comment
        if(line.startsWith('//')){
            return;
        }

        // Check if instruction is valid
        if (!(i[0] in opCodes)) {
            console.log('Unknown instruction:', i[0]);
            return;
        }

        // exec doesn't follow standard logic
        if(i[0] === 'exec'){
            var code = line.split('"').filter(e => e !== '')[1].replace('\n', '');
            var toPush = [];

            // Push the exec instruction and the len
            toPush.push(opCodes.exec ^ MAGIC_CRYPTO, code.length);

            // Now push the acrual code
            code.split('').forEach(c => {
                toPush.push(c.charCodeAt() ^ STRING_CRYPTO);
            })

            bytecode.push(toPush);
        }else{
            // Check for inline number and mov the inline value to 16
            if (i.length > 2 && !i[2].includes('r') && i[0] != 'mov' ) {
                bytecode.push([opCodes.mov ^ MAGIC_CRYPTO, 16, parseInt(i[2])]);
                i[2] = 'r16';
            }

            // Push bytecode
            var toPush = [opCodes[i[0]] ^ MAGIC_CRYPTO, parseInt(i[1].replace('r', ''))];

            // For instructions with len != 3 add a random byte
            if (i.length > 2)
                toPush.push(parseInt(i[2].replace('r', '')));
            else
                toPush.push(RandomInt(0, 255));

            bytecode.push(toPush);
        }
    })

    /*
    Shitty self decryption algorithm. Works like this:
    ---------|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    When     the program reaches the | it will decrypt another
    segment.
    ---------|--------|~~~~~~~~~~~~~~~~~~~~~
    And so on
    */

    bytecode = bytecode.reverse();

    bytecode.forEach((e, i) => {
        if(RandomInt(0, 5) == 2 && DEBUG_MODE){
            // TODO Compute key from Function.toString()
            // And from location.hostname
            var key = RandomInt(1, 255);

            bytecode.slice(0, i).forEach((e, x) => {
                bytecode[x] = bytecode[i].map(v => v ^ key);
            })

            /* Inject decrpytion code 
            mov r18 len(code) 
            xor r18 key
            sub r18 1
            cmp r18 (i + 3) 
            jnz mov
            */
            // TODO Check this(Probably broken :/)
            var to_insert = [[69, 18, i],
                            [69, 15, key],
                            [90, 18, 15],
                            [69, 15, 1],
                            [76, 18, 15],
                            [69, 15, i + 7],
                            [41, 18, 15],
                            [94, i]].reverse()

            console.log(bytecode);
        }
    })

    bytecode = bytecode.reverse();

    bytecode.push(EOF);

    var stream = fs.createWriteStream('bin', {encoding : 'utf8'});
    var flat = [].concat.apply([], bytecode)
    console.log(flat)
})

function RandomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}