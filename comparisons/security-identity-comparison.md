# AWS Security & Identity Services Comparison

## Table of Contents
- [High-Level Overview](#high-level-overview)
- [Detailed Comparison Table](#detailed-comparison-table)
- [Decision Tree](#decision-tree)
- [Common Exam Scenarios](#common-exam-scenarios)
- [Key Differences Summary](#key-differences-summary)
- [Exam Strategy & Keywords](#exam-strategy--keywords)
- [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## High-Level Overview

### IAM (Identity and Access Management)

**Purpose**: Central identity and access management service for AWS resources

**Key Features**:
- Users, Groups, Roles, and Policies
- Fine-grained permissions using JSON policies
- Multi-factor authentication (MFA)
- Identity federation (SAML 2.0, OIDC)
- Cross-account access via roles
- Service Control Policies (SCPs) at organization level
- Permission boundaries for delegation
- Access Analyzer for policy validation

**Best For**: Managing AWS resource access, service-to-service authentication, cross-account access, temporary credentials

⚠️ **EXAM TIP**: IAM is for AWS resource authorization, NOT for application user authentication

---

### AWS Cognito

**Purpose**: User identity and authentication service for web and mobile applications

**Key Components**:
- **User Pools**: User directory for sign-up/sign-in, includes hosted UI
- **Identity Pools**: Provide temporary AWS credentials to users
- Social identity providers (Google, Facebook, Apple, Amazon)
- SAML-based identity providers
- Custom authentication flows with Lambda triggers
- Advanced security features (adaptive authentication, compromised credentials)

**Best For**: Mobile/web app user authentication, social login, providing AWS resource access to end users

⚠️ **EXAM TIP**: Cognito is for APPLICATION users, IAM is for AWS resources. Cognito Identity Pools GENERATE temporary IAM credentials.

---

### AWS Directory Service

**Purpose**: Managed directory services for Active Directory workloads

**Three Flavors**:

#### 1. AWS Managed Microsoft AD
- Full Microsoft Active Directory running in AWS
- Supports AD-aware applications, LDAP, Kerberos, NTLM
- Multi-AZ deployment with automatic failover
- Trust relationships with on-premises AD (one-way, two-way, forest)
- Can be used for SSO to AWS Management Console
- Supports up to 500,000 objects (expandable)

#### 2. AD Connector
- Proxy/gateway to redirect requests to on-premises AD
- NO directory data stored in AWS
- Requires VPN or Direct Connect
- Users authenticate against on-premises AD
- SSO to AWS Management Console using on-premises credentials
- Lower cost than Managed AD

#### 3. Simple AD
- Standalone managed directory powered by Samba 4
- Compatible with basic AD features
- NO trust relationships with other domains
- Up to 500 users (small) or 5,000 users (large)
- Linux workloads, simple LDAP applications

**Best For**:
- Managed AD: AD-aware apps in AWS, lift-and-shift migrations
- AD Connector: Existing on-premises AD with AWS SSO needs
- Simple AD: Basic LDAP for Linux apps, development/testing

⚠️ **EXAM TIP**: AD Connector does NOT store directory data in AWS; it's a proxy. Managed AD can operate independently from on-premises.

---

### AWS KMS (Key Management Service)

**Purpose**: Create and control encryption keys for AWS services and applications

**Key Features**:
- Customer Master Keys (CMKs) / KMS Keys
- Three types: AWS managed, Customer managed, Custom key store (CloudHSM)
- Automatic key rotation for customer managed keys
- Envelope encryption for large data
- Integration with 100+ AWS services
- Key policies and IAM policies for access control
- CloudTrail logging for all key usage
- Regional service with multi-region keys available

**Encryption Types**:
- Symmetric (AES-256): Most common, key never leaves KMS
- Asymmetric (RSA, ECC): Public/private key pairs, can download public key

**Best For**: Encrypting data at rest, envelope encryption, centralized key management, compliance requirements

⚠️ **EXAM TIP**: KMS keys are region-specific by default. For encryption across regions, use multi-region keys or copy encrypted snapshots with re-encryption.

---

### AWS Secrets Manager

**Purpose**: Securely store, manage, and rotate secrets (passwords, API keys, credentials)

**Key Features**:
- Automatic secret rotation with Lambda
- Native rotation for RDS, DocumentDB, Redshift
- Fine-grained access control with IAM and resource policies
- Encryption at rest using KMS
- Cross-account secret access
- Secret versioning and staging labels
- Integration with RDS, Redshift, DocumentDB
- Audit with CloudTrail

**Best For**: Database credentials, API keys, OAuth tokens, automatic rotation requirements

⚠️ **EXAM TIP**: Secrets Manager has AUTOMATIC rotation capability. Parameter Store does NOT have native automatic rotation (you must build it yourself).

---

### SSM Parameter Store

**Purpose**: Centralized storage for configuration data and secrets

**Key Features**:
- Store parameters as String, StringList, SecureString
- SecureString encrypted with KMS
- Parameter hierarchies (e.g., /prod/db/password)
- Parameter policies (expiration, notification)
- Versioning and change tracking
- No additional charge for Standard parameters
- Integration with Systems Manager and other AWS services

**Two Tiers**:
- **Standard**: Free, up to 10,000 parameters, 4 KB size, no parameter policies
- **Advanced**: Charges apply, up to 100,000 parameters, 8 KB size, parameter policies

**Best For**: Application configuration, simple secrets without rotation needs, cost-conscious deployments

⚠️ **EXAM TIP**: Parameter Store is cheaper but lacks automatic rotation. Use Secrets Manager for database credentials that need rotation; use Parameter Store for static config or when cost is a concern.

---

## Detailed Comparison Table

| Feature | IAM | Cognito | Directory Service | KMS | Secrets Manager | Parameter Store |
|---------|-----|---------|-------------------|-----|-----------------|-----------------|
| **Primary Purpose** | AWS resource access control | App user authentication | Microsoft AD compatibility | Encryption key management | Secret storage & rotation | Configuration & secret storage |
| **Target Users** | AWS resources, employees | Application end users | Windows/AD workloads | Encryption operations | Applications needing secrets | Applications needing config |
| **Authentication** | Yes (IAM users) | Yes (User Pools) | Yes (AD authentication) | No | No | No |
| **Authorization** | Yes (Policies) | Yes (via Identity Pools → IAM) | Yes (AD groups) | Yes (Key policies) | Yes (Resource policies) | Yes (IAM policies) |
| **Encryption** | N/A | Data at rest encrypted | Data at rest encrypted | Core purpose | KMS encrypted at rest | KMS encrypted (SecureString) |
| **Automatic Rotation** | Access keys (manual) | N/A | Password policies | Yes (annual, optional) | Yes (built-in) | No (manual) |
| **Federation** | SAML, OIDC | SAML, OIDC, Social | AD federation | N/A | N/A | N/A |
| **Cross-Account** | Yes (Assume Role) | Yes (with Identity Pools) | Yes (with trusts) | Yes (Key policies) | Yes (Resource policies) | Yes (Resource policies) |
| **Pricing** | Free | Free tier, then pay-per-MAU | Hourly charges | Per API call, per key | Per secret/month + API calls | Free (Standard), charges (Advanced) |
| **Regional/Global** | Global service | Regional | Regional | Regional | Regional | Regional |
| **Integration** | All AWS services | Mobile/Web apps | Windows apps, SSO | 100+ AWS services | RDS, DocumentDB, Redshift | Systems Manager, ECS, Lambda |
| **MFA Support** | Yes | Yes | Yes (via AD) | No | No | No |
| **Audit Logging** | CloudTrail | CloudTrail | CloudTrail | CloudTrail (all key usage) | CloudTrail | CloudTrail |
| **API Rate Limits** | Yes (soft limits) | Yes | N/A | Yes (5,500/sec shared) | Yes | Yes (1,000 TPS standard) |
| **Versioning** | Policy versions | N/A | N/A | Key rotation versions | Yes (staging labels) | Yes |
| **Max Size** | Policy: 6,144 chars (roles) | N/A | 500K objects (Managed AD) | 4 KB direct encrypt | 64 KB | 4 KB (Standard), 8 KB (Advanced) |

---

## Decision Tree

### When to Choose Each Service

```
START: What do you need to secure?

├─ AWS Resource Access Control
│  ├─ Within AWS account → IAM Users/Roles
│  ├─ Cross-account access → IAM Roles (AssumeRole)
│  ├─ Service-to-service → IAM Roles
│  ├─ Federated access from corporate directory → IAM + SAML/OIDC
│  └─ Temporary credentials → IAM Roles + STS
│
├─ Application User Authentication
│  ├─ Mobile/Web app users → Cognito User Pools
│  ├─ Need social login → Cognito User Pools (Google, Facebook, etc.)
│  ├─ Need AWS resource access for app users → Cognito Identity Pools
│  └─ Custom authentication flow → Cognito + Lambda triggers
│
├─ Active Directory Integration
│  ├─ Need actual AD in AWS
│  │  ├─ AD-aware applications → AWS Managed Microsoft AD
│  │  ├─ Lift-and-shift Windows apps → AWS Managed Microsoft AD
│  │  └─ Trust with on-premises AD → AWS Managed Microsoft AD
│  ├─ Have existing on-premises AD
│  │  ├─ Don't want to replicate directory → AD Connector
│  │  └─ Need SSO to AWS Console only → AD Connector
│  └─ Simple LDAP for Linux apps → Simple AD
│
├─ Encryption & Key Management
│  ├─ Data at rest encryption → KMS
│  ├─ Envelope encryption for large data → KMS
│  ├─ Compliance (FIPS 140-2 Level 2) → KMS
│  ├─ Need full control of HSM (FIPS 140-2 Level 3) → CloudHSM
│  └─ Multi-region encrypted data → KMS Multi-Region Keys
│
└─ Secret & Configuration Storage
   ├─ Database credentials that need rotation
   │  ├─ RDS/DocumentDB/Redshift → Secrets Manager
   │  └─ Other databases → Secrets Manager + Lambda rotation
   ├─ API keys, OAuth tokens needing rotation → Secrets Manager
   ├─ Static configuration data → Parameter Store
   ├─ Simple secrets, cost-conscious → Parameter Store (SecureString)
   └─ Large volume of parameters → Parameter Store Advanced
```

---

## Common Exam Scenarios

### Scenario 1: Cross-Account S3 Access

**Question**: Company A needs to give Company B access to an S3 bucket. What's the best approach?

**Options**:
1. Create IAM users in Company A for Company B
2. Use IAM roles with cross-account trust
3. Make the S3 bucket public
4. Share access keys

**Answer**: Option 2 - IAM Roles with cross-account trust

**Explanation**:
- Create a role in Company A's account with S3 access permissions
- Establish trust relationship allowing Company B's account to assume the role
- Company B users assume the role using STS AssumeRole
- Provides temporary credentials, no shared secrets
- Can audit access through CloudTrail

⚠️ **EXAM TIP**: Cross-account access should ALWAYS use IAM roles, never shared IAM users or access keys. Look for "AssumeRole" in the correct answer.

---

### Scenario 2: Mobile App User Authentication

**Question**: A mobile app needs to authenticate users and allow them to upload photos to S3. Users should only access their own folders.

**Solution**:
1. **Cognito User Pool**: Authenticate users (sign-up, sign-in)
2. **Cognito Identity Pool**: Exchange authenticated token for temporary AWS credentials
3. **IAM Policy**: Use policy variables for dynamic permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::my-bucket/${cognito-identity.amazonaws.com:sub}/*"
    }
  ]
}
```

**Key Points**:
- User Pool handles authentication
- Identity Pool provides AWS credentials
- Policy variable `${cognito-identity.amazonaws.com:sub}` ensures users only access their folder
- Temporary credentials automatically rotate

⚠️ **EXAM TIP**: Cognito User Pools (authentication) + Identity Pools (AWS credentials) is the standard pattern for mobile/web apps accessing AWS resources.

---

### Scenario 3: Enterprise Federation to AWS Console

**Question**: Enterprise wants 1,000 employees to access AWS Console using corporate Active Directory credentials without creating IAM users.

**Options**:
1. Create 1,000 IAM users manually
2. AWS Managed Microsoft AD with trust to on-premises
3. AD Connector
4. IAM Identity Provider with SAML

**Answer**: Multiple valid approaches depending on requirements:

**Option A: AD Connector** (Most cost-effective if you have on-premises AD)
- Proxy to on-premises AD
- Enables AWS Console SSO
- No directory data in AWS
- Requires VPN/Direct Connect

**Option B: IAM Identity Provider with SAML** (If using SAML-based IdP)
- Configure corporate IdP (like ADFS, Okta) for SAML
- Create IAM Identity Provider
- Map AD groups to IAM roles
- Users authenticate via IdP, assume roles

**Option C: AWS Managed Microsoft AD** (If migrating AD to AWS)
- Full AD in AWS
- Trust relationship with on-premises
- More expensive but independent operation

⚠️ **EXAM TIP**: For existing on-premises AD + AWS Console SSO with minimal cost → AD Connector. For SAML-based IdP → IAM Identity Provider. Look for keywords like "existing AD", "no replication", "cost-effective".

---

### Scenario 4: RDS Password Rotation

**Question**: Compliance requires RDS database passwords to rotate every 30 days. What's the best solution?

**Options**:
1. Store in Parameter Store and rotate with Lambda
2. Store in Secrets Manager with automatic rotation
3. Store in S3 with lifecycle policies
4. Manual rotation and update application config

**Answer**: Option 2 - Secrets Manager with automatic rotation

**Explanation**:
- Secrets Manager has native RDS rotation support
- Automatically rotates credentials without downtime
- Lambda function handles rotation logic
- Applications retrieve current password via API
- CloudTrail logs all access
- Can rotate on schedule (30 days) or on-demand

**Why not Parameter Store?**
- No built-in automatic rotation
- Would need to build Lambda rotation function yourself
- More complex to maintain

⚠️ **EXAM TIP**: Keywords "automatic rotation" + "database credentials" = Secrets Manager. Parameter Store requires manual rotation setup.

---

### Scenario 5: Encryption Key Management for Multi-Region App

**Question**: Application in us-east-1 and eu-west-1 needs to encrypt/decrypt data in both regions without cross-region API calls.

**Options**:
1. Single KMS key in us-east-1, replicate data
2. Separate KMS keys per region, re-encrypt when copying
3. KMS Multi-Region keys
4. CloudHSM cluster

**Answer**: Option 3 - KMS Multi-Region Keys

**Explanation**:
- Multi-Region keys have same key ID and key material across regions
- Can encrypt in one region, decrypt in another
- No cross-region API calls (lower latency)
- Independent key policies per region
- Reduces complexity for global applications

**When to use separate keys?**
- Data sovereignty requirements (data must not be decryptable outside region)
- Different security requirements per region

⚠️ **EXAM TIP**: "Multi-region application" + "encrypt in one region, decrypt in another" + "low latency" = Multi-Region KMS keys.

---

### Scenario 6: Least Privilege Delegation

**Question**: DevOps team needs to create IAM roles for developers, but you want to limit what permissions they can grant.

**Solution**: IAM Permission Boundaries

**Implementation**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:PutRolePolicy",
        "iam:AttachRolePolicy"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "iam:PermissionsBoundary": "arn:aws:iam::123456789012:policy/DevBoundary"
        }
      }
    }
  ]
}
```

**Key Points**:
- Permission boundary defines maximum permissions
- DevOps can create roles but only within boundary
- Developer roles cannot exceed boundary even if policy grants more
- Effective permissions = Identity policy ∩ Permission boundary

⚠️ **EXAM TIP**: "Delegate permission management" + "prevent privilege escalation" = Permission Boundaries.

---

### Scenario 7: Hybrid AD Architecture

**Question**: Company has on-premises AD with 50,000 users. Migrating Windows apps to AWS that require AD authentication. On-premises AD must remain authoritative.

**Solution**: AWS Managed Microsoft AD with Two-Way Trust

**Architecture**:
```
On-Premises AD (authoritative)
    ↕ (Two-way trust via VPN/DX)
AWS Managed Microsoft AD
    ↓ (Authentication)
Windows EC2 instances / AD-aware apps
```

**Key Decisions**:
- **Why Managed AD, not AD Connector?**
  - Apps in AWS need local AD (performance, reliability)
  - Works even if VPN goes down
  - Can handle local AWS workloads independently

- **Why Two-Way Trust?**
  - Users from either domain can access resources in both
  - Flexibility for gradual migration

- **Why not One-Way Trust?**
  - Use if AWS AD users should NOT access on-premises resources

⚠️ **EXAM TIP**: "AD-aware applications in AWS" + "on-premises AD" + "high availability" = Managed AD with trust. "SSO only" + "no local apps" = AD Connector.

---

### Scenario 8: Service-to-Service Authentication

**Question**: Lambda function needs to read from DynamoDB and write to S3. How should it authenticate?

**Answer**: IAM Role for Lambda (Execution Role)

**Implementation**:
1. Create IAM role with trust policy for lambda.amazonaws.com
2. Attach policies for DynamoDB read and S3 write
3. Assign role to Lambda function
4. Lambda automatically receives temporary credentials

**Why not IAM User?**
- No credential management needed
- Automatic credential rotation
- Follows least privilege (role tied to function)
- No hardcoded credentials in code

**Policy Example**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:Query"],
      "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/MyTable"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

⚠️ **EXAM TIP**: Service-to-service authentication in AWS ALWAYS uses IAM roles, never IAM users or access keys.

---

### Scenario 9: Compliance - Separate Encryption Keys

**Question**: Security requirement: Development, Staging, and Production environments must use separate encryption keys, and developers should not access production keys.

**Solution**: Separate KMS Keys with Key Policies

**Architecture**:
- **Dev KMS Key**: Developers have encrypt/decrypt permissions
- **Staging KMS Key**: Developers + QA have permissions
- **Production KMS Key**: Only production role has permissions

**Key Policy Example (Production)**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM User Permissions",
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::123456789012:root"},
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow Production Role",
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::123456789012:role/ProductionRole"},
      "Action": ["kms:Decrypt", "kms:Encrypt", "kms:GenerateDataKey"],
      "Resource": "*"
    }
  ]
}
```

**Additional Controls**:
- Use different AWS accounts per environment (best practice)
- SCPs at organization level
- CloudTrail monitoring for key usage

⚠️ **EXAM TIP**: Environment separation + encryption = Separate KMS keys per environment. Use key policies to restrict access.

---

### Scenario 10: Configuration Management at Scale

**Question**: Microservices architecture with 100+ services needs centralized configuration. Some values are sensitive (DB passwords), others are not (endpoints, timeouts).

**Solution**: Hybrid approach with Parameter Store and Secrets Manager

**Strategy**:
```
Parameter Store Hierarchy:
/myapp/
  /prod/
    /service1/
      api_endpoint → "https://api.example.com"
      timeout → "30"
      db_connection → {{resolve:secretsmanager:prod/service1/dbcreds}}
    /service2/
      ...
  /dev/
    /service1/
      ...
```

**Implementation**:
1. **Non-sensitive config** → Parameter Store Standard (free)
2. **Sensitive values** → Secrets Manager (with rotation)
3. **Reference secrets from parameters** → Use dynamic references
4. **Hierarchical retrieval** → Get all parameters for service by path

**Code Example**:
```python
import boto3

ssm = boto3.client('ssm')

# Get all config for service1 in prod
params = ssm.get_parameters_by_path(
    Path='/myapp/prod/service1',
    Recursive=True,
    WithDecryption=True  # Resolves SecureString and secret references
)
```

**Benefits**:
- Cost-effective (most config is free)
- Automatic rotation for sensitive values
- Single API call to get all config
- Version tracking for config changes

⚠️ **EXAM TIP**: Large-scale configuration + mix of sensitive/non-sensitive = Parameter Store + Secrets Manager hybrid. Use dynamic references to link them.

---

## Key Differences Summary

### IAM vs Cognito

| Aspect | IAM | Cognito |
|--------|-----|---------|
| **User Type** | AWS resources, employees, services | Application end users |
| **Scale** | Thousands | Millions |
| **Use Case** | AWS Console access, API access | Mobile/web app authentication |
| **Social Login** | No | Yes |
| **MFA** | Yes (for IAM users) | Yes (for app users) |
| **Credentials** | Long-term (users) or temporary (roles) | Always temporary (via Identity Pools) |

**Common Misconception**: "I need users in my app, so I'll use IAM Users" ❌
**Correct**: Use Cognito User Pools for app users, IAM for AWS resource access ✅

---

### AWS Managed AD vs AD Connector vs Simple AD

| Feature | Managed AD | AD Connector | Simple AD |
|---------|------------|--------------|-----------|
| **AD in AWS** | Yes (full copy) | No (proxy only) | Yes (Samba-based) |
| **Trust Relationships** | Yes | No | No |
| **Works without on-prem** | Yes | No (requires on-prem) | Yes |
| **User Capacity** | 500,000+ | Unlimited (proxy) | 500 or 5,000 |
| **Use Case** | AD-aware apps in AWS | SSO with on-prem AD | Simple LDAP, dev/test |
| **Cost** | $$$ (highest) | $$ (medium) | $ (lowest) |
| **MFA** | Yes | Yes (via on-prem) | No |

**Common Misconception**: "AD Connector stores a copy of AD in AWS" ❌
**Correct**: AD Connector is just a proxy, all authentication happens on-premises ✅

---

### Secrets Manager vs Parameter Store

| Feature | Secrets Manager | Parameter Store |
|---------|----------------|-----------------|
| **Automatic Rotation** | Yes (built-in) | No (manual Lambda) |
| **Native DB Integration** | RDS, DocumentDB, Redshift | None |
| **Cross-Region Replication** | Yes | No (manual) |
| **Cost** | $0.40/secret/month + API calls | Free (Standard), paid (Advanced) |
| **Max Size** | 64 KB | 4 KB (Standard), 8 KB (Advanced) |
| **Best For** | Database credentials, rotating secrets | Static config, cost-sensitive |
| **Versioning** | Yes (staging labels) | Yes |

**Common Misconception**: "Parameter Store and Secrets Manager are the same" ❌
**Correct**: Secrets Manager has automatic rotation and is for secrets; Parameter Store is for config and simple secrets ✅

---

### KMS vs CloudHSM

| Feature | KMS | CloudHSM |
|---------|-----|----------|
| **Multi-Tenancy** | Yes (shared infrastructure) | No (dedicated HSM) |
| **FIPS Compliance** | Level 2 | Level 3 |
| **Key Control** | AWS has access | Only you have access |
| **Management** | Fully managed | You manage HSM cluster |
| **Cost** | $1/key/month + API calls | $1-2/hour per HSM |
| **Integration** | 100+ AWS services | Manual integration |
| **Use Case** | Most encryption needs | Regulatory requiring Level 3 |

**Common Misconception**: "KMS is not secure because AWS has access to keys" ❌
**Correct**: KMS is highly secure and meets most compliance needs; CloudHSM is for strict regulations requiring Level 3 ✅

---

## Exam Strategy & Keywords

### IAM Keywords to Watch

**Indicates IAM**:
- "AWS resource access"
- "Cross-account access"
- "AssumeRole"
- "Service-to-service authentication"
- "Temporary credentials"
- "Federated access"
- "Permission boundaries"
- "Service Control Policies"
- "AWS Console access for employees"

**IAM Tricky Concepts**:
1. **Policy Evaluation Logic**:
   - Explicit Deny > Explicit Allow > Implicit Deny
   - Multiple policies: Union of all allows, any deny wins
   - Cross-account: Requires both accounts to allow

2. **Trust Policies vs Permission Policies**:
   - Trust policy: WHO can assume the role
   - Permission policy: WHAT the role can do

3. **Resource-Based vs Identity-Based**:
   - Identity-based: Attached to user/role/group
   - Resource-based: Attached to resource (S3, Lambda)
   - Resource-based can grant cross-account without AssumeRole

---

### Cognito Keywords to Watch

**Indicates Cognito**:
- "Mobile app users"
- "Web application authentication"
- "Social login" (Google, Facebook)
- "User sign-up/sign-in"
- "Application users accessing AWS resources"
- "User pool" or "Identity pool"
- "Millions of users"

**Cognito Tricky Concepts**:
1. **User Pools vs Identity Pools**:
   - User Pools: Authentication (is this user who they say they are?)
   - Identity Pools: Authorization (temporary AWS credentials)
   - Often used together: User Pool → Identity Pool → AWS access

2. **Policy Variables**:
   - Use `${cognito-identity.amazonaws.com:sub}` for user-specific access
   - Enables fine-grained permissions without individual policies

---

### Directory Service Keywords to Watch

**Indicates Managed AD**:
- "AD-aware applications"
- "Lift-and-shift Windows applications"
- "Trust relationship with on-premises"
- "Need AD in AWS"
- "LDAP, Kerberos, NTLM"

**Indicates AD Connector**:
- "Existing on-premises AD"
- "SSO to AWS Console"
- "Don't want to replicate directory"
- "Cost-effective"
- "Proxy to on-premises"

**Indicates Simple AD**:
- "Simple LDAP"
- "Linux workloads"
- "Development/testing"
- "No trust relationships needed"
- "Low cost"

---

### KMS Keywords to Watch

**Indicates KMS**:
- "Encryption at rest"
- "Customer managed keys"
- "Key rotation"
- "Envelope encryption"
- "Compliance" (FIPS 140-2 Level 2)
- "Encrypt across regions" → Multi-Region keys
- "Audit encryption usage"

**KMS Tricky Concepts**:
1. **Key Policies are Required**:
   - Unlike IAM, key policy is mandatory
   - Key policy + IAM policy both evaluated
   - Best practice: Key policy grants account root, IAM policy grants specific users

2. **Envelope Encryption**:
   - Direct encryption limited to 4 KB
   - Large files: KMS generates data key, use data key to encrypt locally
   - Encrypted data key stored with encrypted data

3. **Cross-Account Access**:
   - Key policy must allow external account
   - External account must have IAM policy allowing KMS operations
   - Both sides must allow

---

### Secrets Manager Keywords to Watch

**Indicates Secrets Manager**:
- "Automatic rotation"
- "Database credentials"
- "RDS password rotation"
- "API keys"
- "OAuth tokens"
- "30-day rotation" (compliance requirement)

---

### Parameter Store Keywords to Watch

**Indicates Parameter Store**:
- "Configuration management"
- "Hierarchical parameters"
- "Cost-effective"
- "Static configuration"
- "Large number of parameters"
- "Integration with Systems Manager"

---

## Quick Reference Cheat Sheet

### Decision Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUICK DECISION GUIDE                         │
└─────────────────────────────────────────────────────────────────┘

WHO NEEDS ACCESS?
├─ AWS Services → IAM Role
├─ Employees → IAM User/Role + MFA
├─ External Account → IAM Role (AssumeRole)
├─ Mobile/Web App Users → Cognito User Pool
└─ App Users need AWS Resources → Cognito Identity Pool

WHAT TYPE OF AUTHENTICATION?
├─ AWS Resources → IAM
├─ Application Users → Cognito
├─ Active Directory → Directory Service
├─ Social Login → Cognito
└─ SAML Federation → IAM Identity Provider

NEED ENCRYPTION?
├─ Key Management → KMS
├─ Full HSM Control → CloudHSM
├─ Multi-Region Data → KMS Multi-Region Keys
└─ Data at Rest → KMS (integrated with services)

NEED TO STORE SECRETS?
├─ With Rotation → Secrets Manager
├─ Database Credentials → Secrets Manager
├─ Without Rotation → Parameter Store (SecureString)
├─ Static Config → Parameter Store (String)
└─ Cost-Conscious → Parameter Store

NEED ACTIVE DIRECTORY?
├─ Windows Apps in AWS → Managed AD
├─ Already have on-prem AD + SSO → AD Connector
├─ Simple LDAP for Linux → Simple AD
└─ Trust Relationships → Managed AD
```

---

### Common Patterns

#### Pattern 1: Secure Multi-Tier Application
```
User → Cognito User Pool (authenticate)
  ↓
Cognito Identity Pool (get AWS credentials)
  ↓
API Gateway (with IAM authorization)
  ↓
Lambda (IAM role for execution)
  ↓
DynamoDB (encrypted with KMS)
  ↓
Secrets Manager (DB credentials)
```

#### Pattern 2: Cross-Account DevOps
```
Dev Account
  ↓
IAM Role (AssumeRole to Prod)
  ↓
Prod Account
  ↓
Deploy Resources (with restricted permissions)
  ↓
CloudTrail (audit all actions)
```

#### Pattern 3: Hybrid AD Architecture
```
On-Premises AD (users)
  ↔ (VPN/Direct Connect)
AWS Managed AD (trust relationship)
  ↓
Windows EC2 Instances (domain-joined)
  ↓
AWS SSO (console access)
```

#### Pattern 4: Encryption Strategy
```
Application
  ↓
KMS (generate data key)
  ↓
Encrypt data locally with data key
  ↓
S3 (store encrypted data + encrypted data key)
  ↓
Decrypt: KMS (decrypt data key) → decrypt data locally
```

---

### Cost Optimization Tips

1. **IAM**: Free, but:
   - Monitor unused roles and users
   - Use roles instead of users where possible
   - Consolidate policies

2. **Cognito**:
   - First 50,000 MAUs free
   - $0.0055 per MAU after
   - Use appropriate features (avoid advanced security if not needed)

3. **Directory Service**:
   - Simple AD < AD Connector < Managed AD (cost)
   - Right-size Managed AD (Standard vs Enterprise)
   - Consider AD Connector if you have on-prem AD

4. **KMS**:
   - $1/key/month (pay for customer managed keys only)
   - $0.03 per 10,000 requests
   - Consolidate keys where appropriate (not for compliance-separated environments)
   - Free tier: 20,000 requests/month

5. **Secrets Manager**:
   - $0.40/secret/month
   - $0.05 per 10,000 API calls
   - Use Parameter Store for non-rotating secrets to save money

6. **Parameter Store**:
   - Standard tier: Free
   - Advanced tier: $0.05/parameter/month
   - Use Standard unless you need >10,000 parameters or >4KB size

---

### Security Best Practices

#### IAM
✅ Enable MFA for all users
✅ Use roles for applications (not users with access keys)
✅ Apply least privilege principle
✅ Use IAM Access Analyzer
✅ Rotate access keys regularly (90 days)
✅ Use permission boundaries for delegation
✅ Enable CloudTrail for auditing

#### Cognito
✅ Enable MFA for User Pools
✅ Use advanced security features (adaptive auth, compromised credentials check)
✅ Implement proper password policies
✅ Use hosted UI for secure authentication flows
✅ Validate tokens in backend

#### Directory Service
✅ Enable MFA for Managed AD
✅ Use security groups to restrict access
✅ Enable CloudTrail logging
✅ Implement proper trust configurations
✅ Use separate VPCs for isolation

#### KMS
✅ Use separate keys per environment
✅ Enable automatic key rotation
✅ Use key policies to restrict access
✅ Monitor with CloudTrail
✅ Use grants for temporary access
✅ Never share keys across security boundaries

#### Secrets Manager / Parameter Store
✅ Enable automatic rotation for database credentials
✅ Use SecureString for sensitive values
✅ Implement least privilege access
✅ Use resource policies for cross-account access
✅ Enable CloudTrail logging
✅ Version secrets for rollback capability

---

### Exam Traps & Common Mistakes

#### Trap 1: IAM User for Application
❌ **Wrong**: Create IAM user with access keys for Lambda function
✅ **Right**: Use IAM role for Lambda execution

#### Trap 2: Cognito for AWS Employees
❌ **Wrong**: Use Cognito for employees to access AWS Console
✅ **Right**: Use IAM with federation (SAML/OIDC) or AWS SSO

#### Trap 3: Parameter Store for Rotating Secrets
❌ **Wrong**: Use Parameter Store for RDS password with rotation
✅ **Right**: Use Secrets Manager for automatic rotation

#### Trap 4: Single KMS Key for All Environments
❌ **Wrong**: Use one KMS key for dev, staging, and prod
✅ **Right**: Separate keys per environment for security isolation

#### Trap 5: AD Connector for Offline Operation
❌ **Wrong**: Use AD Connector for AWS applications that need AD even when VPN is down
✅ **Right**: Use Managed AD with trust relationship

#### Trap 6: Hardcoded Credentials
❌ **Wrong**: Store database passwords in application code or config files
✅ **Right**: Use Secrets Manager or Parameter Store with IAM role for access

#### Trap 7: Public S3 Bucket for Cross-Account
❌ **Wrong**: Make S3 bucket public for another account to access
✅ **Right**: Use bucket policy or IAM role with cross-account access

#### Trap 8: Overly Permissive Policies
❌ **Wrong**: Grant `s3:*` on `Resource: "*"` to "make it work"
✅ **Right**: Grant specific actions on specific resources (least privilege)

---

### Scenario Keywords Translation Table

| Exam Keywords | Translation | Correct Service |
|--------------|-------------|-----------------|
| "Millions of users" | Scale beyond IAM | **Cognito** |
| "AssumeRole" | Cross-account or service role | **IAM Role** |
| "Automatic rotation" + "database" | Managed rotation needed | **Secrets Manager** |
| "Cost-effective" + "configuration" | Budget-conscious storage | **Parameter Store** |
| "AD-aware applications" | Windows apps in AWS | **Managed AD** |
| "Existing on-premises AD" + "SSO only" | Don't replicate directory | **AD Connector** |
| "Encrypt data at rest" | Encryption keys | **KMS** |
| "Social login" | Google, Facebook auth | **Cognito User Pools** |
| "Mobile app" + "AWS resources" | App users need S3/DynamoDB | **Cognito Identity Pools** |
| "Trust relationship" | AD federation | **Managed AD** (not AD Connector) |
| "Multi-region" + "encryption" | Same key in multiple regions | **Multi-Region KMS Keys** |
| "Permission boundaries" | Delegate with limits | **IAM Permission Boundaries** |
| "Service Control Policy" | Organization-level governance | **AWS Organizations + IAM** |
| "Temporary credentials" | Time-limited access | **IAM Roles + STS** |
| "Federated access" | External IdP | **IAM SAML/OIDC** or **Cognito** |

---

## Final Exam Tips

1. **Read carefully for user type**: AWS resources vs application users vs employees

2. **Cost matters**: If question mentions "cost-effective", choose cheaper option (Parameter Store over Secrets Manager, AD Connector over Managed AD)

3. **Automatic rotation is key differentiator**: Secrets Manager has it, Parameter Store doesn't

4. **Cross-account = Roles**: Always use IAM roles for cross-account, never users or keys

5. **Service-to-service = Roles**: Never use IAM users for applications

6. **AD in AWS vs Proxy**: Managed AD stores data in AWS, AD Connector is just a proxy

7. **KMS regional**: Remember KMS keys are regional; multi-region keys for global apps

8. **Policy evaluation**: Explicit Deny always wins, then explicit allow, then implicit deny

9. **Cognito two-part**: User Pools (authentication) + Identity Pools (AWS credentials)

10. **Trust + Permission**: Cross-account needs both accounts to allow (trust relationship + permissions)

---

## Practice Questions

### Question 1
A company needs to provide temporary access to an S3 bucket for a third-party auditor for 7 days. What's the most secure approach?

A) Create an IAM user with access keys and delete after 7 days
B) Create an IAM role with S3 permissions and provide AssumeRole instructions
C) Make the S3 bucket public with a date-based bucket policy
D) Share root account credentials with NDA

**Answer**: B

**Explanation**: IAM role with AssumeRole provides temporary credentials that automatically expire. It's more secure than long-term access keys and doesn't require manual cleanup. The role can have time-based conditions in the trust policy.

---

### Question 2
A mobile game needs to authenticate millions of players and let them save game progress to DynamoDB. Players can sign in with Google or Facebook. What's the architecture?

A) IAM users for each player
B) Cognito User Pool + Identity Pool
C) Directory Service with Simple AD
D) IAM with SAML federation

**Answer**: B

**Explanation**: Cognito User Pool authenticates players and supports social identity providers (Google, Facebook). Identity Pool converts authenticated identity into temporary AWS credentials for DynamoDB access. This scales to millions of users.

---

### Question 3
A company is migrating 50 Windows applications to AWS that require Active Directory. The on-premises AD must remain the source of truth. VPN connection is established. What should they use?

A) Simple AD
B) AD Connector
C) AWS Managed Microsoft AD with two-way trust
D) Cognito

**Answer**: C

**Explanation**: Windows applications in AWS need actual AD (not just a proxy), so AD Connector is insufficient. Managed AD provides local AD for apps. Two-way trust keeps on-premises AD as source of truth while allowing AWS resources to authenticate. If apps were not AD-aware and only SSO was needed, AD Connector would work.

---

### Question 4
A compliance requirement mandates RDS database credentials must rotate every 30 days. What's the simplest solution?

A) Parameter Store with Lambda rotation function
B) Secrets Manager with automatic rotation
C) Store in S3 with lifecycle policies
D) Manual rotation with CloudWatch Events

**Answer**: B

**Explanation**: Secrets Manager has built-in automatic rotation for RDS with Lambda function included. It's the simplest solution requiring no custom development. Parameter Store would require building the entire rotation mechanism.

---

### Question 5
A Lambda function in Account A needs to access an S3 bucket in Account B. What's required?

A) IAM user in Account B with access keys
B) IAM role in Account B that Account A can assume + S3 bucket policy
C) Make S3 bucket public
D) Copy S3 bucket to Account A

**Answer**: B

**Explanation**: Cross-account access requires IAM role in target account (B) with trust policy allowing source account (A). Additionally, S3 bucket policy in Account B must allow the role. Lambda in Account A assumes the role to get temporary credentials. Both accounts must explicitly allow.

---

## Additional Resources

### AWS Documentation Links
- IAM: https://docs.aws.amazon.com/IAM/latest/UserGuide/
- Cognito: https://docs.aws.amazon.com/cognito/
- Directory Service: https://docs.aws.amazon.com/directoryservice/
- KMS: https://docs.aws.amazon.com/kms/
- Secrets Manager: https://docs.aws.amazon.com/secretsmanager/
- Parameter Store: https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html

### Key Whitepapers
- "AWS Security Best Practices"
- "Overview of AWS Security"
- "AWS Key Management Service Best Practices"

---

**Last Updated**: 2025-11-20
**Version**: 1.0
**For**: AWS Solutions Architect Professional Exam

---

*This comparison guide is designed specifically for exam preparation. Always refer to official AWS documentation for production implementation details.*
