# Task 3.2: Determine a Strategy to Improve Security

## Overview

This task focuses on continuously improving the security posture of existing AWS solutions through detection, analysis, automated remediation, and preventive controls. Security improvement is an ongoing process, not a one-time activity.

**Weight:** ~20% of Domain 3 (5% of total exam)

---

## Core Concepts

### Security Improvement Lifecycle

```
1. DETECT → Identify security gaps and threats
2. ANALYZE → Assess impact and prioritize
3. REMEDIATE → Fix identified issues
4. PREVENT → Implement controls to avoid recurrence
5. MONITOR → Continuous validation and improvement
```

### Defense in Depth

Security must be implemented at multiple layers:
- **Network** - VPC, Security Groups, NACLs, WAF
- **Compute** - Instance hardening, patching, endpoint protection
- **Application** - Code analysis, secrets management, API security
- **Data** - Encryption at rest and in transit, access controls
- **Identity** - IAM, MFA, least privilege, federation
- **Audit** - Logging, monitoring, compliance validation

---

## AWS Security Services for Continuous Improvement

### AWS Security Hub - Centralized Security Management

**What it does:** Aggregates security findings from multiple AWS services and partner products into a single dashboard

**Integrated Services:**
- Amazon GuardDuty (threat detection)
- Amazon Inspector (vulnerability scanning)
- Amazon Macie (data discovery and protection)
- IAM Access Analyzer (resource exposure)
- AWS Firewall Manager (firewall policies)
- AWS Systems Manager (patch compliance)
- Third-party tools (Palo Alto, Trend Micro, etc.)

**Security Standards Supported:**
1. **AWS Foundational Security Best Practices (FSBP)**
2. **CIS AWS Foundations Benchmark**
3. **PCI DSS**
4. **NIST 800-53**

**Finding Severity Levels:**
- **CRITICAL** (90-100) - Immediate action required
- **HIGH** (70-89) - Needs prompt attention
- **MEDIUM** (40-69) - Should be addressed soon
- **LOW** (1-39) - Informational
- **INFORMATIONAL** (0) - No security issue

#### Security Hub Insights

**Pre-defined Insights:**
- Resources with the most findings
- EC2 instances with findings
- S3 buckets with public write/read
- AMIs flagged with critical findings
- IAM users with findings

**Custom Insights:**
Create your own using filters:
```json
{
  "Filters": {
    "SeverityLabel": [{"Value": "CRITICAL", "Comparison": "EQUALS"}],
    "ResourceType": [{"Value": "AwsEc2Instance", "Comparison": "EQUALS"}],
    "ComplianceStatus": [{"Value": "FAILED", "Comparison": "EQUALS"}]
  }
}
```

#### Automated Remediation with Security Hub

**Architecture Pattern:**
```
Security Hub Finding → EventBridge Rule → Lambda/Systems Manager Automation
                                      └─→ SNS (notification)
                                      └─→ SIEM (integration)
```

**Example EventBridge Rule:**
```json
{
  "source": ["aws.securityhub"],
  "detail-type": ["Security Hub Findings - Imported"],
  "detail": {
    "findings": {
      "Severity": {
        "Label": ["CRITICAL", "HIGH"]
      },
      "Compliance": {
        "Status": ["FAILED"]
      },
      "Workflow": {
        "Status": ["NEW"]
      }
    }
  }
}
```

**AWS Automated Security Response Solution:**
- Pre-built playbooks for common security findings
- Supports multiple security standards (CIS, NIST, FSBP)
- Automated or manual execution modes
- Audit trail in finding notes
- Auto-updates findings to RESOLVED

**Common Automated Remediations:**
1. **S3.1 - S3 bucket has public read access**
   - Remediation: Remove public access, enable block public access
2. **EC2.1 - EBS snapshots should not be public**
   - Remediation: Make snapshot private
3. **IAM.1 - IAM policies should not allow full "*:*" privileges**
   - Remediation: Notify security team (too risky to auto-fix)
4. **CloudTrail.1 - CloudTrail should be enabled**
   - Remediation: Create multi-region trail
5. **RDS.1 - RDS snapshots should be private**
   - Remediation: Modify snapshot permissions

**When NOT to Auto-Remediate:**
- IAM permission changes (risk of breaking applications)
- Security group rule deletions (may impact connectivity)
- Resource deletions (risk of data loss)
- Changes requiring business approval

---

### Amazon GuardDuty - Threat Detection

**What it does:** Intelligent threat detection using machine learning to analyze:
- VPC Flow Logs
- CloudTrail event logs
- DNS logs
- S3 data events
- EKS audit logs
- RDS login activity
- Lambda network activity

**Finding Types:**

**1. Reconnaissance Threats**
- Port scanning
- VPC probe activities
- Unusual API patterns

**2. Instance Compromise**
- Backdoor communication
- Cryptocurrency mining
- Malware detection
- Unusual protocols

**3. Account Compromise**
- Credential exfiltration
- Unusual API calls
- Login from anomalous locations
- Password policy changes

**4. S3 Bucket Compromise**
- Suspicious data access patterns
- Credentials exposure
- Policy changes for public access

**5. Kubernetes Threats (EKS)**
- Anonymous API requests
- Privilege escalation attempts
- Suspicious container behavior

**GuardDuty Severity Levels:**
- **High (7.0-8.9)** - Active security threat, immediate investigation
- **Medium (4.0-6.9)** - Suspicious activity, investigate soon
- **Low (1.0-3.9)** - Informational, monitor

#### GuardDuty Extended Threat Detection (2025)

**New Capabilities:**
- AI-powered behavioral analytics
- Multi-stage threat correlation
- Runtime monitoring for EKS
- Enhanced S3 threat detection
- RDS login activity monitoring

**Exam Scenario:**
```
Question: Company needs to detect compromised EC2 instances in near real-time
          without installing agents or modifying applications.

Options:
A) Install antivirus on all instances
B) Enable GuardDuty
C) Configure CloudWatch alarms on network metrics
D) Use AWS Inspector

Answer: B - Enable GuardDuty
Why: GuardDuty analyzes VPC Flow Logs, CloudTrail, and DNS logs without
     requiring agents. It uses ML to detect anomalous behavior and provides
     near real-time threat detection.
```

#### GuardDuty Response Patterns

**Pattern 1: Automated Block**
```
GuardDuty Finding (High Severity)
  → EventBridge Rule
    → Lambda Function
      → Isolate instance (new security group)
      → Create forensic snapshot
      → Notify security team
      → Create Security Hub finding
```

**Pattern 2: Enrichment and Investigation**
```
GuardDuty Finding
  → EventBridge Rule
    → Lambda Function
      → Query additional context (CloudTrail, VPC Flow Logs)
      → Enrich finding with WHOIS/IP reputation
      → Create Detective investigation
      → Send to SIEM
```

**Pattern 3: Automated Ticketing**
```
GuardDuty Finding
  → EventBridge Rule
    → Step Functions Workflow
      → Check finding severity and type
      → Create Jira/ServiceNow ticket
      → Assign to appropriate team
      → Set SLA based on severity
```

---

### IAM Access Analyzer - Resource Exposure Detection

**What it does:** Uses automated reasoning to identify resources shared outside your AWS account or organization

**Supported Resource Types:**
- S3 buckets
- IAM roles
- KMS keys
- Lambda functions and layers
- SQS queues
- Secrets Manager secrets
- SNS topics
- ECR repositories
- RDS DB snapshots
- EBS snapshots
- EFS file systems
- DynamoDB tables (with Point-in-Time Recovery)

#### 2025 Enhancements

**Automated Reasoning Technology:**
- Analyzes complex permission layers across multiple policy types
- Resource policies
- IAM policies
- VPC endpoints
- Service Control Policies (SCPs)
- Session policies

**Continuous Monitoring:**
- Daily analysis of resource access
- Alerts on new external access grants
- Validates that only intended access exists

**Use Cases:**

**1. Verify Intended Access:**
```
Scenario: Ensure only authorized accounts can access S3 bucket
Solution: Create Access Analyzer
         - Define zone of trust (your org)
         - Review findings for external access
         - Remediate unintended access
```

**2. Validate Before Deployment:**
```
Scenario: Need to verify new IAM policy doesn't grant unintended permissions
Solution: Use Access Analyzer policy validation
         - Analyzes policy before deployment
         - Identifies overly permissive rules
         - Suggests policy improvements
```

**3. Unused Access Analysis:**
```
Scenario: Reduce attack surface by removing unused permissions
Solution: Enable unused access finding
         - Identifies IAM users/roles with unused permissions
         - Shows last used date for each permission
         - Recommend permission removal
```

#### Access Analyzer Findings

**Finding Types:**
- **External** - Resource shared outside zone of trust
- **Public** - Resource accessible by any AWS account
- **Cross-account** - Resource shared with specific accounts
- **Unused access** - Permissions not used in tracking period (90 days)

**Remediation Workflow:**
```
1. Review finding details
2. Determine if access is intended
3. If unintended:
   - Update resource policy
   - Remove cross-account permissions
   - Enable block public access (S3)
4. Archive finding if access is intended
5. Monitor for new findings
```

**Exam Scenario:**
```
Question: Security audit reveals several S3 buckets shared with external
          accounts. Need to identify ALL resources with external access.

Options:
A) Manually review all resource policies
B) Use Config rules to check policies
C) Enable IAM Access Analyzer
D) Review CloudTrail logs

Answer: C - Enable IAM Access Analyzer
Why: Access Analyzer automatically discovers and reports all resources
     shared outside your zone of trust. It uses automated reasoning to
     analyze complex permission scenarios.
```

---

### Amazon Inspector - Vulnerability Scanning

**What it does:** Automated vulnerability management service

**Scan Types:**

**1. EC2 Instance Scanning**
- Operating system vulnerabilities (CVEs)
- Network reachability issues
- Requires Systems Manager agent

**2. Container Image Scanning (ECR)**
- Scans on push to ECR
- Continuous rescanning of images
- Identifies packages with CVEs

**3. Lambda Function Scanning**
- Code vulnerabilities in application dependencies
- Package vulnerabilities in layers
- Automatic rescanning on code/dependency updates

**Inspector Findings:**

**Severity:**
- **Critical** - Publicly exploitable, high impact
- **High** - Exploitable, significant impact
- **Medium** - Harder to exploit, medium impact
- **Low** - Difficult to exploit, low impact
- **Informational** - No security risk

**Risk Score:**
Inspector calculates risk score based on:
- CVE severity (CVSS score)
- Network exposure (public vs private)
- Exploit availability
- Fix availability

**Automated Response:**
```
Inspector Finding (Critical)
  → EventBridge Rule
    → Step Functions Workflow
      → Check if patch available
        → Yes: Systems Manager patch deployment
        → No: Isolate resource, notify security team
      → Update finding in Security Hub
      → Create ticket for tracking
```

**Best Practices:**
- Enable continuous scanning (automatically scans on changes)
- Integrate with Security Hub for centralized view
- Set up EventBridge rules for high/critical findings
- Suppress findings for accepted risks (with justification)
- Re-scan after remediation

---

### Amazon Detective - Security Investigation

**What it does:** Makes it easy to analyze, investigate, and quickly identify the root cause of security findings

**Data Sources:**
- VPC Flow Logs
- CloudTrail logs
- GuardDuty findings
- EKS audit logs

**Key Features:**

**1. Behavior Graph**
- Automatically collects and processes log data
- Creates unified view of resource interactions
- Maintains up to 1 year of historical data
- Visualizes relationships between resources

**2. Detective Investigations (2025)**
- Automatic investigation of IAM users and roles
- ML-based analysis to identify indicators of compromise
- API-driven: `StartInvestigation`
- Provides actionable insights

**3. Finding Groups**
- Groups related findings that may indicate same security issue
- Reduces alert fatigue
- Shows timeline and scope of activity

**Investigation Workflow:**
```
1. Start from GuardDuty finding or Security Hub alert
2. Pivot to Detective
3. View entity timeline (what happened when)
4. Analyze:
   - IP addresses involved
   - API calls made
   - Resources accessed
   - User agents used
5. Determine if activity is:
   - Legitimate (false positive)
   - Compromised credentials
   - Malicious insider
   - Compromised instance
6. Take appropriate action
```

**Exam Scenario:**
```
Question: GuardDuty detected unusual API calls from an IAM user.
          Need to investigate full scope of activity.

Options:
A) Query CloudTrail logs with Athena
B) Use CloudWatch Logs Insights
C) Use Amazon Detective
D) Review IAM access advisor

Answer: C - Amazon Detective
Why: Detective automatically aggregates and visualizes activity across
     all data sources, making it easy to see full scope of user activity,
     related entities, and timeline. Much faster than manual log analysis.
```

---

### AWS Audit Manager - Compliance Automation

**What it does:** Simplifies audit preparation through automated evidence collection

**Supported Frameworks:**
- SOC 2
- PCI DSS
- HIPAA
- GDPR
- FedRAMP
- Custom frameworks

**How it Works:**
1. Select compliance framework
2. Audit Manager creates assessment
3. Automatically collects evidence:
   - CloudTrail events
   - Config compliance
   - Security Hub findings
   - CloudWatch Logs
4. Organize evidence by control
5. Review and generate audit reports

**Use Cases:**
- Continuous compliance monitoring
- Audit preparation
- Evidence management
- Compliance reporting

---

## Security Improvement Strategies

### Strategy 1: Automated Vulnerability Remediation

**Architecture:**
```
Inspector Finding (Critical CVE)
  → EventBridge Rule (filter: critical + patch available)
    → Systems Manager Automation
      → Create snapshot
      → Apply patch
      → Verify health
      → Update Security Hub
```

**Implementation Considerations:**
- Test automation in non-production first
- Include rollback procedures
- Set maintenance windows
- Rate limit to avoid overwhelming systems

### Strategy 2: Threat Detection and Response

**Multi-Layer Detection:**
```
Network Layer:
  GuardDuty (VPC Flow Logs analysis)
  → Detects port scanning, C2 communication

Application Layer:
  GuardDuty (CloudTrail analysis)
  → Detects unusual API activity

Data Layer:
  Macie
  → Detects sensitive data exposure

Host Layer:
  Inspector
  → Detects vulnerabilities
```

**Coordinated Response:**
```
1. GuardDuty detects threat
2. EventBridge triggers investigation
3. Detective analyzes scope
4. Automated containment (if applicable)
5. Security Hub creates incident
6. Notify security team
7. Systems Manager isolation playbook
8. Forensics snapshot creation
```

### Strategy 3: Access Management Improvements

**Continuous IAM Rightsizing:**
```
1. IAM Access Analyzer identifies unused permissions
2. Review with application teams
3. Create new policy with only used permissions
4. Test in non-production
5. Deploy updated policy
6. Monitor for access issues
7. Iterate
```

**MFA Enforcement (2025):**
- Root user MFA now mandatory across all account types
- FIDO-certified security keys supported
- Virtual MFA devices (TOTP)
- Hardware MFA devices

**Best Practice Policies:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyAllExceptListedIfNoMFA",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:GetUser",
        "iam:ListMFADevices",
        "iam:ListVirtualMFADevices",
        "iam:ResyncMFADevice",
        "sts:GetSessionToken"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

### Strategy 4: Data Protection Enhancements

**S3 Security Posture:**
```
Continuous Monitoring:
1. Access Analyzer → Detect public/external access
2. Macie → Discover sensitive data
3. Security Hub → S3 security best practices
4. Config Rules → Encryption and versioning compliance

Automated Remediation:
- Block public access automatically
- Enable default encryption
- Enable versioning
- Configure lifecycle policies
- Enable access logging
```

**Encryption Key Management:**
```
KMS Key Policy Best Practices:
- Separate keys for different data classifications
- Enable key rotation
- Use key policies to limit access
- Monitor key usage with CloudTrail
- Set up CloudWatch alarms for key deletion
```

### Strategy 5: Network Security Improvements

**Zero Trust Network:**
```
Traditional: Trust internal network
Zero Trust: Verify every request

Implementation:
1. Segment VPCs by sensitivity
2. Require authentication for all service calls
3. Use PrivateLink instead of VPC peering
4. Implement micro-segmentation with security groups
5. Enable VPC Flow Logs
6. Monitor with GuardDuty
```

**WAF Protection Layers:**
```
CloudFront → AWS WAF (edge)
  - DDoS protection with Shield
  - Geographic restrictions
  - Rate limiting

ALB → AWS WAF (regional)
  - OWASP Top 10 protection
  - IP reputation lists
  - Custom rules for application logic

API Gateway
  - Throttling
  - Usage plans
  - Resource policies
```

---

## Security Assessment and Gap Analysis

### Security Review Checklist

**Identity and Access:**
- [ ] MFA enabled for all users
- [ ] No access keys for root account
- [ ] Unused IAM users/roles removed
- [ ] Least privilege policies enforced
- [ ] Access Analyzer findings addressed
- [ ] Password policy meets requirements
- [ ] Cross-account access follows best practices

**Data Protection:**
- [ ] Encryption at rest for all sensitive data
- [ ] Encryption in transit (TLS 1.2+)
- [ ] S3 block public access enabled
- [ ] Secrets in Secrets Manager (not hardcoded)
- [ ] Database encryption enabled
- [ ] EBS volumes encrypted
- [ ] S3 versioning enabled for critical buckets

**Logging and Monitoring:**
- [ ] CloudTrail enabled in all regions
- [ ] GuardDuty enabled in all regions
- [ ] Security Hub enabled with standards
- [ ] Config enabled and recording
- [ ] VPC Flow Logs enabled
- [ ] S3 access logging enabled
- [ ] CloudWatch alarms for security events

**Network Security:**
- [ ] Security groups follow least privilege
- [ ] No unused security groups
- [ ] Network ACLs configured appropriately
- [ ] No overly permissive rules (0.0.0.0/0)
- [ ] PrivateLink used for service access
- [ ] VPN/Direct Connect secured
- [ ] WAF enabled for public endpoints

**Compliance and Governance:**
- [ ] Security Hub standards enabled
- [ ] Config rules for compliance
- [ ] Automated compliance reporting
- [ ] Regular security assessments
- [ ] Incident response plan documented
- [ ] Backup and disaster recovery tested

### Gap Prioritization Matrix

| Severity | Exposure | Priority | Action Timeline |
|----------|----------|----------|----------------|
| Critical | Public | P0 | Immediate (hours) |
| Critical | Internal | P1 | 24-48 hours |
| High | Public | P1 | 24-48 hours |
| High | Internal | P2 | 1 week |
| Medium | Public | P2 | 1 week |
| Medium | Internal | P3 | 1 month |
| Low | Any | P4 | Next quarter |

---

## Tricky Exam Scenarios

### Scenario 1: Multi-Service Security Detection

```
Question: Company needs comprehensive threat detection including:
          - Compromised instances
          - Unusual API activity
          - Sensitive data exposure
          - Container vulnerabilities

Which combination of services?

Options:
A) GuardDuty + Inspector + Macie + Security Hub
B) CloudWatch + CloudTrail + Config
C) Security Hub only
D) GuardDuty + Detective

Answer: A
Why:
- GuardDuty: Threat detection (instances, API activity)
- Inspector: Vulnerability scanning (containers, instances)
- Macie: Sensitive data discovery
- Security Hub: Centralized findings from all services
```

### Scenario 2: Automated Remediation Decision

```
Question: Security Hub finding: "S3 bucket has public read access"
          Should this be auto-remediated?

Consider:
- Bucket contains CloudFront logs (intentionally public)
- Bucket tagged Environment=Production
- Finding severity: HIGH

Options:
A) Yes, always block public access
B) No, requires manual review
C) Auto-remediate only if not tagged AllowPublic=true
D) Only notify, never remediate

Answer: C
Why: Conditional automation based on tags allows flexibility.
      Some buckets (CDN logs, public websites) legitimately need
      public access. Tags indicate intentional configuration.
```

### Scenario 3: IAM Access Analyzer vs Security Hub

```
Question: Need to find all resources shared with external accounts.
          Which service?

Options:
A) Security Hub
B) IAM Access Analyzer
C) Config rules
D) Trusted Advisor

Answer: B
Why: Access Analyzer specifically designed to identify resources
      shared outside your zone of trust. Security Hub aggregates
      findings but doesn't perform deep access analysis.
```

### Scenario 4: GuardDuty Cost Optimization

```
Question: GuardDuty costs are high due to VPC Flow Logs in high-traffic VPC.
          Need to reduce costs without losing security visibility.

Options:
A) Disable GuardDuty in that region
B) Reduce VPC Flow Log sampling
C) Use GuardDuty in master account only
D) Keep GuardDuty, optimize VPC Flow Log storage separately

Answer: D
Why: GuardDuty analyzes flow logs but doesn't store them long-term.
      Flow log storage costs are separate. Don't disable GuardDuty
      as it provides critical threat detection. GuardDuty pricing
      is based on volume analyzed, which you can't easily reduce
      without losing visibility.

Note: VPC Flow Logs can be sent directly to S3 with reduced
      retention or filtered to only capture rejected connections.
```

### Scenario 5: Detective Investigation Scope

```
Question: GuardDuty found suspicious activity from IAM role 3 days ago.
          Need to understand full scope: what resources were accessed,
          from which IPs, what data was downloaded.

Options:
A) Query CloudTrail logs with Athena
B) Use CloudWatch Logs Insights
C) Use Amazon Detective
D) Review IAM access advisor

Answer: C
Why: Detective maintains behavior graph showing relationships and
      timeline. It automatically correlates CloudTrail, VPC Flow Logs,
      and GuardDuty findings. Much faster than manual log analysis.
```

---

## Cost Considerations

### Service Pricing Overview

| Service | Pricing Model | Optimization Strategy |
|---------|---------------|---------------------|
| **Security Hub** | Per finding + per compliance check | Disable unused standards, use finding aggregation |
| **GuardDuty** | Per GB analyzed (VPC Flows, DNS, CloudTrail) | Can't reduce without losing visibility; budget accordingly |
| **Inspector** | Per instance/image/function scanned | Scan only production, schedule scans appropriately |
| **Detective** | Per GB ingested | 12-month retention, minimal control over costs |
| **Access Analyzer** | Free | No cost optimization needed |
| **Macie** | Per GB scanned + per bucket monitored | Scan only sensitive data stores, use sampling |

### Cost Optimization Tips

**Security Hub:**
```
Reduce costs by:
- Only enable needed standards (not all 4)
- Use finding aggregation (central account)
- Suppress informational findings
- Archive resolved findings

Average cost: $1-5 per account per month
```

**GuardDuty:**
```
Costs driven by:
- VPC Flow Log volume (largest component)
- CloudTrail event volume
- DNS query volume
- S3/EKS/RDS logs (if enabled)

Cannot easily reduce without losing coverage
Budget: $20-200+ per account per month based on activity
```

**Inspector:**
```
Reduce costs by:
- Scan production only
- Schedule scans (not continuous for dev/test)
- Use finding suppression for accepted risks

Pricing:
- EC2: $1.29 per instance per month
- ECR: $0.09 per image scan
- Lambda: $0.30 per function per month
```

---

## Compliance and Governance

### Compliance Frameworks Mapping

**CIS AWS Foundations Benchmark:**
- IAM controls (password policy, MFA, access keys)
- Logging controls (CloudTrail, Config, VPC Flow Logs)
- Monitoring controls (CloudWatch alarms for security events)
- Networking controls (security groups, NACLs)

**NIST 800-53:**
- Access control (AC family)
- Audit and accountability (AU family)
- Incident response (IR family)
- System and communications protection (SC family)

**PCI DSS:**
- Network security controls
- Encryption requirements
- Access control requirements
- Logging and monitoring

### Security Hub Controls

**Example Controls:**

**[IAM.1] IAM policies should not allow full "*:*" administrative privileges**
```
Why: Overly broad permissions violate least privilege
Remediation: Create granular policies for specific services/actions
Auto-remediate: No (requires understanding business needs)
```

**[S3.1] S3 Block Public Access setting should be enabled**
```
Why: Prevents accidental public exposure
Remediation: Enable block public access at bucket and account level
Auto-remediate: Yes (unless tagged AllowPublic=true)
```

**[CloudTrail.1] CloudTrail should be enabled and configured**
```
Why: Required for audit trail and compliance
Remediation: Create multi-region trail with encryption
Auto-remediate: Yes
```

---

## Hands-On Labs

### Lab 1: Security Hub with Automated Remediation

**Objective:** Set up centralized security monitoring with auto-remediation

**Steps:**
1. Enable Security Hub in management account
2. Enable AWS Foundational Security Best Practices standard
3. Create EventBridge rule for critical S3 findings
4. Create Lambda function to enable S3 block public access
5. Deploy AWS Automated Security Response solution
6. Test by creating S3 bucket with public access
7. Verify automatic remediation
8. Review finding status change

### Lab 2: GuardDuty Threat Detection

**Objective:** Detect and respond to threats

**Steps:**
1. Enable GuardDuty in all regions
2. Generate sample findings (GuardDuty console)
3. Create EventBridge rule for high-severity findings
4. Create SNS topic for notifications
5. Create Lambda function to:
   - Log finding details
   - Isolate compromised instance (if EC2)
   - Create forensic snapshot
6. Test with real activity (port scan, unusual API calls)
7. Review Detective for investigation

### Lab 3: IAM Access Analyzer

**Objective:** Identify and remediate external resource access

**Steps:**
1. Enable IAM Access Analyzer
2. Define zone of trust (your organization)
3. Create test resources with external access:
   - S3 bucket shared with external account
   - Lambda function with resource policy
   - KMS key with cross-account access
4. Review findings
5. Validate if access is intended
6. Remediate unintended access
7. Archive intended findings
8. Set up alerts for new findings

### Lab 4: Inspector Vulnerability Scanning

**Objective:** Continuous vulnerability management

**Steps:**
1. Enable Inspector for EC2, ECR, Lambda
2. Deploy instances and container images
3. Wait for initial scan results
4. Review findings and risk scores
5. Create EventBridge rule for critical findings
6. Implement automated patching:
   - Systems Manager for EC2
   - New image builds for containers
7. Rescan after remediation
8. Suppress accepted risks with justification

---

## Summary and Key Takeaways

### Must Know for Exam

1. **Security Hub** - Centralized security, aggregates findings, automated remediation
2. **GuardDuty** - Threat detection using ML, no agents required, analyzes logs
3. **IAM Access Analyzer** - Finds external resource access, automated reasoning
4. **Inspector** - Vulnerability scanning for EC2/ECR/Lambda, continuous monitoring
5. **Detective** - Security investigation, behavior graphs, root cause analysis
6. **Automated remediation** - EventBridge + Lambda/Systems Manager

### When to Use Which Service

```
Find vulnerabilities → Inspector
Detect threats → GuardDuty
Investigate incidents → Detective
Find external access → Access Analyzer
Centralize findings → Security Hub
Automate remediation → EventBridge + Lambda/SSM
Compliance automation → Audit Manager
```

### Decision Framework

**Should you auto-remediate?**
```
Low Risk + High Confidence = Auto-remediate
  Examples: Enable encryption, block public access (with tag exceptions)

High Risk OR Low Confidence = Manual review
  Examples: IAM policy changes, security group modifications

Always = Alert + Create ticket
  For audit trail and awareness
```

### Common Exam Traps

- **GuardDuty doesn't require agents** - it analyzes existing logs
- **Security Hub doesn't detect threats** - it aggregates findings from other services
- **Access Analyzer is free** - don't choose costly alternatives
- **Detective requires GuardDuty** - they work together
- **Inspector has three scan types** - EC2, ECR, Lambda (not just EC2)

---

**Next:** [Task 3.3 - Performance Optimization](./task-3.3-performance-optimization.md)
