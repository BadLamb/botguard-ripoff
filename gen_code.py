import sys
import random 

raw = ""

with open(sys.argv[1], "r+") as f:
    raw = f.read()

instructions = raw.split("\n")
code = []

USED_OPCODES = [12, 76, 69, 79, 92, 90, 41, 29, 17, 94, 87]

MAGIC_CRYPTO = 0
OBFUSCATE = True
DEBUG_MODE = True

free_opcodes = []
for i in xrange(100):
    if i not in USED_OPCODES:
        free_opcodes.append(i)

has_redefined = False

for i in instructions:
    words = i.split(" ")

    new_register = 31

    # Random unused opcodes as a form of obfuscation
    if not DEBUG_MODE:
        for i in xrange(random.randint(0, 5)):
            code.extend([random.choice(free_opcodes) ^ MAGIC_CRYPTO,
                         random.randint(0, 30),
                         random.randint(0, 30)])

    """ Redefine built in functions such as console
        to make debugging harder
    """
    # Convert string literals to registers
    if words[0] != 'jz' and words[2][0] != 'r' and words[0] != 'mov':
        code.extend([69 ^ MAGIC_CRYPTO, 15, int(words[2].strip('r'))])
        new_register = 15

    # Actual instructions
    if words[0] == "add":
        code.extend([12 ^ MAGIC_CRYPTO])
    elif words[0] == "sub":
        code.extend([76 ^ MAGIC_CRYPTO])
    elif words[0] == 'xor':
        code.extend([90 ^ MAGIC_CRYPTO])
    elif words[0] == 'cmp':
        code.extend([41 ^ MAGIC_CRYPTO])
    elif words[0] == 'jz':
        code.extend([94 ^ MAGIC_CRYPTO])
    elif words[0] == 'mov':
        code.extend([69 ^ MAGIC_CRYPTO])
    elif words[0] == 'mova':
        code.extend([79 ^ MAGIC_CRYPTO])
    elif words[0] == 'movt':
        code.extend([92 ^ MAGIC_CRYPTO])
    else:
        print "Invalid instruction %s" %(words[0])
        exit()

    # Add target register
    code.extend([int(words[1].strip('r'))])

    # If there was no string literal add origin register
    if words[0] != 'jz' and new_register == 31:
        code.extend([int(words[2].strip('r'))])

    elif new_register != 31:
        code.extend([new_register])
        
    # Add todo xor
    if random.randint(0, 5) == 2 and not DEBUG_MODE:
        code.extend([0xabcdef, 1337, 0xabcdff])

# Add end of code
code.extend([251])

# Replace the todo xors with real crypto 
for i in xrange(len(code)):
    if code[len(code) - i -1] == 0xabcdef:
        print "Ayy"
        key = random.randint(0, 255)

        print key

        # delete the todo xor
        print code[len(code) - (i - 1) : len(code) - (i + 2)]
        del code[len(code) - (i - 1) : len(code) - (i + 2)]

        # replace it with the real deal
        to_insert = [69, 18, len(code),
                     69, 15, key,
                     90, 18, 15,
                     69, 15, 1,
                     76, 18, 15,
                     69, 15, i + 6,
                     41, 18, 15,
                     94, i]

        print len(to_insert)
        code[i:i] = to_insert

        for j in xrange(len(code) - i):
            print("Original: %d with key %d : %d" %(code[len(code) - j-1], key, code[len(code) - j -1] ^ key))
            code[len(code) - j-1] = code[len(code) - j -1] ^ key

        """ Now we append the following code:
            mov r18 len(code) 
            xor r18 key
            sub r18 1
            cmp r18 (i + 3) 
            jnz mov

            This will decrypt the segment of code and will make
            static analysis hard
        """

print code

# Write to file
with open("bin", "wb") as f:
    f.write(bytearray(code))
    