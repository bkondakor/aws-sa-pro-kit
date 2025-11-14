# Domain 1 - Task 1.2: Prescribe Security Controls

## Overview
Security is a critical pillar of the AWS Well-Architected Framework and represents a significant portion of the Solutions Architect Professional exam. This task focuses on implementing comprehensive security controls across multi-account environments, identity management, encryption, and detective controls.

---

## 1. Multi-Account Security with AWS Organizations

### AWS Organizations Fundamentals

**What it is:**
AWS Organizations enables centralized management and governance of multiple AWS accounts through a hierarchical structure.

**Key Components:**
- **Root:** Top-level container for all accounts
- **Organizational Units (OUs):** Logical groupings of accounts
- **Accounts:** Individual AWS accounts (management and member accounts)
- **Service Control Policies (SCPs):** Permission boundaries applied to OUs or accounts

**Benefits:**
- Consolidated billing and cost allocation
- Centralized policy management
- Automated account creation
- Service control across organization
- Resource sharing via AWS RAM

### Service Control Policies (SCPs) - 2025 Updates

**What SCPs Are:**
SCPs are JSON policies that specify maximum permissions for accounts in an organization. They do NOT grant permissions—they set boundaries.

**Recent Enhancement (2025):**
AWS Organizations now supports **full IAM policy language** including:
- Condition keys (aws:RequestedRegion, aws:PrincipalArn, etc.)
- Individual resource ARNs (not just wildcards)
- NotAction element with Allow statements
- Complex condition operators

**SCP Evaluation Logic:**
```
Effective Permissions = Identity-Based Policies ∩ SCPs ∩ Permission Boundaries ∩ Resource Policies

Key Rule: Explicit Deny > Explicit Allow > Implicit Deny
```

**Best Practices for SCPs (2025):**

1. **Test Before Applying to Root**
   - Create test OU with representative accounts
   - Apply SCP to test OU first
   - Validate impact before broader deployment
   - Use IAM Access Analyzer to validate policies

2. **Apply at OU Level, Not Account Level**
   - Easier troubleshooting and management
   - Consistent governance across similar accounts
   - Clearer organizational structure

3. **Start with Allow-All, Add Denies**
   - Begin with FullAWSAccess managed policy
   - Add specific Deny statements for restrictions
   - Avoid overly broad wildcards in Deny statements

4. **Essential SCPs to Implement:**

**Prevent Account Leaving Organization:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "organizations:LeaveOrganization",
      "Resource": "*"
    }
  ]
}
```

**Deny Specific Regions:**
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
          "aws:RequestedRegion": [
            "us-east-1",
            "us-west-2",
            "eu-west-1"
          ]
        },
        "ArnNotLike": {
          "aws:PrincipalArn": [
            "arn:aws:iam::*:role/OrganizationAccountAccessRole"
          ]
        }
      }
    }
  ]
}
```

**Protect Security Services:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": [
        "cloudtrail:StopLogging",
        "cloudtrail:DeleteTrail",
        "guardduty:DeleteDetector",
        "guardduty:DisassociateFromMasterAccount",
        "config:DeleteConfigRule",
        "config:DeleteConfigurationRecorder",
        "config:DeleteDeliveryChannel",
        "config:StopConfigurationRecorder"
      ],
      "Resource": "*"
    }
  ]
}
```

**Deny Root User Actions:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "aws:PrincipalArn": "arn:aws:iam::*:root"
        }
      }
    }
  ]
}
```

**Govern Access to AI/ML Services (2025 Best Practice):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "bedrock:*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalOrgID": "${OrganizationId}"
        }
      }
    }
  ]
}
```

### SCP Strategy by Organizational Unit

**Production OU SCP:**
- Deny region restrictions (enforce specific regions)
- Protect logging and monitoring
- Require encryption for S3, EBS
- Deny root user access
- Enforce tagging requirements

**Development/Sandbox OU SCP:**
- Allow experimental services
- Restrict instance types (cost control)
- Deny expensive services (Redshift, EMR clusters)
- Allow broader regional access

**Security OU SCP:**
- Allow security tool access across organization
- Prevent modification of security services
- Broad service access for security operations

---

## 2. Identity Federation and Cross-Account Access

### AWS IAM Identity Center (AWS SSO)

**What it is:**
Successor to AWS SSO, provides centralized access management for multiple AWS accounts and business applications.

**Key Features:**
- Single sign-on to AWS accounts
- Integration with external identity providers (Okta, Azure AD, etc.)
- SAML 2.0 and OIDC support
- Permission sets (reusable IAM policies)
- MFA enforcement

**Architecture:**
```
External IdP (Azure AD/Okta) → IAM Identity Center → AWS Accounts
                                      ↓
                               Permission Sets
                                      ↓
                            IAM Roles in Accounts
```

**Permission Sets:**
- Templates for IAM policies
- Applied to users/groups for specific accounts
- Can reference AWS managed or custom policies
- Support session duration configuration

**When to Use:**
- Multiple AWS accounts (5+)
- External identity provider integration
- Need for centralized access management
- Workforce access (not application access)

### SAML 2.0 Federation

**What it is:**
Standard for exchanging authentication and authorization data between identity provider and service provider.

**Flow:**
```
1. User authenticates with Corporate IdP
2. IdP returns SAML assertion
3. User presents assertion to AWS STS
4. STS returns temporary credentials
5. User accesses AWS resources
```

**Use Cases:**
- Enterprise SSO integration
- Compliance requirements for centralized authentication
- Temporary credential requirements
- Active Directory integration (via AD FS)

**Key API:** `sts:AssumeRoleWithSAML`

### OIDC (OpenID Connect) Federation

**What it is:**
Identity layer built on OAuth 2.0 for web-based and mobile authentication.

**Use Cases:**
- Mobile application authentication (Amazon Cognito)
- Web identity federation (Google, Facebook, Amazon)
- GitHub Actions or GitLab CI/CD accessing AWS
- Kubernetes service accounts accessing AWS (IRSA)

**Key APIs:**
- `sts:AssumeRoleWithWebIdentity`
- Better: Use Amazon Cognito for web/mobile apps

**GitHub Actions Example (2025 Best Practice):**
```yaml
# No long-lived credentials needed!
permissions:
  id-token: write
  contents: read

- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
    aws-region: us-east-1
```

### Cross-Account Access Patterns

**Pattern 1: IAM Role Assumption**

**Setup:**
1. Account A (trusting): Creates IAM role with trust policy for Account B
2. Account B (trusted): User/role assumes the role in Account A
3. STS returns temporary credentials

**Trust Policy Example:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "unique-external-id-123"
        }
      }
    }
  ]
}
```

**ExternalId Best Practice:**
- Required for third-party access
- Prevents "confused deputy" problem
- Unique per customer/partner
- Secret shared between you and third party

**Pattern 2: Role Chaining**

**What it is:**
Assuming a role from another assumed role (up to 1 hour session duration limit).

**Use Case:**
Account A → Account B → Account C

**Limitation:**
- Maximum session duration: 1 hour (when chaining)
- Maximum chain depth: Platform-dependent (not recommended >2)

**Exam Tip:** If scenario requires >1 hour sessions with role chaining, design is incorrect.

**Pattern 3: Resource-Based Policies**

**Services Supporting Resource-Based Policies:**
- S3 buckets
- SNS topics
- SQS queues
- Lambda functions
- KMS keys
- Secrets Manager secrets
- ECR repositories

**Advantage:**
- No role assumption needed
- Original identity preserved (CloudTrail shows actual user)
- More granular than role-based access

**S3 Cross-Account Example:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/DataAnalystRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::shared-data-bucket",
        "arn:aws:s3:::shared-data-bucket/*"
      ]
    }
  ]
}
```

### Permission Boundaries

**What they are:**
Advanced IAM feature that sets maximum permissions an identity-based policy can grant.

**Use Cases:**
- Delegate administration safely
- Prevent privilege escalation
- Enforce organizational security requirements

**Example Scenario:**
Developers can create IAM roles but cannot grant permissions outside predefined boundary.

**Implementation:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "dynamodb:*",
        "lambda:*"
      ],
      "Resource": "*"
    }
  ]
}
```

Attach as permission boundary: Even if identity policy allows `iam:*`, effective permissions are restricted to S3, DynamoDB, Lambda.

---

## 3. Encryption Strategies

### AWS Key Management Service (KMS)

**What it is:**
Managed service for creating and controlling encryption keys.

**Key Types:**

**1. AWS Managed Keys**
- Created/managed by AWS services
- Format: `aws/service-name` (e.g., `aws/s3`)
- Free, automatic rotation every year
- Cannot be deleted

**2. Customer Managed Keys (CMK)**
- Full control over key policies and rotation
- $1/month per key + usage charges
- Can be disabled or deleted (7-30 day waiting period)
- Custom rotation (manual or automatic yearly)

**3. AWS Owned Keys**
- AWS owns and manages (DynamoDB default encryption)
- No visibility or control
- Free
- Cannot be used in CloudTrail logs

**Key Policies:**

**Default Key Policy:**
- Created with customer managed key
- Allows root account full access
- Can be modified to grant specific permissions

**Example Key Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM policies",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow use from specific account",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:root"
      },
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    }
  ]
}
```

**Cross-Account Encryption:**

Scenario: Account A encrypts S3 object with KMS key, Account B needs to access.

Requirements:
1. KMS key policy allows Account B
2. IAM policy in Account B allows kms:Decrypt
3. S3 bucket policy allows Account B
4. IAM policy in Account B allows s3:GetObject

**Envelope Encryption:**
- Data encrypted with data key
- Data key encrypted with KMS key
- Reduces network calls to KMS
- Enables large data encryption (>4KB)

**KMS Quotas (Important for Exam):**
- API request quotas: 5,500 - 30,000/sec (varies by region and operation)
- Shared quota across encrypt/decrypt operations
- Can request quota increases

**Best Practices:**
- Use different keys for different data classifications
- Enable automatic key rotation for compliance
- Use grants for temporary permissions
- Monitor key usage with CloudWatch and CloudTrail

### AWS CloudHSM

**What it is:**
Hardware Security Module (HSM) in AWS cloud for cryptographic key storage and operations.

**Key Differences from KMS:**

| Feature | KMS | CloudHSM |
|---------|-----|----------|
| **Control** | AWS manages hardware | Customer manages keys |
| **Compliance** | FIPS 140-2 Level 2 | FIPS 140-2 Level 3 |
| **Multi-tenancy** | Multi-tenant | Single-tenant |
| **Integration** | Native AWS service integration | Requires custom integration |
| **Price** | $1/key/month | ~$1.45/hour per HSM |
| **Performance** | API quotas apply | Dedicated throughput |
| **Availability** | Multi-AZ by default | Requires cluster setup |

**When to Use CloudHSM:**
- FIPS 140-2 Level 3 compliance required
- Need to own encryption keys in hardware
- Custom cryptographic algorithms
- High-throughput requirements (>30K TPS)
- Offload SSL/TLS processing

**Architecture:**
- Deploy cluster across multiple AZs
- Minimum 2 HSMs for HA (recommended 3+)
- Client integration via CloudHSM client library
- Supports PKCS#11, Java JCE, Microsoft CNG

### Encryption at Rest

**S3 Encryption Options:**

**1. SSE-S3 (AES-256)**
- AWS-managed keys
- Free
- Automatic for new buckets (2023+)

**2. SSE-KMS**
- Customer managed keys
- Audit trail via CloudTrail
- Envelope encryption
- Key policy control

**3. SSE-C (Customer-Provided Keys)**
- Customer provides key with each request
- AWS performs encryption/decryption
- AWS doesn't store key
- Customer manages key distribution

**4. Client-Side Encryption**
- Encrypt before upload
- Full control over encryption process
- Use AWS Encryption SDK or custom solution

**EBS Encryption:**
- Uses KMS automatically
- Encrypts data, boot volumes, snapshots
- Minimal performance impact
- Cannot remove encryption once enabled
- Can encrypt existing unencrypted volumes via snapshot

**RDS Encryption:**
- Uses KMS for encryption at rest
- Must be enabled at creation (cannot enable later on existing DB)
- Encrypts storage, backups, snapshots, read replicas
- **Exam Tip:** To encrypt existing DB, snapshot → copy snapshot (enable encryption) → restore

**DynamoDB Encryption:**
- Encryption at rest enabled by default (2023+)
- Uses AWS owned key (default, free)
- Can use customer managed key (additional cost)
- Encryption cannot be disabled

### Encryption in Transit

**TLS/SSL Termination Points:**

**CloudFront:**
- Viewer → CloudFront: HTTPS required (can enforce)
- CloudFront → Origin: Can enforce HTTPS
- Custom SSL certificates via ACM or import

**Application Load Balancer:**
- Client → ALB: HTTPS with ACM certificate
- ALB → Target: Can be HTTP or HTTPS
- End-to-end encryption: HTTPS on both sides

**Network Load Balancer:**
- TLS termination supported (2019+)
- Passthrough mode for end-to-end encryption
- Lower latency than ALB for TLS

**VPN Connections:**
- IPsec encryption automatically enabled
- AES-256 or AES-128 encryption
- SHA-1 or SHA-2 for integrity

**Direct Connect:**
- No encryption by default (private connection)
- Options for encryption:
  1. MACsec (Layer 2, 10/100 Gbps only)
  2. VPN over Direct Connect (IPsec)
  3. Application-level encryption (TLS)

**Best Practice:** For Direct Connect with compliance requirements, use MACsec or VPN over public VIF.

---

## 4. Secrets Management

### AWS Secrets Manager

**What it is:**
Managed service for storing, retrieving, and rotating secrets (database credentials, API keys, tokens).

**Key Features:**
- Automatic secret rotation (Lambda-based)
- Integration with RDS, Redshift, DocumentDB
- Fine-grained access control via IAM and resource policies
- Encryption at rest with KMS
- Cross-region replication (multi-region applications)
- Versioning and staging labels

**Automatic Rotation:**
- RDS: Fully automated, AWS-managed Lambda
- Custom: Provide custom Lambda function
- Rotation schedule: Every N days (minimum 1 day)

**Cost (2025):**
- $0.40 per secret per month
- $0.05 per 10,000 API calls

**When to Use:**
- Database credentials requiring rotation
- Automatic rotation needed
- Cross-region secret replication
- Compliance requirements for secret management

### AWS Systems Manager Parameter Store

**What it is:**
Hierarchical storage for configuration data and secrets.

**Tiers:**

| Feature | Standard | Advanced |
|---------|----------|----------|
| **Parameters** | 10,000 per account | 100,000+ per account |
| **Max Size** | 4 KB | 8 KB |
| **Parameter Policies** | Not available | Available |
| **Cost** | Free | $0.05 per parameter/month |
| **Throughput** | Standard | Higher |

**Parameter Types:**
- **String:** Plain text
- **StringList:** Comma-separated values
- **SecureString:** Encrypted with KMS

**Parameter Policies (Advanced Only):**
- Expiration: Delete parameter after specified time
- ExpirationNotification: EventBridge event before expiration
- NoChangeNotification: Alert if parameter not changed in X days

**When to Use Parameter Store:**
- Configuration values, feature flags
- Low-cost secret storage (if no rotation needed)
- Application configuration management
- Hierarchical parameter organization (/app/prod/db-url)

**Secrets Manager vs Parameter Store:**

| Use Case | Choice |
|----------|--------|
| Database credentials with rotation | Secrets Manager |
| API keys without rotation | Parameter Store (SecureString) |
| Application configuration | Parameter Store |
| Cross-region secret replication | Secrets Manager |
| Fine-grained access control | Both (prefer Secrets Manager for secrets) |
| Cost-sensitive | Parameter Store |

---

## 5. Detective Controls

### Amazon GuardDuty

**What it is:**
Intelligent threat detection service using machine learning to identify malicious activity.

**Data Sources:**
- VPC Flow Logs
- CloudTrail event logs
- DNS logs
- S3 data event logs (for S3 Protection)
- EKS audit logs (for EKS Protection)
- RDS login activity (for RDS Protection)

**Key Features:**
- Continuous monitoring (not periodic scans)
- Machine learning and anomaly detection
- Integration with Security Hub
- Automated threat detection
- No agents required

**Finding Types (Examples):**
- **Recon:** UnauthorizedAccess:EC2/SSHBruteForce
- **Instance Compromise:** CryptoCurrency:EC2/BitcoinTool.B!DNS
- **Account Compromise:** Stealth:IAMUser/CloudTrailLoggingDisabled
- **Bucket Compromise:** Exfiltration:S3/ObjectRead.Unusual

**Response Actions:**
- EventBridge rule → Lambda → Automated remediation
- SNS notification to security team
- Update security groups (isolate compromised instance)
- Snapshot instance for forensics

**Best Practices:**
- Enable in all accounts and regions
- Centralize findings in security account via delegated administrator
- Automate response for common findings
- Integrate with SIEM tools

**Cost:**
- Based on volume of logs analyzed
- CloudTrail events: $4.48 per million events/month (first 500M)
- VPC Flow Logs: $0.84 per GB/month (first 500 GB)
- DNS logs: $0.84 per million queries/month

### AWS Security Hub

**What it is:**
Central security and compliance dashboard aggregating findings from multiple AWS and partner security services.

**Integrated Services:**
- GuardDuty, Inspector, Macie
- IAM Access Analyzer
- Systems Manager Patch Manager
- Firewall Manager
- Third-party: Palo Alto, Trend Micro, CrowdStrike, etc.

**Security Standards:**
- AWS Foundational Security Best Practices
- CIS AWS Foundations Benchmark
- PCI DSS
- NIST 800-53

**Key Features:**
- Automated compliance checks
- Consolidated findings across accounts
- Finding aggregation across regions
- Integration with EventBridge for automation
- Custom insights and filters

**Finding Format:**
- ASFF (AWS Security Finding Format)
- Standardized schema for all findings
- Severity: Critical, High, Medium, Low, Informational

**Multi-Account Strategy:**
- Designate security account as delegated administrator
- Automatically enroll new accounts
- Centralized view of all findings
- Member accounts can view own findings

**Automated Remediation:**
```
Security Hub Finding → EventBridge Rule → Lambda/Step Functions → Remediation
```

**Example:** Failed S3 bucket public access check → Lambda enables S3 Block Public Access

### AWS Config

**What it is:**
Service for assessing, auditing, and evaluating configurations of AWS resources.

**Key Features:**
- Resource inventory and configuration history
- Configuration change tracking
- Compliance auditing via Config Rules
- Configuration snapshots
- Multi-account, multi-region aggregation

**Config Rules:**

**AWS Managed Rules (200+):**
- `s3-bucket-public-read-prohibited`
- `encrypted-volumes`
- `rds-multi-az-support`
- `iam-password-policy`
- `vpc-flow-logs-enabled`

**Custom Rules:**
- Lambda-based custom logic
- Evaluate configurations against custom requirements
- Triggered by configuration changes or periodically

**Compliance Timeline:**
- Historical compliance view
- Track when resources became non-compliant
- Link to configuration changes causing non-compliance

**Remediation:**
- **Manual:** View non-compliant resources, fix manually
- **Automatic:** SSM Automation documents
  - Example: Enable EBS encryption, enable S3 versioning

**Multi-Account Aggregator:**
- Centralized view of compliance across organization
- Deploy in security/audit account
- Requires authorization from member accounts

**Cost Considerations:**
- Configuration item: $0.003 per item recorded
- Rule evaluation: $0.001 per evaluation (first 100K free)
- Can be expensive with many resources

**Cost Optimization:**
- Record only specific resource types
- Use conformance packs for standardized deployment
- Leverage organization-wide aggregator

### Amazon Macie

**What it is:**
Data security service using machine learning to discover, classify, and protect sensitive data in S3.

**Key Features:**
- Automated sensitive data discovery (PII, credentials, financial)
- Continuous monitoring of S3 buckets
- Data classification based on content
- Security and access control evaluation

**Sensitive Data Types Detected:**
- Personally Identifiable Information (PII)
- Protected Health Information (PHI)
- Financial data (credit cards, bank accounts)
- AWS credentials
- Private keys and certificates

**Findings:**
- Sensitive data discoveries
- Policy findings (public buckets, unencrypted, etc.)
- Severity scoring
- Integration with Security Hub and EventBridge

**Discovery Jobs:**
- One-time: Scan specific buckets once
- Scheduled: Regular scans (daily, weekly, monthly)
- Scope by bucket, prefix, or tags

**Best Practices:**
- Enable organization-wide for data governance
- Create automated jobs for new buckets
- Integrate findings with incident response
- Use custom data identifiers for proprietary formats

**Cost:**
- $5 per GB for first 1,000 GB/month (tiered pricing)
- Can be expensive for large S3 estates
- Evaluate sampling strategies

### IAM Access Analyzer

**What it is:**
Analyzes resource policies to identify resources shared with external entities.

**Key Features:**
- Identifies unintended access to resources
- Validates IAM policies during development
- Generates policies based on access activity
- Continuous monitoring of resource policies

**Findings:**
- Public S3 buckets
- IAM roles assumable by external accounts
- KMS keys shared externally
- Lambda functions with public access
- SQS queues accessible by external accounts

**Analyzers:**
- **Organization:** Analyze access from outside organization
- **Account:** Analyze access from outside specific account

**Policy Validation:**
- Validate policy syntax and logic
- Security warnings for overly permissive policies
- Best practice checks
- Custom policy checks (OPA/Cedar)

**Policy Generation (2025 Feature):**
- Analyzes CloudTrail logs
- Generates policy based on actual usage
- Implements least privilege automatically

---

## 6. Tricky Scenarios and Exam Tips

### Scenario 1: SCP vs IAM Policy Precedence

**Question:**
"User has AdministratorAccess IAM policy. SCP denies EC2 actions. Can user launch EC2?"

**Answer:** No

**Explanation:**
- SCPs set maximum permissions
- Even with admin policy, SCP restriction applies
- Explicit deny always wins

### Scenario 2: Cross-Account KMS Encrypted S3 Access

**Question:**
"Account A has S3 bucket with KMS-encrypted objects. Account B needs read access."

**Required Permissions:**
1. **Account A - KMS Key Policy:** Allow Account B to use key for decryption
2. **Account A - S3 Bucket Policy:** Allow Account B to GetObject
3. **Account B - IAM Policy:** Allow s3:GetObject and kms:Decrypt
4. **Account B principal:** Must have all permissions in their identity policy

**Common Exam Trap:** Forgetting KMS key permissions in cross-account scenarios.

### Scenario 3: Role Chaining Session Duration

**Question:**
"User assumes Role A (max 4 hours), which assumes Role B. How long can Role B session last?"

**Answer:** Maximum 1 hour

**Explanation:**
- Role chaining reduces max session to 1 hour
- Regardless of role settings
- Design implication: Avoid long role chains

### Scenario 4: Root User Protection

**Question:**
"How to prevent root user from deleting resources?"

**Answer:** SCPs apply to root user!

**Implementation:**
```json
{
  "Effect": "Deny",
  "Action": "*",
  "Resource": "*",
  "Condition": {
    "StringLike": {
      "aws:PrincipalArn": "arn:aws:iam::*:root"
    }
  }
}
```

**Best Practices:**
- Enable MFA for root
- Don't use root for daily operations
- Use SCP to restrict root actions
- Monitor root user activity

### Scenario 5: Secrets Manager Auto-Rotation Failure

**Question:**
"RDS credentials in Secrets Manager. Rotation fails. What happened?"

**Common Causes:**
1. Lambda rotation function can't reach RDS (security group/NACL)
2. Lambda doesn't have permission to update secret
3. Database doesn't allow password update from Lambda's IP
4. Master user credentials changed outside Secrets Manager

**Solution:**
- Ensure Lambda in same VPC as RDS or VPC access configured
- Grant Lambda IAM permissions (secretsmanager:UpdateSecret)
- Database security groups allow Lambda security group
- Only change credentials via Secrets Manager

### Scenario 6: GuardDuty Finding Prioritization

**Question:**
"Which GuardDuty finding requires immediate action?"

**Severity Levels:**
- **High (7.0-8.9):** Immediate investigation (compromise indicators)
- **Medium (4.0-6.9):** Timely investigation (suspicious activity)
- **Low (0.1-3.9):** Informational (reconnaissance, probing)

**Prioritize:**
1. High severity findings (instance/account compromise)
2. Findings with known true positive patterns
3. Findings in production environments
4. Repeated findings (pattern of attacks)

---

## 7. Hands-On Practice Labs

### Lab 1: Implement Multi-Account Security with SCPs
1. Create organization with 3 accounts
2. Create OUs (Production, Development)
3. Create and attach SCPs:
   - Deny root user access
   - Restrict to specific regions
   - Protect CloudTrail
4. Test SCP effectiveness
5. Use IAM Access Analyzer to validate

### Lab 2: Cross-Account Role Assumption
1. Create role in Account A
2. Configure trust policy for Account B
3. Add ExternalId for security
4. Assume role from Account B
5. Test permissions
6. Monitor with CloudTrail

### Lab 3: KMS Cross-Account Encryption
1. Create KMS key in Account A
2. Configure key policy for Account B
3. Encrypt S3 object in Account A
4. Access from Account B
5. Verify CloudTrail logs
6. Test with and without permissions

### Lab 4: Secrets Manager with RDS
1. Create RDS instance
2. Store credentials in Secrets Manager
3. Configure automatic rotation
4. Create Lambda function using secret
5. Trigger rotation manually
6. Verify application continues working

### Lab 5: Centralized Security Hub
1. Enable Security Hub in security account
2. Enable GuardDuty, Config, Macie
3. Configure delegated administrator
4. Enable in member accounts
5. Review aggregated findings
6. Create EventBridge rule for automated response

---

## 8. Key Takeaways

**Decision Trees:**

```
Need to restrict account permissions?
├─ Specific users/roles → IAM policies
├─ Maximum permissions org-wide → SCPs
├─ Delegate admin safely → Permission boundaries
└─ Prevent privilege escalation → Combination of all

Need encryption?
├─ AWS service integration → KMS
├─ FIPS 140-2 Level 3 → CloudHSM
├─ Automatic rotation → Secrets Manager
└─ Configuration values → Parameter Store

Need to detect threats?
├─ Malicious activity → GuardDuty
├─ Configuration compliance → Config
├─ Sensitive data discovery → Macie
├─ External access → IAM Access Analyzer
└─ Centralized view → Security Hub
```

**SCP Best Practices:**
- Test in isolated OU before broader rollout
- Apply at OU level for easier management
- Use deny statements for guardrails
- Protect security services from modification
- Monitor with CloudTrail for SCP violations

**Encryption Checklist:**
- At rest: Enable by default (S3, EBS, RDS, DynamoDB)
- In transit: Enforce TLS 1.2+ for all connections
- Key management: Use KMS for audit trail
- Rotation: Enable automatic key rotation
- Cross-account: Configure KMS key policies correctly

**Detective Controls Strategy:**
- GuardDuty: All accounts, all regions
- Security Hub: Centralize in security account
- Config: Critical compliance rules only (cost)
- Macie: Sensitive data buckets
- IAM Access Analyzer: Organization-wide

---

## 9. Common Exam Traps

**Trap 1:** Assuming IAM admin can override SCP
- **Reality:** SCP always applies, even to admins

**Trap 2:** Forgetting KMS permissions in cross-account access
- **Reality:** Need permissions on KMS key, S3 bucket, AND in IAM policy

**Trap 3:** Not understanding role chaining limitations
- **Reality:** Maximum 1 hour when role chaining

**Trap 4:** Using Secrets Manager for all secrets
- **Reality:** Parameter Store is cheaper for non-rotating secrets

**Trap 5:** Enabling all Config rules everywhere
- **Reality:** Can be very expensive; be selective

**Trap 6:** Not protecting root user with SCPs
- **Reality:** Root user subject to SCPs

**Trap 7:** Assuming GuardDuty requires agents
- **Reality:** Agentless, analyzes logs automatically

---

**Next Steps:**
- Study Task 1.3: Reliable and Resilient Architectures
- Practice cross-account access patterns in lab environment
- Review AWS Security whitepapers
- Complete practice questions on security controls
