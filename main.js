document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const endScreen = document.getElementById('end-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const finalScoreElement = document.getElementById('final-score');

    // Game state
    let score = 0;
    let currentQuestionIndex = 0;
    let timer;
    let timeLeft = 30;

    const questions = [
        {
            question: 'Коя година е създадена Българската държава?',
            answers: [
                { text: '681 г.', correct: true },
                { text: '865 г.', correct: false },
                { text: '1185 г.', correct: false },
                { text: '1396 г.', correct: false },
            ],
        },
        {
            question: 'Кой е първият български цар?',
            answers: [
                { text: 'Хан Аспарух', correct: false },
                { text: 'Цар Симеон I', correct: true },
                { text: 'Цар Петър I', correct: false },
                { text: 'Цар Калоян', correct: false },
            ],
        },
        {
            question: 'Кога е покръстването на българите?',
            answers: [
                { text: '681 г.', correct: false },
                { text: '864 г.', correct: true },
                { text: '988 г.', correct: false },
                { text: '1018 г.', correct: false },
            ],
        },
        {
            question: 'Кой български владетел е наречен "Велики"?',
            answers: [
                { text: 'Хан Крум', correct: false },
                { text: 'Цар Симеон I', correct: true },
                { text: 'Цар Иван Асен II', correct: false },
                { text: 'Хан Омуртаг', correct: false },
            ],
        },
        {
            question: 'През коя година България пада под османско владичество?',
            answers: [
                { text: '1389 г.', correct: false },
                { text: '1393 г.', correct: false },
                { text: '1396 г.', correct: true },
                { text: '1453 г.', correct: false },
            ],
        },
        {
            question: 'Кой е авторът на "История славянобългарска"?',
            answers: [
                { text: 'Паисий Хилендарски', correct: true },
                { text: 'Софроний Врачански', correct: false },
                { text: 'Неофит Рилски', correct: false },
                { text: 'Петър Берон', correct: false },
            ],
        },
        {
            question: 'Кога е избухнало Априлското въстание?',
            answers: [
                { text: '1875 г.', correct: false },
                { text: '1876 г.', correct: true },
                { text: '1877 г.', correct: false },
                { text: '1878 г.', correct: false },
            ],
        },
        {
            question: 'Кой е Васил Левски?',
            answers: [
                { text: 'Поет', correct: false },
                { text: 'Революционер и национален герой', correct: true },
                { text: 'Художник', correct: false },
                { text: 'Цар', correct: false },
            ],
        },
        {
            question: 'Кога е обявена независимостта на България?',
            answers: [
                { text: '1878 г.', correct: false },
                { text: '1885 г.', correct: false },
                { text: '1908 г.', correct: true },
                { text: '1912 г.', correct: false },
            ],
        },
        {
            question: 'В коя война България губи Южна Добруджа?',
            answers: [
                { text: 'Първа балканска война', correct: false },
                { text: 'Втора балканска война', correct: true },
                { text: 'Първа световна война', correct: false },
                { text: 'Втора световна война', correct: false },
            ],
        },
    ];

    // Event Listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    function startGame() {
        score = 0;
        currentQuestionIndex = 0;
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        updateScore();
        showNextQuestion();
    }

    function showNextQuestion() {
        resetState();
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionElement.innerText = question.question;
            question.answers.forEach(answer => {
                const button = document.createElement('button');
                button.innerText = answer.text;
                button.classList.add('answer-button');
                if (answer.correct) {
                    button.dataset.correct = answer.correct;
                }
                button.addEventListener('click', selectAnswer);
                answersElement.appendChild(button);
            });
            startTimer();
        } else {
            endGame();
        }
    }

    function resetState() {
        clearTimeout(timer);
        timeLeft = 30;
        timerElement.innerText = timeLeft;
        while (answersElement.firstChild) {
            answersElement.removeChild(answersElement.firstChild);
        }
    }

    function startTimer() {
        timerElement.innerText = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }

    function selectAnswer(e) {
        clearInterval(timer);
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === 'true';

        setStatusClass(selectedButton, correct);

        if (correct) {
            score += 10; // Add 10 points for each correct answer
            updateScore();
            currentQuestionIndex++;
            setTimeout(showNextQuestion, 1000); // Wait 1 second before next question
        } else {
            setTimeout(endGame, 1000); // Wait 1 second before ending game
        }
    }

    function setStatusClass(element, correct) {
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('incorrect');
        }
    }

    function updateScore() {
        scoreElement.innerText = `Точки: ${score}`;
    }

    function endGame() {
        quizScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalScoreElement.innerText = score;
    }
});
