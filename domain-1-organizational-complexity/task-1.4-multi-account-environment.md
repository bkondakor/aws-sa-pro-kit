---
title: "Task 1.4: Design a Multi-Account AWS Environment"
domain: 1
domain_name: "Design Solutions for Organizational Complexity"
task: 1.4
weight: "26%"
exam_topics:
  - organizations
  - control-tower
  - multi-account
  - scp
  - sso
  - landing-zone
  - account-factory
  - resource-access-manager
status: complete
last_updated: "2025-11-18"
---

# Task 1.4: Design a Multi-Account AWS Environment

## Overview
Multi-account strategies are fundamental to enterprise AWS architectures. This task covers designing, implementing, and managing complex multi-account environments using AWS Organizations, Control Tower, and related services for governance, security, and operational excellence.

---

## 1. AWS Organizations Fundamentals

### Core Concepts

**What is AWS Organizations?**
Service for centrally managing and governing multiple AWS accounts.

**Key Components:**

**1. Organization**
- Root container for all accounts
- One management account (formerly master account)
- Multiple member accounts

**2. Organizational Units (OUs)**
- Logical containers for accounts
- Hierarchical structure (nested OUs supported)
- Policies inherited from parent OUs

**3. Accounts**
- **Management Account:** Creates organization, manages billing, applies policies
- **Member Accounts:** Standard accounts within organization

**Organization Structure Example:**
```
Root
├── Security OU
│   ├── Security Tooling Account
│   ├── Log Archive Account
│   └── Audit Account
├── Infrastructure OU
│   ├── Network Account
│   └── Shared Services Account
├── Workloads OU
│   ├── Production OU
│   │   ├── Prod App 1 Account
│   │   └── Prod App 2 Account
│   ├── Non-Production OU
│   │   ├── Development Account
│   │   ├── Test Account
│   │   └── Staging Account
└── Suspended OU (for decommissioned accounts)
```

### Policy Types

**1. Service Control Policies (SCPs)**
- Define maximum permissions for accounts/OUs
- Do NOT grant permissions (only limit)
- Attached to root, OUs, or accounts
- Inherited down the hierarchy

**2. Tag Policies**
- Standardize tags across organization
- Define tag keys and allowed values
- Enforce tagging compliance

**3. Backup Policies**
- Centrally manage AWS Backup plans
- Apply to OUs or accounts
- Automatic backup compliance

**4. AI Services Opt-Out Policies**
- Control whether AWS can use content for service improvement
- Applied to AI services (Rekognition, Comprehend, Lex, etc.)

### Consolidated Billing

**Benefits:**
- Single bill for all accounts in organization
- Combined usage for volume discounts
- Reserved Instance and Savings Plans sharing
- Free tier applies to aggregate usage

**Cost Allocation:**
- Cost allocation tags across organization
- Individual account-level cost tracking
- Departmental chargeback reports
- AWS Cost Explorer filters by account/OU

**Billing Features:**
- One payment method for organization
- Detailed billing reports per account
- Volume discount aggregation
- Centralized payment instrument

---

## 2. AWS Control Tower

### What is AWS Control Tower?

**Definition:**
Automated service for setting up and governing secure, multi-account AWS environment based on best practices.

**Key Features (2025):**
- Automated account provisioning (< 30 minutes for landing zone)
- Pre-configured guardrails (preventive and detective)
- Account Factory for standardized account creation
- Centralized dashboard for governance
- Integration with AWS Organizations, Service Catalog, CloudFormation

**Landing Zone Components:**

**1. Foundational Accounts**
- **Management Account:** Organization root, Control Tower deployment
- **Log Archive Account:** Centralized logging (CloudTrail, Config)
- **Audit Account:** Security team access, read-only to all accounts

**2. Organizational Units**
- **Security OU:** Contains Log Archive and Audit accounts
- **Sandbox OU:** Development and experimentation
- **Custom OUs:** Production, Non-Production, Infrastructure (user-defined)

**3. Shared Accounts (Best Practice)**
- **Network Account:** Centralized networking (Transit Gateway, Direct Connect)
- **Shared Services Account:** Common services (AD, DNS, monitoring)
- **Security Tooling Account:** Security services (GuardDuty master, Security Hub)

### Control Tower Guardrails

**Types:**

**1. Mandatory Guardrails**
- Always enabled, cannot be disabled
- Preventive and detective controls
- Examples:
  - Disallow changes to CloudWatch Logs log groups
  - Detect public read access to S3 buckets
  - Disallow deletion of AWS Config aggregation authorizations

**2. Strongly Recommended Guardrails**
- AWS best practices
- Should enable unless specific reason
- Examples:
  - Enable MFA for root user
  - Detect whether MFA is enabled for root user
  - Disallow public write access to S3 buckets

**3. Elective Guardrails**
- Optional based on requirements
- Industry-specific or custom needs
- Examples:
  - Disallow internet connection through RDP
  - Detect whether Amazon EBS volumes are attached to EC2 instances
  - Disallow creation of access keys for root user

**Implementation Methods:**

**Preventive (SCPs):**
- Prevent actions before they occur
- AWS Organizations Service Control Policies
- Cannot be overridden by member accounts
- Example: Prevent region usage, prevent root user actions

**Detective (AWS Config Rules):**
- Detect non-compliant resources
- Run periodically or on configuration change
- Report to Control Tower dashboard
- Example: Detect unencrypted S3 buckets, detect EC2 instances without specific tags

**Proactive (CloudFormation Hooks - 2025)**
- Pre-deployment validation
- Check resources before creation
- Prevent non-compliant infrastructure deployment

### Account Factory

**What it is:**
Automated account provisioning service within Control Tower.

**Features:**
- Standardized account creation (< 30 minutes)
- Pre-configured baseline (CloudTrail, Config, guardrails)
- Customizable network configuration
- Service Catalog integration
- Automated OU assignment

**Account Provisioning Process:**
1. Request account via Service Catalog or API
2. Account Factory creates account in Organization
3. Baseline configuration applied:
   - CloudTrail logging to Log Archive account
   - AWS Config enabled and reporting
   - Guardrails applied based on OU
   - SNS topics for notifications
4. Optional VPC created with specified configuration
5. Account available for use

**Customization:**
- Account Factory Customization (AFC) for additional automation
- CloudFormation StackSets for resource deployment
- Service Catalog products for self-service

**Best Practices:**
- Use Account Factory for all account creation (consistency)
- Automate via API for large-scale provisioning
- Implement approval workflow via Service Catalog
- Tag accounts for organization and cost allocation

---

## 3. Multi-Account Design Patterns

### Account Strategy by Function

**Common Account Patterns:**

**1. Environment-Based Separation**
```
├── Production OU
│   ├── Prod-Application-A
│   ├── Prod-Application-B
│   └── Prod-Application-C
├── Non-Production OU
│   ├── Dev-Application-A
│   ├── Test-Application-A
│   └── Staging-Application-A
```

**Benefits:**
- Clear blast radius (production isolated)
- Different access controls per environment
- Cost allocation by environment
- Compliance boundary

**2. Application/Workload-Based Separation**
```
├── Application-A OU
│   ├── App-A-Production
│   ├── App-A-Development
│   └── App-A-Test
├── Application-B OU
│   ├── App-B-Production
│   ├── App-B-Development
│   └── App-B-Test
```

**Benefits:**
- Team ownership of accounts
- Independent lifecycle management
- Granular cost tracking per application
- Service quotas per application

**3. Functional Account Pattern (Recommended)**
```
Root
├── Core OU
│   ├── Management Account (billing, organization)
│   ├── Log Archive (centralized logging)
│   ├── Audit (security team read-only)
│   ├── Network (Transit Gateway, Direct Connect)
│   └── Shared Services (AD, DNS, patch management)
├── Security OU
│   └── Security Tooling (GuardDuty, Security Hub, Macie)
├── Workloads OU
│   ├── Production OU
│   │   ├── Prod-App-1
│   │   └── Prod-App-2
│   ├── Non-Production OU
│   │   ├── Dev-App-1
│   │   └── Test-App-1
│   └── Sandbox OU (experimentation)
└── Suspended OU (decommissioned accounts)
```

**Why This Pattern:**
- Separates core infrastructure from workloads
- Centralized security and networking
- Flexible workload organization
- Compliance-friendly (security OU isolation)

### Account Sizing Considerations

**One Account per Application vs Shared Accounts:**

**Multiple Applications per Account:**
- **Pros:** Fewer accounts to manage, lower overhead
- **Cons:** Shared service quotas, blast radius, cost allocation complexity

**One Account per Application:**
- **Pros:** Isolated quotas, clear cost attribution, limited blast radius
- **Cons:** More accounts to manage, potential cost overhead

**Recommended Approach:**
- Separate accounts for production vs non-production
- Separate accounts for compliance-regulated workloads
- Shared accounts for similar-security-posture applications in non-prod
- Minimum: 10-15 accounts for small organizations
- Enterprise: 50-200+ accounts typical

**Service Quota Implications:**
- Each account has independent service quotas
- Use multiple accounts to exceed regional quotas
- Example: 5,000 VPCs across 10 accounts = 50,000 total capacity

---

## 4. Resource Sharing with AWS RAM

### AWS Resource Access Manager (RAM)

**What it is:**
Service for securely sharing AWS resources across accounts within organization or externally.

**Shareable Resources (2025):**

**Networking:**
- VPC subnets (shared VPC pattern)
- Transit Gateway attachments
- Route 53 Resolver rules
- Route 53 hosted zones (private)

**Security:**
- License Manager configurations
- Systems Manager documents
- Image Builder components and recipes

**Compute:**
- EC2 Dedicated Hosts
- EC2 Capacity Reservations

**Data/Storage:**
- Aurora DB clusters (cross-account snapshots)
- CodeBuild projects and report groups

**And many more...**

### Shared VPC Pattern

**Architecture:**
```
Network Account (Owner)
  ├── VPC with subnets
  ├── Route tables, NAT Gateways, Internet Gateway
  └── Shares subnets via RAM

Participant Accounts (Consumers)
  ├── Deploy EC2, RDS, Lambda into shared subnets
  ├── Cannot modify VPC configuration
  └── Own their deployed resources
```

**Benefits:**
- Centralized network management
- Reduced VPC proliferation
- Consistent network architecture
- Simplified connectivity to on-premises (single TGW attachment)
- Cost savings (shared NAT Gateways, Transit Gateway)

**Permissions:**
- **Owners:** Full VPC control (subnets, route tables, gateways)
- **Participants:** Can deploy resources, manage own security groups
- **Participants cannot:** Modify route tables, NACLs, or VPC configuration

**Cost Allocation:**
- Participants billed for their resources (EC2, RDS)
- Owner billed for VPC infrastructure (NAT Gateway, Transit Gateway)
- Data transfer billed to resource owner

**Best Practices:**
- Separate subnets for different participants (isolation)
- Use security groups for traffic control (not NACLs)
- Tag resources for cost allocation
- Document subnet allocation strategy

**Exam Scenario:**
"100 application teams need to deploy to AWS with centralized networking team."

**Answer:** Shared VPC pattern
- Network team owns VPC in Network Account
- Shares subnets to application accounts via RAM
- Application teams deploy resources independently
- Centralized networking control maintained

### Transit Gateway Sharing

**Pattern:**
- Central network account owns Transit Gateway
- Shares Transit Gateway to member accounts via RAM
- Member accounts attach their VPCs

**Benefits:**
- Centralized routing management
- Reduced Transit Gateway costs (one TGW instead of many)
- Simplified hybrid connectivity
- Hub-and-spoke pattern at scale

**Architecture:**
```
Network Account
  └── Transit Gateway (shared via RAM)

Application Account 1
  └── VPC → Attachment to shared TGW

Application Account 2
  └── VPC → Attachment to shared TGW

On-Premises
  └── Direct Connect → TGW (via Network Account)
```

---

## 5. Centralized Logging and Monitoring

### CloudTrail Organization Trail

**What it is:**
Single trail that logs events for all accounts in organization.

**Setup:**
- Created in management account
- Applies to all existing and future accounts
- Logs delivered to S3 bucket in Log Archive account
- Cannot be disabled by member accounts (read-only)

**Best Practices:**
- Enable for all regions (captures global service events)
- Enable log file validation (tamper detection)
- Encrypt with KMS
- Enable CloudWatch Logs integration for real-time monitoring
- Use S3 Object Lock for immutability (compliance)

**Multi-Region Considerations:**
- Organization trail automatically covers all regions
- Global service events (IAM, STS) only in us-east-1
- Enable in all regions to capture regional service events

### Centralized Logging Architecture

**Pattern:**
```
Member Accounts (Production, Development, etc.)
  ├── CloudTrail → S3 in Log Archive Account
  ├── VPC Flow Logs → S3 in Log Archive Account
  ├── Config → Aggregator in Audit Account
  ├── GuardDuty → Delegated Admin (Security Account)
  └── CloudWatch Logs → Cross-account subscription to Log Archive

Log Archive Account
  ├── S3 buckets for all logs
  ├── Bucket policies allow cross-account writes
  ├── S3 Object Lock for compliance
  ├── Lifecycle policies for cost optimization
  └── Glacier for long-term retention

Audit Account
  ├── Config Aggregator (multi-account, multi-region)
  ├── Security Hub (delegated administrator)
  ├── Read-only access to all accounts (audit role)
  └── Compliance reporting dashboards
```

**S3 Bucket Policy for Cross-Account Logging:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSCloudTrailWrite",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudtrail.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::org-cloudtrail-logs/*",
      "Condition": {
        "StringEquals": {
          "s3:x-amz-acl": "bucket-owner-full-control",
          "aws:SourceOrgID": "${OrganizationID}"
        }
      }
    }
  ]
}
```

### AWS Config Aggregator

**What it is:**
Centralized view of AWS Config data across multiple accounts and regions.

**Setup:**
- Create aggregator in Audit Account
- Authorize aggregator in member accounts (automatic with Organizations)
- View compliance across all accounts

**Benefits:**
- Single pane of glass for compliance
- Advanced queries across organization
- Compliance dashboards
- Historical configuration tracking

**Best Practices:**
- Deploy in Audit Account (separate from workloads)
- Use organization-wide aggregator
- Create custom Config rules for organizational standards
- Integrate with Security Hub for unified findings

### GuardDuty Delegated Administrator

**Pattern:**
- Enable GuardDuty in Security Account as delegated administrator
- Automatically enables in all member accounts
- Centralized findings in Security Account
- Member accounts can view their own findings

**Benefits:**
- Centralized threat detection
- Simplified management
- Aggregated findings across organization
- Integration with Security Hub

**Architecture:**
```
Security Account (Delegated Admin)
  ├── GuardDuty master detector
  ├── Aggregated findings from all accounts
  ├── SNS/EventBridge for notifications
  └── Automated remediation workflows

Member Accounts
  ├── GuardDuty detectors (managed by admin)
  ├── Local findings view
  └── Cannot disable GuardDuty (if SCP enforced)
```

---

## 6. Identity and Access Management

### Cross-Account Access Strategies

**1. Cross-Account Roles (Recommended)**

**Pattern:**
```
User in Account A
  ↓ (assumes role)
Role in Account B (trusts Account A)
  ↓ (temporary credentials)
Access resources in Account B
```

**Trust Policy in Account B:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111111111111:role/AdminRole"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "unique-external-id"
        },
        "IpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        }
      }
    }
  ]
}
```

**Best Practices:**
- Use ExternalId for third-party access (confused deputy prevention)
- Apply condition keys (source IP, MFA)
- Limit session duration (1-12 hours)
- Use permission boundaries if delegating role creation

**2. IAM Identity Center (AWS SSO)**

**Architecture:**
```
External IdP (Azure AD, Okta)
  ↓ (SAML 2.0)
IAM Identity Center
  ↓ (permission sets)
AWS Accounts in Organization
  ↓ (temporary credentials)
Users access resources
```

**Permission Sets:**
- Templates for cross-account access
- Apply to users/groups for specific accounts
- Can use AWS managed or custom policies
- Session duration configurable

**Benefits:**
- Single sign-on across all accounts
- Centralized access management
- Integration with corporate directory
- Temporary credentials (no long-lived access keys)
- Audit trail via CloudTrail

**Example Permission Sets:**
- **ViewOnlyAccess:** Read-only across organization
- **DeveloperAccess:** Full access in dev accounts, read-only in production
- **AdminAccess:** Full access in specific accounts
- **DatabaseAdmin:** RDS/DynamoDB admin only

**3. Service Control Policies for Access Boundaries**

**Pattern:**
Prevent accounts from accessing resources outside organization.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalOrgID": "${OrganizationID}"
        },
        "Bool": {
          "aws:PrincipalIsAWSService": "false"
        }
      }
    }
  ]
}
```

**Use Case:**
Prevent data exfiltration to external AWS accounts.

---

## 7. Advanced Multi-Account Patterns

### Landing Zone Customization

**Account Factory Customization (AFC):**

**What it is:**
Extend Account Factory with custom CloudFormation resources.

**Use Cases:**
- Deploy standard resources to all new accounts
- Configure specific IAM roles
- Enable additional security services
- Set up networking baseline

**Implementation:**
```
Account Provisioning
  ↓
Account Factory (baseline)
  ↓
AFC Blueprint (custom resources)
  ↓
  - Create IAM roles
  - Enable SecurityHub
  - Configure S3 block public access
  - Deploy monitoring agents
  ↓
Account ready for use
```

**Blueprint Components:**
- CloudFormation templates
- Service Catalog products
- SCPs for the account's OU
- Resource tags

### Multi-Region Multi-Account

**Pattern:**
Replicate multi-account structure across regions for global applications.

**Challenges:**
- Consistency across regions
- Resource naming (must be globally unique for some services)
- Cross-region data synchronization
- Cost optimization (replicate only necessary resources)

**Strategies:**
- **StackSets:** Deploy CloudFormation across accounts and regions
- **Regional Resources:** VPCs, subnets in each region
- **Global Resources:** IAM, Route 53, CloudFront (single region deployment)
- **Naming Convention:** Include region in resource names (app-prod-us-east-1)

**StackSets for Multi-Account Deployment:**

```
Management Account
  ↓
CloudFormation StackSet
  ↓
Deploy to: Production OU, Regions: [us-east-1, eu-west-1]
  ↓
  ├── Prod-Account-1 (us-east-1) → Stack Instance
  ├── Prod-Account-1 (eu-west-1) → Stack Instance
  ├── Prod-Account-2 (us-east-1) → Stack Instance
  └── Prod-Account-2 (eu-west-1) → Stack Instance
```

**StackSet Features:**
- Automatic deployment to new accounts in OU
- Centralized updates across all stacks
- Failure handling (continue or stop on errors)
- Service-managed permissions (automatic via Organizations)

### Service Catalog for Self-Service

**Pattern:**
Enable teams to provision approved resources via Service Catalog.

**Architecture:**
```
Central IT (Account Factory)
  ↓ (creates products)
Service Catalog Portfolio
  ├── Standard VPC Product
  ├── Database Product (RDS approved configs)
  ├── Compute Product (approved AMIs)
  └── Networking Product (subnets, security groups)
  ↓ (shares to accounts)
Development Teams
  ↓ (self-service provisioning)
Resources deployed with guardrails
```

**Benefits:**
- Standardized resource deployment
- Compliance built-in
- Self-service reduces IT bottleneck
- Cost controls via approved configurations
- Version control for infrastructure

**Product Types:**
- CloudFormation templates
- Terraform configurations
- Service Actions (automated operations)

---

## 8. Compliance and Governance

### Tagging Strategy

**Organizational Tagging Requirements:**

**Required Tags (enforced via Tag Policies):**
- **Environment:** Production, Development, Test, Staging
- **Owner:** Email or team identifier
- **CostCenter:** For chargeback
- **Project:** Application or project name
- **Compliance:** PCI, HIPAA, SOC2, None

**Tag Policy Example:**
```json
{
  "tags": {
    "Environment": {
      "tag_key": {
        "@@assign": "Environment"
      },
      "tag_value": {
        "@@assign": [
          "Production",
          "Development",
          "Test",
          "Staging"
        ]
      },
      "enforced_for": {
        "@@assign": [
          "ec2:instance",
          "rds:db",
          "s3:bucket"
        ]
      }
    }
  }
}
```

**Enforcement:**
- Tag Policies define standards
- SCPs can enforce tags at creation
- Config rules detect non-compliant resources
- Automated tagging via Lambda

### Compliance Automation

**Automated Compliance Checks:**

**AWS Config Rules (Organization-Wide):**
- Deploy compliance rules via StackSets
- Organization conformance packs
- Automatic remediation via Systems Manager

**Example Conformance Pack:**
```
Operational Best Practices for NIST 800-53
  ├── encrypted-volumes (EC2)
  ├── rds-storage-encrypted
  ├── s3-bucket-server-side-encryption-enabled
  ├── cloudtrail-enabled
  ├── iam-password-policy
  └── 50+ additional rules
```

**Automated Remediation:**
```
Non-Compliant Resource Detected (Config Rule)
  ↓
EventBridge Rule Triggered
  ↓
Lambda/SSM Automation Document
  ↓
Resource Remediated
  ↓
SNS Notification (for audit trail)
```

---

## 9. Tricky Scenarios and Exam Tips

### Scenario 1: Shared VPC vs VPC Peering vs Transit Gateway

**Question:**
"100 application teams need network connectivity. Choose solution."

**Analysis:**

| Solution | Pros | Cons | Best For |
|----------|------|------|----------|
| **Shared VPC** | Centralized mgmt, low cost | Limited to 1 VPC per region | Centralized networking team |
| **VPC Peering** | Simple, low latency | Doesn't scale (n²/2 connections) | <10 VPCs |
| **Transit Gateway** | Scalable, transitive routing | Higher cost | >10 VPCs, complex routing |

**Answer:** Shared VPC (if centralized networking) or Transit Gateway (if teams manage own VPCs)

### Scenario 2: Organization Trail vs Individual Trails

**Question:**
"Ensure CloudTrail cannot be disabled in any account."

**Wrong Answer:** Create trail in each account with SCP protection
- **Problem:** Account admins could still disable before SCP applied

**Correct Answer:** Organization Trail from management account
- **Benefit:** Cannot be disabled by member accounts (read-only)
- **Additional:** SCP to prevent CloudTrail modifications

### Scenario 3: Control Tower vs Manual Organizations Setup

**Question:**
"Starting new AWS deployment with 20 accounts. Use Control Tower or manual setup?"

**Answer:** Control Tower (almost always)

**Why:**
- Automated landing zone (<30 min)
- Pre-configured guardrails
- Account Factory for standardization
- Integration with best practices
- Faster time to value

**When NOT to use Control Tower:**
- Existing complex Organizations setup (migration complex)
- Custom requirements incompatible with Control Tower guardrails
- Regions not supported by Control Tower (rare)

### Scenario 4: SCPs Not Working

**Question:**
"Applied SCP to deny EC2 actions but users can still launch instances."

**Common Causes:**
1. SCP attached to wrong level (not covering target account)
2. SCP has allow list but FullAWSAccess also attached (allow wins)
3. Service role not excluded from SCP
4. Action names incorrect in SCP

**Troubleshooting:**
- Verify SCP attachment hierarchy
- Check for multiple SCPs (all must allow)
- Test with IAM policy simulator
- CloudTrail logs show SCP evaluation

### Scenario 5: RAM Sharing Doesn't Work

**Question:**
"Shared subnet via RAM but participant account can't deploy resources."

**Common Causes:**
1. Resource sharing not accepted by participant
2. Participant doesn't have IAM permissions for service (EC2, RDS)
3. Subnet AZ not available in participant account (AZ IDs differ)
4. Resource type not supported in shared subnet

**Solution:**
- Verify resource share acceptance status
- Check IAM permissions in participant account
- Use AZ IDs (use1-az1) not AZ names (us-east-1a)
- Review supported resource types for shared subnets

---

## 10. Hands-On Practice Labs

### Lab 1: Create Multi-Account Organization
1. Create AWS Organization from management account
2. Create OUs (Security, Production, Development)
3. Create member accounts via Account Factory
4. Apply SCPs to OUs
5. Test SCP enforcement
6. Configure consolidated billing

### Lab 2: Deploy Control Tower Landing Zone
1. Enable Control Tower in management account
2. Review pre-configured guardrails
3. Create additional OU via Control Tower
4. Provision account via Account Factory
5. Customize Account Factory with additional resources
6. Review compliance dashboard

### Lab 3: Shared VPC Implementation
1. Create VPC in network account
2. Create subnets across multiple AZs
3. Share subnets via AWS RAM
4. Accept share in participant account
5. Deploy EC2 instance in shared subnet
6. Verify connectivity and cost allocation

### Lab 4: Centralized Logging
1. Create organization trail in management account
2. Configure S3 bucket in Log Archive account
3. Enable VPC Flow Logs to central S3
4. Create Config aggregator in Audit account
5. Enable GuardDuty with delegated admin
6. Query logs using Athena

### Lab 5: IAM Identity Center Setup
1. Enable IAM Identity Center
2. Configure external IdP (or use built-in directory)
3. Create permission sets (Admin, Developer, ReadOnly)
4. Assign users to accounts with permission sets
5. Test SSO login to multiple accounts
6. Review CloudTrail logs for role assumptions

---

## 11. Key Takeaways

**Decision Trees:**

```
Multi-Account Strategy:

How many accounts?
├─ <5 accounts → Manual Organizations setup acceptable
├─ 5-50 accounts → Use Control Tower
└─ >50 accounts → Control Tower + automation essential

Network connectivity?
├─ Centralized team manages networking → Shared VPC
├─ Teams manage own VPCs (5-15) → VPC Peering
├─ Teams manage own VPCs (>15) → Transit Gateway
└─ Service-level access only → PrivateLink

Logging strategy?
├─ All accounts → Organization Trail (CloudTrail)
├─ Compliance requirements → Config Aggregator + Organization Trail
├─ Security monitoring → GuardDuty delegated admin
└─ Centralized analysis → S3 in Log Archive + Athena
```

**Multi-Account Best Practices:**
- Use Control Tower for new deployments (automated best practices)
- Minimum 5 foundational accounts (Management, Log Archive, Audit, Network, Security)
- Separate production from non-production (blast radius)
- Centralize logging in Log Archive account (tamper-proof)
- Use IAM Identity Center for workforce access (SSO)
- Apply SCPs for guardrails (protect security services)
- Automate account provisioning (Account Factory)
- Tag everything (cost allocation, compliance)

**Organization Structure:**
- Root → OUs by function (Security, Infrastructure, Workloads)
- Workloads OU → Sub-OUs by environment (Prod, Non-Prod, Sandbox)
- Suspended OU for decommissioned accounts
- Avoid deep nesting (max 3-4 levels)

**Security and Compliance:**
- Organization Trail for all accounts (cannot be disabled)
- Config Aggregator in Audit account (centralized compliance)
- GuardDuty with delegated admin (centralized threat detection)
- SCPs to protect security services (CloudTrail, Config, GuardDuty)
- IAM Identity Center for centralized access (no long-lived credentials)

---

## 12. Common Exam Traps

**Trap 1:** Thinking SCPs grant permissions
- **Reality:** SCPs only limit, never grant (must have IAM policy too)

**Trap 2:** Assuming member accounts can disable Organization Trail
- **Reality:** Organization Trail is read-only in member accounts

**Trap 3:** Using management account for workloads
- **Reality:** Management account should only manage organization (security risk)

**Trap 4:** Not understanding SCP inheritance
- **Reality:** SCPs inherit down hierarchy (OU → child OU → account)

**Trap 5:** Forgetting RAM resource share acceptance
- **Reality:** Participant must accept share (unless Organizations auto-accept enabled)

**Trap 6:** Confusing AZ names vs AZ IDs
- **Reality:** us-east-1a in Account A ≠ us-east-1a in Account B (use AZ IDs)

**Trap 7:** Over-complicating with too many accounts
- **Reality:** Start simple, add accounts as needed (avoid premature optimization)

---

**Next Steps:**
- Study Task 1.5: Cost Optimization and Visibility Strategies
- Practice multi-account setup in sandbox environment
- Review AWS Organizations and Control Tower documentation
- Complete practice questions on multi-account governance
