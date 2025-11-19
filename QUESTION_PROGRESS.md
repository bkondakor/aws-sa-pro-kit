# AWS SA Pro - 60 Tricky Questions Generation Progress

**Date Started:** 2025-11-19
**Target:** 60 new tricky scenario questions
**Strategy:** Create in 4 batches of 15 questions each

## Progress Tracker

### Batch 1: Hybrid Cloud & Multi-Region Architectures (15 questions)
**Status:** ✅ COMPLETED
**File:** `questions/tricky-batch-5-hybrid-multiregion.json`
**Topics:**
- Direct Connect with VPN failover scenarios (BFD, VGW routing preferences)
- Transit Gateway complex routing (ECMP, route table segmentation)
- Multi-region active-active patterns (Route 53, Aurora Global DB, DynamoDB Global Tables)
- Hybrid DNS resolution (Route 53 Resolver endpoints, subnet routing)
- Cross-region data synchronization (DR strategies, replication patterns)
**Question Types:** 10 single-choice, 5 multiple-choice

### Batch 2: Security & Compliance Deep Dives (15 questions)
**Status:** ✅ COMPLETED
**File:** `questions/tricky-batch-6-security-compliance.json`
**Topics:**
- KMS key rotation and cross-account encryption
- IAM permission boundaries and SCPs
- Secrets Manager rotation strategies
- HIPAA/PCI-DSS compliance logging (CloudTrail, Object Lock)
- CloudHSM vs KMS key management
- Multi-tenant access control with SAML session tags
**Question Types:** 10 single-choice, 5 multiple-choice

### Batch 3: Performance & Auto-Scaling Optimization (15 questions)
**Status:** ✅ COMPLETED
**File:** `questions/tricky-batch-7-performance-scaling.json`
**Topics:**
- RDS Performance Insights wait events (IO:DataFileRead, Client:ClientRead)
- ElastiCache Redis cluster mode and scaling strategies
- Auto Scaling metrics selection and Spot Instance handling
- ALB-to-Lambda integration and health checks
- CloudFront cache optimization and cache policies
- Athena query optimization (Parquet, partitioning, file sizing)
- Kinesis + Lambda concurrency and parallelization
- OpenSearch JVM tuning and index lifecycle management
**Question Types:** 10 single-choice, 5 multiple-choice

### Batch 4: Cost Optimization & Migration Strategies (15 questions)
**Status:** ✅ COMPLETED
**File:** `questions/tricky-batch-8-cost-migration.json`
**Topics:**
- Reserved Instance marketplace and Savings Plans comparison
- EC2 cost optimization (Spot, Graviton2, Instance Scheduler)
- Database migration (Oracle to Aurora, DMS with CDC)
- S3 storage class lifecycle policies (Glacier Instant Retrieval, Intelligent-Tiering)
- Application migration strategies (VMware to AWS, MGN)
- Cost allocation tags and AWS Organizations
- Glue Flex execution class and Redshift Serverless
- Data transfer cost optimization (CloudFront, cross-region)
- Rightsizing with Compute Optimizer
**Question Types:** 10 single-choice, 5 multiple-choice

---

## Question Quality Checklist
- [ ] Realistic business scenario with constraints
- [ ] Tests deep architectural knowledge
- [ ] Tricky distractors based on common misconceptions
- [ ] Detailed explanations with AWS service limits
- [ ] Mix of single-choice and multiple-choice (SELECT 2-3)
- [ ] References to AWS Well-Architected Framework

---

## Commits Log
- [x] Batch 1 committed (2025-11-19)
- [x] Batch 2 committed (2025-11-19)
- [x] Batch 3 committed (2025-11-19)
- [x] Batch 4 committed (2025-11-19)
- [ ] Final aggregation completed

---

**Total Questions Generated:** 60 / 60 (100% complete) ✅
