// Exam Application with State Persistence
class ExamApp {
    constructor() {
        this.questionLoader = new QuestionLoader();
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.flaggedQuestions = new Set();
        this.startTime = null;
        this.timerInterval = null;
        this.currentExamId = null;
        this.screens = {
            examSelection: document.getElementById('examSelectionScreen'),
            welcome: document.getElementById('welcomeScreen'),
            exam: document.getElementById('examScreen'),
            results: document.getElementById('resultsScreen'),
            review: document.getElementById('reviewScreen')
        };
        this.init();
    }

    async init() {
        try {
            await this.questionLoader.loadAllQuestions();
            this.setupEventListeners();
            this.checkForSavedExam();
            this.renderExamTemplates();
        } catch (error) {
            console.error('Failed to initialize exam app:', error);
            alert('Failed to load exam questions. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Exam selection
        document.getElementById('examTemplateContainer')?.addEventListener('click', (e) => {
            const card = e.target.closest('.exam-template-card');
            if (card) {
                const examId = card.dataset.examId;
                this.selectExam(examId);
            }
        });

        // Welcome screen
        document.getElementById('startBtn')?.addEventListener('click', () => this.startExam());
        document.getElementById('backToSelectionBtn')?.addEventListener('click', () => this.showScreen('examSelection'));

        // Exam navigation
        document.getElementById('nextBtn')?.addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevBtn')?.addEventListener('click', () => this.prevQuestion());
        document.getElementById('flagBtn')?.addEventListener('click', () => this.toggleFlag());
        document.getElementById('submitBtn')?.addEventListener('click', () => this.submitExam());

        // Results and review
        document.getElementById('reviewBtn')?.addEventListener('click', () => this.showReview());
        document.getElementById('retakeBtn')?.addEventListener('click', () => this.retakeExam());
        document.getElementById('backToResultsBtn')?.addEventListener('click', () => this.showResults());
        document.getElementById('newExamBtn')?.addEventListener('click', () => this.startNewExam());

        // Resume exam button
        document.getElementById('resumeExamBtn')?.addEventListener('click', () => this.resumeExam());
        document.getElementById('dismissResumeBtn')?.addEventListener('click', () => this.dismissResume());
    }

    renderExamTemplates() {
        const container = document.getElementById('examTemplateContainer');
        if (!container) return;

        container.innerHTML = '';

        Object.values(EXAM_TEMPLATES).forEach(template => {
            const card = document.createElement('div');
            card.className = 'exam-template-card';
            card.dataset.examId = template.id;

            const icon = document.createElement('div');
            icon.className = 'exam-icon';
            icon.textContent = template.icon;

            const name = document.createElement('h3');
            name.className = 'exam-name';
            name.textContent = template.name;

            const description = document.createElement('p');
            description.className = 'exam-description';
            description.textContent = template.description;

            const questionCount = document.createElement('div');
            questionCount.className = 'exam-question-count';

            // Calculate actual question count
            let count;
            if (template.questionCount === 'all') {
                count = this.questionLoader.getAllQuestions().length;
            } else if (typeof template.questionCount === 'number') {
                count = template.questionCount;
            } else {
                const questions = template.getQuestions(this.questionLoader);
                count = questions.length;
            }

            questionCount.textContent = `${count} Questions`;

            card.appendChild(icon);
            card.appendChild(name);
            card.appendChild(description);
            card.appendChild(questionCount);

            container.appendChild(card);
        });
    }

    selectExam(examId) {
        const template = EXAM_TEMPLATES[examId];
        if (!template) {
            console.error('Invalid exam template:', examId);
            return;
        }

        this.currentExamId = examId;
        this.questions = template.getQuestions(this.questionLoader);

        // Shuffle questions for random exams
        if (template.type === 'random') {
            this.shuffleArray(this.questions);
        }

        this.updateWelcomeScreen(template);
        this.showScreen('welcome');
    }

    updateWelcomeScreen(template) {
        const welcomeTitle = document.getElementById('welcomeExamName');
        const welcomeDesc = document.getElementById('welcomeExamDesc');
        const totalQuestions = document.getElementById('totalQuestions');

        if (welcomeTitle) welcomeTitle.textContent = template.name;
        if (welcomeDesc) welcomeDesc.textContent = template.description;
        if (totalQuestions) totalQuestions.textContent = this.questions.length;
    }

    checkForSavedExam() {
        const savedState = this.loadExamState();
        const resumeBanner = document.getElementById('resumeBanner');

        if (savedState && resumeBanner) {
            const examName = EXAM_TEMPLATES[savedState.examId]?.name || 'Previous Exam';
            const progress = savedState.currentQuestionIndex + 1;
            const total = savedState.questions.length;

            document.getElementById('resumeExamName').textContent = examName;
            document.getElementById('resumeProgress').textContent =
                `Question ${progress} of ${total}`;

            resumeBanner.style.display = 'block';
        } else if (resumeBanner) {
            resumeBanner.style.display = 'none';
        }
    }

    resumeExam() {
        const savedState = this.loadExamState();
        if (!savedState) {
            alert('No saved exam found.');
            return;
        }

        this.currentExamId = savedState.examId;
        this.questions = savedState.questions;
        this.currentQuestionIndex = savedState.currentQuestionIndex;
        this.userAnswers = savedState.userAnswers;
        this.flaggedQuestions = new Set(savedState.flaggedQuestions);
        this.startTime = Date.now() - savedState.elapsedTime;

        this.startTimer();
        this.showScreen('exam');
        this.renderQuestion();
        this.renderQuestionPalette();

        const resumeBanner = document.getElementById('resumeBanner');
        if (resumeBanner) resumeBanner.style.display = 'none';
    }

    dismissResume() {
        this.clearExamState();
        const resumeBanner = document.getElementById('resumeBanner');
        if (resumeBanner) resumeBanner.style.display = 'none';
    }

    startNewExam() {
        this.clearExamState();
        this.showScreen('examSelection');
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
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

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const timerEl = document.getElementById('timer');
            if (timerEl) {
                timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
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
        const currentQuestionNumEl = document.getElementById('currentQuestionNum');
        const questionCounterEl = document.getElementById('questionCounter');
        const progressFillEl = document.getElementById('progressFill');

        if (currentQuestionNumEl) currentQuestionNumEl.textContent = questionNum;
        if (questionCounterEl) {
            questionCounterEl.textContent = `Question ${questionNum} of ${this.questions.length}`;
        }

        // Update progress bar
        const progress = (questionNum / this.questions.length) * 100;
        if (progressFillEl) progressFillEl.style.width = `${progress}%`;

        // Render question text with type indicator
        const questionTextEl = document.getElementById('questionText');
        if (questionTextEl) {
            questionTextEl.innerHTML = '';

            if (isMultipleChoice) {
                const badge = document.createElement('span');
                badge.style.cssText = 'background: #146EB4; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; margin-right: 10px;';
                badge.textContent = 'Select ALL that apply';
                questionTextEl.appendChild(badge);
            }

            const questionText = document.createTextNode(question.question);
            questionTextEl.appendChild(questionText);
        }

        // Render options
        const optionsContainer = document.getElementById('optionsContainer');
        if (optionsContainer) {
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
        }

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;

        const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
        if (nextBtn) nextBtn.style.display = isLastQuestion ? 'none' : 'inline-block';
        if (submitBtn) submitBtn.style.display = isLastQuestion ? 'inline-block' : 'none';

        // Update flag button
        const flagBtn = document.getElementById('flagBtn');
        if (flagBtn) {
            if (this.flaggedQuestions.has(this.currentQuestionIndex)) {
                flagBtn.classList.add('flagged');
                flagBtn.textContent = '🚩 Flagged';
            } else {
                flagBtn.classList.remove('flagged');
                flagBtn.textContent = '🚩 Flag for Review';
            }
        }

        // Update question palette
        this.renderQuestionPalette();

        // Save state after rendering
        this.saveExamState();
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
        this.saveExamState();
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
        if (!palette) return;

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
        this.clearExamState(); // Clear saved state after submission
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

        const scoreCircle = document.getElementById('scoreCircle');
        const scorePercentage = document.getElementById('scorePercentage');
        const passStatus = document.getElementById('passStatus');
        const correctCount = document.getElementById('correctCount');
        const incorrectCount = document.getElementById('incorrectCount');
        const totalTime = document.getElementById('totalTime');

        // Animate score circle
        const percentage = this.results.percentage;
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (percentage / 100) * circumference;

        if (scoreCircle) {
            setTimeout(() => {
                scoreCircle.style.strokeDashoffset = offset;
            }, 100);
        }

        // Update score text
        if (scorePercentage) scorePercentage.textContent = `${percentage}%`;

        // Update pass/fail status
        if (passStatus) {
            if (this.results.passed) {
                passStatus.textContent = '✅ Passed';
                passStatus.className = 'pass-status passed';
            } else {
                passStatus.textContent = '❌ Failed';
                passStatus.className = 'pass-status failed';
            }
        }

        // Update stats
        if (correctCount) correctCount.textContent = this.results.correct;
        if (incorrectCount) incorrectCount.textContent = this.results.incorrect;

        const minutes = Math.floor(this.results.timeTaken / 60000);
        const seconds = Math.floor((this.results.timeTaken % 60000) / 1000);
        if (totalTime) {
            totalTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    showReview() {
        this.showScreen('review');
        this.renderReview();
    }

    renderReview() {
        const reviewContent = document.getElementById('reviewContent');
        if (!reviewContent) return;

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
        // Clear state and restart the same exam
        this.clearExamState();

        if (this.currentExamId) {
            const template = EXAM_TEMPLATES[this.currentExamId];
            if (template && template.type === 'random') {
                // For random exams, get new random questions
                this.questions = template.getQuestions(this.questionLoader);
                this.shuffleArray(this.questions);
            }
        }

        this.showScreen('welcome');
    }

    // State Persistence Methods
    saveExamState() {
        const state = {
            examId: this.currentExamId,
            questions: this.questions,
            currentQuestionIndex: this.currentQuestionIndex,
            userAnswers: this.userAnswers,
            flaggedQuestions: Array.from(this.flaggedQuestions),
            elapsedTime: Date.now() - this.startTime,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem('awsSapExamState', JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save exam state:', error);
        }
    }

    loadExamState() {
        try {
            const stateJson = localStorage.getItem('awsSapExamState');
            if (!stateJson) return null;

            const state = JSON.parse(stateJson);

            // Check if state is not too old (24 hours)
            const maxAge = 24 * 60 * 60 * 1000;
            if (Date.now() - state.timestamp > maxAge) {
                this.clearExamState();
                return null;
            }

            return state;
        } catch (error) {
            console.error('Failed to load exam state:', error);
            return null;
        }
    }

    clearExamState() {
        try {
            localStorage.removeItem('awsSapExamState');
        } catch (error) {
            console.error('Failed to clear exam state:', error);
        }
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
    if (!darkModeToggle) return;

    const icon = darkModeToggle.querySelector('.icon');

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (icon) icon.textContent = '☀️';
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Update icon and save preference
        if (document.body.classList.contains('dark-mode')) {
            if (icon) icon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            if (icon) icon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
}
