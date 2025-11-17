# Domain 1: Design Solutions for Organizational Complexity

## Study Guide Overview

**Domain Weight:** 26% of exam
**Exam Questions:** Approximately 20 out of 75 questions

This comprehensive study guide covers all aspects of Domain 1 for the AWS Solutions Architect Professional (SAP-C02) exam. All materials use up-to-date AWS information as of 2025 and include real-world scenarios and tricky exam situations.

---

## Table of Contents

1. [Domain Overview](#domain-overview)
2. [Study Materials](#study-materials)
3. [Study Plan](#study-plan)
4. [Quick Reference](#quick-reference)
5. [Exam Tips](#exam-tips)

---

## Domain Overview

### What This Domain Covers

Domain 1 focuses on designing architectures for complex organizational structures, including:
- Multi-account environments and governance
- Hybrid and multi-region networking
- Enterprise security controls
- Disaster recovery and resilience
- Cost optimization at scale

### Task Statements

**Task 1.1: Architect network connectivity strategies**
- Hybrid connectivity (Direct Connect, VPN, Transit Gateway)
- Multi-VPC architectures and connectivity patterns
- Private connectivity options (PrivateLink, VPC endpoints)
- Global network design

**Task 1.2: Prescribe security controls**
- Multi-account security with AWS Organizations and SCPs
- Identity federation and cross-account access
- Encryption strategies (KMS, CloudHSM)
- Detective controls (GuardDuty, Security Hub, Config, Macie)

**Task 1.3: Design reliable and resilient architectures**
- Multi-region architectures and failover strategies
- Disaster recovery patterns (Backup/Restore, Pilot Light, Warm Standby, Active-Active)
- Service quotas and limits management
- Graceful degradation and circuit breaker patterns

**Task 1.4: Design a multi-account AWS environment**
- AWS Organizations structure and management
- AWS Control Tower and Landing Zones
- Resource sharing (AWS RAM)
- Centralized logging and monitoring

**Task 1.5: Determine cost optimization and visibility strategies**
- Cost allocation tags and Cost Categories
- AWS Cost Explorer and Cost and Usage Reports
- AWS Budgets and Cost Anomaly Detection
- Reserved Instances and Savings Plans strategies

---

## Study Materials

### Core Task Statements

| Document | Topics Covered | Estimated Study Time |
|----------|---------------|---------------------|
| [Task 1.1: Network Connectivity](./domain1-task1.1-network-connectivity.md) | Transit Gateway, Direct Connect, VPN, PrivateLink, Multi-VPC patterns, Global networking | 3-4 hours |
| [Task 1.2: Security Controls](./domain1-task1.2-security-controls.md) | Organizations, SCPs, IAM Identity Center, KMS, CloudHSM, GuardDuty, Security Hub | 4-5 hours |
| [Task 1.3: Reliable Architectures](./domain1-task1.3-reliable-resilient-architectures.md) | DR patterns, Multi-region, Service quotas, Circuit breakers, AWS Backup | 3-4 hours |
| [Task 1.4: Multi-Account Environment](./domain1-task1.4-multi-account-environment.md) | Control Tower, Account Factory, RAM, Shared VPC, Centralized logging | 3-4 hours |
| [Task 1.5: Cost Optimization](./domain1-task1.5-cost-optimization.md) | Cost Explorer, Budgets, Savings Plans, Cost allocation, Right-sizing | 3-4 hours |

### Supplementary Materials

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [Tricky Scenarios](./domain1-tricky-scenarios.md) | Complex multi-service scenarios | After completing all task statements |
| [Practice Questions](./domain1-practice-questions.md) | Exam-style questions with explanations | Final preparation, self-assessment |

**Total Core Study Time:** 16-21 hours
**Total with Practice:** 20-25 hours

---

## Study Plan

### Week 1: Networking and Security (Tasks 1.1 and 1.2)

**Day 1-2: Network Connectivity**
- Study Transit Gateway architectures
- Understand Direct Connect + VPN redundancy
- Learn PrivateLink vs VPC Peering vs Transit Gateway decision criteria
- Hands-on: Create Transit Gateway with multiple VPC attachments

**Day 3-4: Security Controls**
- Deep dive into AWS Organizations and SCPs
- Study IAM Identity Center (AWS SSO)
- Learn KMS cross-account encryption patterns
- Hands-on: Implement SCPs and test enforcement

**Day 5: Integration**
- Review tricky scenarios combining networking and security
- Practice questions on Topics 1.1 and 1.2
- Identify weak areas for additional study

### Week 2: Resilience and Multi-Account (Tasks 1.3 and 1.4)

**Day 1-2: Reliable Architectures**
- Study all 4 DR patterns in detail
- Understand RTO/RPO requirements mapping
- Learn service quotas management
- Hands-on: Implement Route 53 failover with health checks

**Day 3-4: Multi-Account Environment**
- Deep dive into AWS Control Tower
- Study multi-account network patterns (Shared VPC, RAM)
- Learn centralized logging strategies
- Hands-on: Set up multi-account logging

**Day 5: Integration**
- Review tricky scenarios for resilience and multi-account
- Practice questions on Topics 1.3 and 1.4
- Create architecture diagrams for common patterns

### Week 3: Cost Optimization and Practice (Task 1.5 and Review)

**Day 1-2: Cost Optimization**
- Study cost allocation and tagging strategies
- Learn Savings Plans vs Reserved Instances
- Understand cost anomaly detection
- Hands-on: Configure Cost Explorer and Budgets

**Day 3: Tricky Scenarios**
- Work through all complex scenarios
- Focus on multi-service integration patterns
- Practice drawing complete architectures

**Day 4-5: Practice and Review**
- Complete all practice questions
- Review incorrect answers thoroughly
- Revisit weak topics
- Take timed practice test

---

## Quick Reference

### Decision Trees

**Network Connectivity:**
```
Need to connect VPCs?
├─ 2-5 VPCs → VPC Peering
├─ 5-50 VPCs → Transit Gateway
├─ Centralized networking → Shared VPC (RAM)
└─ Service-level access → PrivateLink

Hybrid connectivity?
├─ <1 Gbps → Site-to-Site VPN
├─ >1 Gbps consistent → Direct Connect
├─ High throughput + encryption → Direct Connect + VPN over public VIF
└─ Maximum resilience → Multiple Direct Connect locations + VPN backup
```

**Security:**
```
Multi-account controls?
├─ Preventive controls → SCPs
├─ Cross-account access → IAM roles with trust policies
├─ Centralized SSO → IAM Identity Center
├─ Threat detection → GuardDuty (delegated admin)
└─ Compliance monitoring → Config Aggregator

Encryption?
├─ AWS service integration → KMS
├─ FIPS 140-2 Level 3 → CloudHSM
├─ Credential rotation → Secrets Manager
└─ Configuration data → Parameter Store
```

**Disaster Recovery:**
```
RTO/RPO requirements?
├─ RTO >24hr, RPO >24hr → Backup/Restore
├─ RTO hours, RPO hours → Pilot Light
├─ RTO minutes, RPO minutes → Warm Standby
└─ RTO seconds, RPO seconds → Active-Active

Data replication?
├─ Database with <1s lag → Aurora Global Database
├─ NoSQL multi-region → DynamoDB Global Tables
├─ File storage → S3 Cross-Region Replication
└─ Block storage → EBS snapshots copied to DR region
```

**Cost Optimization:**
```
Commitment strategy?
├─ Predictable EC2, same instance family → EC2 Instance Savings Plans (72%)
├─ Variable compute (EC2/Fargate/Lambda) → Compute Savings Plans (66%)
├─ Specific instance type long-term → Standard RI (72%)
├─ May change instance type → Convertible RI (54%)
└─ Fault-tolerant workloads → Spot Instances (70-90%)

Storage optimization?
├─ Unknown access pattern → S3 Intelligent-Tiering
├─ Infrequent access → S3 Standard-IA
├─ Archive with instant retrieval → S3 Glacier Instant Retrieval
└─ Long-term archive → S3 Glacier Deep Archive
```

### Key Service Comparison

| Requirement | Solution A | Solution B | When to Use A | When to Use B |
|-------------|-----------|-----------|---------------|---------------|
| **VPC Connectivity** | VPC Peering | Transit Gateway | 2-5 VPCs, simple topology | 5+ VPCs, complex routing |
| **Hybrid Connectivity** | VPN | Direct Connect | <1 Gbps, cost-sensitive | >1 Gbps, consistent performance |
| **Service Access** | PrivateLink | VPC Peering | Service-level, overlapping IPs | Full network, no IP overlap |
| **Cross-Account Access** | IAM Roles | Resource Policies | General cross-account | Specific resources (S3, Lambda) |
| **Secrets** | Secrets Manager | Parameter Store | Need rotation | No rotation, cost-sensitive |
| **DR Strategy** | Warm Standby | Active-Active | RTO minutes, cost-aware | RTO seconds, high availability |
| **Cost Commitment** | Savings Plans | Reserved Instances | Flexibility needed | Specific instance type |
| **Threat Detection** | GuardDuty | Security Hub | ML-based threat detection | Centralized security findings |

### Critical Service Limits to Remember

| Service | Default Limit | Impact |
|---------|---------------|--------|
| VPCs per region | 5 | Network architecture |
| VPC Peering per VPC | 125 | Connectivity scale |
| Transit Gateway attachments | 5,000 | Multi-VPC scale |
| Direct Connect Gateway VPC attachments | 10 | Hybrid connectivity |
| Lambda concurrent executions | 1,000 | Serverless capacity |
| VPN connections per VGW | 10 | Hybrid redundancy |
| S3 requests (PUT/GET) | 3,500/5,500 per prefix/sec | Performance |

---

## Exam Tips

### Common Question Patterns

**Pattern 1: Service Selection**
- Read all requirements carefully (cost, performance, scale, security)
- Eliminate services that don't meet explicit requirements
- Choose AWS-managed services when "least operational overhead"
- Choose serverless/Spot when "most cost-effective"

**Pattern 2: Multi-Requirement Scenarios**
- Create a checklist of requirements
- Score each answer against ALL requirements
- Eliminate answers that fail any single requirement
- Choose answer that best meets all requirements

**Pattern 3: Troubleshooting**
- Identify what's wrong (usually missing permission or configuration)
- Understand the evaluation flow (SCP → IAM → Resource Policy)
- Remember cross-account requirements (both sides need permissions)
- Check for common misconfigurations (wrong region, wrong scope)

### Keywords to Watch

| Phrase | Usually Means |
|--------|---------------|
| "LEAST operational overhead" | Managed services, automation, SCPs |
| "MOST cost-effective" | Serverless, Spot, Savings Plans, managed services |
| "MOST secure" | Preventive controls, encryption, MFA, least privilege |
| "cannot be disabled by member accounts" | Organization Trail, SCPs |
| "automatically apply to new accounts" | Organization-level controls, Control Tower |
| "centralized" | Delegated administrator, organization aggregator |
| "overlapping IP addresses" | PrivateLink (only solution) |
| "sub-second RPO" | DynamoDB Global Tables, Aurora Global Database |
| "99.99% availability" | Multi-AZ minimum, likely multi-region |

### Common Traps to Avoid

1. **Over-engineering:** Active-Active when Warm Standby meets requirements
2. **Under-engineering:** Backup/Restore when RTO is minutes
3. **Wrong service use case:** PrivateLink for full network (use TGW)
4. **Forgetting cross-account requirements:** KMS key policy + IAM policy + resource policy
5. **Assuming services do what they don't:** VPC Peering with overlapping CIDRs
6. **Ignoring budget constraints:** Choose expensive solution when cost matters
7. **Confusing similar services:** Standard RI vs Convertible RI, SSM vs Secrets Manager

### Time Management

- **Read questions carefully:** 30 seconds
- **Eliminate wrong answers:** 30 seconds
- **Choose best answer:** 30 seconds
- **Review if time permits:** 30 seconds
- **Total per question:** ~2 minutes (leaving 30 min buffer for 75 questions)

**Strategy:**
1. First pass: Answer easy questions (1.5 min each)
2. Second pass: Flag and return to difficult questions
3. Final review: Check flagged questions with remaining time

---

## Hands-On Labs Checklist

### Network Connectivity
- [ ] Create Transit Gateway with multiple VPC attachments
- [ ] Configure Transit Gateway route tables for segmentation
- [ ] Set up VPC Endpoint for S3 (Gateway Endpoint)
- [ ] Create Interface Endpoint for AWS services
- [ ] Implement VPC Peering between 2 VPCs

### Security
- [ ] Create AWS Organization with multiple OUs
- [ ] Apply SCPs to OUs and test enforcement
- [ ] Set up cross-account IAM role assumption
- [ ] Configure KMS key for cross-account encryption
- [ ] Enable GuardDuty with delegated administrator

### Resilience
- [ ] Create Route 53 health checks and failover routing
- [ ] Set up Aurora read replica in different region
- [ ] Configure AWS Backup with cross-region copy
- [ ] Test RDS Multi-AZ failover
- [ ] Implement Auto Scaling with health checks

### Multi-Account
- [ ] Deploy AWS Control Tower landing zone
- [ ] Create account via Account Factory
- [ ] Share VPC subnets via AWS RAM
- [ ] Configure Organization Trail
- [ ] Set up Config Aggregator

### Cost Optimization
- [ ] Enable cost allocation tags
- [ ] Create Cost Explorer custom report
- [ ] Configure AWS Budget with alerts
- [ ] Set up Cost Anomaly Detection
- [ ] Review Compute Optimizer recommendations

---

## Assessment Checklist

### Knowledge Validation

**Task 1.1: Network Connectivity**
- [ ] Can explain when to use Transit Gateway vs VPC Peering vs PrivateLink
- [ ] Understand Direct Connect with VPN for redundancy
- [ ] Know how to design centralized egress architecture
- [ ] Can calculate data transfer costs for different patterns

**Task 1.2: Security**
- [ ] Understand SCP evaluation logic and inheritance
- [ ] Can design cross-account KMS encryption
- [ ] Know differences between Secrets Manager and Parameter Store
- [ ] Understand GuardDuty, Security Hub, Config, and Macie roles

**Task 1.3: Resilience**
- [ ] Can match DR pattern to RTO/RPO requirements
- [ ] Understand Aurora Global Database replication lag
- [ ] Know service quotas for critical services
- [ ] Can design health check and failover architecture

**Task 1.4: Multi-Account**
- [ ] Understand Control Tower vs manual Organizations setup
- [ ] Know when to use Shared VPC vs Transit Gateway
- [ ] Can design centralized logging architecture
- [ ] Understand RAM sharing permissions (owner vs participant)

**Task 1.5: Cost Optimization**
- [ ] Know differences between Savings Plans and RIs
- [ ] Understand blended vs unblended vs amortized costs
- [ ] Can calculate cost savings for right-sizing
- [ ] Know how to set up cost allocation and chargeback

### Practice Test Benchmark

**Target Scores:**
- After Task 1-2: 60% on practice questions
- After Task 3-4: 70% on practice questions
- After Task 5: 75% on practice questions
- Final review: 80%+ on practice questions

**If scoring below target:**
- Review explanations for all incorrect answers
- Revisit relevant study materials
- Create flashcards for concepts you missed
- Practice hands-on labs for weak areas
- Take practice test again after 3-5 days

---

## Additional Resources

### AWS Documentation (Critical Reading)
- AWS Well-Architected Framework (all 6 pillars)
- Building a Scalable and Secure Multi-VPC Network Infrastructure (whitepaper)
- AWS Security Best Practices (whitepaper)
- Organizing Your AWS Environment Using Multiple Accounts (whitepaper)

### AWS Services Deep Dive
- AWS Transit Gateway documentation
- AWS Organizations and SCPs best practices
- Aurora Global Database documentation
- AWS Cost Management user guide

### Practice and Validation
- AWS Skill Builder (official practice exam)
- Tutorials Dojo practice exams
- This repository's practice questions
- AWS re:Post for real-world scenarios

---

## Study Progress Tracker

### Week 1
- [ ] Task 1.1: Network Connectivity (4 hours)
- [ ] Task 1.2: Security Controls (5 hours)
- [ ] Hands-on labs for Week 1
- [ ] Practice questions for Tasks 1.1-1.2
- [ ] Score: ____% (Target: 60%+)

### Week 2
- [ ] Task 1.3: Reliable Architectures (4 hours)
- [ ] Task 1.4: Multi-Account (4 hours)
- [ ] Hands-on labs for Week 2
- [ ] Practice questions for Tasks 1.3-1.4
- [ ] Score: ____% (Target: 70%+)

### Week 3
- [ ] Task 1.5: Cost Optimization (4 hours)
- [ ] Tricky Scenarios review (3 hours)
- [ ] Full practice question set
- [ ] Hands-on labs review
- [ ] Score: ____% (Target: 80%+)

### Final Preparation
- [ ] Review all incorrect practice questions
- [ ] Complete all hands-on labs
- [ ] Draw common architecture patterns from memory
- [ ] Review decision trees and quick reference
- [ ] Timed full practice exam (26% of 75 = 20 questions in 48 minutes)
- [ ] Final score: ____% (Target: 85%+)

---

## Success Metrics

**You're ready for Domain 1 when you can:**
1. Draw complete architectures for multi-account, multi-region organizations
2. Explain trade-offs between different networking approaches
3. Design appropriate DR strategies based on RTO/RPO
4. Configure SCPs to enforce organizational security controls
5. Calculate and optimize costs in multi-account environments
6. Answer practice questions with 85%+ accuracy
7. Complete architecture questions in <3 minutes

**Final Check (Day Before Exam):**
- [ ] Can explain Transit Gateway vs VPC Peering decision criteria
- [ ] Know all 4 DR patterns and when to use each
- [ ] Understand SCP evaluation logic
- [ ] Remember PrivateLink is only solution for overlapping IPs
- [ ] Know Savings Plans vs RI differences
- [ ] Can design cross-account KMS encryption
- [ ] Understand Organization Trail vs account trails
- [ ] Know service quotas for critical services

---

## Conclusion

Domain 1 represents 26% of the exam and tests your ability to design complex, enterprise-scale AWS architectures. Success requires:

1. **Deep technical knowledge** of networking, security, resilience, and cost optimization
2. **Architectural thinking** to balance competing requirements
3. **Service selection skills** to choose appropriate AWS services
4. **Trade-off analysis** to evaluate options against requirements
5. **Real-world experience** with multi-account and hybrid environments

Use this study guide systematically, complete all hands-on labs, and practice consistently. With focused preparation, you'll master Domain 1 and be well-prepared for the AWS Solutions Architect Professional exam.

**Good luck with your studies!**

---

*Last updated: 2025-11-14*
*Created for AWS Solutions Architect Professional (SAP-C02) exam preparation*
