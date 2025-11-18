# AWS SA Pro Exam - 200 Question Generation Plan

**Created**: 2025-11-18
**Target**: 200 detailed, tricky exam questions with comprehensive explanations
**Status**: In Progress

## Question Distribution by Domain

Based on SAP-C02 exam weights:

| Domain | Weight | Questions | Status |
|--------|--------|-----------|--------|
| Domain 1: Organizational Complexity | 26% | 52 | ✅ 52/52 |
| Domain 2: Design for New Solutions | 29% | 58 | ⏳ Pending |
| Domain 3: Continuous Improvement | 25% | 50 | ⏳ Pending |
| Domain 4: Migration & Modernization | 20% | 40 | ⏳ Pending |
| **Total** | **100%** | **200** | **52/200** |

## Domain 1: Organizational Complexity (52 Questions)

### Task 1.1: Network Connectivity (12 questions) ✅ COMPLETE
- [x] Direct Connect advanced scenarios (failover, LAG, MACsec)
- [x] Transit Gateway complex routing scenarios
- [x] VPN over Direct Connect backup scenarios
- [x] Cross-region peering with overlapping CIDRs
- [x] PrivateLink vs VPC Peering trade-offs
- [x] Site-to-Site VPN with BGP routing
- [x] AWS Cloud WAN vs Transit Gateway
- [x] Route propagation and route table priorities
- [x] Direct Connect Gateway limitations
- [x] Multicast and anycast scenarios
- [x] Network segmentation strategies
- [x] Hybrid DNS resolution (Route 53 Resolver)

### Task 1.2: Security Controls (12 questions) ✅ COMPLETE
- [x] SCPs vs IAM policies vs resource policies
- [x] Cross-account access patterns (roles, resource policies)
- [x] AWS SSO vs SAML federation trade-offs
- [x] Attribute-based access control (ABAC)
- [x] Permission boundaries complex scenarios
- [x] AWS Control Tower guardrails
- [x] Security Hub multi-account aggregation
- [x] GuardDuty threat detection scenarios
- [x] AWS Config aggregators and conformance packs
- [x] Secrets Manager cross-account access
- [x] Certificate management with ACM Private CA
- [x] IAM Access Analyzer findings

### Task 1.3: Reliable & Resilient Architectures (10 questions) ✅ COMPLETE
- [x] Multi-region active-active architectures
- [x] Global Accelerator vs CloudFront for HA
- [x] Route 53 health checks and failover policies
- [x] RDS Multi-AZ vs Aurora Global Database
- [x] DynamoDB Global Tables consistency models
- [x] S3 Cross-Region Replication advanced scenarios
- [x] Chaos engineering practices
- [x] Failure injection testing (FIS)
- [x] Recovery time/point objectives (RTO/RPO) scenarios
- [x] Backup strategies across services

### Task 1.4: Multi-Account Environment (10 questions) ✅ COMPLETE
- [x] AWS Organizations OU structure design
- [x] Consolidated billing and cost allocation
- [x] Service Control Policies (SCPs) inheritance
- [x] Resource sharing with AWS RAM
- [x] Cross-account CloudWatch logs and metrics
- [x] Multi-account CloudTrail strategies
- [x] Account vending machines
- [x] AWS Control Tower account factory
- [x] StackSets for multi-account deployments
- [x] Cross-account CI/CD pipelines

### Task 1.5: Cost Optimization & Visibility (8 questions) ✅ COMPLETE
- [x] Cost allocation tags strategy
- [x] AWS Cost Explorer and Cost Anomaly Detection
- [x] Reserved Instances vs Savings Plans
- [x] Compute Optimizer recommendations
- [x] S3 Intelligent-Tiering vs Lifecycle policies
- [x] Data transfer cost optimization
- [x] Multi-account billing consolidation
- [x] AWS Budgets and alerts

## Domain 2: Design for New Solutions (58 Questions)

### Task 2.1: Deployment Strategy (12 questions)
- [ ] Blue/Green deployment with Route 53 weighted routing
- [ ] Canary deployments with ALB weighted target groups
- [ ] CodeDeploy deployment configurations
- [ ] ECS blue/green with CodeDeploy
- [ ] Lambda versioning and aliases for deployments
- [ ] CloudFormation StackSets vs nested stacks
- [ ] CDK vs Terraform trade-offs
- [ ] Deployment rollback strategies
- [ ] Feature flags and dark launches
- [ ] Multi-region deployment orchestration
- [ ] Database migration during deployments
- [ ] Zero-downtime deployment patterns

### Task 2.2: Business Continuity (14 questions)
- [ ] Pilot light vs warm standby vs multi-site
- [ ] RTO/RPO requirement mapping
- [ ] Aurora Global Database failover
- [ ] S3 replication (CRR, SRR, RTC)
- [ ] DynamoDB PITR vs on-demand backups
- [ ] AWS Backup cross-region copy
- [ ] EBS snapshot lifecycle management
- [ ] Database migration with minimal downtime (DMS)
- [ ] Application-level disaster recovery
- [ ] Testing DR procedures
- [ ] Route 53 Application Recovery Controller
- [ ] Backup retention and compliance
- [ ] Multi-region database synchronization
- [ ] Recovery automation with Systems Manager

### Task 2.3: Security Controls (16 questions)
- [ ] KMS key policies and grants
- [ ] CloudHSM vs KMS trade-offs
- [ ] Client-side vs server-side encryption
- [ ] S3 bucket policies with encryption enforcement
- [ ] VPC endpoint policies
- [ ] NACLs vs Security Groups scenarios
- [ ] AWS WAF rule groups and managed rules
- [ ] Shield Advanced vs Shield Standard
- [ ] Secrets rotation with Lambda
- [ ] Parameter Store vs Secrets Manager
- [ ] Encryption in transit (TLS, MACsec, IPsec)
- [ ] GuardDuty findings and remediation
- [ ] Security scanning in CI/CD (CodeGuru, Inspector)
- [ ] Container security (ECR scanning, ECS/EKS security)
- [ ] API Gateway authorization (IAM, Cognito, Lambda)
- [ ] Cognito User Pools vs Identity Pools

### Task 2.4: Reliability Requirements (16 questions)
- [ ] Auto Scaling based on custom metrics
- [ ] Target tracking vs step scaling vs simple scaling
- [ ] ALB vs NLB vs Gateway Load Balancer
- [ ] Connection draining and deregistration delay
- [ ] Health check configurations
- [ ] Multi-AZ deployment patterns
- [ ] Spread placement groups vs partition placement groups
- [ ] EBS volume types and IOPS provisioning
- [ ] EFS performance modes and throughput modes
- [ ] Circuit breaker patterns
- [ ] Retry logic and exponential backoff
- [ ] Queue-based load leveling (SQS)
- [ ] Dead letter queues and error handling
- [ ] Service mesh (App Mesh) for microservices
- [ ] EventBridge for event-driven architectures
- [ ] Step Functions error handling and retries

## Domain 3: Continuous Improvement (50 Questions)

### Task 3.1: Operational Excellence (12 questions)
- [ ] CloudWatch Logs Insights query optimization
- [ ] CloudWatch Metrics and custom metrics
- [ ] CloudWatch Alarms composite alarms
- [ ] X-Ray tracing and service maps
- [ ] Systems Manager automation documents
- [ ] Systems Manager Patch Manager
- [ ] EventBridge rules and event patterns
- [ ] SNS vs SQS for notifications
- [ ] CloudFormation drift detection
- [ ] AWS Config rules for compliance
- [ ] Service Catalog for standardization
- [ ] Well-Architected Framework reviews

### Task 3.2: Security Improvements (10 questions)
- [ ] IAM Access Analyzer policy validation
- [ ] GuardDuty findings automation
- [ ] Security Hub automated remediation
- [ ] Macie for sensitive data discovery
- [ ] Detective for security investigations
- [ ] Certificate rotation automation
- [ ] Secrets rotation strategies
- [ ] Network firewall rules optimization
- [ ] CloudTrail log analysis and alerting
- [ ] Compliance as code (Config rules, OPA)

### Task 3.3: Performance Optimization (12 questions)
- [ ] CloudFront caching strategies and invalidation
- [ ] ElastiCache Redis vs Memcached
- [ ] ElastiCache cluster vs non-cluster mode
- [ ] DAX for DynamoDB acceleration
- [ ] RDS Performance Insights
- [ ] Aurora read replica lag reduction
- [ ] DynamoDB partition key design
- [ ] DynamoDB GSI vs LSI trade-offs
- [ ] S3 Transfer Acceleration
- [ ] EBS volume optimization (gp3 vs io2)
- [ ] Lambda performance (memory, provisioned concurrency)
- [ ] API Gateway caching and throttling

### Task 3.4: Reliability Improvements (8 questions)
- [ ] Auto Scaling lifecycle hooks
- [ ] Predictive scaling for Auto Scaling
- [ ] SQS visibility timeout tuning
- [ ] SQS FIFO vs standard queues
- [ ] SNS message filtering
- [ ] EventBridge archive and replay
- [ ] Step Functions execution patterns
- [ ] Chaos engineering with FIS

### Task 3.5: Cost Optimization (8 questions)
- [ ] Compute Savings Plans vs EC2 Reserved Instances
- [ ] Spot Instances with Auto Scaling
- [ ] Spot Fleet strategies
- [ ] Lambda cost optimization (memory tuning)
- [ ] S3 storage class optimization
- [ ] EBS volume cost optimization (gp3 migration)
- [ ] Data transfer cost reduction
- [ ] Trusted Advisor cost recommendations

## Domain 4: Migration & Modernization (40 Questions)

### Task 4.1: Migration Selection (10 questions)
- [ ] 7 R's framework decision making
- [ ] Migration Evaluator (TSO Logic) assessment
- [ ] Application Discovery Service
- [ ] Migration Hub strategy recommendations
- [ ] Mainframe migration strategies
- [ ] Windows to Linux migration
- [ ] Database migration assessment (SCT)
- [ ] Application dependency mapping
- [ ] Wave planning for migrations
- [ ] Cost-benefit analysis for migration paths

### Task 4.2: Migration Approach (12 questions)
- [ ] AWS Application Migration Service (MGN)
- [ ] CloudEndure vs MGN
- [ ] Database Migration Service (DMS) scenarios
- [ ] DMS homogeneous vs heterogeneous migrations
- [ ] Schema Conversion Tool (SCT)
- [ ] DataSync for file transfer
- [ ] Transfer Family for SFTP/FTPS
- [ ] Snow family for large data transfers
- [ ] Storage Gateway migration patterns
- [ ] VMware Cloud on AWS migration
- [ ] Mainframe replatforming (Blu Age, Micro Focus)
- [ ] Migration testing and validation

### Task 4.3: Architecture Design (10 questions)
- [ ] Lift-and-shift to cloud-native refactoring
- [ ] Monolith to microservices decomposition
- [ ] Event-driven architecture patterns
- [ ] Serverless architecture design
- [ ] Container orchestration (ECS vs EKS)
- [ ] Service discovery (Cloud Map)
- [ ] API-first design patterns
- [ ] Data lake architecture (Lake Formation)
- [ ] Real-time analytics architecture
- [ ] Batch processing modernization (Batch, Glue)

### Task 4.4: Modernization Opportunities (8 questions)
- [ ] EC2 to Lambda migration scenarios
- [ ] RDS to Aurora migration benefits
- [ ] Self-managed Kubernetes to EKS
- [ ] Traditional queue systems to SQS/EventBridge
- [ ] File servers to EFS/FSx
- [ ] Traditional caching to ElastiCache
- [ ] CI/CD modernization (Jenkins to CodePipeline)
- [ ] Infrastructure as Code adoption (CloudFormation, CDK)

## Question Quality Guidelines

Each question must:
1. ✅ Be scenario-based (realistic business context)
2. ✅ Test deep understanding, not just memorization
3. ✅ Include tricky distractors based on common misconceptions
4. ✅ Have detailed explanations (why correct answer is right, why others are wrong)
5. ✅ Reference up-to-date service features and limits
6. ✅ Focus on trade-offs, not just features
7. ✅ Include constraints (cost, time, compliance, performance)
8. ✅ Test architectural decision-making skills

## Progress Tracking

- **Total Questions Generated**: 52/200 (26% complete)
- **Last Updated**: 2025-11-18
- **Latest Batch**: Domain 1 COMPLETE - All 52 questions (Tasks 1.1-1.5)
- **Questions per commit**: ~10-20 (to track progress incrementally)

## File Organization

Questions will be organized in `/questions/` folder:
- `domain-1-questions.json` (52 questions)
- `domain-2-questions.json` (58 questions)
- `domain-3-questions.json` (50 questions)
- `domain-4-questions.json` (40 questions)
- `all-questions.json` (combined 200 questions for exam website)

## Research Sources

For each topic, verify current information from:
- AWS Official Documentation
- AWS Service FAQs
- AWS Whitepapers
- AWS re:Invent presentations
- AWS Architecture Blog
- Service limits and quotas pages

---
**Status Legend**: ✅ Complete | ⏳ In Progress | ❌ Pending | 🔄 Needs Review
