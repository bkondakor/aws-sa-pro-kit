// AWS SA Pro Practice Exam Application
class ExamApp {
    constructor() {
        this.allQuestionSets = [];
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.flaggedQuestions = new Set();
        this.startTime = null;
        this.timerInterval = null;
        this.examMode = null;
        this.examConfig = null;
        this.studyMode = false; // Answer reveal mode

        this.screens = {
            welcome: document.getElementById('welcomeScreen'),
            config: document.getElementById('configScreen'),
            exam: document.getElementById('examScreen'),
            results: document.getElementById('resultsScreen'),
            review: document.getElementById('reviewScreen')
        };

        this.init();
    }

    async init() {
        await this.loadAllQuestions();
        this.setupEventListeners();
        this.checkSavedExam();
    }

    async loadAllQuestions() {
        try {
            const response = await fetch('all-questions.json');
            const data = await response.json();
            this.allQuestionSets = data.questionSets;
            document.getElementById('totalQuestions').textContent = data.metadata.totalQuestions;
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Failed to load questions. Please ensure all-questions.json is available.');
        }
    }

    setupEventListeners() {
        // Study mode toggle
        document.getElementById('studyModeToggle')?.addEventListener('change', (e) => {
            this.studyMode = e.target.checked;
            // Update current question display if in exam screen
            if (this.screens.exam.classList.contains('active')) {
                if (this.studyMode && this.userAnswers[this.currentQuestionIndex] !== null) {
                    this.showStudyModeFeedback();
                } else {
                    this.hideStudyModeFeedback();
                }
            }
        });

        // Exam mode selection
        document.querySelectorAll('.exam-mode-card').forEach(card => {
            card.addEventListener('click', () => this.selectExamMode(card.dataset.mode));
        });

        // Navigation buttons
        document.getElementById('backToWelcomeBtn')?.addEventListener('click', () => this.showScreen('welcome'));
        document.getElementById('continueExamBtn')?.addEventListener('click', () => this.continueSavedExam());
        document.getElementById('newExamBtn')?.addEventListener('click', () => this.startNewExam());
        document.getElementById('startConfiguredExamBtn')?.addEventListener('click', () => this.startConfiguredExam());

        // Exam controls
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevQuestion());
        document.getElementById('flagBtn').addEventListener('click', () => this.toggleFlag());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitExam());
        document.getElementById('reviewBtn').addEventListener('click', () => this.showReview());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakeExam());
        document.getElementById('backToResultsBtn').addEventListener('click', () => this.showResults());
    }

    checkSavedExam() {
        const saved = localStorage.getItem('examState');
        if (saved) {
            const examState = JSON.parse(saved);
            const savedExamSection = document.getElementById('savedExamSection');
            const savedExamDetails = document.getElementById('savedExamDetails');

            const answered = examState.userAnswers.filter(a => a !== null).length;
            const total = examState.questions.length;
            const percentage = Math.round((answered / total) * 100);

            savedExamDetails.textContent = `${answered} of ${total} questions answered (${percentage}%)`;
            savedExamSection.style.display = 'block';
        }
    }

    selectExamMode(mode) {
        this.examMode = mode;

        if (mode === 'full') {
            // Start full exam immediately
            this.prepareFullExam();
            this.startExam();
        } else if (mode === 'random') {
            // Show random exam configuration
            this.showRandomConfig();
        } else if (mode === 'domain') {
            // Show domain selection
            this.showDomainConfig();
        }
    }

    prepareFullExam() {
        this.questions = [];
        this.allQuestionSets.forEach(set => {
            this.questions.push(...set.questions);
        });
        this.shuffleArray(this.questions);
    }

    showRandomConfig() {
        this.showScreen('config');
        document.getElementById('configTitle').textContent = 'Configure Random Exam';

        const configContent = document.getElementById('configContent');
        configContent.innerHTML = `
            <div class="config-option">
                <label>
                    <span>Number of questions:</span>
                    <input type="number" id="randomQuestionCount" min="10" max="132" value="30">
                </label>
            </div>
            <div class="config-option">
                <label>
                    <input type="checkbox" id="shuffleOptions" checked>
                    <span>Shuffle answer options</span>
                </label>
            </div>
        `;
    }

    showDomainConfig() {
        this.showScreen('config');
        document.getElementById('configTitle').textContent = 'Select Domains';

        // Group question sets by domain
        const domainMap = new Map();
        this.allQuestionSets.forEach(set => {
            if (!domainMap.has(set.domain)) {
                domainMap.set(set.domain, []);
            }
            domainMap.get(set.domain).push(set);
        });

        const configContent = document.getElementById('configContent');
        let html = '<div class="domain-list">';

        domainMap.forEach((sets, domain) => {
            const totalQuestions = sets.reduce((sum, set) => sum + set.questions.length, 0);
            html += `
                <div class="domain-item">
                    <input type="checkbox" id="domain-${this.sanitizeId(domain)}" value="${domain}" checked>
                    <label for="domain-${this.sanitizeId(domain)}">${domain}</label>
                    <span class="question-count">${totalQuestions} questions</span>
                </div>
            `;
        });

        html += '</div>';
        configContent.innerHTML = html;
    }

    sanitizeId(str) {
        return str.replace(/[^a-zA-Z0-9]/g, '-');
    }

    startConfiguredExam() {
        if (this.examMode === 'random') {
            const count = parseInt(document.getElementById('randomQuestionCount').value);
            this.prepareRandomExam(count);
        } else if (this.examMode === 'domain') {
            this.prepareDomainExam();
        }

        if (this.questions.length === 0) {
            alert('Please select at least one domain or adjust your configuration.');
            return;
        }

        this.startExam();
    }

    prepareRandomExam(count) {
        // Collect all questions
        const allQuestions = [];
        this.allQuestionSets.forEach(set => {
            allQuestions.push(...set.questions);
        });

        // Shuffle and select random questions
        this.shuffleArray(allQuestions);
        this.questions = allQuestions.slice(0, Math.min(count, allQuestions.length));
    }

    prepareDomainExam() {
        this.questions = [];
        const selectedDomains = [];

        document.querySelectorAll('.domain-item input[type="checkbox"]:checked').forEach(checkbox => {
            selectedDomains.push(checkbox.value);
        });

        this.allQuestionSets.forEach(set => {
            if (selectedDomains.includes(set.domain)) {
                this.questions.push(...set.questions);
            }
        });

        this.shuffleArray(this.questions);
    }

    startNewExam() {
        localStorage.removeItem('examState');
        document.getElementById('savedExamSection').style.display = 'none';
    }

    continueSavedExam() {
        const saved = localStorage.getItem('examState');
        if (saved) {
            const examState = JSON.parse(saved);
            this.questions = examState.questions;
            this.currentQuestionIndex = examState.currentQuestionIndex;
            this.userAnswers = examState.userAnswers;
            this.flaggedQuestions = new Set(examState.flaggedQuestions);
            this.startTime = examState.startTime;
            this.studyMode = examState.studyMode || false;

            this.showScreen('exam');
            this.startTimer();
            this.renderQuestion();
            this.renderQuestionPalette();
        }
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
        this.saveExamState();
    }

    saveExamState() {
        const examState = {
            questions: this.questions,
            currentQuestionIndex: this.currentQuestionIndex,
            userAnswers: this.userAnswers,
            flaggedQuestions: Array.from(this.flaggedQuestions),
            startTime: this.startTime,
            examMode: this.examMode,
            studyMode: this.studyMode
        };
        localStorage.setItem('examState', JSON.stringify(examState));
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
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

        // Handle study mode feedback for already answered questions
        if (this.studyMode && this.userAnswers[this.currentQuestionIndex] !== null) {
            this.showStudyModeFeedback();
        } else {
            this.hideStudyModeFeedback();
        }
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
        this.saveExamState();

        // Show immediate feedback in study mode
        if (this.studyMode) {
            this.showStudyModeFeedback();
        }
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

        // Show immediate feedback in study mode
        if (this.studyMode && currentAnswer.length > 0) {
            this.showStudyModeFeedback();
        } else if (this.studyMode && currentAnswer.length === 0) {
            // Hide feedback if all selections are cleared
            this.hideStudyModeFeedback();
        }

        this.renderQuestionPalette();
        this.saveExamState();
    }

    showStudyModeFeedback() {
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        const correctAnswer = question.correctAnswer;
        const isMultipleChoice = question.type === 'multiple';

        // Mark correct and incorrect options
        document.querySelectorAll('.option').forEach((optionDiv, index) => {
            const isUserAnswer = isMultipleChoice
                ? (Array.isArray(userAnswer) && userAnswer.includes(index))
                : (userAnswer === index);

            const isCorrectAnswer = isMultipleChoice
                ? (Array.isArray(correctAnswer) && correctAnswer.includes(index))
                : (correctAnswer === index);

            // Remove previous feedback classes
            optionDiv.classList.remove('study-correct', 'study-incorrect', 'study-correct-answer');

            // Apply feedback classes
            if (isCorrectAnswer) {
                optionDiv.classList.add('study-correct-answer');
            }

            if (isUserAnswer && isCorrectAnswer) {
                optionDiv.classList.add('study-correct');
            } else if (isUserAnswer && !isCorrectAnswer) {
                optionDiv.classList.add('study-incorrect');
            }
        });

        // Show explanation
        const explanationDiv = document.getElementById('studyModeExplanation');
        if (question.explanation) {
            explanationDiv.innerHTML = `
                <div class="explanation-header">
                    <span class="explanation-icon">💡</span>
                    <strong>Explanation</strong>
                </div>
                <div class="explanation-content">${question.explanation}</div>
            `;
            explanationDiv.style.display = 'block';
        }
    }

    hideStudyModeFeedback() {
        // Remove all feedback classes from options
        document.querySelectorAll('.option').forEach((optionDiv) => {
            optionDiv.classList.remove('study-correct', 'study-incorrect', 'study-correct-answer');
        });

        // Hide explanation
        const explanationDiv = document.getElementById('studyModeExplanation');
        explanationDiv.style.display = 'none';
    }

    toggleFlag() {
        if (this.flaggedQuestions.has(this.currentQuestionIndex)) {
            this.flaggedQuestions.delete(this.currentQuestionIndex);
        } else {
            this.flaggedQuestions.add(this.currentQuestionIndex);
        }
        this.renderQuestion();
        this.saveExamState();
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
            this.saveExamState();
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
            this.saveExamState();
        }
    }

    goToQuestion(index) {
        this.currentQuestionIndex = index;
        this.renderQuestion();
        this.saveExamState();
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
        localStorage.removeItem('examState');
    }

    calculateResults() {
        let correct = 0;

        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = question.correctAnswer;

            if (question.type === 'multiple') {
                // For multiple choice, check if arrays match
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
                if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                    const userSorted = [...userAnswer].sort();
                    const correctSorted = [...correctAnswer].sort();
                    isCorrect = JSON.stringify(userSorted) === JSON.stringify(correctSorted);
                }
            } else {
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

                // Mark wrong answer
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
        this.shuffleArray(this.questions);
        localStorage.removeItem('examState');
        this.showScreen('welcome');
        this.checkSavedExam();
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
