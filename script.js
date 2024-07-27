let points = 100;
let netScore = 100;
let currentQuestionIndex = 0;
const baseBet = 5;
const baseWin = 10;
let streak = 0;
const multipliers = [1, 1.5, 2];  // Random multipliers
let currentMultiplier = 1;
let confidenceLevel = 1;
let hypeLevel = 0;
let timerInterval;
let timeLeft = 10;

function updatePoints() {
    document.getElementById('points').innerText = `Points: ${points}`;
    document.getElementById('net-score').innerText = `Net Score: ${netScore}`;
}

function updateHypeBar() {
    const hypeBar = document.getElementById('hype-bar');
    hypeBar.style.width = `${(hypeLevel / 5) * 100}%`;
}

function startTimer() {
    timeLeft = 10;
    document.getElementById('timer').innerText = `Time left: ${timeLeft}s`;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            forfeitGame();
        }
    }, 1000);
}

function forfeitGame() {
    alert("Time's up! Game over.");
    currentQuestionIndex = questions.length;  // End the game
    displayQuestion();
}

function displayQuestion() {
    clearInterval(timerInterval);
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    if (currentQuestionIndex < questions.length) {
        currentMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
        const question = questions[currentQuestionIndex];
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>Multiplier: ${currentMultiplier}</p>
            <p>${question.question}</p>
            <input type="range" min="1" max="10" value="1" id="confidence-slider" oninput="updateConfidence(this.value)">
            <p>Confidence Level: <span id="confidence-level">1</span></p>
            <button onclick="bet(true)">True</button>
            <button onclick="bet(false)">False</button>
        `;
        questionContainer.appendChild(questionDiv);
        startTimer();
    } else {
        questionContainer.innerHTML = '<p>All questions completed!</p>';
    }
}

function updateConfidence(value) {
    confidenceLevel = value;
    document.getElementById('confidence-level').innerText = value;
}

function bet(answer) {
    clearInterval(timerInterval);
    let betAmount = baseBet * currentMultiplier * confidenceLevel;
    let winAmount = baseWin * currentMultiplier * confidenceLevel;

    if (hypeLevel >= 5) {
        currentMultiplier = 2.5;  // Guaranteed 2.5x bet on the next question
        betAmount = baseBet * currentMultiplier * confidenceLevel;
        winAmount = baseWin * currentMultiplier * confidenceLevel;
    }

    if (points < betAmount) {
        alert("Not enough points to bet!");
        return;
    }

    points -= betAmount;

    const questionDiv = document.getElementsByClassName('question')[0];

    if (questions[currentQuestionIndex].answer === answer) {
        points += winAmount;
        netScore += winAmount;
        streak++;
        hypeLevel++;
        if (streak % 3 === 0) {
            points += 10;  // Bonus points for streaks
            netScore += 10;
        }
        questionDiv.classList.add('win');
    } else {
        netScore -= betAmount;
        streak = 0;
        hypeLevel = Math.max(0, hypeLevel - 1);
        questionDiv.classList.add('lose');
    }

    setTimeout(() => {
        questionDiv.classList.remove('win');
        questionDiv.classList.remove('lose');
        currentQuestionIndex++;
        updatePoints();
        updateHypeBar();
        if (hypeLevel >= 5) {
            hypeLevel = 0;
        }
        displayQuestion();
    }, 1000);
}

function startGame() {
    document.getElementById('welcome-container').style.display = 'none';
    document.getElementById('points').style.display = 'block';
    document.getElementById('net-score').style.display = 'block';
    document.getElementById('hype-container').style.display = 'block';
    document.getElementById('timer').style.display = 'block';
    updatePoints();
    updateHypeBar();
    displayQuestion();
}

window.onload = () => {
updatePoints();
updateHypeBar();
};