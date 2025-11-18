// Question Loader Module
// Loads all questions from the questions folder

class QuestionLoader {
    constructor() {
        this.questionFiles = [
            '../questions/domain-1-task-1.1-network-connectivity.json',
            '../questions/domain-1-task-1.2-security-controls.json',
            '../questions/domain-1-task-1.3-reliable-resilient.json',
            '../questions/domain-1-task-1.4-multi-account.json',
            '../questions/domain-1-task-1.5-cost-optimization.json',
            '../questions/domain-2-task-2.1-deployment-strategy.json',
            '../questions/domain-2-task-2.3-security-controls.json',
            '../questions/domain-2-task-2.4-reliability.json',
            '../questions/domain-3-task-3.1-operational-excellence.json',
            '../questions/domain-3-task-3.2-security-improvements.json',
            '../questions/domain-3-task-3.3-to-3.5-performance-reliability-cost.json'
        ];
        this.allQuestions = [];
        this.questionsByDomain = {};
        this.questionsByTask = {};
    }

    async loadAllQuestions() {
        try {
            const promises = this.questionFiles.map(file =>
                fetch(file)
                    .then(response => response.json())
                    .catch(err => {
                        console.warn(`Failed to load ${file}:`, err);
                        return null;
                    })
            );

            const results = await Promise.all(promises);

            results.forEach((data, index) => {
                if (data && data.questions && data.questions.length > 0) {
                    const questions = data.questions.map(q => ({
                        ...q,
                        domain: data.domain,
                        task: data.task,
                        sourceFile: this.questionFiles[index]
                    }));

                    this.allQuestions.push(...questions);

                    // Organize by domain
                    if (!this.questionsByDomain[data.domain]) {
                        this.questionsByDomain[data.domain] = [];
                    }
                    this.questionsByDomain[data.domain].push(...questions);

                    // Organize by task
                    if (!this.questionsByTask[data.task]) {
                        this.questionsByTask[data.task] = [];
                    }
                    this.questionsByTask[data.task].push(...questions);
                }
            });

            console.log(`Loaded ${this.allQuestions.length} questions from ${this.questionFiles.length} files`);
            return this.allQuestions;
        } catch (error) {
            console.error('Error loading questions:', error);
            throw error;
        }
    }

    getAllQuestions() {
        return [...this.allQuestions];
    }

    getQuestionsByDomain(domain) {
        return this.questionsByDomain[domain] ? [...this.questionsByDomain[domain]] : [];
    }

    getQuestionsByTask(task) {
        return this.questionsByTask[task] ? [...this.questionsByTask[task]] : [];
    }

    getRandomQuestions(count) {
        const shuffled = this.shuffleArray([...this.allQuestions]);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    getDomains() {
        return Object.keys(this.questionsByDomain);
    }

    getTasks() {
        return Object.keys(this.questionsByTask);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Exam Configuration Templates
const EXAM_TEMPLATES = {
    'full-exam': {
        id: 'full-exam',
        name: 'Full Practice Exam',
        description: 'Complete exam with all available questions',
        icon: '📝',
        type: 'predefined',
        questionCount: 'all',
        getQuestions: (loader) => loader.getAllQuestions()
    },
    'random-75': {
        id: 'random-75',
        name: 'Random 75 Questions',
        description: 'Simulates the real AWS SAP exam length',
        icon: '🎲',
        type: 'random',
        questionCount: 75,
        getQuestions: (loader) => loader.getRandomQuestions(75)
    },
    'random-50': {
        id: 'random-50',
        name: 'Quick Practice - 50 Questions',
        description: 'Shorter practice session',
        icon: '⚡',
        type: 'random',
        questionCount: 50,
        getQuestions: (loader) => loader.getRandomQuestions(50)
    },
    'random-25': {
        id: 'random-25',
        name: 'Mini Quiz - 25 Questions',
        description: 'Quick knowledge check',
        icon: '🎯',
        type: 'random',
        questionCount: 25,
        getQuestions: (loader) => loader.getRandomQuestions(25)
    },
    'domain-1': {
        id: 'domain-1',
        name: 'Domain 1: Organizational Complexity',
        description: 'Focus on organizational complexity scenarios',
        icon: '🏢',
        type: 'predefined',
        questionCount: 'domain',
        getQuestions: (loader) => loader.getQuestionsByDomain('Domain 1: Organizational Complexity')
    },
    'domain-2': {
        id: 'domain-2',
        name: 'Domain 2: New Solutions',
        description: 'Focus on designing new solutions',
        icon: '💡',
        type: 'predefined',
        questionCount: 'domain',
        getQuestions: (loader) => loader.getQuestionsByDomain('Domain 2: New Solutions')
    },
    'domain-3': {
        id: 'domain-3',
        name: 'Domain 3: Continuous Improvement',
        description: 'Focus on continuous improvement scenarios',
        icon: '📈',
        type: 'predefined',
        questionCount: 'domain',
        getQuestions: (loader) => loader.getQuestionsByDomain('Domain 3: Continuous Improvement')
    },
    'network-security': {
        id: 'network-security',
        name: 'Network & Security Deep Dive',
        description: 'Network connectivity and security controls',
        icon: '🔒',
        type: 'predefined',
        questionCount: 'mixed',
        getQuestions: (loader) => {
            const networkQuestions = loader.getQuestionsByTask('Task 1.1: Network Connectivity');
            const securityQuestions = loader.getQuestionsByTask('Task 1.2: Security Controls');
            return [...networkQuestions, ...securityQuestions];
        }
    },
    'reliability-resilience': {
        id: 'reliability-resilience',
        name: 'Reliability & Resilience',
        description: 'High availability and disaster recovery',
        icon: '🛡️',
        type: 'predefined',
        questionCount: 'mixed',
        getQuestions: (loader) => {
            const task13 = loader.getQuestionsByTask('Task 1.3: Reliable and Resilient');
            const task24 = loader.getQuestionsByTask('Task 2.4: Reliability');
            return [...task13, ...task24];
        }
    }
};
