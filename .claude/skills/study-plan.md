# study-plan

Create a personalized study plan for the AWS Solutions Architect Professional exam.

## Usage
Use this skill when you want to:
- Create a structured study schedule
- Plan exam preparation based on available time
- Identify knowledge gaps and prioritize topics
- Track progress through exam domains

## Instructions

When this skill is invoked:

1. **Ask the user**:
   - How many weeks until their exam date (or if they're flexible)
   - Hours per week they can dedicate to study
   - Their current AWS experience level (associate-level, professional, no cert)
   - Any specific weak areas or topics to emphasize
   - Whether they have hands-on AWS experience

2. **Use AWS MCP tools** to verify current exam domains and weightings

3. **Create a comprehensive study plan** following this structure:

### Study Plan Structure:
```markdown
# AWS Solutions Architect Professional - Study Plan

## Your Profile
- **Target Exam Date:** [Date or "Flexible"]
- **Study Duration:** [X weeks]
- **Weekly Time Commitment:** [Y hours/week]
- **Current Level:** [Experience level]
- **Areas to Emphasize:** [Topics]
- **Total Study Hours:** [Calculated total]

---

## Exam Breakdown

The AWS Certified Solutions Architect - Professional exam consists of:
- **Duration:** 180 minutes (3 hours)
- **Questions:** 75 questions (scenario-based)
- **Passing Score:** ~750/1000 (approximately 70%)
- **Format:** Multiple choice, multiple response

### Exam Domains & Weighting:
1. Design for Organizational Complexity (26%)
2. Design for New Solutions (29%)
3. Continuous Improvement for Existing Solutions (25%)
4. Accelerate Workload Migration and Modernization (20%)

---

## Study Plan Overview

### Phase 1: Foundation (Weeks 1-[X])
**Goal:** Cover core services and concepts
**Time Allocation:** [Y] hours

### Phase 2: Deep Dive (Weeks [X]-[Y])
**Goal:** Master complex scenarios and integration patterns
**Time Allocation:** [Y] hours

### Phase 3: Practice & Review (Weeks [Y]-[Z])
**Goal:** Practice questions, identify gaps, review weak areas
**Time Allocation:** [Y] hours

### Phase 4: Final Prep (Final Week)
**Goal:** Final review, mental preparation
**Time Allocation:** [Y] hours

---

## Weekly Breakdown

### Week 1: [Focus Area]
**Exam Domain:** [Domain name] ([X]%)

**Topics to Cover:**
- [ ] [Topic 1]
  - Study materials: [suggestions]
  - Hands-on: [suggested labs]
- [ ] [Topic 2]
  - Study materials: [suggestions]
  - Hands-on: [suggested labs]

**Deliverables:**
- [ ] Complete study notes for [topics]
- [ ] Practice 10 questions on [topics]
- [ ] Hands-on lab: [specific exercise]

**Time Breakdown:**
- Reading/Videos: [X] hours
- Hands-on Practice: [Y] hours
- Practice Questions: [Z] hours

---

[Repeat for each week]

---

## Recommended Study Resources

### Official AWS Resources:
- [ ] AWS Well-Architected Framework
- [ ] AWS Whitepapers (focus on: [list key ones])
- [ ] AWS Documentation for key services
- [ ] AWS Architecture Center case studies

### Hands-On Practice:
- [ ] Set up free-tier AWS account
- [ ] Complete [specific labs/projects]
- [ ] Build sample architectures for each domain

### Practice Exams:
- [ ] Week [X]: First practice exam (baseline)
- [ ] Week [Y]: Second practice exam (midpoint check)
- [ ] Week [Z]: Final practice exam (readiness check)

---

## Service Coverage Checklist

### Compute:
- [ ] EC2 (placement groups, instance types, purchasing options)
- [ ] Auto Scaling (policies, lifecycle hooks)
- [ ] Lambda (limits, optimization, integration)
- [ ] ECS/EKS/Fargate (container orchestration patterns)
- [ ] Elastic Beanstalk (deployment strategies)

### Storage:
- [ ] S3 (storage classes, lifecycle, encryption, replication)
- [ ] EBS (volume types, snapshots, encryption)
- [ ] EFS (performance modes, throughput modes)
- [ ] FSx (Windows, Lustre, NetApp ONTAP, OpenZFS)
- [ ] Storage Gateway (modes and use cases)
- [ ] Snow Family (migration options)

### Database:
- [ ] RDS (Multi-AZ, read replicas, backups)
- [ ] Aurora (global database, serverless, cloning)
- [ ] DynamoDB (GSI, LSI, DAX, streams, global tables)
- [ ] ElastiCache (Redis vs Memcached)
- [ ] DocumentDB, Keyspaces, Neptune, QLDB, Timestream
- [ ] Database migration strategies

### Networking:
- [ ] VPC (advanced routing, endpoints, peering, Transit Gateway)
- [ ] Direct Connect (LAG, virtual interfaces, BGP)
- [ ] Route 53 (routing policies, health checks, DNSSEC)
- [ ] CloudFront (origins, behaviors, Lambda@Edge, CloudFront Functions)
- [ ] Global Accelerator
- [ ] VPN (Site-to-Site, Client VPN)
- [ ] PrivateLink

### Security & Identity:
- [ ] IAM (advanced policies, permission boundaries, SCPs)
- [ ] Organizations (OU structure, SCPs, multi-account strategies)
- [ ] Cognito (user pools, identity pools, federation)
- [ ] Secrets Manager, Systems Manager Parameter Store
- [ ] KMS (key policies, grants, multi-region keys)
- [ ] CloudHSM
- [ ] AWS SSO/IAM Identity Center
- [ ] Security Hub, GuardDuty, Detective, Macie

### Application Integration:
- [ ] SQS (standard vs FIFO, dead-letter queues)
- [ ] SNS (fan-out patterns, message filtering)
- [ ] EventBridge (rules, patterns, schema registry)
- [ ] Step Functions (state machines, error handling)
- [ ] AppSync (GraphQL for mobile/web)
- [ ] API Gateway (REST vs HTTP vs WebSocket)
- [ ] Kinesis (Streams, Firehose, Data Analytics)

### Management & Governance:
- [ ] CloudWatch (metrics, logs, insights, alarms)
- [ ] CloudTrail (organization trails, insights)
- [ ] Config (rules, conformance packs, aggregators)
- [ ] Systems Manager (Session Manager, Patch Manager, Automation)
- [ ] Control Tower (guardrails, Account Factory)
- [ ] Service Catalog
- [ ] AWS Backup
- [ ] Cost Explorer, Budgets, Cost Allocation Tags

### Migration & Transfer:
- [ ] Migration Hub
- [ ] Application Discovery Service
- [ ] Database Migration Service (DMS)
- [ ] Server Migration Service (SMS)
- [ ] DataSync, Transfer Family
- [ ] Migration strategies (6 R's)

### Analytics:
- [ ] Athena (query S3 data)
- [ ] EMR (big data processing)
- [ ] Redshift (data warehousing, Spectrum)
- [ ] QuickSight (BI dashboards)
- [ ] Glue (ETL, Data Catalog)
- [ ] Lake Formation

### Developer Tools:
- [ ] CodeCommit, CodeBuild, CodeDeploy, CodePipeline
- [ ] CloudFormation (advanced patterns, StackSets)
- [ ] CDK basics
- [ ] SAM for serverless

---

## Weekly Milestones & Check-ins

### Week [X] Goals:
- [ ] Completed [specific topics]
- [ ] Scored [target]% on practice questions
- [ ] Completed [hands-on labs]

**Self-Assessment Questions:**
- Can you explain when to use [service] vs [service]?
- Can you design a [specific architecture pattern]?
- What are the key limits for [critical services]?

[Repeat for each week]

---

## Study Tips & Strategies

### For Reading/Learning:
1. Use AWS MCP tools to verify current service information
2. Take detailed notes in your own words
3. Focus on "when to use" not just "what is"
4. Pay attention to service limits and constraints
5. Study comparison tables for similar services

### For Hands-On Practice:
1. Set up a sandbox AWS account (free tier when possible)
2. Build reference architectures for each domain
3. Practice with AWS CLI and CloudFormation
4. Experiment with service integrations
5. Document your architectures

### For Practice Questions:
1. Read the question twice before looking at options
2. Identify key requirements and constraints
3. Eliminate obviously wrong answers first
4. Choose the BEST answer, not just a working answer
5. Review explanations for both correct and incorrect answers

### Exam Day Strategy:
1. Skip hard questions and come back later
2. Watch for keywords that hint at specific services
3. Look for "cost-effective," "least operational overhead," "most secure"
4. Trust your first instinct if you're unsure
5. Manage your time: ~2.4 minutes per question

---

## Progress Tracking

Use this checklist to track your progress:

- [ ] Week 1 complete
- [ ] Week 2 complete
- [ ] Week 3 complete
[etc...]

- [ ] Practice Exam 1: [Score]
- [ ] Practice Exam 2: [Score]
- [ ] Practice Exam 3: [Score]

**Target:** Consistently scoring 80%+ on practice exams

---

## Adjust As Needed

This plan is a starting point. Adjust based on:
- Your progress and comprehension
- Practice exam results
- Identified weak areas
- Available time
- Hands-on experience level

**Remember:** Quality over quantity. Deep understanding beats memorization!

---

## Next Steps

1. Review this plan and adjust for your schedule
2. Set up your study environment
3. Create your AWS free-tier account
4. Start with Week 1 topics
5. Track your progress weekly

Good luck with your exam preparation! 🎯
```

4. **Save the study plan** to `study-plan.md` in the root directory
5. **Provide encouragement** and next steps

## Important
- Personalize the plan based on user's available time and experience
- Make the plan realistic and achievable
- Include specific, actionable tasks
- Balance theory, hands-on, and practice questions
- Adjust difficulty and pace based on experience level
- Focus on understanding over memorization
- Emphasize scenario-based learning
