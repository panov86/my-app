document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const endScreen = document.getElementById('end-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const giveUpButton = document.getElementById('give-up-button');
    const joker5050Button = document.getElementById('joker-50-50');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const finalScoreElement = document.getElementById('final-score');
    const playerNameInput = document.getElementById('player-name');
    const startLeaderboardList = document.getElementById('start-leaderboard-list');
    const endLeaderboardList = document.getElementById('end-leaderboard-list');
    const ratingContainer = document.getElementById('rating-container');
    const stars = document.querySelectorAll('.star');

    // Sound Elements
    const startSound = document.getElementById('start-sound');
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');
    const endSound = document.getElementById('end-sound');

    // Game state
    let score = 0;
    let currentQuestionIndex = 0;
    let timer;
    let timeLeft = 30;
    let jokers5050 = 0;
    let correctAnswersCount = 0;
    let playerName = '';
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    let shuffledQuestions = [];

    const allQuestions = [
        // Existing questions (omitted for brevity, but they are here)
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
        {
            question: 'Кой е предводителят на селската въстание от 1277 г.?',
            answers: [
                { text: 'Ивайло', correct: true },
                { text: 'Момчил', correct: false },
                { text: 'Калоян', correct: false },
                { text: 'Добротица', correct: false },
            ],
        },
        {
            question: 'През коя година е битката при Клокотница?',
            answers: [
                { text: '1205 г.', correct: false },
                { text: '1230 г.', correct: true },
                { text: '1241 г.', correct: false },
                { text: '1257 г.', correct: false },
            ],
        },
        {
            question: 'Кой български владетел приема християнството за официална религия?',
            answers: [
                { text: 'Хан Тервел', correct: false },
                { text: 'Княз Борис I', correct: true },
                { text: 'Цар Самуил', correct: false },
                { text: 'Хан Аспарух', correct: false },
            ],
        },
        {
            question: 'Коя е столицата на Второто българско царство?',
            answers: [
                { text: 'Плиска', correct: false },
                { text: 'Преслав', correct: false },
                { text: 'Търново', correct: true },
                { text: 'Охрид', correct: false },
            ],
        },
        {
            question: 'Кой е последният български цар преди падането под османско владичество?',
            answers: [
                { text: 'Иван Шишман', correct: true },
                { text: 'Иван Срацимир', correct: false },
                { text: 'Иван Асен II', correct: false },
                { text: 'Константин II Асен', correct: false },
            ],
        },
        {
            question: 'Кога България се присъединява към Европейския съюз?',
            answers: [
                { text: '2004 г.', correct: false },
                { text: '2007 г.', correct: true },
                { text: '2014 г.', correct: false },
                { text: '2001 г.', correct: false },
            ],
        },
        {
            question: 'Кой е първият демократично избран президент на България?',
            answers: [
                { text: 'Петър Младенов', correct: false },
                { text: 'Желю Желев', correct: true },
                { text: 'Петър Стоянов', correct: false },
                { text: 'Георги Първанов', correct: false },
            ],
        },
        {
            question: 'През коя година е "Виденовата зима"?',
            answers: [
                { text: '1995 г.', correct: false },
                { text: '1996 г.', correct: false },
                { text: '1997 г.', correct: true },
                { text: '1998 г.', correct: false },
            ],
        },
        {
            question: 'Кога България става член на НАТО?',
            answers: [
                { text: '1999 г.', correct: false },
                { text: '2004 г.', correct: true },
                { text: '2007 г.', correct: false },
                { text: '2014 г.', correct: false },
            ],
        },
        // More questions
        {
            question: 'Кой български хан побеждава арабите при Константинопол през 718 г.?',
            answers: [
                { text: 'Хан Тервел', correct: true },
                { text: 'Хан Аспарух', correct: false },
                { text: 'Хан Крум', correct: false },
                { text: 'Хан Омуртаг', correct: false },
            ],
        },
        {
            question: 'Коя битка е известна като "Битката на народите" за българите през 917 г.?',
            answers: [
                { text: 'Битката при Ахелой', correct: true },
                { text: 'Битката при Клокотница', correct: false },
                { text: 'Битката при Траянови врата', correct: false },
                { text: 'Битката при Одрин', correct: false },
            ],
        },
        {
            question: 'Кой е създателят на глаголицата?',
            answers: [
                { text: 'Кирил и Методий', correct: true },
                { text: 'Климент Охридски', correct: false },
                { text: 'Черноризец Храбър', correct: false },
                { text: 'Йоан Екзарх', correct: false },
            ],
        },
        {
            question: 'Кой български цар е известен със своите строителни дейности и надписи?',
            answers: [
                { text: 'Хан Омуртаг', correct: true },
                { text: 'Хан Крум', correct: false },
                { text: 'Цар Симеон I', correct: false },
                { text: 'Цар Петър I', correct: false },
            ],
        },
        {
            question: 'Кой е предводител на въстанието, което възстановява българската държава през 1185 г.?',
            answers: [
                { text: 'Асен и Петър', correct: true },
                { text: 'Ивайло', correct: false },
                { text: 'Калоян', correct: false },
                { text: 'Иван Асен II', correct: false },
            ],
        },
        {
            question: 'Кой български цар побеждава латинците в битката при Одрин през 1205 г.?',
            answers: [
                { text: 'Цар Калоян', correct: true },
                { text: 'Цар Иван Асен II', correct: false },
                { text: 'Цар Борил', correct: false },
                { text: 'Цар Константин Тих', correct: false },
            ],
        },
        {
            question: 'Кой е последният български патриарх преди падането на България под османско владичество?',
            answers: [
                { text: 'Патриарх Евтимий', correct: true },
                { text: 'Патриарх Йоаким', correct: false },
                { text: 'Патриарх Игнатий', correct: false },
                { text: 'Патриарх Висарион', correct: false },
            ],
        },
        {
            question: 'Коя е първата българска печатна книга?',
            answers: [
                { text: '"Абагар" на Филип Станиславов', correct: true },
                { text: '"Неделник" на Софроний Врачански', correct: false },
                { text: '"Рибен буквар" на Петър Берон', correct: false },
                { text: '"История славянобългарска" на Паисий Хилендарски', correct: false },
            ],
        },
        {
            question: 'Кой е идеологът и организатор на българските чети в Сърбия през 60-те години на 19 век?',
            answers: [
                { text: 'Георги Раковски', correct: true },
                { text: 'Васил Левски', correct: false },
                { text: 'Любен Каравелов', correct: false },
                { text: 'Христо Ботев', correct: false },
            ],
        },
        {
            question: 'Кой е първият български княз след Освобождението?',
            answers: [
                { text: 'Александър I Батенберг', correct: true },
                { text: 'Фердинанд I', correct: false },
                { text: 'Борис III', correct: false },
                { text: 'Симеон II', correct: false },
            ],
        },
        {
            question: 'Кога е Съединението на Княжество България и Източна Румелия?',
            answers: [
                { text: '1885 г.', correct: true },
                { text: '1878 г.', correct: false },
                { text: '1908 г.', correct: false },
                { text: '1876 г.', correct: false },
            ],
        },
        {
            question: 'Кой е министър-председател на България по време на Първата световна война?',
            answers: [
                { text: 'Васил Радославов', correct: true },
                { text: 'Александър Стамболийски', correct: false },
                { text: 'Александър Малинов', correct: false },
                { text: 'Теодор Теодоров', correct: false },
            ],
        },
        {
            question: 'Кога е извършен превратът, с който е свалено правителството на Александър Стамболийски?',
            answers: [
                { text: '1923 г.', correct: true },
                { text: '1934 г.', correct: false },
                { text: '1944 г.', correct: false },
                { text: '1919 г.', correct: false },
            ],
        },
        {
            question: 'Кой български цар управлява по време на Втората световна война?',
            answers: [
                { text: 'Цар Борис III', correct: true },
                { text: 'Цар Фердинанд I', correct: false },
                { text: 'Княз Александър I', correct: false },
                { text: 'Цар Симеон II', correct: false },
            ],
        },
        {
            question: 'Кога е обявена Народна република България?',
            answers: [
                { text: '1946 г.', correct: true },
                { text: '1944 г.', correct: false },
                { text: '1956 г.', correct: false },
                { text: '1989 г.', correct: false },
            ],
        },
        {
            question: 'Кой е последният комунистически лидер на България?',
            answers: [
                { text: 'Тодор Живков', correct: true },
                { text: 'Георги Димитров', correct: false },
                { text: 'Вълко Червенков', correct: false },
                { text: 'Петър Младенов', correct: false },
            ],
        },
        {
            question: 'Кога започват демократичните промени в България?',
            answers: [
                { text: '1989 г.', correct: true },
                { text: '1991 г.', correct: false },
                { text: '1997 г.', correct: false },
                { text: '2001 г.', correct: false },
            ],
        },
    ];

    // Event Listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', () => {
        endScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        updateLeaderboardDisplay();
    });
    giveUpButton.addEventListener('click', endGame);
    joker5050Button.addEventListener('click', useJoker5050);
    stars.forEach(star => star.addEventListener('click', rateGame));

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startGame() {
        playerName = playerNameInput.value;
        if (!playerName) {
            alert('Моля, въведете име.');
            return;
        }

        startSound.play();
        score = 0;
        currentQuestionIndex = 0;
        jokers5050 = 1; // Start with one joker
        correctAnswersCount = 0;
        shuffledQuestions = [...allQuestions];
        shuffle(shuffledQuestions);

        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        ratingContainer.classList.add('hidden');
        questionElement.classList.remove('hidden');
        answersElement.classList.remove('hidden');
        giveUpButton.classList.remove('hidden');
        updateScore();
        updateJokerButton();
        showNextQuestion();
    }

    function showNextQuestion() {
        resetState();
        if (currentQuestionIndex < shuffledQuestions.length) {
            const question = shuffledQuestions[currentQuestionIndex];
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
        Array.from(answersElement.children).forEach(button => {
            button.disabled = false;
            button.style.display = '';
        });
        updateJokerButton(); // Update button state at the beginning of each question
    }

    function startTimer() {
        timerElement.innerText = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                incorrectSound.play();
                endGame();
            }
        }, 1000);
    }

    function selectAnswer(e) {
        clearInterval(timer);
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === 'true';

        Array.from(answersElement.children).forEach(button => {
            button.disabled = true;
        });

        if (correct) {
            correctSound.play();
            score += 10; 
            correctAnswersCount++;
            if (correctAnswersCount > 0 && correctAnswersCount % 5 === 0) {
                jokers5050++;
                updateJokerButton();
            }
            updateScore();
            currentQuestionIndex++;
            setStatusClass(selectedButton, true);
            setTimeout(showNextQuestion, 1000); 
        } else {
            incorrectSound.play();
            setStatusClass(selectedButton, false);
            showRating();
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

    function updateJokerButton() {
        joker5050Button.innerText = `50/50 (${jokers5050})`;
        joker5050Button.disabled = jokers5050 <= 0;
    }

    function useJoker5050() {
        if (jokers5050 > 0) {
            jokers5050--;
            updateJokerButton();

            const answers = Array.from(answersElement.children);
            const incorrectButtons = answers.filter(button => button.dataset.correct !== 'true');
            
            shuffle(incorrectButtons);
            incorrectButtons[0].style.display = 'none';
            incorrectButtons[1].style.display = 'none';

            joker5050Button.disabled = true;
        }
    }

    function endGame() {
        endSound.play();
        clearInterval(timer);
        showRating();
    }

    function showRating() {
        questionElement.classList.add('hidden');
        answersElement.classList.add('hidden');
        giveUpButton.classList.add('hidden');
        joker5050Button.classList.add('hidden'); // Hide joker button as well
        ratingContainer.classList.remove('hidden');

        setTimeout(() => {
            quizScreen.classList.add('hidden');
            endScreen.classList.remove('hidden');
            finalScoreElement.innerText = score;
            updateLeaderboard(playerName, score);
            updateLeaderboardDisplay();
            
            // Reset for next game
            joker5050Button.classList.remove('hidden');
            ratingContainer.classList.add('hidden');
            questionElement.classList.remove('hidden');
            answersElement.classList.remove('hidden');
            giveUpButton.classList.remove('hidden');
        }, 5000);
    }

    function updateLeaderboard(name, score) {
        if (name && score) {
            leaderboard.push({ name, score });
            leaderboard.sort((a, b) => b.score - a.score);
            leaderboard = leaderboard.slice(0, 3);
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        }
    }

    function updateLeaderboardDisplay() {
        startLeaderboardList.innerHTML = '';
        endLeaderboardList.innerHTML = '';

        leaderboard.forEach(entry => {
            const startLi = document.createElement('li');
            startLi.innerText = `${entry.name}: ${entry.score}`;
            startLeaderboardList.appendChild(startLi);

            const endLi = document.createElement('li');
            endLi.innerText = `${entry.name}: ${entry.score}`;
            endLeaderboardList.appendChild(endLi);
        });
    }

    function rateGame(e) {
        const selectedValue = e.target.dataset.value;
        stars.forEach(star => {
            if (star.dataset.value <= selectedValue) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
        console.log(`Rated with ${selectedValue} stars`);
    }

    // Initial leaderboard display
    updateLeaderboardDisplay();
});
