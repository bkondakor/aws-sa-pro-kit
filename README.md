# AWS Solutions Architect Professional Exam Preparation Kit

A comprehensive, Obsidian-compatible study guide for the AWS Certified Solutions Architect - Professional exam (SAP-C02).

## 📚 Start Here

**[📖 INDEX.md](./INDEX.md)** - Your complete study guide with all materials organized by domain

**[🎯 Practice Exam](https://bkondakor.github.io/aws-sa-pro-kit/exam/)** - Interactive online practice exam (once deployed)

## Overview

This repository provides a complete exam preparation system with:

- **Interactive Practice Exam**: Modern web-based exam simulator with detailed explanations
- **Obsidian-Compatible Format**: YAML frontmatter, wiki-style links, and organized structure
- **40+ Study Documents**: 29,000+ lines of comprehensive study materials
- **4 Exam Domains**: Complete coverage of SAP-C02 blueprint
- **Practice Materials**: Scenarios, questions, and hands-on labs
- **AWS MCP Servers**: Direct access to AWS documentation and knowledge base
- **Claude Code Integration**: AI-powered study tools and custom commands
- **Slash Commands**: Quick access to study workflows

## 📖 Study Materials

All materials are now **Obsidian-compatible** with:
- ✅ YAML frontmatter with metadata
- ✅ Standardized folder structure
- ✅ Wiki-style internal links
- ✅ Cross-domain tags
- ✅ Consistent heading hierarchy
- ✅ Domain-based organization

See **[INDEX.md](./INDEX.md)** for complete navigation and study paths.

## Features

### 🔌 MCP Server Integration

Two AWS MCP servers are configured for up-to-date information:

- **aws-documentation**: Access official AWS documentation, API references, and guides
- **aws-knowledge**: Access AWS knowledge base for architectural patterns and best practices

### 🤖 AWS Expert Agent

An AI agent specialized in AWS SA Pro exam preparation that:
- Creates comprehensive study notes
- Generates realistic practice questions
- Explains complex architectural patterns
- Highlights exam-relevant information
- Provides up-to-date service comparisons

### ⚡ Claude Skills

Four specialized skills for exam preparation:

1. **study-notes**: Generate comprehensive study notes for any AWS service or concept
2. **practice-questions**: Create realistic, scenario-based practice questions
3. **service-comparison**: Compare similar AWS services to understand trade-offs
4. **study-plan**: Create a personalized study schedule based on your timeline

### 📝 Slash Commands

Quick commands for common tasks:

- `/learn` - Generate study notes for a service or concept
- `/quiz` - Create practice questions on a topic
- `/compare` - Compare similar AWS services
- `/lookup` - Quick lookup of service information
- `/plan` - Create a personalized study plan

### 🎯 Practice Exam Website

An interactive, modern web application for taking practice exams:

**Features:**
- Modern, responsive design that works on all devices
- Question randomization for each exam session
- Progress tracking and timer
- Flag questions for review
- Question palette for easy navigation
- Animated results screen with pass/fail status
- Detailed review mode with explanations
- Easily customizable question pool via JSON

**Access Options:**
1. **Online**: Visit [https://bkondakor.github.io/aws-sa-pro-kit/exam/](https://bkondakor.github.io/aws-sa-pro-kit/exam/) (once deployed)
2. **Local**: Run from the `exam/` directory using a local web server:
   ```bash
   cd exam
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

**Adding Questions**: Simply edit `exam/questions.json` to add your own practice questions with explanations.

See [exam/README.md](./exam/README.md) for detailed documentation.

## Getting Started

### Prerequisites

1. **Claude Code**: Install Claude Code CLI or use Claude Code in your IDE
2. **Node.js**: Required for AWS MCP servers (npx)
3. **AWS Account** (optional but recommended): For hands-on practice

### Setup

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd aws-sa-pro-kit
   ```

2. The `.claude` configuration is already set up. When you start Claude Code in this directory, it will automatically:
   - Load the AWS MCP servers
   - Make the AWS expert agent available
   - Enable all skills and commands

3. Start using the tools:
   ```bash
   # Generate study notes
   /learn

   # Create practice questions
   /quiz

   # Compare services
   /compare

   # Create a study plan
   /plan
   ```

## Usage Examples

### Creating Study Notes

```
/learn
```

Then specify the service (e.g., "VPC", "S3", "Lambda") and detailed study notes will be generated and saved to `notes/`.

### Generating Practice Questions

```
/quiz
```

Specify the topic and number of questions. Realistic, scenario-based questions will be created and saved to `questions/`.

### Comparing Services

```
/compare
```

Specify which services to compare (e.g., "EFS vs FSx", "ALB vs NLB") and a detailed comparison will be generated and saved to `comparisons/`.

### Quick Lookup

```
/lookup
```

Get quick information about any AWS service without creating full study notes.

### Creating a Study Plan

```
/plan
```

Answer a few questions about your timeline and experience level, and a personalized study plan will be created.

## Repository Structure

```
aws-sa-pro-kit/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml        # GitHub Pages deployment pipeline
├── .claude/
│   ├── mcp.json                    # MCP server configuration
│   ├── agents/
│   │   └── aws-expert.md           # AWS expert agent configuration
│   ├── skills/
│   │   ├── study-notes.md          # Study notes generation skill
│   │   ├── practice-questions.md   # Practice questions skill
│   │   ├── service-comparison.md   # Service comparison skill
│   │   └── study-plan.md           # Study plan creation skill
│   └── commands/
│       ├── learn.md                # /learn command
│       ├── quiz.md                 # /quiz command
│       ├── compare.md              # /compare command
│       ├── lookup.md               # /lookup command
│       └── plan.md                 # /plan command
├── exam/                           # Practice exam web application
│   ├── index.html                  # Exam application
│   ├── styles.css                  # Modern styling
│   ├── app.js                      # Exam functionality
│   ├── questions.json              # Question pool (customizable)
│   └── README.md                   # Exam documentation
├── domain-1-organizational-complexity/  # Domain 1 study materials
├── domain-2-new-solutions/             # Domain 2 study materials
├── domain-3-continuous-improvement/    # Domain 3 study materials
├── domain-4-migration-modernization/   # Domain 4 study materials
├── notes/                          # Generated study notes (created on use)
├── questions/                      # Generated practice questions (created on use)
├── comparisons/                    # Service comparisons (created on use)
├── index.html                      # Landing page (redirects to exam)
├── INDEX.md                        # Complete study guide index
├── MASTER_STUDY_PLAN.md           # Comprehensive study plan
└── README.md                       # This file
```

## Exam Information

### AWS Certified Solutions Architect - Professional

- **Duration**: 180 minutes (3 hours)
- **Questions**: 75 questions
- **Format**: Multiple choice and multiple response
- **Passing Score**: ~750/1000 (approximately 70%)

### Exam Domains

1. **Design for Organizational Complexity** (26%)
   - Multi-account strategies, cross-account access, federation, cost allocation

2. **Design for New Solutions** (29%)
   - Designing reliable, secure, high-performing, cost-optimized architectures

3. **Continuous Improvement for Existing Solutions** (25%)
   - Operational excellence, performance optimization, security improvements

4. **Accelerate Workload Migration and Modernization** (20%)
   - Migration strategies, application modernization, data migration

## Study Tips

1. **Use the MCP Tools**: Always verify information is current using `/lookup`
2. **Focus on Scenarios**: The exam is scenario-based, not just definitions
3. **Hands-On Practice**: Set up a free-tier AWS account and practice
4. **Compare Services**: Understand when to use service A vs service B
5. **Know the Trade-offs**: Cost, performance, complexity, operational overhead
6. **Study Service Limits**: Important quotas often appear in exam scenarios
7. **Review Regularly**: Use `/quiz` to test your knowledge frequently

## Resources

### Official AWS Resources
- [AWS Certified Solutions Architect - Professional](https://aws.amazon.com/certification/certified-solutions-architect-professional/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)
- [AWS Whitepapers](https://aws.amazon.com/whitepapers/)

### Using This Kit
- Use `/plan` to create your personalized study schedule
- Use `/learn` for any topic you need to study
- Use `/quiz` regularly to test your knowledge
- Use `/compare` when confused about similar services
- Track your progress and adjust your study plan as needed

## Contributing

Feel free to customize the agent, skills, and commands to match your learning style:
- Edit `.claude/agents/aws-expert.md` to adjust the agent's behavior
- Modify skills in `.claude/skills/` to change how content is generated
- Update commands in `.claude/commands/` to customize workflows

## License

This is a personal study repository. AWS and related marks are trademarks of Amazon.com, Inc. or its affiliates.

## Feedback

If you find issues with the configuration or have suggestions for improvement, please open an issue or submit a pull request.

---

**Good luck with your exam preparation!** 🎯

Remember: Understanding beats memorization. Focus on the "why" and "when", not just the "what".