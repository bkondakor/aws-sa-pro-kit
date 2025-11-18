const fs = require('fs');
const path = require('path');

const questionsDir = path.join(__dirname, '..', 'questions');
const outputFile = path.join(__dirname, '..', 'exam', 'all-questions.json');

const files = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json'));

const allData = {
  metadata: {
    totalFiles: files.length,
    totalQuestions: 0,
    domains: [],
    lastUpdated: new Date().toISOString()
  },
  questionSets: []
};

files.forEach(file => {
  const filePath = path.join(questionsDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Check if this is a simple format (direct questions array) or complex format (nested tasks)
  if (content.questions && Array.isArray(content.questions)) {
    // Simple format
    allData.questionSets.push({
      filename: file,
      domain: content.domain,
      task: content.task,
      question_count: content.question_count || content.questions.length,
      questions: content.questions
    });

    allData.metadata.totalQuestions += content.questions.length;
  } else {
    // Complex format with nested tasks
    // Find all keys that contain question arrays
    Object.keys(content).forEach(key => {
      if (typeof content[key] === 'object' && content[key].questions && Array.isArray(content[key].questions)) {
        allData.questionSets.push({
          filename: file,
          domain: content.domain,
          task: content.tasks || key,
          taskKey: key,
          question_count: content[key].question_count || content[key].questions.length,
          questions: content[key].questions
        });

        allData.metadata.totalQuestions += content[key].questions.length;
      }
    });
  }

  // Track unique domains
  const domainExists = allData.metadata.domains.some(d => d === content.domain);
  if (!domainExists) {
    allData.metadata.domains.push(content.domain);
  }
});

// Sort domains
allData.metadata.domains.sort();

fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
console.log('✓ Created all-questions.json');
console.log('  Total questions:', allData.metadata.totalQuestions);
console.log('  Total question sets:', allData.questionSets.length);
console.log('  Total files:', files.length);
console.log('  Domains:', allData.metadata.domains.join(', '));
