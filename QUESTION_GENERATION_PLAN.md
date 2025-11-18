# AWS SA Pro Exam - 200 Question Generation Plan

**Created**: 2025-11-18
**Target**: 200 detailed, tricky exam questions with comprehensive explanations
**Status**: ✅ COMPLETE

## Question Distribution by Domain

Based on SAP-C02 exam weights:

| Domain | Weight | Questions | Status |
|--------|--------|-----------|--------|
| Domain 1: Organizational Complexity | 26% | 52 | ✅ 52/52 |
| Domain 2: Design for New Solutions | 29% | 58 | ✅ 58/58 |
| Domain 3: Continuous Improvement | 25% | 50 | ✅ 50/50 |
| Domain 4: Migration & Modernization | 20% | 40 | ✅ 40/40 |
| **Total** | **100%** | **200** | **✅ 200/200 COMPLETE** |

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

### Task 2.1: Deployment Strategy (12 questions) ✅ COMPLETE
- [x] Blue/Green deployment with Route 53 weighted routing
- [x] Canary deployments with ALB weighted target groups
- [x] CodeDeploy deployment configurations
- [x] ECS blue/green with CodeDeploy
- [x] Lambda versioning and aliases for deployments
- [x] CloudFormation StackSets vs nested stacks
- [x] CDK vs Terraform trade-offs
- [x] Deployment rollback strategies
- [x] Feature flags and dark launches
- [x] Multi-region deployment orchestration
- [x] Database migration during deployments
- [x] Zero-downtime deployment patterns

### Task 2.2: Business Continuity (14 questions) ✅ COMPLETE
- [x] Pilot light vs warm standby vs multi-site
- [x] RTO/RPO requirement mapping
- [x] Aurora Global Database failover
- [x] S3 replication (CRR, SRR, RTC)
- [x] DynamoDB PITR vs on-demand backups
- [x] AWS Backup cross-region copy
- [x] EBS snapshot lifecycle management
- [x] Database migration with minimal downtime (DMS)
- [x] Application-level disaster recovery
- [x] Testing DR procedures
- [x] Route 53 Application Recovery Controller
- [x] Backup retention and compliance
- [x] Multi-region database synchronization
- [x] Recovery automation with Systems Manager

### Task 2.3: Security Controls (16 questions) ✅ COMPLETE
- [x] KMS key policies and grants
- [x] CloudHSM vs KMS trade-offs
- [x] Client-side vs server-side encryption
- [x] S3 bucket policies with encryption enforcement
- [x] VPC endpoint policies
- [x] NACLs vs Security Groups scenarios
- [x] AWS WAF rule groups and managed rules
- [x] Shield Advanced vs Shield Standard
- [x] Secrets rotation with Lambda
- [x] Parameter Store vs Secrets Manager
- [x] Encryption in transit (TLS, MACsec, IPsec)
- [x] GuardDuty findings and remediation
- [x] Security scanning in CI/CD (CodeGuru, Inspector)
- [x] Container security (ECR scanning, ECS/EKS security)
- [x] API Gateway authorization (IAM, Cognito, Lambda)
- [x] Cognito User Pools vs Identity Pools

### Task 2.4: Reliability Requirements (16 questions) ✅ COMPLETE
- [x] Auto Scaling based on custom metrics
- [x] Target tracking vs step scaling vs simple scaling
- [x] ALB vs NLB vs Gateway Load Balancer
- [x] Connection draining and deregistration delay
- [x] Health check configurations
- [x] Multi-AZ deployment patterns
- [x] Spread placement groups vs partition placement groups
- [x] EBS volume types and IOPS provisioning
- [x] EFS performance modes and throughput modes
- [x] Circuit breaker patterns
- [x] Retry logic and exponential backoff
- [x] Queue-based load leveling (SQS)
- [x] Dead letter queues and error handling
- [x] Service mesh (App Mesh) for microservices
- [x] EventBridge for event-driven architectures
- [x] Step Functions error handling and retries

## Domain 3: Continuous Improvement (50 Questions)

### Task 3.1: Operational Excellence (12 questions) ✅ COMPLETE
- [x] CloudWatch Logs Insights query optimization
- [x] CloudWatch Metrics and custom metrics
- [x] CloudWatch Alarms composite alarms
- [x] X-Ray tracing and service maps
- [x] Systems Manager automation documents
- [x] Systems Manager Patch Manager
- [x] EventBridge rules and event patterns
- [x] SNS vs SQS for notifications
- [x] CloudFormation drift detection
- [x] AWS Config rules for compliance
- [x] Service Catalog for standardization
- [x] Well-Architected Framework reviews

### Task 3.2: Security Improvements (10 questions) ✅ COMPLETE
- [x] IAM Access Analyzer policy validation
- [x] GuardDuty findings automation
- [x] Security Hub automated remediation
- [x] Macie for sensitive data discovery
- [x] Detective for security investigations
- [x] Certificate rotation automation
- [x] Secrets rotation strategies
- [x] Network firewall rules optimization
- [x] CloudTrail log analysis and alerting
- [x] Compliance as code (Config rules, OPA)

### Task 3.3: Performance Optimization (12 questions) ✅ COMPLETE
- [x] CloudFront caching strategies and invalidation
- [x] ElastiCache Redis vs Memcached
- [x] ElastiCache cluster vs non-cluster mode
- [x] DAX for DynamoDB acceleration
- [x] RDS Performance Insights
- [x] Aurora read replica lag reduction
- [x] DynamoDB partition key design
- [x] DynamoDB GSI vs LSI trade-offs
- [x] S3 Transfer Acceleration
- [x] EBS volume optimization (gp3 vs io2)
- [x] Lambda performance (memory, provisioned concurrency)
- [x] API Gateway caching and throttling

### Task 3.4: Reliability Improvements (8 questions) ✅ COMPLETE
- [x] Auto Scaling lifecycle hooks
- [x] Predictive scaling for Auto Scaling
- [x] SQS visibility timeout tuning
- [x] SQS FIFO vs standard queues
- [x] SNS message filtering
- [x] EventBridge archive and replay
- [x] Step Functions execution patterns
- [x] Chaos engineering with FIS

### Task 3.5: Cost Optimization (8 questions) ✅ COMPLETE
- [x] Compute Savings Plans vs EC2 Reserved Instances
- [x] Spot Instances with Auto Scaling
- [x] Spot Fleet strategies
- [x] Lambda cost optimization (memory tuning)
- [x] S3 storage class optimization
- [x] EBS volume cost optimization (gp3 migration)
- [x] Data transfer cost reduction
- [x] Trusted Advisor cost recommendations

## Domain 4: Migration & Modernization (40 Questions)

### Task 4.1: Migration Selection (10 questions) ✅ COMPLETE
- [x] 7 R's framework decision making
- [x] Migration Evaluator (TSO Logic) assessment
- [x] Application Discovery Service
- [x] Migration Hub strategy recommendations
- [x] Mainframe migration strategies
- [x] Windows to Linux migration
- [x] Database migration assessment (SCT)
- [x] Application dependency mapping
- [x] Wave planning for migrations
- [x] Cost-benefit analysis for migration paths

### Task 4.2: Migration Approach (12 questions) ✅ COMPLETE
- [x] AWS Application Migration Service (MGN)
- [x] CloudEndure vs MGN
- [x] Database Migration Service (DMS) scenarios
- [x] DMS homogeneous vs heterogeneous migrations
- [x] Schema Conversion Tool (SCT)
- [x] DataSync for file transfer
- [x] Transfer Family for SFTP/FTPS
- [x] Snow family for large data transfers
- [x] Storage Gateway migration patterns
- [x] VMware Cloud on AWS migration
- [x] Mainframe replatforming (Blu Age, Micro Focus)
- [x] Migration testing and validation

### Task 4.3: Architecture Design (10 questions) ✅ COMPLETE
- [x] Lift-and-shift to cloud-native refactoring
- [x] Monolith to microservices decomposition
- [x] Event-driven architecture patterns
- [x] Serverless architecture design
- [x] Container orchestration (ECS vs EKS)
- [x] Service discovery (Cloud Map)
- [x] API-first design patterns
- [x] Data lake architecture (Lake Formation)
- [x] Real-time analytics architecture
- [x] Batch processing modernization (Batch, Glue)

### Task 4.4: Modernization Opportunities (8 questions) ✅ COMPLETE
- [x] EC2 to Lambda migration scenarios
- [x] RDS to Aurora migration benefits
- [x] Self-managed Kubernetes to EKS
- [x] Traditional queue systems to SQS/EventBridge
- [x] File servers to EFS/FSx
- [x] Traditional caching to ElastiCache
- [x] CI/CD modernization (Jenkins to CodePipeline)
- [x] Infrastructure as Code adoption (CloudFormation, CDK)

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

- **Total Questions Generated**: 200/200 (100% COMPLETE) ✅
- **Last Updated**: 2025-11-18
- **Status**: PROJECT COMPLETE - All 4 domains finished
- **Question Mix**: Single-choice AND multiple-choice (Select TWO/THREE) questions included
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
