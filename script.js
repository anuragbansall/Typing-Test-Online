const randomTextContainer = document.querySelector('#random-text-container');
const userWordInput = document.querySelector('#user-word-input');
const userWpm = document.querySelector('#user-wpm');
const userTime = document.querySelector('#user-time');
const userTestToggleBtn = document.querySelector('#user-test-toggle-btn');
const keyPressCaption = document.querySelector('#key-press-caption');

let isTypingTestOver = false;
let isTypingTestStart = false;
let intervalId;
let wpmCount = 0

function typingTestStart() {
    if (isTypingTestStart) {return};

    let cursor = 0;
    let randomIdx = Math.floor(Math.random() * paragraphsArray.length);
    let randomTextGenerate = paragraphsArray[randomIdx];
    let randomText = randomTextGenerate;

    let startTimeMinute = 0;
    let startTimeSecond = 0;
    let currentSeconds = 0;
    let wordTypedCount = 0;

    randomTextContainer.innerHTML = '';
    randomText.split('').forEach(el => {
        randomTextContainer.innerHTML += `<span>${el}</span>`;
    });

    let randomTextLength = randomText.length;
    let randomTextAllChars = document.querySelectorAll('#random-text-container span');

    intervalId = setInterval(function () {
        if (isTypingTestOver) {
            clearInterval(intervalId);
            return;
        }

        startTimeSecond++;
        if (startTimeSecond == 60) {
            startTimeSecond = 0;
            startTimeMinute++;
        }
        currentSeconds++;
        let startTime = `${startTimeMinute}:${startTimeSecond < 10 ? '0' + startTimeSecond : startTimeSecond}`;
        userTime.innerHTML = startTime;

        let timeInMinutes = currentSeconds / 60;
        wpmCount = Math.round(wordTypedCount / timeInMinutes);
        userWpm.innerHTML = `${wpmCount} wpm`;
    }, 1000);

    window.addEventListener('keydown', function (e) {
        if (!isTypingTestOver) {
            let userKeyPress = e.key.toLowerCase();
            if (cursor < randomTextLength) {
                if (userKeyPress === randomTextAllChars[cursor].innerHTML.toLowerCase()) {
                    randomTextAllChars[cursor].style.color = 'green';
                    cursor++;
                    if (userKeyPress !== ' ') {
                        userWordInput.innerHTML += userKeyPress;
                    } else {
                        userWordInput.innerHTML = ''; // Optionally handle punctuation or spaces differently
                        wordTypedCount++;
                    }
                } else {
                    randomTextAllChars[cursor].style.color = 'crimson';
                }
            }
            if (cursor === randomTextLength) {
                endTypingTest();
            }
            keyPressCaption.style.display = 'block';
            keyPressCaption.innerHTML = userKeyPress;
            setTimeout(function () {
                keyPressCaption.style.display = 'none';
            }, 500);
        }
    });

    isTypingTestStart = true; // Mark test as started
}

userTestToggleBtn.addEventListener('click', function () {
    if (this.innerHTML.trim() === "Start") {
        this.innerHTML = 'End';
        typingTestStart();
    } else if (this.innerHTML.trim() === "End") {
        endTypingTest();
    }
});

function endTypingTest() {
    let finalWpmCount = wpmCount
    document.querySelector('#typingtest-container').innerHTML = '';
    document.querySelector('#typingtest-result #wpm-result').innerHTML = finalWpmCount
    document.querySelector('#typingtest-result').style.display = 'block'
    
    clearInterval(intervalId);
    isTypingTestOver = true; 
    isTypingTestStart = false;
}