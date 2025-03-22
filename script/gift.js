function Main_9() {

const textarea = document.getElementById('personalised-note');
const charCount = document.getElementById('char-count');

textarea.addEventListener('input', () => {
    const remainingChars = 250 - textarea.value.length;
    charCount.textContent = remainingChars;
});
}