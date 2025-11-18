# AWS Solutions Architect Professional - Practice Exam

A modern, interactive web application for practicing AWS Solutions Architect Professional exam questions.

## Features

- **Modern UI**: Clean, responsive design that works on desktop and mobile devices
- **Multiple Question Types**: Supports both single-choice and multiple-choice questions
- **Question Pool**: Questions are randomly shuffled for each exam session
- **Progress Tracking**: Visual progress bar and question palette
- **Flag System**: Mark questions for review during the exam
- **Timer**: Track how long you spend on the exam
- **Instant Results**: See your score with a visual breakdown
- **Detailed Review**: Review all answers with explanations after completing the exam
- **Question Navigation**: Jump to any question using the question palette
- **Responsive Design**: Works seamlessly on all screen sizes

## How to Use

### Local Development

1. Open the `exam` directory in your file system
2. Open `index.html` in a modern web browser
3. Click "Start Exam" to begin

**Note**: Due to browser security restrictions with loading JSON files locally, you may need to run a local web server:

```bash
# Using Python 3
cd exam
python3 -m http.server 8000

# Using Python 2
cd exam
python -m SimpleHTTPServer 8000

# Using Node.js (if you have npx installed)
cd exam
npx http-server
```

Then visit `http://localhost:8000` in your browser.

### Taking the Exam

1. **Start**: Click the "Start Exam" button on the welcome screen
2. **Answer Questions**:
   - **Single-choice**: Click to select one answer (radio button)
   - **Multiple-choice**: Check all that apply (checkbox - look for "Select ALL that apply" badge)
3. **Navigate**: Use "Next" and "Previous" buttons or click questions in the palette
4. **Flag Questions**: Click "Flag for Review" to mark questions you want to revisit
5. **Submit**: Click "Submit Exam" when you're ready (you'll be warned about unanswered questions)
6. **Review**: After submission, review your answers with detailed explanations

### Question Palette

The question palette shows the status of all questions:
- **White**: Unanswered
- **Orange**: Answered
- **Orange with flag**: Flagged for review
- **Blue border**: Current question

## Customizing Questions

### Question Format

Edit `questions.json` to add or modify questions. The exam supports two question types:

#### Single-Choice Questions (Select One Answer)

```json
{
  "question": "Your question text here?",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctAnswer": 0,
  "explanation": "Detailed explanation of the correct answer and why other options are incorrect."
}
```

#### Multiple-Choice Questions (Select Multiple Answers)

```json
{
  "type": "multiple",
  "question": "Which of the following are AWS storage services? (Select ALL that apply)",
  "options": [
    "Amazon S3",
    "Amazon EC2",
    "Amazon EFS",
    "Amazon CloudFront",
    "Amazon EBS"
  ],
  "correctAnswer": [0, 2, 4],
  "explanation": "Amazon S3, EFS, and EBS are storage services. EC2 is a compute service and CloudFront is a CDN."
}
```

**Field Definitions:**
- `type`: (Optional) Set to `"multiple"` for multiple-choice questions. Omit for single-choice (default)
- `question`: The question text
- `options`: Array of answer choices
- `correctAnswer`:
  - For single-choice: Zero-based index of the correct option (e.g., `0` = first option)
  - For multiple-choice: Array of zero-based indices (e.g., `[0, 2, 4]`)
- `explanation`: Detailed explanation shown during review

### Adding Questions

Simply add more question objects to the `questions` array in `questions.json`:

```json
{
  "questions": [
    {
      "question": "First question...",
      ...
    },
    {
      "question": "Second question...",
      ...
    }
  ]
}
```

## Exam Mechanics

- **Passing Score**: 70% (configurable in the code)
- **Time Limit**: None (but time is tracked)
- **Question Order**: Randomized for each exam session
- **Retake**: Questions are reshuffled when retaking the exam

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `app.js` - Exam logic and functionality
- `questions.json` - Question pool (easily customizable)
- `README.md` - This file

## Browser Compatibility

Works with modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Tips for Studying

1. Take the exam multiple times - questions are randomized
2. Review the explanations carefully, even for questions you got right
3. Flag questions you're unsure about and review them at the end
4. Time yourself to simulate real exam conditions
5. Add your own questions to the JSON file based on your study materials

## Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #FF9900;
    --secondary-color: #232F3E;
    --accent-color: #146EB4;
    /* ... other colors */
}
```

### Changing Passing Score

Edit line in `app.js`:

```javascript
passed: (correct / this.questions.length) >= 0.7, // 0.7 = 70%
```

## License

This is a study tool for AWS Solutions Architect Professional exam preparation.
