function calculateRSA() {
    const p = parseInt(document.getElementById("p").value);
    const q = parseInt(document.getElementById("q").value);

    if (!isPrime(p) || !isPrime(q)) {
        alert("Please enter prime numbers for p and q.");
        return;
    }

    const n = p * q;
    const phi = (p - 1) * (q - 1);

    let e = 2;
    while (e < phi) {
        if (gcd(e, phi) === 1) {
            break;
        }
        e++;
    }

    const d = modInverse(e, phi);

    document.getElementById("public-key").textContent = `(${n}, ${e})`;
    document.getElementById("private-key").textContent = d;

    const plaintext = document.getElementById("plaintext").value;
    const encodedText = encode(plaintext, n, e);
    document.getElementById("ciphertext").textContent = encodedText;

    const decodedText = decode(encodedText, n, e, d);

    document.getElementById("decoded-plaintext").textContent = decodedText;
}

function isPrime(number) {
    if (number < 2) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            return false;
        }
    }
    return true;
}

function encode(plaintext, n, e) {
    let encodedText = "";
    for (let i = 0; i < plaintext.length; i++) {
        const charCode = plaintext.charCodeAt(i);
        const encrypted = modPow(charCode, e, n);
        encodedText += encrypted.toString() + " ";
    }
    return encodedText.trim();
}

function decode(ciphertext, n, e, d) {
    const encryptedChars = ciphertext.split(" ");
    let decodedText = "";
    for (let i = 0; i < encryptedChars.length; i++) {
        const encrypted = parseInt(encryptedChars[i]);
        const decrypted = modPow(encrypted, d, n);
        decodedText += String.fromCharCode(decrypted);
    }
    return decodedText;
}

function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

function modInverse(a, m) {
    let [x, y, gcd] = extendedGCD(a, m);
    if (gcd !== 1) {
        throw new Error("No modular inverse exists.");
    }
    return ((x % m) + m) % m;
}

function extendedGCD(a, b) {
    if (b === 0) {
        return [1, 0, a];
    }
    const [x, y, gcd] = extendedGCD(b, a % b);
    return [y, x - Math.floor(a / b) * y, gcd];
}

function modPow(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        base = (base * base) % modulus;
        exponent = Math.floor(exponent / 2);
    }
    return result;
}