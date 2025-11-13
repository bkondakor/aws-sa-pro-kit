# study-notes

Generate comprehensive study notes for AWS services or topics for the Solutions Architect Professional exam.

## Usage
Use this skill when you need to create detailed study notes on:
- Specific AWS services (e.g., VPC, Route 53, CloudFront)
- AWS concepts (e.g., disaster recovery, cost optimization)
- Architectural patterns (e.g., microservices, event-driven)

## Instructions

When this skill is invoked:

1. **Ask the user** what service or topic they want to study
2. **Use AWS MCP tools** to get the latest information about the service/topic
3. **Create comprehensive study notes** following this structure:

### Note Structure:
```markdown
# [Service/Topic Name]

## Overview
- What is it?
- Primary use cases
- Key value proposition

## Core Concepts
- Important terminology
- How it works
- Architecture components

## Key Features
- Most important capabilities
- Configuration options
- Integration points

## Exam-Focused Points
⚠️ EXAM TIP: [Critical exam information]
⚠️ EXAM TIP: [Common gotchas]
⚠️ EXAM TIP: [When to use vs alternatives]

## Service Limits & Constraints
- Important quotas
- Performance characteristics
- Regional availability considerations

## Use Cases & Examples
- Real-world scenarios
- Configuration examples
- Best practices

## Comparison with Similar Services
| Feature | This Service | Alternative 1 | Alternative 2 |
|---------|-------------|---------------|---------------|
| ... | ... | ... | ... |

## Common Exam Scenarios
1. Scenario description → Correct approach
2. Scenario description → Correct approach

## Key Takeaways
- Top 3-5 points to remember for the exam
```

4. **Save the notes** to a file in the `notes/` directory with a descriptive name
5. **Inform the user** where the notes were saved

## Important
- Always verify information using AWS MCP tools
- Focus on exam-relevant aspects
- Include practical examples
- Highlight common misconceptions
- Compare with similar services when applicable
