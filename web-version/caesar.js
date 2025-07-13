document.addEventListener("DOMContentLoaded", function () {
    const inputText = document.querySelector(".main textarea");
    const inputShift = document.querySelector(".main .shiftInput");

    const encryptButton = document.getElementById("encryptBtn");
    const autoDecryptButton = document.getElementById("autoDecryptBtn");

    const output = document.querySelector(".main p");

    const alphabetEN = "abcdefghijklmnopqrstuvwxyz";
    const alphabetRU = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

    let wordSet = new Set();

    function animateText(element, text, delay = 5) {
        element.innerHTML = "";
        let i = 0;
    
        function typeChar() {
            if (i < text.length) {
                const span = document.createElement("span");
                span.textContent = text[i];
    
                span.style.opacity = 0;
                span.style.transition = "opacity 0.2s";
                element.appendChild(span);
    
                setTimeout(() => {
                    span.style.opacity = 1;
                }, 10);
    
                i++;
                setTimeout(typeChar, delay);
            }
        }
    
        typeChar();
    }
    
    function loadWordList() {
        fetch("../../res/words_alpha.txt")
            .then(response => response.text())
            .then(text => {
                const words = text.split(/\r?\n/)
                                .map(
                                    word => word.trim().toLowerCase()
                                );
                
                wordSet = new Set(words);
                console.log("words_alpha is loaded:", wordSet.size, "words");
            })
            .catch(error => console.error("vocabulary loading error:", error));
    }

    function caesarCipher(text, shift, alphabet) {
        let result = "";

        for (let char of text.toLowerCase()) {
            if (alphabet.includes(char)) {
                
                let index = alphabet.indexOf(char);
                let newIndex = (index + shift) % alphabet.length;
                
                if (newIndex < 0) {
                    newIndex += alphabet.length;
                }
                
                result += alphabet[newIndex];
            
            } else {
                result += char;
            }
        }

        return result;
    }

    function detectAlphabet(text) {
        if (/[a-z]/i.test(text)) {
            return alphabetEN;
        
        } else if (/[а-яё]/i.test(text)) {
            return alphabetRU;
        
        } else {
            return null;
        }
    }

    function highlightWords(text) {
        return text.split(/\s+/).map(word => {
            if (wordSet.has(word) && word.length >= 2) {
                return `<span style="color: green;">${word}</span>`;
            } else {
                return word;
            }
        }).join(" ");
    }

    function autoDecrypt() {
        const text = inputText.value;
        const alphabet = detectAlphabet(text);

        if (!alphabet) {
            output.textContent = "error";
            return;
        }

        if (text === "") {
            output.textContent = "error";
            return;
        }

        let maxShift = 0;
        
        if (alphabet === alphabetEN) {
            maxShift = 26;
        
        } else if (alphabet === alphabetRU) {
            maxShift = 33;
        }

        let results = [];
        for (let shift = 1; shift < maxShift; shift++) {
        
            let decrypted = caesarCipher(text, -shift, alphabet);
            let highlighted = highlightWords(decrypted);
        
            results.push(`${shift}. ${highlighted}<br>`);
        }

        output.innerHTML = "possible<br>decryption<br>options:<br><br>" + results.join("<br>"); 
    }

    function handleCipher(encrypt = true) {
        const text = inputText.value;
        const shift = parseInt(inputShift.value, 10);
        const alphabet = detectAlphabet(text);

        if (!alphabet) {
            output.textContent = "error";
            return;
        }

        if (isNaN(shift)) {
            output.textContent = "error";
            return;
        }

        let finalShift = 0;
        if (encrypt) {
            finalShift = Math.abs(shift);
        } else {
            finalShift = -Math.abs(shift);
        }
        
        const result = caesarCipher(text, finalShift, alphabet);
        animateText(output, result);
    }

    encryptButton.addEventListener("click", function () {
        handleCipher(true);
    });

    autoDecryptButton.addEventListener("click", function () {
        autoDecrypt();
    });

    loadWordList();
});
