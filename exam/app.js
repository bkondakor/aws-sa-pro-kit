// Exam Application
class ExamApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.flaggedQuestions = new Set();
        this.startTime = null;
        this.timerInterval = null;
        this.screens = {
            welcome: document.getElementById('welcomeScreen'),
            exam: document.getElementById('examScreen'),
            results: document.getElementById('resultsScreen'),
            review: document.getElementById('reviewScreen')
        };
        this.init();
    }

    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.updateTotalQuestions();
    }

    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            const data = await response.json();
            this.questions = data.questions;

            // Shuffle questions for randomization
            this.shuffleArray(this.questions);

            // Initialize user answers array
            this.userAnswers = new Array(this.questions.length).fill(null);
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Failed to load questions. Please ensure questions.json is available.');
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startExam());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevQuestion());
        document.getElementById('flagBtn').addEventListener('click', () => this.toggleFlag());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitExam());
        document.getElementById('reviewBtn').addEventListener('click', () => this.showReview());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakeExam());
        document.getElementById('backToResultsBtn').addEventListener('click', () => this.showResults());
    }

    updateTotalQuestions() {
        document.getElementById('totalQuestions').textContent = this.questions.length;
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    startExam() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.flaggedQuestions.clear();
        this.startTime = Date.now();
        this.startTimer();
        this.showScreen('exam');
        this.renderQuestion();
        this.renderQuestionPalette();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('timer').textContent =
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const isMultipleChoice = question.type === 'multiple';

        // Update question counter and progress
        const questionNum = this.currentQuestionIndex + 1;
        document.getElementById('currentQuestionNum').textContent = questionNum;
        document.getElementById('questionCounter').textContent =
            `Question ${questionNum} of ${this.questions.length}`;

        // Update progress bar
        const progress = (questionNum / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;

        // Render question text with type indicator
        const questionTextEl = document.getElementById('questionText');
        questionTextEl.innerHTML = '';

        if (isMultipleChoice) {
            const badge = document.createElement('span');
            badge.style.cssText = 'background: #146EB4; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; margin-right: 10px;';
            badge.textContent = 'Select ALL that apply';
            questionTextEl.appendChild(badge);
        }

        const questionText = document.createTextNode(question.question);
        questionTextEl.appendChild(questionText);

        // Render options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';

            const input = document.createElement('input');
            input.type = isMultipleChoice ? 'checkbox' : 'radio';
            input.name = 'answer';
            input.value = index;
            input.id = `option${index}`;

            // Check if this option was previously selected
            const currentAnswer = this.userAnswers[this.currentQuestionIndex];
            if (isMultipleChoice && Array.isArray(currentAnswer)) {
                if (currentAnswer.includes(index)) {
                    input.checked = true;
                    optionDiv.classList.add('selected');
                }
            } else if (!isMultipleChoice && currentAnswer === index) {
                input.checked = true;
                optionDiv.classList.add('selected');
            }

            input.addEventListener('change', (e) => {
                if (isMultipleChoice) {
                    this.toggleMultipleAnswer(parseInt(e.target.value));
                } else {
                    this.selectAnswer(parseInt(e.target.value));
                }
            });

            const label = document.createElement('label');
            label.htmlFor = `option${index}`;
            label.className = 'option-text';
            label.textContent = option;
            label.style.cursor = 'pointer';

            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            optionDiv.addEventListener('click', (e) => {
                if (e.target !== input) {
                    if (isMultipleChoice) {
                        input.checked = !input.checked;
                        this.toggleMultipleAnswer(index);
                    } else {
                        input.checked = true;
                        this.selectAnswer(index);
                    }
                }
            });

            optionsContainer.appendChild(optionDiv);
        });

        // Update navigation buttons
        document.getElementById('prevBtn').disabled = this.currentQuestionIndex === 0;

        const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
        document.getElementById('nextBtn').style.display = isLastQuestion ? 'none' : 'inline-block';
        document.getElementById('submitBtn').style.display = isLastQuestion ? 'inline-block' : 'none';

        // Update flag button
        const flagBtn = document.getElementById('flagBtn');
        if (this.flaggedQuestions.has(this.currentQuestionIndex)) {
            flagBtn.classList.add('flagged');
            flagBtn.textContent = '🚩 Flagged';
        } else {
            flagBtn.classList.remove('flagged');
            flagBtn.textContent = '🚩 Flag for Review';
        }

        // Update question palette
        this.renderQuestionPalette();
    }

    selectAnswer(optionIndex) {
        this.userAnswers[this.currentQuestionIndex] = optionIndex;

        // Update visual selection
        document.querySelectorAll('.option').forEach((opt, idx) => {
            if (idx === optionIndex) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });

        this.renderQuestionPalette();
    }

    toggleMultipleAnswer(optionIndex) {
        let currentAnswer = this.userAnswers[this.currentQuestionIndex];

        // Initialize as empty array if not set
        if (!Array.isArray(currentAnswer)) {
            currentAnswer = [];
        }

        // Toggle the option
        const index = currentAnswer.indexOf(optionIndex);
        if (index > -1) {
            currentAnswer.splice(index, 1);
        } else {
            currentAnswer.push(optionIndex);
        }

        // Store back (or null if empty)
        this.userAnswers[this.currentQuestionIndex] = currentAnswer.length > 0 ? currentAnswer : null;

        // Update visual selection
        document.querySelectorAll('.option').forEach((opt, idx) => {
            if (currentAnswer.includes(idx)) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });

        this.renderQuestionPalette();
    }

    toggleFlag() {
        if (this.flaggedQuestions.has(this.currentQuestionIndex)) {
            this.flaggedQuestions.delete(this.currentQuestionIndex);
        } else {
            this.flaggedQuestions.add(this.currentQuestionIndex);
        }
        this.renderQuestion();
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
        }
    }

    goToQuestion(index) {
        this.currentQuestionIndex = index;
        this.renderQuestion();
    }

    renderQuestionPalette() {
        const palette = document.getElementById('questionPalette');
        palette.innerHTML = '';

        this.questions.forEach((_, index) => {
            const item = document.createElement('div');
            item.className = 'palette-item';
            item.textContent = index + 1;

            if (this.userAnswers[index] !== null) {
                item.classList.add('answered');
            }
            if (this.flaggedQuestions.has(index)) {
                item.classList.add('flagged');
            }
            if (index === this.currentQuestionIndex) {
                item.classList.add('current');
            }

            item.addEventListener('click', () => this.goToQuestion(index));
            palette.appendChild(item);
        });
    }

    submitExam() {
        const unanswered = this.userAnswers.filter(a => a === null).length;

        if (unanswered > 0) {
            const confirm = window.confirm(
                `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`
            );
            if (!confirm) return;
        }

        this.stopTimer();
        this.calculateResults();
        this.showResults();
    }

    calculateResults() {
        let correct = 0;

        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = question.correctAnswer;

            if (question.type === 'multiple') {
                // For multiple choice, check if arrays match (same elements, order doesn't matter)
                if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                    const userSorted = [...userAnswer].sort();
                    const correctSorted = [...correctAnswer].sort();
                    if (JSON.stringify(userSorted) === JSON.stringify(correctSorted)) {
                        correct++;
                    }
                }
            } else {
                // For single choice, direct comparison
                if (userAnswer === correctAnswer) {
                    correct++;
                }
            }
        });

        this.results = {
            correct,
            incorrect: this.questions.length - correct,
            total: this.questions.length,
            percentage: Math.round((correct / this.questions.length) * 100),
            passed: (correct / this.questions.length) >= 0.7,
            timeTaken: Date.now() - this.startTime
        };
    }

    showResults() {
        this.showScreen('results');

        // Animate score circle
        const percentage = this.results.percentage;
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (percentage / 100) * circumference;

        setTimeout(() => {
            document.getElementById('scoreCircle').style.strokeDashoffset = offset;
        }, 100);

        // Update score text
        document.getElementById('scorePercentage').textContent = `${percentage}%`;

        // Update pass/fail status
        const passStatus = document.getElementById('passStatus');
        if (this.results.passed) {
            passStatus.textContent = '✅ Passed';
            passStatus.className = 'pass-status passed';
        } else {
            passStatus.textContent = '❌ Failed';
            passStatus.className = 'pass-status failed';
        }

        // Update stats
        document.getElementById('correctCount').textContent = this.results.correct;
        document.getElementById('incorrectCount').textContent = this.results.incorrect;

        const minutes = Math.floor(this.results.timeTaken / 60000);
        const seconds = Math.floor((this.results.timeTaken % 60000) / 1000);
        document.getElementById('totalTime').textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    showReview() {
        this.showScreen('review');
        this.renderReview();
    }

    renderReview() {
        const reviewContent = document.getElementById('reviewContent');
        reviewContent.innerHTML = '';

        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = question.correctAnswer;
            const isMultipleChoice = question.type === 'multiple';

            let isCorrect = false;
            if (isMultipleChoice) {
                // Check if arrays match for multiple choice
                if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                    const userSorted = [...userAnswer].sort();
                    const correctSorted = [...correctAnswer].sort();
                    isCorrect = JSON.stringify(userSorted) === JSON.stringify(correctSorted);
                }
            } else {
                // Direct comparison for single choice
                isCorrect = userAnswer === correctAnswer;
            }

            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;

            // Question header
            const header = document.createElement('div');
            header.className = 'review-question-header';

            const questionNum = document.createElement('div');
            questionNum.className = 'review-question-number';
            questionNum.textContent = `Question ${index + 1}`;
            if (isMultipleChoice) {
                const badge = document.createElement('span');
                badge.style.cssText = 'background: #146EB4; color: white; padding: 2px 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 600; margin-left: 8px;';
                badge.textContent = 'MULTIPLE';
                questionNum.appendChild(badge);
            }

            const status = document.createElement('div');
            status.className = `review-status ${isCorrect ? 'correct' : 'incorrect'}`;
            status.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';

            header.appendChild(questionNum);
            header.appendChild(status);

            // Question text
            const questionText = document.createElement('div');
            questionText.className = 'review-question-text';
            questionText.textContent = question.question;

            // Options
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'review-options';

            question.options.forEach((option, optIndex) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'review-option';
                optionDiv.textContent = option;

                const isUserAnswer = isMultipleChoice
                    ? (Array.isArray(userAnswer) && userAnswer.includes(optIndex))
                    : (userAnswer === optIndex);

                const isCorrectAnswer = isMultipleChoice
                    ? (Array.isArray(correctAnswer) && correctAnswer.includes(optIndex))
                    : (correctAnswer === optIndex);

                // Mark user's answer
                if (isUserAnswer) {
                    optionDiv.classList.add('user-answer');
                    const label = document.createElement('span');
                    label.className = 'answer-label user';
                    label.textContent = 'Your Answer';
                    optionDiv.appendChild(label);
                }

                // Mark correct answer
                if (isCorrectAnswer) {
                    optionDiv.classList.add('correct-answer');
                    const label = document.createElement('span');
                    label.className = 'answer-label correct';
                    label.textContent = 'Correct';
                    optionDiv.appendChild(label);
                }

                // Mark wrong answer (user selected but incorrect)
                if (isUserAnswer && !isCorrectAnswer) {
                    optionDiv.classList.add('wrong-answer');
                }

                optionsDiv.appendChild(optionDiv);
            });

            // Explanation
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation';

            const explanationTitle = document.createElement('div');
            explanationTitle.className = 'explanation-title';
            explanationTitle.innerHTML = '💡 Explanation';

            const explanationText = document.createElement('div');
            explanationText.className = 'explanation-text';
            explanationText.textContent = question.explanation || 'No explanation available.';

            explanationDiv.appendChild(explanationTitle);
            explanationDiv.appendChild(explanationText);

            // Assemble review item
            reviewItem.appendChild(header);
            reviewItem.appendChild(questionText);
            reviewItem.appendChild(optionsDiv);
            reviewItem.appendChild(explanationDiv);

            reviewContent.appendChild(reviewItem);
        });
    }

    retakeExam() {
        // Shuffle questions again for a new experience
        this.shuffleArray(this.questions);
        this.showScreen('welcome');
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ExamApp();
    initDarkMode();
});

// Dark Mode Functionality
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('.icon');

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        icon.textContent = '☀️';
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Update icon and save preference
        if (document.body.classList.contains('dark-mode')) {
            icon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
}
