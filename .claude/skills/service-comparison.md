# service-comparison

Create detailed comparisons between similar AWS services to clarify when to use each option.

## Usage
Use this skill when you need to understand the differences between similar AWS services, such as:
- Storage options (EFS vs FSx vs S3)
- Load balancers (ALB vs NLB vs GLB vs CLB)
- Databases (RDS vs Aurora vs DynamoDB vs DocumentDB)
- Messaging (SQS vs SNS vs EventBridge vs Kinesis)
- Compute (EC2 vs ECS vs EKS vs Lambda vs Fargate)
- DNS/CDN (Route 53 policies, CloudFront vs Global Accelerator)

## Instructions

When this skill is invoked:

1. **Ask the user** which services or category they want to compare
2. **Use AWS MCP tools** to get current information about each service
3. **Create a comprehensive comparison** following this structure:

### Comparison Structure:
```markdown
# Service Comparison: [Service Category]

## Services Covered
- [Service 1]: [One-line description]
- [Service 2]: [One-line description]
- [Service 3]: [One-line description]

---

## High-Level Overview

### [Service 1]
**Primary Use Case:** [Main purpose]
**Key Strength:** [What it's best at]
**Typical Scenario:** [When you'd choose this]

### [Service 2]
**Primary Use Case:** [Main purpose]
**Key Strength:** [What it's best at]
**Typical Scenario:** [When you'd choose this]

[Repeat for each service...]

---

## Detailed Comparison Table

| Feature/Aspect | [Service 1] | [Service 2] | [Service 3] |
|----------------|-------------|-------------|-------------|
| **Primary Use Case** | ... | ... | ... |
| **Performance** | ... | ... | ... |
| **Scalability** | ... | ... | ... |
| **Availability** | ... | ... | ... |
| **Pricing Model** | ... | ... | ... |
| **Integration** | ... | ... | ... |
| **Complexity** | ... | ... | ... |
| **Key Limits** | ... | ... | ... |

---

## Decision Tree

**Choose [Service 1] when:**
- [Requirement/scenario]
- [Requirement/scenario]
- [Requirement/scenario]

**Choose [Service 2] when:**
- [Requirement/scenario]
- [Requirement/scenario]
- [Requirement/scenario]

**Choose [Service 3] when:**
- [Requirement/scenario]
- [Requirement/scenario]
- [Requirement/scenario]

---

## Common Exam Scenarios

### Scenario 1: [Description]
**Requirements:** [List requirements]
**Best Choice:** [Service] because [reason]
⚠️ **EXAM TIP:** [Why distractors might seem appealing]

### Scenario 2: [Description]
**Requirements:** [List requirements]
**Best Choice:** [Service] because [reason]
⚠️ **EXAM TIP:** [Key differentiator to remember]

[Include 3-5 scenarios]

---

## Key Differences Summary

🔑 **Most Important Distinctions:**
1. [Critical difference to remember]
2. [Critical difference to remember]
3. [Critical difference to remember]

⚠️ **Common Misconceptions:**
- **Myth:** [Common wrong assumption]
  **Reality:** [Correct understanding]

- **Myth:** [Common wrong assumption]
  **Reality:** [Correct understanding]

---

## Exam Strategy

**Keywords to Watch For:**
- "[Keyword]" → Usually indicates [Service]
- "[Keyword]" → Usually indicates [Service]
- "[Keyword]" → Usually indicates [Service]

**Red Herrings:**
- Watch out for [common distractor pattern]
- Don't confuse [similar feature] between services

---

## Quick Reference Cheat Sheet

| Need | Choose |
|------|--------|
| [Specific requirement] | [Service] |
| [Specific requirement] | [Service] |
| [Specific requirement] | [Service] |
```

4. **Include real-world examples** showing configuration or architecture
5. **Highlight pricing differences** when significant
6. **Note regional availability** if it varies
7. **ALWAYS write the complete comparison** to `comparisons/` directory

## CRITICAL: Final Output Protocol

**Your LAST action must be:**
- Write ALL comparison content to the file (comparisons/[service-names]-comparison.md)
- Return ONLY: "Results written to: comparisons/[service-names]-comparison.md"
- Do NOT include the full content in your final response
- Keep your final message minimal - just the file path reference

## Important
- Always use AWS MCP tools to verify current capabilities
- Focus on practical decision-making criteria
- Include exam-realistic scenarios
- Explain WHY one service is better for specific requirements
- Note when services can be used together
- Highlight cost implications when relevant
