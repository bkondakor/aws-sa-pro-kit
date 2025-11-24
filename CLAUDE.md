# Using Claude Code with AWS SA Pro Kit

This guide explains how to use Claude Code with the AWS Solutions Architect Professional Exam Preparation Kit.

## Overview

This repository is fully configured for Claude Code with AI-powered study tools, AWS documentation access, and automated workflows. Claude Code enhances your exam preparation with intelligent assistance, up-to-date AWS information, and customizable study commands.

## Quick Start

1. Open this repository in Claude Code:
   ```bash
   cd aws-sa-pro-kit
   claude
   ```

2. Claude Code will automatically load:
   - AWS MCP servers for documentation access
   - Specialized study commands
   - AI-powered skills for generating study materials

3. Start using slash commands:
   ```
   /learn       # Generate study notes for any AWS service
   /quiz        # Create practice questions on a topic
   /compare     # Compare similar AWS services
   /lookup      # Quick AWS service information lookup
   /plan        # Create a personalized study plan
   ```

## Available Tools

### Slash Commands

The kit includes 5 custom slash commands for efficient studying:

#### `/learn` - Generate Study Notes
Creates comprehensive study notes for any AWS service or concept.

**Example:**
```
/learn
```
You'll be prompted for the service name (e.g., "VPC", "DynamoDB", "Step Functions").

Output: Detailed study notes saved to `notes/` directory with:
- Service overview and key features
- Use cases and scenarios
- Important configurations
- Exam-relevant details
- Best practices

#### `/quiz` - Practice Questions
Generates realistic, scenario-based practice questions.

**Example:**
```
/quiz
```
Specify the topic and number of questions.

Output: Practice questions saved to `questions/` directory with:
- Scenario-based questions
- Multiple choice answers
- Detailed explanations
- References to study materials

#### `/compare` - Service Comparison
Creates detailed comparisons between similar AWS services.

**Example:**
```
/compare
```
Specify services to compare (e.g., "EFS vs FSx", "ALB vs NLB", "SNS vs SQS").

Output: Comparison document saved to `comparisons/` directory with:
- Feature comparison table
- Use case recommendations
- Cost considerations
- Performance characteristics
- When to use each service

#### `/lookup` - Quick Information
Fast lookup of AWS service information without creating full study notes.

**Example:**
```
/lookup
```
Get instant answers from AWS documentation and knowledge base.

#### `/plan` - Study Plan
Creates a personalized study schedule based on your timeline and experience.

**Example:**
```
/plan
```
Answer questions about:
- Target exam date
- Current AWS experience level
- Available study time per week
- Specific weak areas

Output: Customized study plan with weekly goals and milestones.

### MCP Servers

Two AWS MCP servers provide real-time access to official AWS resources:

#### 1. aws-documentation
Access to official AWS documentation, API references, and service guides.

**What it provides:**
- Current service features and capabilities
- API reference information
- Service limits and quotas
- Regional availability
- Pricing information

**Usage:** Automatically used by `/lookup` and other commands to ensure information is current.

#### 2. aws-knowledge
Access to AWS knowledge base with architectural patterns and best practices.

**What it provides:**
- Well-Architected Framework principles
- Reference architectures
- Best practices and patterns
- Troubleshooting guides
- Migration strategies

**Usage:** Provides context for generating study materials and answering architecture questions.

## Project Structure

```
aws-sa-pro-kit/
├── .claude/                        # Claude Code configuration
│   ├── mcp.json                   # MCP server configuration
│   ├── commands/                  # Slash command definitions
│   │   ├── learn.md              # /learn command
│   │   ├── quiz.md               # /quiz command
│   │   ├── compare.md            # /compare command
│   │   ├── lookup.md             # /lookup command
│   │   └── plan.md               # /plan command
│   ├── skills/                    # AI skills
│   │   ├── study-notes.md        # Study notes generation
│   │   ├── practice-questions.md # Question generation
│   │   ├── service-comparison.md # Service comparison
│   │   └── study-plan.md         # Study planning
│   └── agents/                    # AI agents
│       └── aws-expert.md         # AWS expert agent
├── domain-1-organizational-complexity/  # Study materials
├── domain-2-new-solutions/
├── domain-3-continuous-improvement/
├── domain-4-migration-modernization/
├── exam/                          # Practice exam web app
├── notes/                         # Generated study notes
├── questions/                     # Generated practice questions
├── comparisons/                   # Service comparisons
└── INDEX.md                       # Complete study guide
```

## Common Workflows

### Daily Study Session

1. **Review a service:**
   ```
   /learn
   # Enter: "Lambda"
   ```

2. **Test your knowledge:**
   ```
   /quiz
   # Enter: "Lambda" and "5 questions"
   ```

3. **Compare with similar services:**
   ```
   /compare
   # Enter: "Lambda vs Fargate"
   ```

### Clarifying Confusing Topics

When you encounter a confusing concept:

1. **Quick lookup:**
   ```
   /lookup
   # Ask: "What's the difference between AWS Backup and EBS snapshots?"
   ```

2. **Generate detailed comparison:**
   ```
   /compare
   # Enter: "AWS Backup vs EBS Snapshots vs AMIs"
   ```

### Creating a Study Plan

At the start of your preparation:

1. **Generate personalized plan:**
   ```
   /plan
   ```

2. **Follow the generated plan** and use `/learn` and `/quiz` for each topic

3. **Track progress** by reviewing generated materials in respective directories

### Pre-Exam Review

One week before the exam:

1. **Review all generated materials:**
   - Check `notes/` directory
   - Review `comparisons/` directory
   - Practice with questions in `questions/`

2. **Take practice exam:**
   - Open `exam/index.html` in browser
   - Complete full 75-question simulation

3. **Fill knowledge gaps:**
   ```
   /learn
   # Focus on weak areas identified in practice exam
   ```

## AI Assistance Best Practices

### Ask Specific Questions

Good:
- "Explain the difference between VPC endpoints and VPC peering for accessing S3"
- "When should I use Aurora Global Database vs DynamoDB Global Tables?"
- "What are the trade-offs between AWS DataSync and AWS Transfer Family?"

Avoid:
- "Tell me about AWS"
- "Explain networking"

### Request Exam-Focused Content

Use phrases that help Claude Code generate exam-relevant content:

- "Generate exam-level questions about..."
- "What are the key differences for the SAP-C02 exam between..."
- "Create a study guide focusing on exam scenarios for..."

### Verify Current Information

AWS services update frequently. Always use `/lookup` to verify critical information:

```
/lookup
# Ask: "What are the current Lambda timeout limits?"
```

### Build Progressive Knowledge

Start broad, then go deep:

1. First: `/learn` (overview)
2. Then: `/compare` (understand alternatives)
3. Finally: `/quiz` (test knowledge)

## Customization

### Modifying Commands

Edit files in `.claude/commands/` to customize slash command behavior:

```bash
# Edit the /learn command
nano .claude/commands/learn.md
```

### Adjusting AI Skills

Edit files in `.claude/skills/` to change how content is generated:

```bash
# Modify study notes format
nano .claude/skills/study-notes.md
```

### Configuring MCP Servers

Edit `.claude/mcp.json` to add or modify MCP servers:

```json
{
  "mcpServers": {
    "aws-documentation": {
      "command": "npx",
      "args": ["-y", "@anthropic/aws-documentation-mcp"]
    },
    "aws-knowledge": {
      "command": "npx",
      "args": ["-y", "@anthropic/aws-knowledge-mcp"]
    }
  }
}
```

## Troubleshooting

### Commands Not Working

If slash commands don't work:

1. Ensure you're in the repository root directory
2. Check that `.claude/` directory exists
3. Verify command files exist in `.claude/commands/`

### MCP Servers Not Loading

If AWS lookups fail:

1. Ensure Node.js is installed: `node --version`
2. Check internet connectivity
3. Verify `.claude/mcp.json` is properly formatted
4. Try restarting Claude Code

### Generated Content Issues

If generated study materials are not helpful:

1. Be more specific in your prompts
2. Edit the skill files in `.claude/skills/` to adjust output format
3. Use `/lookup` to verify information
4. Provide feedback and regenerate

## Integration with Study Materials

### Obsidian Compatibility

All generated content is Obsidian-compatible with:

- YAML frontmatter
- Wiki-style links
- Standardized structure
- Cross-domain tags

Open the repository in Obsidian for enhanced note-taking and linking.

### Practice Exam Integration

Questions generated with `/quiz` can be added to the practice exam:

1. Generate questions: `/quiz`
2. Review output in `questions/` directory
3. Add to `exam/questions.json` for web-based practice
4. Test in browser at `exam/index.html`

## Tips for Effective Use

### 1. Use Commands Daily

Make it a habit to use at least one slash command per study session. This keeps you engaged and builds a comprehensive personal study library.

### 2. Compare Everything

The exam tests your ability to choose the right service. Use `/compare` extensively:
- Storage options
- Database options
- Networking solutions
- Migration strategies

### 3. Generate Scenarios

When using `/quiz`, focus on scenario-based questions that mirror the actual exam format.

### 4. Verify with Official Docs

Always use `/lookup` to verify critical information, especially:
- Service limits
- Regional availability
- New features
- Pricing models

### 5. Build Your Knowledge Base

Save all generated content. Over time, you'll build a comprehensive, personalized study guide.

### 6. Track Your Progress

- Review the `notes/` directory weekly
- Redo questions from `questions/` directory
- Update your study plan as needed

## Advanced Usage

### Chaining Commands

You can use multiple commands in sequence for comprehensive coverage:

```
/learn
# Enter: "AWS Transit Gateway"

/quiz
# Enter: "Transit Gateway" and "10 questions"

/compare
# Enter: "Transit Gateway vs VPC Peering vs VPN"
```

### Custom Prompts

You can ask Claude Code to perform custom tasks:

```
Generate a comparison table of all AWS compute services showing:
- Use cases
- Pricing model
- Scaling capabilities
- Availability guarantees
```

### Batch Operations

Request multiple related items at once:

```
Generate study notes for all AWS database services
```

## Resources

### Official Documentation
- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [AWS Certification](https://aws.amazon.com/certification/)
- [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)

### This Repository
- [INDEX.md](./INDEX.md) - Complete study guide
- [README.md](./README.md) - Repository overview
- [MASTER_STUDY_PLAN.md](./MASTER_STUDY_PLAN.md) - Comprehensive study plan

## Getting Help

### Claude Code Issues
- Type `/help` in Claude Code
- Visit [Claude Code GitHub](https://github.com/anthropics/claude-code/issues)

### AWS SA Pro Kit Issues
- Check existing documentation in this repository
- Review generated content in respective directories
- Use `/lookup` for AWS-specific questions

## Best Practices Summary

1. **Start each session with a command** - Use `/learn`, `/quiz`, or `/lookup`
2. **Verify information** - Use MCP servers via `/lookup` for current data
3. **Compare services** - Use `/compare` for similar services
4. **Practice regularly** - Use `/quiz` to generate questions
5. **Build progressively** - Start broad, go deep
6. **Track progress** - Review generated materials weekly
7. **Customize as needed** - Edit commands and skills to match your learning style
8. **Use the practice exam** - Test yourself with the web application
9. **Stay current** - Leverage MCP servers for latest AWS updates
10. **Be specific** - Detailed prompts yield better results

---

**Happy studying!** Claude Code is here to make your AWS SA Pro exam preparation more efficient and effective.

Remember: The exam tests your ability to design solutions, not just memorize facts. Use these tools to understand the "why" and "when", not just the "what".
