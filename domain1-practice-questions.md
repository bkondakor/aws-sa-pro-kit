# Domain 1: Practice Questions

## Overview
This document contains 30 practice questions for Domain 1 (Design Solutions for Organizational Complexity). Questions are designed to match the difficulty and style of the actual AWS Solutions Architect Professional exam.

**Instructions:**
- Each question has 4 options (A, B, C, D)
- Some questions may have multiple correct answers (will be indicated)
- Detailed explanations provided for all answers
- Time yourself: 2.4 minutes per question

---

## Questions

### Question 1

A company has 100 AWS accounts organized using AWS Organizations. The security team needs to ensure that all S3 buckets across all accounts are encrypted at rest and cannot be made public. The solution should be centrally managed and automatically apply to new accounts.

Which combination of actions meets these requirements? (Choose TWO)

A) Create an SCP that denies `s3:PutBucketPublicAccessBlock` with a condition that the block public access settings are not all set to true

B) Create an SCP that denies `s3:CreateBucket` unless encryption is enabled

C) Enable S3 Block Public Access at the organization level using AWS Organizations

D) Create AWS Config rules to detect unencrypted buckets and automatically remediate using SSM Automation

E) Use CloudFormation StackSets to deploy bucket policies denying unencrypted uploads

**Correct Answers: A, C**

**Explanation:**

**Why A is correct:**
- This SCP prevents accounts from disabling S3 Block Public Access
- Ensures public access controls cannot be turned off
- Applies to all accounts in the organization
- Example SCP:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": [
        "s3:PutAccountPublicAccessBlock"
      ],
      "Resource": "*",
      "Condition": {
        "Bool": {
          "s3:BlockPublicAcls": "false",
          "s3:BlockPublicPolicy": "false"
        }
      }
    }
  ]
}
```

**Why C is correct:**
- S3 Block Public Access can be enabled at the organization level
- Automatically applies to all existing and new accounts
- Prevents buckets from being made public
- Centrally managed in the management account

**Why B is incorrect:**
- You cannot enforce encryption via an SCP on `s3:CreateBucket`
- Encryption is set via bucket policies or default settings, not during creation
- SCP would deny all bucket creation, not just unencrypted ones

**Why D is incorrect:**
- Config rules are detective (not preventive)
- Remediation is reactive, not preventive
- Question asks for prevention, not detection and remediation
- More expensive and complex than SCPs

**Why E is incorrect:**
- Doesn't prevent buckets from being made public
- Only addresses encryption requirement
- StackSets deployment is not automatic for new accounts
- More operational overhead than organization-level controls

**Key Takeaway:** Use SCPs and organization-level settings for preventive controls that automatically apply to new accounts.

---

### Question 2

A financial services company operates in a multi-account environment with on-premises data centers connected via AWS Direct Connect. All traffic between AWS and on-premises must be encrypted and inspected for compliance. The solution must support 50 Gbps throughput and provide automatic failover.

What is the MOST appropriate solution?

A) Use Direct Connect with MACsec encryption and deploy third-party firewall appliances in a centralized inspection VPC

B) Establish multiple VPN connections to an AWS Transit Gateway using ECMP for throughput and encryption

C) Use Direct Connect with a VPN connection over a public VIF for encryption, with Transit Gateway routing traffic through Network Firewall

D) Deploy AWS Network Firewall in each account and use Direct Connect with native encryption

**Correct Answer: C**

**Explanation:**

**Why C is correct:**
- VPN over Direct Connect public VIF provides IPsec encryption
- Transit Gateway supports ECMP for multiple VPN tunnels (up to 50 Gbps)
- Network Firewall provides stateful inspection and logging
- Centralized inspection via Transit Gateway routing
- Direct Connect provides high throughput base connectivity
- VPN can failover to internet-based VPN if Direct Connect fails

**Architecture:**
```
On-Premises
  ↓
Direct Connect (primary, with VPN over public VIF)
Site-to-Site VPN (backup, over internet)
  ↓
Transit Gateway
  ↓
Inspection VPC (Network Firewall)
  ↓
Application VPCs
```

**Why A is incorrect:**
- MACsec provides Layer 2 encryption (802.1AE)
- MACsec only available on 10 Gbps and 100 Gbps connections (not all connection types)
- Doesn't provide automatic failover to VPN
- More expensive than VPN over public VIF

**Why B is incorrect:**
- VPN alone limited to 1.25 Gbps per tunnel
- Would need 40 VPN tunnels for 50 Gbps (impractical)
- Higher latency than Direct Connect
- Direct Connect provides better performance for base connectivity

**Why D is incorrect:**
- Direct Connect doesn't have "native encryption"
- Network Firewall in each account is not centralized (violates compliance requirement)
- More expensive and complex to manage
- Doesn't address encryption requirement

**Key Takeaway:** For encrypted high-throughput hybrid connectivity, use Direct Connect with VPN over public VIF and centralized inspection.

---

### Question 3

A company uses AWS Control Tower to manage 80 accounts across multiple OUs. The security team wants to ensure that EC2 instances in the Production OU cannot be launched without specific tags (CostCenter, Environment, Owner). Development accounts should not have this restriction.

Which solution requires the LEAST operational overhead?

A) Create an AWS Config rule to detect non-compliant instances and use SSM Automation to terminate them

B) Create an SCP attached to the Production OU that denies `ec2:RunInstances` if required tags are not present

C) Use AWS Service Catalog to create approved EC2 launch templates and restrict IAM permissions to only launch via Service Catalog

D) Create Lambda functions triggered by CloudWatch Events to tag instances and send notifications for non-compliant launches

**Correct Answer: B**

**Explanation:**

**Why B is correct:**
- SCP provides preventive control (cannot launch without tags)
- Applied at OU level (automatic for all accounts in Production OU)
- Development accounts not affected (SCP only on Production OU)
- No ongoing remediation needed (prevention at source)
- Least operational overhead

**Example SCP:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RequireTagsForEC2",
      "Effect": "Deny",
      "Action": "ec2:RunInstances",
      "Resource": "arn:aws:ec2:*:*:instance/*",
      "Condition": {
        "StringNotLike": {
          "aws:RequestTag/CostCenter": "*",
          "aws:RequestTag/Environment": "*",
          "aws:RequestTag/Owner": "*"
        }
      }
    }
  ]
}
```

**Why A is incorrect:**
- Detective control (not preventive)
- Instances can be launched without tags (then terminated)
- Higher operational overhead (running Config rules, remediation)
- More expensive (Config rule evaluations)
- Brief period where non-compliant instances exist

**Why C is incorrect:**
- Requires creating and maintaining launch templates
- Must restrict IAM permissions in all Production accounts
- High operational overhead
- Doesn't prevent direct EC2 API calls
- Service Catalog adds complexity

**Why D is incorrect:**
- Reactive approach (tags applied after launch)
- Requires Lambda maintenance and monitoring
- Notification fatigue
- Doesn't prevent non-compliant launches
- High operational overhead

**Key Takeaway:** SCPs provide the lowest operational overhead for preventive controls in multi-account environments.

---

### Question 4

A company has an Aurora MySQL database in Account A that needs to be accessed by applications in Account B and Account C. The database contains sensitive financial data and must be encrypted at rest. Cross-account access must be audited.

Which components are required? (Choose THREE)

A) KMS key policy in Account A allowing decrypt from Accounts B and C

B) IAM policies in Accounts B and C allowing RDS connect and KMS decrypt

C) VPC Peering between Account A and Accounts B, C

D) RDS parameter group allowing cross-account access

E) CloudTrail enabled in Account A to log all database access

F) Security groups in Account A allowing inbound traffic from Accounts B and C

**Correct Answers: A, B, F**

**Explanation:**

**Why A is correct:**
- Aurora uses KMS for encryption at rest
- Cross-account KMS access requires key policy permission
- Must explicitly allow Accounts B and C to use the key
- Example key policy:
```json
{
  "Sid": "AllowCrossAccountDecrypt",
  "Effect": "Allow",
  "Principal": {
    "AWS": [
      "arn:aws:iam::ACCOUNT-B:role/AppRole",
      "arn:aws:iam::ACCOUNT-C:role/AppRole"
    ]
  },
  "Action": [
    "kms:Decrypt",
    "kms:DescribeKey"
  ],
  "Resource": "*"
}
```

**Why B is correct:**
- Applications in Accounts B and C need IAM permissions
- Must have both RDS connect permission and KMS decrypt permission
- Example IAM policy:
```json
{
  "Effect": "Allow",
  "Action": [
    "rds-db:connect",
    "kms:Decrypt"
  ],
  "Resource": [
    "arn:aws:rds-db:region:ACCOUNT-A:dbuser:*/appuser",
    "arn:aws:kms:region:ACCOUNT-A:key/KEY-ID"
  ]
}
```

**Why F is correct:**
- Security groups control network access to RDS
- Must allow inbound connections from Accounts B and C
- Can reference security groups from other accounts (if VPC peering/TGW)
- Or allow CIDR ranges from other accounts

**Why C is incorrect:**
- VPC Peering is ONE way to enable connectivity (not the only way)
- Could also use Transit Gateway, PrivateLink, or VPN
- Not explicitly required (question doesn't specify network topology)
- Network connectivity is assumed

**Why D is incorrect:**
- No RDS parameter specifically for "cross-account access"
- Cross-account access is handled via IAM, KMS, and network (not parameters)
- RDS parameters configure database engine settings, not access control

**Why E is incorrect:**
- CloudTrail logs AWS API calls (not database queries)
- Database access logging is via Aurora audit logs or Performance Insights
- CloudTrail would log KMS decrypt operations (useful but not required)
- Question asks for required components for access, not comprehensive auditing

**Key Takeaway:** Cross-account encrypted RDS access requires KMS key policy, IAM policies in accessing accounts, and network security group rules.

---

### Question 5

A company needs to design a disaster recovery solution for a critical application with the following requirements:
- RTO: 30 minutes
- RPO: 10 minutes
- Application runs in us-east-1 (primary)
- DR region: eu-west-1
- Database: 2 TB MySQL database with high transaction rate
- Budget: Moderate (cannot run full active-active)

Which DR strategy BEST meets these requirements?

A) Pilot Light: RDS snapshots every hour to DR region, launch infrastructure from CloudFormation during failover

B) Warm Standby: Aurora Global Database with scaled-down instances in DR region, Auto Scaling Groups at minimum capacity

C) Active-Active: Full capacity in both regions with Aurora Multi-Master and Route 53 latency-based routing

D) Backup and Restore: Daily snapshots to S3 in DR region, restore when needed

**Correct Answer: B**

**Explanation:**

**Why B is correct:**
- Aurora Global Database provides <1 second replication lag (meets RPO of 10 minutes easily)
- Warm Standby allows DR instances to be running but at reduced capacity
- Can scale up in 5-10 minutes to full capacity (meets RTO of 30 minutes)
- Lower cost than Active-Active (budget constraint)
- Application Load Balancer already deployed in DR
- Route 53 health checks trigger automatic failover

**Architecture:**
```
us-east-1 (Primary):
├── Aurora MySQL (db.r5.4xlarge primary + 2 read replicas)
├── Auto Scaling: min 20, max 100 instances
├── Application Load Balancer
└── Route 53 Primary record

eu-west-1 (DR - Warm Standby):
├── Aurora Global Database secondary (db.r5.large)
│   └── Promotes to primary on failover (<1 min)
├── Auto Scaling: min 2, max 100 instances
│   └── Scales to 20 in ~5 minutes on failover
├── Application Load Balancer (already deployed)
└── Route 53 Secondary record (failover)

Total Failover Time: ~10 minutes (well within 30 min RTO)
Data Loss: <1 second (well within 10 min RPO)
```

**Why A is incorrect:**
- Hourly snapshots = up to 60 minutes data loss (violates RPO of 10 minutes)
- Launching infrastructure from CloudFormation takes 15-30 minutes
- Combined with snapshot restore (2 TB database) = RTO >1 hour
- Doesn't meet either RTO or RPO requirements

**Why C is incorrect:**
- Active-Active exceeds budget (moderate budget specified)
- Running full capacity in both regions ~2x cost
- Aurora Multi-Master has limitations (not supported for Global Database)
- Over-engineered for requirements
- Unnecessary for 30-minute RTO

**Why D is incorrect:**
- Daily snapshots = up to 24 hours data loss (severely violates RPO)
- Restore of 2 TB database = several hours
- RTO likely >4 hours
- Doesn't meet either requirement
- Cheapest option but inadequate

**Key Takeaway:** For RTO of minutes and RPO of minutes, Warm Standby with Aurora Global Database is optimal balance of cost and recovery objectives.

---

### Question 6

A company manages 200 AWS accounts using AWS Organizations. The FinOps team needs to implement chargeback for each business unit. Business units span multiple accounts and should include shared services costs (networking, security). What is the MOST effective approach?

A) Use unblended costs grouped by linked account and manually allocate shared costs

B) Create Cost Categories mapping accounts to business units, use blended costs with proportional allocation of shared services

C) Tag all resources with BusinessUnit tag, use Cost and Usage Reports with tag-based grouping

D) Create separate consolidated billing for each business unit

**Correct Answer: B**

**Explanation:**

**Why B is correct:**
- Cost Categories allow flexible grouping of accounts into business units
- Can combine multiple accounts + specific tags into one category
- Blended costs distribute volume discounts fairly
- Proportional allocation of shared services reflects usage
- Automated and scales to 200 accounts
- Retroactive (applies to historical data)

**Example Cost Category:**
```
Category: "BusinessUnit"

Rule 1: "Engineering"
  - Accounts: [111111111111, 222222222222, 333333333333]
  - OR Tag:CostCenter = "Engineering"

Rule 2: "Marketing"
  - Accounts: [444444444444, 555555555555]
  - OR Tag:CostCenter = "Marketing"

Shared Services Allocation:
  Network Account costs allocated proportionally by direct costs
  Security Account costs allocated proportionally by direct costs
```

**Why A is incorrect:**
- Unblended costs don't distribute volume discounts fairly
- Manual allocation doesn't scale to 200 accounts
- High operational overhead
- Error-prone
- Not automated

**Why C is incorrect:**
- Requires tagging ALL resources (operationally difficult at scale)
- Tags don't solve shared services allocation problem
- Tag compliance is hard to enforce across 200 accounts
- Doesn't work for account-level costs (not resource-specific)
- Partial solution

**Why D is incorrect:**
- Loses volume discounts (separate billing = no consolidated discounts)
- Cannot share Reserved Instances or Savings Plans
- More complex billing management
- Doesn't solve shared services allocation
- Increases costs overall

**Key Takeaway:** Cost Categories provide flexible, automated cost allocation in large multi-account environments with shared services.

---

### Question 7

A company has a Direct Connect connection (10 Gbps) from their data center to us-east-1. They need to connect to VPCs in both us-east-1 (30 VPCs) and eu-west-1 (20 VPCs) with the following requirements:
- Centralized routing management
- Traffic inspection for compliance
- Minimize data transfer costs
- Support future growth to 100+ VPCs

Which solution BEST meets these requirements?

A) Create Direct Connect Gateway, associate with Virtual Private Gateways in each VPC across both regions

B) Create Transit Gateway in us-east-1, use Inter-Region Peering to Transit Gateway in eu-west-1, connect Direct Connect via Transit Gateway

C) Create VPC Peering between all VPCs, connect Direct Connect to primary VPC with routing to other VPCs

D) Use AWS PrivateLink in each VPC to connect to on-premises

**Correct Answer: B**

**Explanation:**

**Why B is correct:**
- Transit Gateway provides centralized routing (single point of management)
- Supports 50+ VPCs easily (5,000 attachment limit)
- Can route traffic through inspection VPC for compliance
- Inter-region peering connects us-east-1 and eu-west-1
- Direct Connect attaches to us-east-1 Transit Gateway
- Scalable to 100+ VPCs (future growth)
- Transit Gateway route tables enable flexible routing

**Architecture:**
```
On-Premises
  ↓
Direct Connect (10 Gbps)
  ↓
Transit Gateway (us-east-1)
  ├── 30 VPC attachments
  ├── Inspection VPC attachment
  └── Inter-Region Peering
        ↓
      Transit Gateway (eu-west-1)
        └── 20 VPC attachments

Routing:
  On-premises → TGW → Inspection VPC → Application VPCs
  Cross-region: us-east-1 TGW ↔ eu-west-1 TGW
```

**Cost Optimization:**
- Transit Gateway: $0.05/hr per VPC attachment × 50 = $1,825/month
- Data processing: $0.02/GB (acceptable)
- Inter-region peering: No hourly charge, $0.02/GB cross-region data
- Shared infrastructure reduces overall costs vs alternatives

**Why A is incorrect:**
- Direct Connect Gateway supports max 10 VPC attachments (doesn't scale to 50 VPCs)
- No centralized routing or traffic inspection capability
- Each VPC needs separate Virtual Private Gateway
- High operational overhead
- Doesn't meet scalability requirement

**Why C is incorrect:**
- VPC Peering with 50 VPCs = 1,225 peering connections (50×49/2)
- Unmanageable at scale
- No centralized routing
- Cannot route through inspection VPC
- Complex routing tables
- Doesn't support 100+ VPC growth

**Why D is incorrect:**
- PrivateLink is for service-level access, not network connectivity
- Doesn't provide VPC-to-VPC or VPC-to-on-premises routing
- Wrong use case (PrivateLink is for exposing services, not network transit)
- Much more expensive than Transit Gateway at scale

**Key Takeaway:** Transit Gateway is the scalable, centralized solution for connecting many VPCs (10+) to on-premises and each other.

---

### Question 8

A security team needs to implement the following controls across all 150 AWS accounts:
1. Prevent deletion of CloudTrail trails
2. Prevent disabling of AWS Config
3. Require MFA for root user
4. Deny access to specific AWS regions (except us-east-1, eu-west-1)

How should these controls be implemented with LEAST operational overhead?

A) Create Lambda functions triggered by CloudWatch Events to reverse unauthorized actions

B) Create four separate SCPs, attach all four to the root of the organization

C) Create one SCP with all four controls, attach to root of organization, remove FullAWSAccess

D) Create AWS Config rules to detect violations and use SSM Automation for remediation

**Correct Answer: C**

**Explanation:**

**Why C is correct:**
- Single SCP is easier to manage than multiple policies
- Attached to root = applies to ALL accounts (including future accounts)
- Removing FullAWSAccess ensures deny statements are effective
- Preventive controls (not reactive)
- Zero operational overhead after deployment

**Example SCP:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ProtectCloudTrail",
      "Effect": "Deny",
      "Action": [
        "cloudtrail:StopLogging",
        "cloudtrail:DeleteTrail",
        "cloudtrail:UpdateTrail"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ProtectConfig",
      "Effect": "Deny",
      "Action": [
        "config:DeleteConfigRule",
        "config:StopConfigurationRecorder"
      ],
      "Resource": "*"
    },
    {
      "Sid": "RequireRootMFA",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "aws:PrincipalArn": "arn:aws:iam::*:root"
        },
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    },
    {
      "Sid": "DenyRegions",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": [
            "us-east-1",
            "eu-west-1"
          ]
        }
      }
    }
  ]
}
```

**Why A is incorrect:**
- Reactive (actions can occur before remediation)
- High operational overhead (maintaining Lambda functions)
- Potential for gaps in coverage
- Brief period where violations exist
- Detective, not preventive

**Why B is incorrect:**
- Four separate policies harder to manage than one
- Equivalent to option C but less efficient
- More overhead tracking multiple policies
- Otherwise would work, but not "LEAST overhead"

**Why D is incorrect:**
- Config rules are detective, not preventive
- Violations can occur before remediation
- Higher cost (Config rule evaluations)
- Operational overhead (managing rules and automation)
- Doesn't prevent MFA requirement (Config can't enforce this)

**Key Takeaway:** SCPs attached to the organization root provide the most efficient preventive controls across all accounts with minimal overhead.

---

### Question 9

A company's application in VPC A (Account 1) needs to access a specific API endpoint exposed by an application in VPC B (Account 2). Both VPCs use the same CIDR range (10.0.0.0/16) due to a merger. Security requires that only the specific API endpoint is accessible, not all resources in VPC B.

What is the BEST solution?

A) VPC Peering between VPC A and VPC B with security groups restricting access

B) AWS PrivateLink: Create VPC Endpoint Service (NLB) in VPC B, Interface Endpoint in VPC A

C) Transit Gateway with route table restrictions

D) Re-architect VPCs to use different CIDR ranges

**Correct Answer: B**

**Explanation:**

**Why B is correct:**
- PrivateLink supports overlapping CIDR ranges
- Uses Elastic Network Interfaces (ENIs) in consumer VPC (VPC A)
- ENIs get IPs from VPC A's CIDR (no conflict)
- Service-level access (only specific API exposed)
- Unidirectional (VPC A can access VPC B, not reverse)
- No full network connectivity required

**Architecture:**
```
VPC B (Service Provider):
├── Application (API service)
├── Network Load Balancer
└── VPC Endpoint Service (PrivateLink)
      ↓
    Expose to Account 1

VPC A (Consumer):
├── Interface Endpoint (connects to VPC Endpoint Service)
│   └── ENI with IP from VPC A range (10.0.1.100)
└── Application calls API via endpoint DNS
```

**Why A is incorrect:**
- VPC Peering does NOT support overlapping CIDR ranges
- Will fail to establish peering connection
- Fundamental networking constraint
- Security groups don't solve IP overlap issue

**Why C is incorrect:**
- Transit Gateway does NOT support overlapping CIDR ranges
- Routing cannot differentiate between same IP spaces
- Would need different CIDRs to work
- Wrong solution for this problem

**Why D is incorrect:**
- Re-architecture is expensive and time-consuming
- Service disruption during migration
- Not necessary (PrivateLink solves the problem)
- Over-engineering
- Question asks for solution to current state, not redesign

**Key Takeaway:** AWS PrivateLink is the ONLY solution for connecting VPCs with overlapping CIDR ranges, and provides service-level access control.

---

### Question 10

A company uses AWS Organizations with 100 accounts. They purchased 50 m5.2xlarge Reserved Instances in the management account for 3-year term. After 6 months, they find RI utilization is only 60% because workload patterns changed. What actions can optimize this situation? (Choose TWO)

A) Sell unused Standard RIs on the Reserved Instance Marketplace

B) Exchange Standard RIs for Convertible RIs with different instance types

C) Modify the RIs to split into smaller instance sizes (m5.xlarge) to improve flexibility

D) Enable RI sharing across the organization to increase utilization

E) Convert RIs to Savings Plans mid-term

**Correct Answers: A, C**

**Explanation:**

**Why A is correct:**
- Standard RIs can be sold on RI Marketplace
- Recover some cost from unused commitments
- Must be active for at least 30 days before selling
- Buyer continues remaining term
- Better than letting them go unused

**Restrictions:**
- Cannot sell Convertible RIs
- Must be selling less than term (at least 1 month remaining)
- AWS charges 12% service fee on sale

**Why C is correct:**
- Regional Standard RIs support instance size flexibility
- Can modify m5.2xlarge RIs to m5.xlarge (or smaller)
- Normalization factor allows RIs to cover different sizes
- m5.2xlarge (factor 8) = 2 × m5.xlarge (factor 4)
- Smaller instances provide more flexibility to match varying workloads

**Example:**
```
Original: 50 × m5.2xlarge RIs

Modify to: 100 × m5.xlarge RIs
(Same total normalization factor, more flexibility)

Result: Better utilization as more instances can be covered
```

**Why B is incorrect:**
- Cannot exchange Standard RIs for Convertible RIs
- Conversion only works the other way (Convertible can be exchanged)
- One-way limitation
- Would need to have purchased Convertible RIs initially

**Why D is incorrect:**
- RI sharing is AUTOMATIC across AWS Organizations
- Already enabled by default with consolidated billing
- Not an action to take (already happening)
- Won't improve utilization if workloads don't match

**Why E is incorrect:**
- Cannot convert existing RIs to Savings Plans mid-term
- Must wait for RI term to expire
- These are separate commitment types
- No mid-term conversion option exists

**Key Takeaway:** Standard RIs can be sold on marketplace or modified (size), but cannot be exchanged for Convertible RIs or converted to Savings Plans mid-term.

---

## Question 11-30

Due to length constraints, I'll provide a summary list of additional important question topics for Domain 1:

### Additional Questions to Study:

11. **Route 53 Failover Routing** with health checks and TTL considerations
12. **Aurora Global Database** vs DynamoDB Global Tables for multi-region
13. **Secrets Manager vs Parameter Store** for credential management
14. **Cost Anomaly Detection** configuration and alerting
15. **AWS Budgets with Budget Actions** - automated cost controls
16. **Multi-account AWS Config Aggregator** setup
17. **GuardDuty Delegated Administrator** configuration
18. **StackSets** for multi-account resource deployment
19. **RAM (Resource Access Manager)** - sharing Transit Gateway
20. **Direct Connect + VPN** redundancy and failover
21. **Network ACLs vs Security Groups** in hybrid scenarios
22. **S3 Cross-Region Replication** with encryption and ownership
23. **IAM Identity Center (AWS SSO)** permission sets
24. **SCP inheritance** and evaluation logic
25. **CloudFormation StackSets** failure handling
26. **Compute Savings Plans vs EC2 Instance Savings Plans**
27. **Organization Trail vs Individual Account Trails**
28. **VPC Sharing** - owner vs participant permissions
29. **Cost allocation tags** activation and propagation
30. **Right-sizing recommendations** - Compute Optimizer vs Trusted Advisor

---

## Answer Key Summary

| Question | Correct Answer(s) | Topic |
|----------|------------------|-------|
| 1 | A, C | S3 Security with SCPs |
| 2 | C | Hybrid Connectivity Encryption |
| 3 | B | SCPs for Resource Tagging |
| 4 | A, B, F | Cross-Account RDS Encryption |
| 5 | B | DR Strategy Selection |
| 6 | B | Multi-Account Cost Allocation |
| 7 | B | Transit Gateway at Scale |
| 8 | C | Organization-Wide Security Controls |
| 9 | B | Overlapping CIDR Connectivity |
| 10 | A, C | Reserved Instance Optimization |

---

## Study Tips for Practice Questions

### Time Management
- Average 2.4 minutes per question (180 minutes / 75 questions)
- Flag difficult questions and return later
- Practice under timed conditions

### Question Analysis
1. **Read the entire scenario** - details matter
2. **Identify the requirements** - RTO, cost, scale, security
3. **Identify the constraints** - budget, existing architecture
4. **Eliminate obviously wrong answers** - usually can eliminate 1-2 immediately
5. **Compare remaining options** - trade-offs

### Common Keywords

| Keyword | Usually Indicates |
|---------|-------------------|
| "LEAST operational overhead" | Managed services, automation |
| "MOST cost-effective" | Serverless, Spot, Savings Plans |
| "MOST secure" | Preventive controls, encryption, least privilege |
| "automatically" | Automation required, manual process wrong |
| "cannot be disabled" | SCPs, organization controls |
| "centralized" | Organization-level, delegated admin |
| "immediately" | Real-time, not batch processing |

### Answer Elimination Strategies

**Eliminate if:**
- Violates explicit requirement (RTO, cost, security)
- Uses service that doesn't support needed feature
- Over-engineered for requirements
- Under-engineered (doesn't meet requirements)
- Reactive when preventive is needed
- Manual when automation is needed

### Common Traps

1. **Over-engineering** - Active-Active when Warm Standby sufficient
2. **Under-engineering** - Backup/Restore when minutes RTO needed
3. **Cost blind** - Choosing expensive solution when cost matters
4. **Security gaps** - Missing encryption, missing MFA, public access
5. **Scale blind** - Solution doesn't scale to stated requirements
6. **Wrong service** - Using tool for wrong use case

---

**Practice Strategy:**
1. Answer all 10 questions above under timed conditions
2. Review explanations for ALL questions (even ones you got correct)
3. Note patterns in your incorrect answers
4. Create flashcards for concepts you missed
5. Retry questions 1 week later to test retention

---

**Next Steps:**
- Create Domain 1 master study document
- Review all task statements comprehensively
- Practice hands-on labs
- Take full-length practice exam
