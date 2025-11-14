# practice-questions

Generate practice questions for AWS Solutions Architect Professional exam preparation.

## Usage
Use this skill to create scenario-based practice questions on:
- Specific AWS services
- Exam domains (design, migration, optimization, etc.)
- Architectural patterns
- Multi-service integration scenarios

## Instructions

When this skill is invoked:

1. **Ask the user** what topic or service they want to practice
2. **Ask how many questions** they want (default: 5)
3. **Optionally ask difficulty level**: medium or hard (SA Pro level)
4. **Use AWS MCP tools** to verify current service capabilities
5. **Generate practice questions** following the format below:

### Question Format:
```markdown
# Practice Questions: [Topic]

## Question 1

**Scenario:**
[2-4 sentences describing a realistic business requirement or challenge]

**Question:**
[Clear question asking for the best solution]

**Options:**
A) [First option - plausible but incorrect]
B) [Second option - could work but not optimal]
C) [Third option - CORRECT ANSWER]
D) [Fourth option - wrong but might seem right]

**Correct Answer: [Letter]**

**Detailed Explanation:**
- **Why [Correct Letter] is correct:**
  [Explanation of why this is the best answer]
  [What makes this the optimal solution]

- **Why other options are incorrect:**
  - **[Letter]**: [Reason why this doesn't work or isn't optimal]
  - **[Letter]**: [Reason why this doesn't work or isn't optimal]
  - **[Letter]**: [Reason why this doesn't work or isn't optimal]

⚠️ **EXAM TIP:** [Key learning point or common misconception]

**Concept Tested:** [What exam concept/skill this question assesses]

---
```

6. **Create questions that**:
   - Are scenario-based (not just definitions)
   - Test practical knowledge and decision-making
   - Include plausible distractors
   - Cover different aspects of the topic
   - Reflect actual exam difficulty
   - Include multi-service integration when relevant

7. **ALWAYS write all questions to a file** in `questions/` directory with descriptive filename

## CRITICAL: Final Output Protocol

**Your LAST action must be:**
- Write ALL practice questions and explanations to the file (questions/[topic]-questions.md)
- Return ONLY: "Results written to: questions/[topic]-questions.md"
- Do NOT include the full content in your final response
- Keep your final message minimal - just the file path reference

## Question Guidelines

### Good Questions Test:
- When to use service A vs service B
- How to meet multiple requirements simultaneously
- Cost optimization decisions
- High availability and disaster recovery
- Security best practices
- Performance optimization
- Multi-account and organizational complexity
- Migration strategies

### Avoid:
- Simple definition questions
- Questions with obvious answers
- Outdated service information
- Unrealistic scenarios
- Questions with multiple correct answers (unless specified as multi-select)

## Important
- Always verify service capabilities with AWS MCP tools
- Explain why ALL options are right or wrong
- Include exam tips highlighting the key learning point
- Make distractors believable but clearly suboptimal when analyzed
- Focus on professional-level complexity (multi-service, trade-offs, constraints)
