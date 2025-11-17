# Domain 1: Tricky Scenarios and Exam-Style Questions

## Overview
This document contains complex, exam-style scenarios combining multiple concepts from Domain 1. These scenarios are designed to test deep understanding and the ability to synthesize knowledge across networking, security, resilience, multi-account architecture, and cost optimization.

---

## Scenario 1: Complex Multi-Region Hybrid Architecture

### Question

A global financial services company has the following requirements:

- On-premises data center in New York with 10 Gbps dedicated connectivity to AWS
- Applications deployed in us-east-1 (primary) and eu-west-1 (DR)
- 300+ application teams across 50 AWS accounts
- Compliance requires all traffic to on-premises must be inspected
- RTO: 15 minutes, RPO: 5 minutes
- All database credentials must rotate every 30 days
- Cost optimization is critical - current monthly spend is $500K

**Design a solution that meets all requirements. Include:**
1. Hybrid connectivity architecture
2. Multi-account network topology
3. DR strategy
4. Security controls
5. Cost optimization approach

### Solution

**1. Hybrid Connectivity Architecture:**

```
On-Premises (New York)
├── Two Direct Connect connections (10 Gbps each) at primary location
├── One Direct Connect connection (10 Gbps) at secondary location (Boston)
└── Site-to-Site VPN as backup (Transit Gateway endpoint)

Direct Connect Configuration:
├── Private VIF to Transit Gateway in us-east-1
├── MACsec encryption for compliance
└── BFD enabled for sub-second failover
```

**Rationale:**
- Two Direct Connect locations for 99.99% SLA (resilience requirement)
- MACsec for encryption (compliance for financial data)
- VPN backup for cost-effective redundancy
- Transit Gateway for centralized routing (50 accounts)

**2. Multi-Account Network Topology:**

```
Organization Structure:
├── Core OU
│   ├── Network Account
│   │   └── Transit Gateway (shared via RAM to all accounts)
│   ├── Security Account
│   │   └── Inspection VPC (AWS Network Firewall)
│   ├── Log Archive Account
│   └── Audit Account
├── Production OU (application accounts)
└── Non-Production OU

Transit Gateway Route Tables:
├── Production RT
│   └── 0.0.0.0/0 → Inspection VPC (all egress inspected)
├── Non-Production RT
│   └── 0.0.0.0/0 → NAT Gateway (no inspection for dev)
├── Inspection RT
│   └── Routes to on-premises and internet
└── On-Premises RT
    └── Routes to Production/Non-Prod VPCs
```

**Rationale:**
- Shared VPC pattern reduces costs (single Transit Gateway)
- Centralized inspection meets compliance requirement
- Separate route tables for production vs non-production (cost optimization)
- Network Account owns all networking infrastructure

**3. DR Strategy:**

**Chosen Strategy: Warm Standby**
- RTO 15 min, RPO 5 min requirements rule out Pilot Light or Backup/Restore
- Active-Active too expensive ($500K spend - cost optimization critical)

**Implementation:**
```
us-east-1 (Primary):
├── Full capacity Auto Scaling Groups
├── Aurora Global Database (primary cluster)
├── DynamoDB Global Tables
└── Application Load Balancers

eu-west-1 (DR):
├── Reduced capacity Auto Scaling (min: 2, max: 100)
├── Aurora Global Database (secondary cluster, 1-second lag)
├── DynamoDB Global Tables (active-active)
└── Application Load Balancers (pre-deployed)

Route 53:
├── Failover routing policy
├── Health checks on primary ALB (30-second interval)
└── CloudWatch alarms for application health
```

**RPO Achievement:**
- Aurora Global Database: <1 second replication lag
- DynamoDB Global Tables: Sub-second replication
- EBS snapshots: Every 4 hours to eu-west-1 (for non-critical data)

**RTO Achievement:**
- Auto Scaling in eu-west-1: 2 min to scale from 2 to target capacity
- Aurora failover: Promote secondary cluster in <1 min
- Route 53 health check + failover: 30 sec health check + 60 sec TTL = 90 sec
- Total: ~3-4 minutes (well within 15 min requirement)

**4. Security Controls:**

**SCPs:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyRegionsNotApproved",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": ["us-east-1", "eu-west-1"]
        }
      }
    },
    {
      "Sid": "ProtectSecurityServices",
      "Effect": "Deny",
      "Action": [
        "cloudtrail:StopLogging",
        "guardduty:DeleteDetector",
        "config:DeleteConfigRule"
      ],
      "Resource": "*"
    }
  ]
}
```

**Secrets Management:**
```
AWS Secrets Manager:
├── Store all database credentials
├── Automatic rotation every 30 days (compliance requirement)
├── Lambda rotation function (RDS integration)
└── Cross-region replication (us-east-1 → eu-west-1)

Cost: ~$0.40/secret/month × 50 databases = $20/month
```

**Detective Controls:**
```
Security Account (Delegated Admin):
├── GuardDuty enabled in all accounts
├── Security Hub with CIS Benchmark
├── Config Aggregator for compliance
└── Macie for sensitive data discovery (financial data)

Log Archive Account:
├── Organization Trail (all accounts, both regions)
├── VPC Flow Logs from all accounts
├── S3 Object Lock for compliance (immutable logs)
└── Lifecycle policy: Glacier after 90 days
```

**5. Cost Optimization Approach:**

**Current Spend Analysis ($500K/month):**

**Immediate Optimizations:**

1. **Reserved Instances / Savings Plans:**
   - Analyze last 3 months usage in Cost Explorer
   - Purchase EC2 Instance Savings Plans for baseline (70% coverage)
   - Target: 60-70% savings on compute ($150K → $60K = $90K savings)

2. **Right-Sizing:**
   - Run Compute Optimizer across all accounts
   - Implement recommendations (typically 20-30% savings)
   - Target: $50K savings/month

3. **Storage Optimization:**
   - S3 Intelligent-Tiering for all buckets
   - Delete unattached EBS volumes (snapshot first)
   - Lifecycle policies: Standard → Glacier after 90 days
   - Target: $20K savings/month

4. **Network Optimization:**
   - Shared Transit Gateway reduces costs vs per-account peering
   - VPC Gateway Endpoints for S3/DynamoDB (free vs NAT Gateway)
   - CloudFront for public content (cheaper than direct S3 egress)
   - Target: $15K savings/month

5. **DR Environment:**
   - Use smaller instance types in eu-west-1 (warm standby)
   - Aurora Serverless v2 for secondary (auto-scaling)
   - Spot Instances for non-critical DR components
   - Target: $25K savings/month

**Total Potential Savings: $200K/month (40% reduction)**

**Cost Governance:**
```
Multi-Account Strategy:
├── Cost allocation tags (CostCenter, Application, Environment)
├── AWS Budgets per account ($10K/month baseline)
├── Cost Anomaly Detection (alerts >$500/day variance)
└── Monthly FinOps review with Cost Explorer

Automated Controls:
├── SCP: Deny expensive instance types in Non-Prod
├── Budget Actions: Stop dev resources at 80% threshold
└── Lambda: Auto-stop development resources after hours
```

**Cost Visibility:**
```
Cost and Usage Reports:
├── Hourly granularity to S3 in management account
├── Athena queries for detailed analysis
└── QuickSight dashboards for executives

Chargeback:
├── Per-account costs (consolidated billing breakdown)
├── Shared services allocated by usage (Transit Gateway, Direct Connect)
└── Monthly cost reports to application teams
```

### Key Exam Insights

**Why This Solution Works:**

1. **Hybrid Connectivity:** Multiple Direct Connect locations + VPN backup meets resilience and cost requirements
2. **Multi-Account:** Transit Gateway shared via RAM scales to 50 accounts efficiently
3. **Traffic Inspection:** Centralized inspection VPC meets compliance without per-account complexity
4. **DR Strategy:** Warm standby balances 15-min RTO with cost optimization (vs expensive active-active)
5. **Security:** Secrets Manager rotation, SCPs, detective controls meet financial compliance
6. **Cost:** 40% reduction through RIs, right-sizing, storage optimization, and architectural improvements

**Common Mistakes:**
- Using Active-Active for DR (too expensive given cost focus)
- VPC Peering instead of Transit Gateway (doesn't scale to 50 accounts)
- Forgetting MACsec for Direct Connect encryption (compliance miss)
- Not centralizing traffic inspection (per-account firewalls = cost/complexity)
- Standard RIs instead of Savings Plans (less flexible for changing needs)

---

## Scenario 2: Cross-Account KMS Encryption with Conflicting Requirements

### Question

A healthcare company has these requirements:

- Account A (Security): Owns KMS key for encrypting PHI
- Account B (Application): Needs to encrypt S3 objects with Account A's key
- Account C (Analytics): Needs to read encrypted objects from Account B's bucket
- Account D (Audit): Needs to read CloudTrail logs of all KMS operations
- Compliance requires: Key cannot leave Security account, all access logged

**Design the IAM policies, KMS key policy, and S3 bucket policy to enable this workflow.**

### Solution

**KMS Key Policy (Account A - Security Account):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM policies",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-A:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow Account B to encrypt",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-B:role/ApplicationRole"
      },
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:GenerateDataKey",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Allow Account C to decrypt",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-C:role/AnalyticsRole"
      },
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Allow S3 to use key for Account B bucket",
      "Effect": "Allow",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "s3.us-east-1.amazonaws.com",
          "kms:CallerAccount": "ACCOUNT-B"
        }
      }
    }
  ]
}
```

**S3 Bucket Policy (Account B - Application Account):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAccountCRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-C:role/AnalyticsRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::account-b-phi-bucket",
        "arn:aws:s3:::account-b-phi-bucket/*"
      ]
    }
  ]
}
```

**IAM Policy (Account B - ApplicationRole):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::account-b-phi-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:GenerateDataKey",
        "kms:DescribeKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:ACCOUNT-A:key/KEY-ID"
    }
  ]
}
```

**IAM Policy (Account C - AnalyticsRole):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::account-b-phi-bucket",
        "arn:aws:s3:::account-b-phi-bucket/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:ACCOUNT-A:key/KEY-ID"
    }
  ]
}
```

**CloudTrail Configuration (Account D - Audit Account Access):**

```
Organization Trail (Management Account):
├── Logs all accounts to S3 in Log Archive Account
├── KMS operations from all accounts included
└── Cross-account read access to Audit Account

Audit Account IAM Policy:
{
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:ListBucket"
  ],
  "Resource": [
    "arn:aws:s3:::org-cloudtrail-logs",
    "arn:aws:s3:::org-cloudtrail-logs/*"
  ]
}

Query CloudTrail logs via Athena:
SELECT
  eventTime,
  userIdentity.accountId,
  eventName,
  requestParameters.keyId,
  sourceIPAddress
FROM cloudtrail_logs
WHERE eventSource = 'kms.amazonaws.com'
  AND (eventName = 'Encrypt' OR eventName = 'Decrypt')
ORDER BY eventTime DESC;
```

### Workflow

**1. Account B Writes Encrypted Object:**
```
ApplicationRole (Account B)
  ↓ (assumes role)
Calls s3:PutObject with SSE-KMS
  ↓ (requires)
KMS Encrypt permission on Account A key (granted in KMS key policy)
  ↓
S3 encrypts object using KMS key from Account A
  ↓
CloudTrail logs kms:Encrypt event (visible in Account D)
```

**2. Account C Reads Encrypted Object:**
```
AnalyticsRole (Account C)
  ↓ (assumes role)
Calls s3:GetObject
  ↓ (requires)
S3 bucket policy allows Account C (granted)
  ↓ (requires)
KMS Decrypt permission on Account A key (granted in KMS key policy)
  ↓
S3 decrypts object and returns plaintext
  ↓
CloudTrail logs kms:Decrypt event (visible in Account D)
```

**3. Account D Audits Activity:**
```
Audit Account queries CloudTrail via Athena
  ↓
Sees all kms:Encrypt and kms:Decrypt events
  ↓
Identifies who accessed PHI data and when
```

### Key Exam Insights

**Critical Points:**
1. **Both KMS key policy AND IAM policy required** - KMS key policy allows cross-account, IAM policy in using account grants to specific principals
2. **S3 bucket policy also required** - Account C needs permission on bucket itself
3. **Three separate permissions needed** - S3 bucket access + KMS decrypt + IAM policy in calling account
4. **CloudTrail logs KMS calls** - Automatic audit trail for compliance
5. **Key never leaves Account A** - Encryption/decryption happens in KMS service, not in application accounts

**Common Mistakes:**
- Forgetting IAM policy in Account B or C (key policy alone isn't enough)
- Not granting S3 service permission in KMS key policy (S3 needs to use key)
- Assuming resource-based policy (S3) is sufficient (KMS permissions also required)
- Not using kms:ViaService condition (security best practice)

---

## Scenario 3: Cost Optimization with Conflicting Requirements

### Question

An e-commerce company has the following situation:

- Current monthly AWS spend: $800K
- 80% spend is on EC2 (mix of web servers, batch processing, data analytics)
- Web servers: 24/7 baseline of 200 m5.2xlarge, peak to 500 during sales
- Batch processing: Runs 6 hours/day (2 AM - 8 AM), 100 c5.4xlarge instances
- Data analytics: Runs 12 hours/day (8 AM - 8 PM), 50 r5.4xlarge instances
- Database: Aurora MySQL with 10 read replicas, high utilization 24/7
- Storage: 500 TB in S3, 80% not accessed for 90+ days
- Company needs 40% cost reduction while maintaining performance

**Design cost optimization strategy with specific actions and projected savings.**

### Solution

**1. Web Servers Optimization:**

**Current Cost:**
```
Baseline: 200 × m5.2xlarge × $0.384/hr × 730 hr/month = $56,064
Peak (Sales): 300 additional × $0.384/hr × 48 hrs/month = $5,530
Total: $61,594/month
```

**Optimized Architecture:**
```
Baseline (200 instances):
├── Purchase EC2 Instance Savings Plan
│   └── 200 × $0.384/hr = $76.80/hr commitment
│   └── 3-year, partial upfront = 60% discount
│   └── Cost: $76.80 × 0.40 × 730 = $22,425/month
│
Peak (300 additional for sales):
├── Use On-Demand (short duration)
│   └── 300 × $0.384/hr × 48 hr/month = $5,530/month
│
Monthly Cost: $27,955
Savings: $61,594 - $27,955 = $33,639/month (55% reduction)
```

**2. Batch Processing Optimization:**

**Current Cost:**
```
100 × c5.4xlarge × $0.68/hr × 180 hr/month = $12,240/month
```

**Optimized Architecture:**
```
Spot Instances with Spot Fleet:
├── Diversify across c5.4xlarge, c5a.4xlarge, c6i.4xlarge
├── Spot discount: 70% typical
├── Cost: $12,240 × 0.30 = $3,672/month
│
Fallback to On-Demand:
├── 10% interruption rate (estimate)
├── Additional On-Demand cost: $1,224/month
│
Total: $4,896/month
Savings: $12,240 - $4,896 = $7,344/month (60% reduction)

Implementation:
- Implement checkpointing every 30 minutes
- Use spot interruption handler (2-min warning)
- Spot Fleet with capacity-optimized allocation strategy
```

**3. Data Analytics Optimization:**

**Current Cost:**
```
50 × r5.4xlarge × $1.008/hr × 365 hr/month = $18,396/month
```

**Optimized Architecture:**
```
Scheduled instances with Auto Scaling:
├── Stop instances during off-hours (12 hrs/day)
├── Use Graviton3 instances (r6g.4xlarge) for 20% better price-performance
│   └── r6g.4xlarge: $0.806/hr (20% cheaper + better performance)
│
Cost: 50 × $0.806/hr × 365 hr/month = $14,710/month
Savings: $18,396 - $14,710 = $3,686/month (20% reduction)

Additional optimization:
- Use Spot Instances for fault-tolerant analytics jobs
- Could reduce to $7,355/month (additional 50% savings)
- Total potential: $11,041/month savings
```

**4. Database Optimization:**

**Current Cost (estimate):**
```
Aurora MySQL:
├── db.r5.2xlarge primary: $0.48/hr × 730 = $350/month
├── 10 × db.r5.2xlarge replicas: $0.48/hr × 730 × 10 = $3,504/month
└── Storage: 5 TB × $0.10/GB = $500/month
Total: $4,354/month
```

**Optimized Architecture:**
```
Aurora Serverless v2 for read replicas:
├── Primary: db.r5.2xlarge (keep reserved)
│   └── 3-year RI: $0.48 × 0.40 = $0.192/hr
│   └── Cost: $140/month
│
├── Read Replicas: Aurora Serverless v2
│   └── Auto-scale based on load (0.5 ACU to 32 ACU)
│   └── Average: 5 ACU × 10 replicas = 50 ACU
│   └── Cost: 50 ACU × $0.12/hr × 730 = $4,380/month
│   └── But utilization is variable - actual: ~$2,500/month
│
└── Storage: Same ($500/month)

Total: $3,140/month
Savings: $4,354 - $3,140 = $1,214/month (28% reduction)

Note: Aurora Serverless v2 scales to zero during low usage
```

**5. Storage Optimization:**

**Current Cost:**
```
500 TB in S3 Standard:
500,000 GB × $0.023/GB = $11,500/month
```

**Optimized Architecture:**
```
S3 Intelligent-Tiering (80% not accessed for 90+ days):
├── Frequently accessed (20%): 100 TB × $0.023 = $2,300/month
├── Infrequently accessed (moves after 30 days): 200 TB × $0.0125 = $2,500/month
├── Archive (moves after 90 days): 200 TB × $0.004 = $800/month
└── Monitoring fee: 500 TB × $0.0025 = $1,250/month

Total: $6,850/month
Savings: $11,500 - $6,850 = $4,650/month (40% reduction)

Implementation:
- Enable S3 Intelligent-Tiering on all buckets
- Lifecycle policy: Move to Intelligent-Tiering immediately
- No changes to application required
```

**Total Monthly Savings:**

| Component | Current | Optimized | Savings | % Reduction |
|-----------|---------|-----------|---------|-------------|
| Web Servers | $61,594 | $27,955 | $33,639 | 55% |
| Batch Processing | $12,240 | $4,896 | $7,344 | 60% |
| Data Analytics | $18,396 | $7,355 | $11,041 | 60% |
| Database | $4,354 | $3,140 | $1,214 | 28% |
| Storage | $11,500 | $6,850 | $4,650 | 40% |
| **Compute Total** | **$108,084** | **$50,196** | **$57,888** | **54%** |

**Total Organization ($800K spend, 80% EC2 = $640K EC2):**
```
EC2 Optimization: $57,888/month savings
Other services (20% of $800K): Assume 15% optimization = $24,000/month

Total Savings: $81,888/month
Annual Savings: $982,656
Percentage Reduction: 10.2%

To reach 40% target ($320K savings):
Additional optimizations needed:
- Right-size remaining EC2 instances (Compute Optimizer): $50K/month
- Delete unused resources (EBS volumes, snapshots, EIPs): $20K/month
- Network optimization (VPC endpoints, CloudFront): $30K/month
- Review Lambda, data transfer, other services: $40K/month

Achievable Total: $220K/month (27.5% reduction)
```

**Recommended Approach to Reach 40%:**
1. Implement above optimizations (27.5%)
2. Application re-architecture:
   - Migrate batch processing to Lambda (event-driven)
   - Use ECS Fargate with Spot for analytics
   - Implement caching layer (ElastiCache) to reduce DB reads
   - Move static content to CloudFront
3. Review third-party SaaS alternatives for less-critical workloads

### Key Exam Insights

**Why This Solution Works:**
1. **Matches commitments to baseline:** Savings Plans for 24/7 web servers
2. **Spot for fault-tolerant:** Batch processing perfect for Spot (70% savings)
3. **Scheduled scaling:** Analytics instances stopped during off-hours
4. **Serverless for variable load:** Aurora Serverless v2 for read replicas
5. **S3 Intelligent-Tiering:** Automatic cost optimization without application changes

**Common Mistakes:**
- Buying RIs for variable workloads (Spot better for batch)
- Not considering Graviton instances (20% better price-performance)
- Using S3 Glacier Flexible instead of Intelligent-Tiering (requires app changes)
- Committing to 3-year RIs for unpredictable workloads (use Savings Plans)
- Not stopping development resources after hours

---

## Scenario 4: SCPs Not Working as Expected

### Question

A security team applied the following SCP to the Production OU but developers can still launch expensive GPU instances:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "ec2:RunInstances",
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "ec2:InstanceType": [
            "p3.*",
            "p4.*",
            "g4dn.*"
          ]
        }
      }
    }
  ]
}
```

**What's wrong? How do you fix it?**

### Solution

**Problems:**

1. **FullAWSAccess Policy Still Attached:**
   - If FullAWSAccess SCP is also attached, it allows all actions
   - SCPs work with AND logic - ALL attached SCPs must allow
   - This SCP denies, but FullAWSAccess allows = net result is ALLOW

2. **Implicit Allow in Root:**
   - If SCP attached only to OU, not to root, account could be moved

3. **Service Role May Be Excluded:**
   - SCP should exclude service roles if they need to launch instances

**Corrected Implementation:**

**Step 1: Remove FullAWSAccess from Production OU**
```
Production OU:
├── Remove: FullAWSAccess (AWS managed policy)
└── Attach: Custom "DenyExpensiveInstances" SCP
```

**Step 2: Use Deny-List Approach**
Create a baseline allow policy plus deny policy:

**AllowList SCP (attached to Production OU):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}
```

**DenyExpensiveInstances SCP (also attached to Production OU):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyExpensiveGPUInstances",
      "Effect": "Deny",
      "Action": "ec2:RunInstances",
      "Resource": "arn:aws:ec2:*:*:instance/*",
      "Condition": {
        "StringLike": {
          "ec2:InstanceType": [
            "p3.*",
            "p4.*",
            "g4dn.*",
            "g5.*"
          ]
        },
        "StringNotEquals": {
          "aws:PrincipalArn": [
            "arn:aws:iam::*:role/MLTrainingRole"
          ]
        }
      }
    }
  ]
}
```

**Step 3: Test**
```bash
# Test as developer (should fail)
aws ec2 run-instances \
  --instance-type p3.2xlarge \
  --image-id ami-12345678

# Error: You are not authorized to launch instances with instance type p3.2xlarge

# Test as MLTrainingRole (should succeed - excluded from deny)
aws sts assume-role --role-arn arn:aws:iam::123456789012:role/MLTrainingRole
aws ec2 run-instances --instance-type p3.2xlarge --image-id ami-12345678
# Success
```

**Step 4: Monitor Compliance**
```
AWS Config Rule:
├── Rule: approved-ec2-instance-types
├── Allowed types: t3.*, m5.*, c5.*
└── Automated remediation: Terminate non-compliant instances

CloudWatch Alarm:
├── Metric: Unauthorized API calls (CloudTrail)
├── Filter: ec2:RunInstances with error "AccessDenied"
└── SNS notification to security team
```

### Key Exam Insights

**SCP Evaluation Logic:**
```
Final Permission = Identity Policy ∩ SCP1 ∩ SCP2 ∩ ... ∩ SCPn

Where ∩ means AND (intersection)
All must allow for action to be permitted
Any explicit deny = final deny
```

**Troubleshooting SCPs:**
1. Check all attached SCPs (not just one)
2. Verify FullAWSAccess not attached if using denies
3. Test with IAM policy simulator
4. Use CloudTrail to see SCP evaluation results
5. Check SCP inheritance (OU → child OU → account)

**Common Mistakes:**
- Attaching both FullAWSAccess and deny SCPs (allow wins)
- Forgetting to exclude service roles from denies
- Applying SCP to wrong OU level
- Not understanding AND logic of multiple SCPs
- Using Allow instead of Deny for restrictions

---

## Summary: Key Exam Patterns

### Pattern Recognition

**When you see these keywords in a question:**

| Keyword/Phrase | Think... |
|----------------|----------|
| "cannot be disabled by member accounts" | Organization Trail (not individual trails) |
| "overlapping IP addresses" | PrivateLink (not VPC Peering or Transit Gateway) |
| "99.99% availability" | Multi-AZ minimum, likely Multi-Region |
| "sub-second RPO" | Aurora Global Database or DynamoDB Global Tables |
| "all traffic must be inspected" | Centralized Inspection VPC + Transit Gateway |
| "cannot exceed budget" | Budget Actions with SCPs or IAM policies |
| "automatically rotate credentials" | Secrets Manager (not Parameter Store) |
| "lowest cost for archival" | S3 Glacier Deep Archive |
| "cross-region encryption" | KMS multi-region keys or cross-account key policies |
| "temporary credentials" | STS, IAM roles, not access keys |
| "centralized DNS" | Route 53 Resolver with inbound/outbound endpoints |
| "prevent data exfiltration" | SCPs denying external principals, VPC endpoints |
| "least operational overhead" | Managed services, automation |
| "most cost-effective" | Serverless, Spot, Savings Plans |

### Decision Frameworks

**Multi-Account Network Connectivity:**
```
2-5 accounts → VPC Peering
5-50 accounts → Transit Gateway (shared via RAM)
50+ accounts → Transit Gateway + Shared VPC pattern
Need service-level access → PrivateLink
Need inspection → Transit Gateway + Inspection VPC
```

**Disaster Recovery:**
```
RTO >24hr, RPO >24hr → Backup/Restore
RTO hours, RPO hours → Pilot Light
RTO minutes, RPO minutes → Warm Standby
RTO seconds, RPO seconds → Active-Active (Multi-Region)
```

**Cost Optimization:**
```
Baseline 24/7 workload → Savings Plans / Reserved Instances
Variable workload → Savings Plans (more flexible than RIs)
Fault-tolerant batch → Spot Instances (70% savings)
Unpredictable → On-Demand (no commitment)
Archive storage → S3 Intelligent-Tiering or Glacier
```

**Security:**
```
Multi-account guardrails → SCPs
Cross-account access → IAM roles with trust policies
Rotate credentials → Secrets Manager
Encryption at rest → KMS with automatic rotation
Threat detection → GuardDuty (delegated admin)
Compliance checking → Config with aggregator
```

---

**Next Steps:**
- Create practice questions for Domain 1
- Review all tricky scenarios multiple times
- Practice drawing architecture diagrams
- Time yourself on scenario questions (3-4 minutes each)
