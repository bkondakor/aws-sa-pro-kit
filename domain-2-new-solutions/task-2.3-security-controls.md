---
title: "Task 2.3: Determine Security Controls Based on Requirements"
domain: 2
domain_name: "Design for New Solutions"
task: 2.3
weight: "29%"
task_weight: "~16% of domain"
exam_topics:
  - security-controls
  - encryption
  - kms
  - cloudhsm
  - network-security
  - waf
  - shield
  - ddos
  - compliance
  - guardduty
status: complete
last_updated: "2025-11-18"
---

# Task 2.3: Determine Security Controls Based on Requirements

## Overview

Security controls are critical for protecting data, applications, and infrastructure on AWS. This task focuses on implementing appropriate security measures including encryption, network security, DDoS protection, and compliance requirements.

**Exam Weight:** ~16% of Domain 2 (approximately 4-5% of total exam)

**Key Focus Areas:**
- Data encryption at rest and in transit
- Network security (Security Groups, NACLs, WAF, Shield)
- Key management (KMS, CloudHSM)
- Secrets management (Secrets Manager, Parameter Store)
- DDoS mitigation strategies
- Compliance requirements (HIPAA, PCI-DSS, GDPR)
- Data residency and sovereignty
- Threat detection (GuardDuty)

---

## Encryption Strategies

### Data Encryption at Rest

**Default Encryption (2023+ Changes):**
- **S3**: All new buckets encrypted by default (SSE-S3)
- **EBS**: Can enable encryption by default per region
- **RDS**: Must enable at creation time
- **DynamoDB**: Encrypted by default (AWS owned key)
- **EFS**: Encryption can be enabled at creation

---

### AWS Key Management Service (KMS)

**2025 Updates:**
- **FIPS 140-3 Level 3 Validation**: Upgraded from FIPS 140-2
- **Configurable Automatic Rotation**: 90 days to 2560 days (7 years)
- **RotateKeyOnDemand API**: Immediate rotation (10 lifetime limit)

**Key Types:**

#### 1. Customer Managed Keys (CMK)
**Characteristics:**
- Full control over key policies and rotation
- Can be disabled or deleted (7-30 day waiting period)
- Custom rotation (manual or automatic)
- Visible in CloudTrail logs

**Pricing:**
- $1/month per key (prorated hourly)
- First rotation: +$1/month
- Second rotation: +$1/month
- Capped at $2/month total for rotation
- API calls: $0.03 per 10,000 requests (after 20,000 free/month)

**Use Cases:**
- Compliance requirements requiring key control
- Need to disable/enable encryption
- Custom key rotation schedules
- Cross-account access with granular controls

#### 2. AWS Managed Keys
**Characteristics:**
- Format: `aws/service-name` (e.g., `aws/s3`, `aws/rds`)
- Free, automatic rotation every year
- Cannot be deleted or disabled
- Limited control over key policies

**Pricing:**
- No monthly key cost
- API calls still charged ($0.03 per 10,000)

**Use Cases:**
- Standard AWS service integrations
- No need for custom key policies
- Cost-effective encryption

#### 3. AWS Owned Keys
**Characteristics:**
- AWS owns and manages completely
- No visibility in your account
- No CloudTrail logs
- Free

**Use Cases:**
- DynamoDB default encryption
- When no key visibility needed
- Lowest cost option

#### 4. Multi-Region Keys
**Characteristics:**
- Interoperable keys with same key material
- Same key ID across regions
- Each replica billed separately ($1/month each)
- **Important**: Key policies are NOT shared between regions

**Use Cases:**
- Multi-region encryption/decryption
- Disaster recovery scenarios
- Global applications
- Cross-region data replication

**Configuration Example:**
```bash
# Create multi-region key in us-east-1
aws kms create-key --multi-region \
  --description "Multi-region encryption key" \
  --region us-east-1

# Replicate to us-west-2
aws kms replicate-key \
  --key-id mrk-xxx \
  --replica-region us-west-2 \
  --region us-east-1
```

#### 5. Asymmetric Keys
**Characteristics:**
- Public/private key pairs
- Used for encryption/decryption and signing/verification
- Same pricing as symmetric keys ($1/month)
- Public key can be downloaded

**Use Cases:**
- Digital signatures
- Public key encryption outside AWS
- Code signing
- Certificate authority operations

---

**KMS Key Policies:**

Every KMS key MUST have exactly one key policy. Key policies are the primary access control mechanism.

**Key Policy Structure:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM User Permissions",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow use of the key for encryption",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/application-role"
      },
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey",
        "kms:GenerateDataKey"
      ],
      "Resource": "*"
    }
  ]
}
```

**Access Control Layers:**
1. **Key Policy** (required, primary control)
2. **IAM Policies** (optional, additional control)
3. **Grants** (optional, programmatic temporary access)

---

**KMS Grants:**

Grants provide temporary, programmatic permissions without modifying the key policy.

**Common Use Cases:**
- AWS services (e.g., RDS, EBS) creating encrypted resources
- Cross-account temporary access
- Delegation without policy changes

**Grant Example:**
```bash
# Create grant for EC2 to use key for EBS
aws kms create-grant \
  --key-id 1234abcd-12ab-34cd-56ef-1234567890ab \
  --grantee-principal arn:aws:iam::111122223333:role/EC2-Role \
  --operations Decrypt GenerateDataKey CreateGrant
```

**Grant Characteristics:**
- Can be created programmatically
- Can be retired/revoked
- Time-limited (optional)
- Tied to specific operations

---

**KMS API Quotas (Important for Exam):**

| Operation | Shared Quota (req/sec) |
|-----------|------------------------|
| Decrypt | 30,000 (varies by region) |
| Encrypt | 30,000 |
| GenerateDataKey | 30,000 |
| GenerateDataKeyWithoutPlaintext | 30,000 |

**Quota Considerations:**
- Quotas shared across all applications in region
- High-volume applications can hit limits
- Solutions: Data key caching, request throttling, multiple keys

---

### AWS CloudHSM

**When CloudHSM is Required:**

**Characteristics:**
- **Compliance**: FIPS 140-2 Level 3 (dedicated hardware)
- **Tenancy**: Single-tenant HSM
- **Control**: Customer manages keys completely
- **Pricing**: ~$1.45/hour per HSM (~$1,044/month)
- **Availability**: Manual cluster setup (minimum 2 HSMs, recommend 3+)

**vs KMS:**
| Factor | KMS | CloudHSM |
|--------|-----|----------|
| **Compliance** | FIPS 140-3 Level 3 | FIPS 140-2 Level 3 |
| **Tenancy** | Multi-tenant | Single-tenant |
| **Control** | AWS manages hardware | Customer manages keys |
| **Price** | $1/key/month | $1.45/hour (~$1,044/month) |
| **Integration** | 100+ AWS services | Custom via PKCS#11, JCE, CNG |
| **Performance** | API quotas | Dedicated throughput |

**Use CloudHSM when:**
- FIPS 140-2 Level 3 explicitly required by regulation
- Need complete ownership of encryption keys
- Custom cryptographic algorithms required
- High-throughput requirements (>30K TPS)
- PKI as root of trust for Certificate Authority
- Cryptocurrency wallets
- Regulatory compliance requiring single-tenant HSM

**Use KMS when:**
- Standard AWS service integration needed
- Cost-effective encryption
- Multi-tenant acceptable
- API quotas sufficient
- Want AWS to manage infrastructure

**Cost Comparison:**
- KMS: $1/month per key
- CloudHSM: $1,044/month (1 HSM)
- CloudHSM HA: $3,132/month (3 HSMs across AZs)

---

### S3 Encryption Options

#### 1. SSE-S3 (Server-Side Encryption with S3 Managed Keys)

**Characteristics:**
- AES-256 encryption
- AWS manages keys automatically
- **FREE**
- Default for all new buckets (since January 2023)

**Configuration:**
```bash
# Enable default encryption for bucket
aws s3api put-bucket-encryption \
  --bucket my-bucket \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      },
      "BucketKeyEnabled": false
    }]
  }'
```

**Use When:**
- Standard protection sufficient
- Cost is primary concern
- No audit trail required
- Simplest option needed

#### 2. SSE-KMS (Server-Side Encryption with KMS)

**Characteristics:**
- Uses AWS KMS customer managed keys
- Full audit trail via CloudTrail
- Envelope encryption
- Key policy controls access

**Pricing:**
- KMS key: $1/month
- API calls: $0.03 per 10,000 requests

**S3 Bucket Keys (Cost Optimization):**
- Reduces KMS API calls by 99%
- Uses bucket-level key to generate object keys
- Significantly reduces costs for high-volume buckets

**Configuration:**
```bash
aws s3api put-bucket-encryption \
  --bucket my-bucket \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms",
        "KMSMasterKeyID": "arn:aws:kms:region:account:key/key-id"
      },
      "BucketKeyEnabled": true
    }]
  }'
```

**Use When:**
- Need audit trail of key usage
- Granular access control required
- Compliance requirements for key management
- Cross-account access with controlled permissions

**Important**: Subject to KMS API quotas - can throttle high-volume uploads without Bucket Keys enabled.

#### 3. SSE-C (Server-Side Encryption with Customer-Provided Keys)

**Characteristics:**
- Customer provides encryption key with each request
- AWS performs encryption/decryption
- AWS doesn't store the key
- Must use HTTPS
- Key required for every GET/PUT

**Configuration:**
```bash
# Upload with SSE-C
aws s3api put-object \
  --bucket my-bucket \
  --key file.txt \
  --body file.txt \
  --sse-customer-algorithm AES256 \
  --sse-customer-key $(base64-encoded-key) \
  --sse-customer-key-md5 $(md5-of-key)

# Download with SSE-C (must provide same key)
aws s3api get-object \
  --bucket my-bucket \
  --key file.txt \
  --sse-customer-algorithm AES256 \
  --sse-customer-key $(base64-encoded-key) \
  --sse-customer-key-md5 $(md5-of-key) \
  output-file.txt
```

**Use When:**
- Must manage keys outside AWS
- Compliance requires key control
- Integration with existing key management system
- Need to rotate keys independently

#### 4. Client-Side Encryption

**Characteristics:**
- Encrypt data before uploading
- Full control over encryption process
- Use AWS Encryption SDK or custom solution
- AWS never sees unencrypted data

**Use When:**
- Highest security requirements
- Zero trust in cloud provider
- Application already has encryption layer
- Regulatory requirements for client-side encryption

**Comparison Matrix:**

| Method | Key Management | Performance | Cost | Audit Trail | Use Case |
|--------|---------------|-------------|------|-------------|----------|
| **SSE-S3** | AWS | Best | Free | No | Standard protection |
| **SSE-KMS** | AWS KMS | Good | $ | Yes | Compliance, audit required |
| **SSE-C** | Customer | Good | Free (S3 only) | No | External key management |
| **Client-Side** | Customer | Lower | Free (S3 only) | No | Highest security |

---

### Database Encryption

#### RDS Encryption

**Characteristics:**
- Must enable at database creation
- Cannot enable on existing instance
- Encrypts: storage, backups, read replicas, snapshots
- Minimal performance impact (<5%)
- Uses KMS

**To Encrypt Existing Database:**
1. Create snapshot of unencrypted database
2. Copy snapshot with encryption enabled
3. Restore from encrypted snapshot
4. Update application connection strings
5. Delete unencrypted database

**Configuration:**
```yaml
DBInstance:
  StorageEncrypted: true
  KmsKeyId: "arn:aws:kms:region:account:key/key-id"
  BackupRetentionPeriod: 7
  CopyTagsToSnapshot: true
```

**Read Replicas:**
- Must have same encryption status as master
- Cross-region replicas can use different KMS key

---

#### Aurora Encryption

**Characteristics:**
- Encrypted at cluster level
- All instances in cluster encrypted
- Cannot remove encryption once enabled
- Storage, backups, snapshots all encrypted
- Low performance impact

**Aurora Global Database:**
- Each region can use different KMS key
- Replication across regions works with different keys
- Must have proper key policies for replication

---

#### DynamoDB Encryption

**2023 Update: Encrypted by Default**

**Encryption Options:**

1. **AWS Owned Key** (Default)
   - Free
   - No visibility or control
   - AWS manages completely

2. **AWS Managed Key** (`aws/dynamodb`)
   - Free key
   - Pay for API calls
   - Automatic annual rotation
   - Visible in CloudTrail

3. **Customer Managed Key**
   - Full control
   - $1/month + API calls
   - Custom rotation
   - Granular access control

**Can Switch Between Key Types:**
```bash
# Switch to customer managed key
aws dynamodb update-table \
  --table-name my-table \
  --sse-specification \
    Enabled=true,SSEType=KMS,KMSMasterKeyId=arn:aws:kms:region:account:key/key-id
```

**Use Customer Managed Key When:**
- Compliance requires key control
- Need audit trail of encryption operations
- Cross-account access required
- Custom rotation schedule needed

---

### Encryption in Transit

#### TLS/SSL Best Practices

**Minimum TLS Version (2025 Recommendations):**
- **Minimum**: TLS 1.2 (disable TLS 1.0 and 1.1)
- **Preferred**: TLS 1.3 where supported
- **Strong Cipher Suites**: AES-GCM
- **Disable Weak Ciphers**: RC4, DES, 3DES
- **Enable Perfect Forward Secrecy (PFS)**

---

**CloudFront:**

**TLS Configuration:**
```json
{
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:account:certificate/certificate-id",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "DefaultCacheBehavior": {
    "ViewerProtocolPolicy": "redirect-to-https"
  }
}
```

**Security Options:**
- **Viewer Protocol Policy**:
  - `allow-all` - HTTP and HTTPS
  - `redirect-to-https` - Redirect HTTP to HTTPS (recommended)
  - `https-only` - Block HTTP requests
- **Minimum TLS Version**: TLSv1.2_2021 (recommended)
- **Custom SSL**: Via ACM (free) or imported certificate
- **SNI**: Cost-effective custom domains

---

**Application Load Balancer (ALB):**

**SSL/TLS Termination:**
```json
{
  "Protocol": "HTTPS",
  "Port": 443,
  "Certificates": [{
    "CertificateArn": "arn:aws:acm:region:account:certificate/certificate-id"
  }],
  "SslPolicy": "ELBSecurityPolicy-TLS-1-2-Ext-2018-06",
  "DefaultActions": [{
    "Type": "forward",
    "TargetGroupArn": "target-group-arn"
  }]
}
```

**SSL Policies (Recommended for 2025):**
- **ELBSecurityPolicy-TLS13-1-2-2021-06**: TLS 1.3, TLS 1.2 (best security)
- **ELBSecurityPolicy-TLS-1-2-Ext-2018-06**: TLS 1.2 only (good balance)
- **ELBSecurityPolicy-FS-1-2-Res-2020-10**: Forward Secrecy + TLS 1.2

**End-to-End Encryption:**
- Client → ALB: HTTPS (TLS termination)
- ALB → Target: HTTPS (re-encryption)
- Both legs encrypted for maximum security

---

**API Gateway:**

**TLS Configuration:**
- HTTPS only (enforced by default)
- Custom domain names via ACM
- Minimum TLS version configurable
- Mutual TLS (mTLS) support

**Mutual TLS (mTLS):**
```yaml
DomainName:
  MutualTlsAuthentication:
    TruststoreUri: s3://bucket/truststore.pem
    TruststoreVersion: "1"
```

**Use mTLS When:**
- B2B API integration
- IoT device authentication
- High-security requirements
- Client certificate authentication needed

---

**VPN Connections:**

**IPsec Encryption:**
- AES-256 or AES-128 cipher
- SHA-2 (SHA-256, SHA-384, SHA-512) for integrity
- Perfect Forward Secrecy supported
- IKEv2 support

**Configuration:**
```json
{
  "VpnConnection": {
    "VpnTunnelOptions": [{
      "Phase1EncryptionAlgorithms": ["AES256"],
      "Phase2EncryptionAlgorithms": ["AES256"],
      "Phase1IntegrityAlgorithms": ["SHA2-256"],
      "Phase2IntegrityAlgorithms": ["SHA2-256"],
      "Phase1DHGroupNumbers": [14],
      "Phase2DHGroupNumbers": [14],
      "IKEVersions": ["ikev2"]
    }]
  }
}
```

---

**Direct Connect Encryption:**

**Important**: Direct Connect is NOT encrypted by default.

**Encryption Options:**

**1. MACsec (Layer 2 Encryption) - Recommended:**
- **Supported**: 10 Gbps and 100 Gbps connections only
- **Performance**: Highest (line-rate encryption)
- **Compliance**: FIPS 140-2 Level 2 validated
- **Latency**: Minimal overhead (<1 microsecond)

**Configuration:**
```bash
# Enable MACsec on Direct Connect
aws directconnect update-connection \
  --connection-id dxcon-xxx \
  --encryption-mode must-encrypt
```

**2. VPN over Direct Connect:**
- Works with all connection speeds
- IPsec encryption
- More overhead than MACsec
- Flexible

**Architecture:**
```
On-Premises → Direct Connect (Public VIF) → IPsec VPN → VPC
```

**3. Application-Level TLS:**
- Independent of connection
- Always recommended as additional layer
- End-to-end encryption

**Recommendation:**
- **Best**: MACsec (if 10/100 Gbps) + application TLS
- **Alternative**: VPN over Direct Connect + application TLS
- **Minimum**: Application TLS only

---

## Secrets Management

### AWS Secrets Manager

**2025 Features:**
- Support for secrets up to **64KB** in size
- Automatic rotation for RDS, Redshift, DocumentDB
- Cross-region replication
- Versioning with staging labels

**Key Features:**

**Automatic Rotation:**
```python
{
  "RotationEnabled": true,
  "RotationRules": {
    "AutomaticallyAfterDays": 30
  },
  "RotationLambdaARN": "arn:aws:lambda:region:account:function:rotation-function"
}
```

**Built-in Rotation for:**
- Amazon RDS (MySQL, PostgreSQL, Oracle, SQL Server, MariaDB)
- Amazon Redshift
- Amazon DocumentDB
- Other services require custom Lambda function

**Cross-Region Replication:**
```bash
aws secretsmanager replicate-secret-to-regions \
  --secret-id my-secret \
  --add-replica-regions Region=us-west-2,KmsKeyId=key-id
```

**Pricing:**
- $0.40 per secret per month
- $0.05 per 10,000 API calls
- No free tier

**Use When:**
- Database credentials requiring rotation
- Secrets need cross-region replication
- Multi-region applications
- Compliance requires secret rotation
- Secrets larger than 8KB

---

### Systems Manager Parameter Store

**2024/2025 Updates:**
- **Cross-account sharing** via AWS Resource Access Manager (RAM)
- Advanced parameters support 8KB (up from 4KB for standard)

**Parameter Tiers:**

| Feature | Standard | Advanced |
|---------|----------|----------|
| **Parameters per account** | 10,000 | 100,000+ |
| **Max size** | 4KB | 8KB |
| **Parameter policies** | No | Yes |
| **Cost** | FREE | $0.05/parameter/month |
| **Throughput** | Standard | Higher |
| **Cross-account sharing** | Yes (via RAM) | Yes (via RAM) |

**Parameter Types:**
1. **String**: Plain text
2. **StringList**: Comma-separated values
3. **SecureString**: Encrypted with KMS

**Configuration:**
```bash
# Create secure string parameter
aws ssm put-parameter \
  --name "/prod/database/password" \
  --value "MySecretPassword123!" \
  --type "SecureString" \
  --key-id "alias/aws/ssm" \
  --tier "Standard"

# Retrieve parameter
aws ssm get-parameter \
  --name "/prod/database/password" \
  --with-decryption
```

**Advanced Parameter Policies:**
```json
{
  "Type": "Expiration",
  "Version": "1.0",
  "Attributes": {
    "Timestamp": "2025-12-31T23:59:59.000Z"
  }
},
{
  "Type": "ExpirationNotification",
  "Version": "1.0",
  "Attributes": {
    "Before": "30",
    "Unit": "Days"
  }
},
{
  "Type": "NoChangeNotification",
  "Version": "1.0",
  "Attributes": {
    "After": "60",
    "Unit": "Days"
  }
}
```

**Hierarchical Organization:**
```
/application/
  /prod/
    /database/
      /host
      /port
      /username
      /password
  /dev/
    /database/
      /host
      /port
```

**Pricing:**
- Standard parameters: **FREE**
- Advanced parameters: $0.05/month
- API calls: 10,000/second throughput (standard), higher (advanced)

**Use When:**
- Configuration values, feature flags
- Cost-sensitive applications
- Secrets that don't require rotation
- Hierarchical parameter organization
- Small secrets (≤8KB)

---

### Secrets Manager vs Parameter Store Decision Matrix

| Scenario | Recommendation | Reason |
|----------|---------------|---------|
| Database passwords with rotation | **Secrets Manager** | Built-in automatic rotation |
| API keys without rotation | **Parameter Store** | Cost-effective, sufficient security |
| Application configuration | **Parameter Store** | Free for standard tier |
| Multi-region deployment secrets | **Secrets Manager** | Native cross-region replication |
| Cost is primary concern | **Parameter Store** | Free for standard tier |
| Secrets >8KB | **Secrets Manager** | Supports up to 64KB |
| Cross-account access | **Both** | Both support RAM (Parameter Store added 2024) |
| Hundreds of config values | **Parameter Store** | Cost-effective at scale |

**Exam Tip**: If the question mentions "rotation," always choose Secrets Manager. If it's about configuration or cost, choose Parameter Store.

---

## Network Security

### Security Groups

**Characteristics:**
- **Stateful**: Return traffic automatically allowed
- **Instance/ENI Level**: Applied to network interfaces
- **Rules**: Allow only (no deny rules)
- **Evaluation**: All rules evaluated before decision
- **Default**: Deny all inbound, allow all outbound

**Configuration:**
```json
{
  "SecurityGroupIngress": [
    {
      "IpProtocol": "tcp",
      "FromPort": 443,
      "ToPort": 443,
      "CidrIp": "0.0.0.0/0"
    },
    {
      "IpProtocol": "tcp",
      "FromPort": 3306,
      "ToPort": 3306,
      "SourceSecurityGroupId": "sg-app-tier"
    }
  ]
}
```

**Best Practices:**
- Create security groups by function (web-sg, app-sg, db-sg)
- Reference other security groups instead of IP addresses
- Use descriptive names and tags
- Principle of least privilege
- Regular audit and cleanup

**Security Group Chaining:**
```
Internet → web-sg (allow 80,443) →
  Web Tier → app-sg (allow 8080 from web-sg) →
    App Tier → db-sg (allow 3306 from app-sg) →
      Database
```

---

### Network ACLs (NACLs)

**Characteristics:**
- **Stateless**: Must configure both inbound and outbound
- **Subnet Level**: Applied to entire subnet
- **Rules**: Allow AND Deny rules
- **Evaluation**: First match wins (rules processed in order)
- **Default**: Allow all inbound and outbound

**Stateless Example:**
```json
{
  "NetworkAcls": [{
    "Entries": [
      {
        "RuleNumber": 100,
        "Protocol": "6",
        "RuleAction": "allow",
        "Egress": false,
        "CidrBlock": "0.0.0.0/0",
        "PortRange": {"From": 80, "To": 80}
      },
      {
        "RuleNumber": 110,
        "Protocol": "6",
        "RuleAction": "allow",
        "Egress": false,
        "CidrBlock": "0.0.0.0/0",
        "PortRange": {"From": 443, "To": 443}
      },
      {
        "RuleNumber": 100,
        "Protocol": "6",
        "RuleAction": "allow",
        "Egress": true,
        "CidrBlock": "0.0.0.0/0",
        "PortRange": {"From": 1024, "To": 65535}
      }
    ]
  }]
}
```

**Why Ephemeral Ports Matter:**
- Client initiates from random port (ephemeral)
- Server responds to that ephemeral port
- NACL outbound must allow ephemeral range
- Common ranges: 1024-65535 (Linux), 49152-65535 (Windows Server)

**Deny Specific IP:**
```json
{
  "RuleNumber": 50,
  "Protocol": "-1",
  "RuleAction": "deny",
  "Egress": false,
  "CidrBlock": "198.51.100.0/24"
}
```

**Rule Numbering:**
- Lower number = higher priority
- Process in order until match
- Common practice: Increment by 10 or 100
- Leave room for insertions

---

### Security Groups vs NACLs

| Feature | Security Groups | NACLs |
|---------|----------------|-------|
| **Operates at** | Instance/ENI | Subnet |
| **State** | Stateful | Stateless |
| **Rules** | Allow only | Allow and Deny |
| **Evaluation** | All rules | First match wins |
| **Default** | Deny all inbound | Allow all |
| **Return traffic** | Automatic | Must configure |
| **Use for** | Positive security | Negative security, block IPs |

**Layered Security (Best Practice):**
```
Internet
  ↓
NACL (Subnet-level, deny known bad IPs)
  ↓
Security Groups (Instance-level, allow required ports)
  ↓
EC2 Instances
```

**Common Exam Scenarios:**

**"Block specific IP address":**
- **Answer**: NACL
- **Reason**: Security Groups can't deny, only allow

**"Allow web traffic with automatic return handling":**
- **Answer**: Security Group
- **Reason**: Stateful, handles return automatically

**"Subnet-level protection":**
- **Answer**: NACL
- **Reason**: Operates at subnet level

**"Must configure ephemeral ports":**
- **Answer**: NACL
- **Reason**: Stateless, need explicit outbound rules

---

## Web Application Security

### AWS WAF (Web Application Firewall)

**Major 2025 Updates:**
- **Rate limiting minimum reduced to 10 requests** (down from 100)
- **Flexible time windows**: 1, 2, 5, or 10 minutes
- **Enhanced aggregation keys**: Headers, cookies, URL paths

**Key Features:**

**1. Rate Limiting (2025 Enhancement):**
```json
{
  "Name": "RateLimitRule",
  "Priority": 1,
  "Statement": {
    "RateBasedStatement": {
      "Limit": 10,
      "EvaluationWindowSec": 60,
      "AggregateKeyType": "IP"
    }
  },
  "Action": {"Block": {}},
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "RateLimitRule"
  }
}
```

**Aggregation Key Types:**
- **IP**: Rate limit per IP address
- **FORWARDED_IP**: Rate limit per X-Forwarded-For IP
- **CUSTOM_KEYS**: Custom combinations (headers, cookies, etc.)

**2. Managed Rule Groups:**
- **Core Rule Set (CRS)**: OWASP Top 10 protection
- **SQL Injection**: Detect SQL injection attacks
- **Cross-Site Scripting (XSS)**: XSS protection
- **Bot Control**: Identify and manage bot traffic
- **Anonymous IP List**: Block Tor, VPNs, hosting providers

**Pricing:**
- Managed rule groups: $1/month each

**3. Custom Rules:**
```json
{
  "Name": "BlockSQLInjection",
  "Priority": 0,
  "Statement": {
    "SqliMatchStatement": {
      "FieldToMatch": {
        "QueryString": {}
      },
      "TextTransformations": [
        {"Priority": 0, "Type": "URL_DECODE"},
        {"Priority": 1, "Type": "HTML_ENTITY_DECODE"}
      ]
    }
  },
  "Action": {"Block": {}}
}
```

**4. Bot Control:**
- Identify scrapers, scanners, crawlers
- Allow good bots (search engines)
- Block or challenge suspicious bots
- ML-based bot detection

**Integration Points:**
- CloudFront distributions (Global WAF)
- Application Load Balancers (Regional WAF)
- API Gateway REST APIs
- AppSync GraphQL APIs
- Cognito user pools
- App Runner services
- AWS Verified Access

**Pricing:**
- Web ACL: $5/month
- Rule: $1/month per rule
- Requests: $0.60 per million
- Managed rule groups: $1/month each
- Bot Control: Additional fees

**Common Patterns:**

**DDoS Protection:**
```
Rate limit: 100 requests per 5 minutes per IP
Action: Block
Exception: Known good IPs (whitelist)
```

**API Protection:**
```
Rate limit: 1000 requests per minute per API key (custom aggregation)
SQL injection protection (managed rule)
XSS protection (managed rule)
```

**Bot Mitigation:**
```
Bot Control managed rule group
Challenge suspicious traffic
Allow verified bots
```

---

### AWS Shield

#### Shield Standard (Free)

**Characteristics:**
- Automatically enabled for ALL AWS customers
- Protection against common Layer 3/4 DDoS attacks
- Protects: CloudFront, Route 53, Global Accelerator, ELB
- Basic attack mitigation
- No cost

**Protection:**
- SYN/UDP floods
- Reflection attacks
- Other Layer 3/4 attacks

---

#### Shield Advanced

**Pricing:**
- **$3,000/month** (12-month commitment)
- Plus data transfer fees during attacks
- Cost protection (AWS credits for scaling costs)

**Key Features:**

**1. Enhanced Protection:**
- Layer 3, 4, AND Layer 7 DDoS protection
- More sophisticated attack mitigation
- Advanced attack analytics
- Near real-time notification

**2. 24/7 DDoS Response Team (DRT):**
- Expert support during attacks
- Incident response assistance
- Can pre-authorize DRT to modify WAF rules during attacks
- Proactive engagement option

**3. Cost Protection:**
- AWS credits for scaling charges during DDoS
- Prevents unexpected bills from attack-induced Auto Scaling
- Applies to protected resources only

**4. AWS WAF Integration:**
- **Includes WAF at no additional cost**
- Up to 50 billion WAF requests/month included
- Pre-configured rules for DDoS mitigation
- Automatic application layer protection

**5. Advanced Metrics:**
- Detailed CloudWatch metrics
- Attack diagnostics
- Historical attack data
- Layer 7 attack visibility

**Protected Resources:**
- CloudFront distributions
- Route 53 hosted zones
- Elastic Load Balancers (ALB, NLB, CLB)
- Elastic IP addresses (EC2, NLB)
- Global Accelerator accelerators

**When to Choose Shield Advanced:**

| Factor | Consider Shield Advanced |
|--------|-------------------------|
| **Application Type** | Business-critical, high-visibility |
| **Revenue Impact** | Significant revenue at stake |
| **Compliance** | Requires DDoS protection SLA |
| **Cost Risk** | Cannot afford DDoS-induced scaling costs |
| **Support Need** | Need expert support during attacks |
| **Layer 7** | Need application-layer DDoS protection |

**Cost-Benefit Analysis:**
- If potential attack cost > $3,000/month → Shield Advanced
- If downtime cost > $3,000/month → Shield Advanced
- If reputation damage significant → Shield Advanced

---

### Shield Standard vs Advanced

| Feature | Standard | Advanced |
|---------|----------|----------|
| **Cost** | Free | $3,000/month |
| **Protection Layer** | Layer 3/4 | Layer 3/4/7 |
| **Services** | CloudFront, Route 53, GA, ELB | + EC2 EIPs |
| **DRT Access** | No | Yes (24/7) |
| **Cost Protection** | No | Yes |
| **WAF Included** | No | Yes |
| **Attack Analytics** | Basic | Advanced |
| **Notifications** | Basic | Enhanced |

**Exam Scenarios:**

**"Need cost protection from DDoS scaling":**
- **Answer**: Shield Advanced
- **Reason**: Only Advanced provides cost protection

**"24/7 expert support during attacks":**
- **Answer**: Shield Advanced
- **Reason**: Includes DDoS Response Team (DRT)

**"Automatic Layer 7 DDoS protection":**
- **Answer**: Shield Advanced
- **Reason**: Includes WAF with automated rules

**"Protect CloudFront from common attacks":**
- **Answer**: Shield Standard (already included)
- **Reason**: Sufficient for basic protection

---

## Threat Detection

### AWS GuardDuty

**2025 Major Updates:**
- **Extended Threat Detection with AI/ML**: Multi-stage attack detection
- **EKS Runtime Monitoring**: Container-level threats using eBPF
- **Custom Entity Lists**: Improved threat intelligence
- **Attack Sequence Findings**: Critical severity, multi-stage attacks

**Data Sources:**

**Core (Always Enabled):**
- VPC Flow Logs (network traffic)
- CloudTrail event logs (API calls)
- DNS logs (DNS queries)

**Optional Protection Plans:**
- **S3 Protection**: S3 data event logs
- **EKS Protection**: Audit logs + runtime monitoring (eBPF agent)
- **RDS Protection**: RDS login activity
- **Lambda Protection**: Lambda network activity
- **Malware Protection**: EBS volume scanning
- **Runtime Monitoring for EKS/ECS**: System-level activity

**Extended Threat Detection (NEW - FREE):**
- Multi-stage attack correlation
- AI/ML-based detection
- Attack sequence findings with critical severity
- MITRE ATT&CK mapping
- **Automatically enabled at no additional cost**

**Finding Categories:**

**1. Reconnaissance:**
- Port scanning
- Unusual API calls
- Example: `Recon:EC2/PortProbeUnprotectedPort`

**2. Instance Compromise:**
- Malware detected
- Cryptocurrency mining
- C&C communication
- Example: `CryptoCurrency:EC2/BitcoinTool.B!DNS`

**3. Account Compromise:**
- Credential exposure
- Disabled logging
- Privilege escalation
- Example: `Stealth:IAMUser/CloudTrailLoggingDisabled`

**4. Bucket Compromise:**
- Unusual data access
- Data exfiltration
- Permission changes
- Example: `Exfiltration:S3/ObjectRead.Unusual`

**5. Malware:**
- Malware on EC2 instances
- Trojan, backdoor, rootkit
- Example: `Execution:EC2/MaliciousFile`

**Severity Levels:**
- **High (7.0-8.9)**: Immediate investigation required
- **Medium (4.0-6.9)**: Timely investigation needed
- **Low (0.1-3.9)**: Informational

**Automated Response:**
```
GuardDuty Finding
  ↓
EventBridge Rule
  ↓
Lambda Function / Step Functions
  ↓
Automated Remediation:
  - Isolate instance (modify security group)
  - Snapshot for forensics
  - Disable IAM user
  - Block IP in NACL
  - Send notification to Security team
```

**Example Lambda Response:**
```python
def lambda_handler(event, context):
    finding = event['detail']

    if finding['severity'] >= 7.0:
        # High severity - immediate action
        instance_id = finding['resource']['instanceDetails']['instanceId']

        # 1. Isolate instance
        isolate_instance(instance_id)

        # 2. Create snapshot for forensics
        create_snapshot(instance_id)

        # 3. Notify security team
        send_sns_notification(finding)

        # 4. Create incident ticket
        create_jira_ticket(finding)

    return {'statusCode': 200}
```

**Multi-Account Strategy:**
- Designate security account as delegated administrator
- Automatically enroll new Organization accounts
- Centralized finding aggregation
- Member accounts can view own findings

**Pricing (2025):**
- CloudTrail events: $4.48 per million events/month
- VPC Flow Logs: $0.84 per GB/month
- DNS logs: $0.84 per million queries/month
- S3 Protection: Volume-based
- EKS Protection: Volume-based
- **Extended Threat Detection: FREE**

**Cost Optimization:**
- 30-day free trial for new accounts
- Tiered pricing (volume discounts)
- Can disable optional protections
- Filter VPC Flow Logs before analysis

---

## Certificate Management

### AWS Certificate Manager (ACM)

**2025 Major Update: Exportable Public Certificates**

**Certificate Types:**

**1. Public Certificates for AWS Services (FREE):**
- Integrated with ELB, CloudFront, API Gateway
- Automatic renewal every 13 months
- Cannot be exported
- No additional cost

**2. Exportable Public Certificates (NEW - June 2025):**
- **Can export certificate and private key**
- Use cases: EC2, EKS pods, on-premises, multi-cloud
- Pay-as-you-go pricing
- Must manage renewal on target systems

**3. Private Certificates:**
- Requires AWS Private Certificate Authority (CA)
- For internal applications
- Pricing: CA costs ($400/month) + per-certificate costs ($0.75)

**Key Features:**

**Automatic Renewal:**
- Certificates valid for 13 months (395 days)
- Renewal attempted 60 days before expiration
- Requires DNS validation (recommended) or email validation

**DNS Validation:**
```json
{
  "DomainValidationOptions": [{
    "DomainName": "example.com",
    "ValidationDomain": "example.com",
    "ValidationMethod": "DNS",
    "ResourceRecord": {
      "Name": "_xxx.example.com",
      "Type": "CNAME",
      "Value": "_yyy.acm-validations.aws"
    }
  }]
}
```

**Route 53 Integration:**
- Can automatically create validation records
- Simplifies DNS validation process

**Regional Considerations:**
- Certificates are regional resources
- **CloudFront**: Must request in **us-east-1** (important for exam!)
- **ALB/NLB**: Request in same region as load balancer
- Cannot copy/move certificates between regions

**Supported Services:**
- Elastic Load Balancing (ALB, NLB, CLB)
- CloudFront distributions
- API Gateway REST and WebSocket APIs
- Elastic Beanstalk
- App Runner
- AWS Amplify

**Pricing (2025):**
- Public certificates for AWS services: **FREE**
- Exportable public certificates: Pay-as-you-go (regional pricing)
- Private CA: $400/month + $0.75 per certificate

**Exam Tips:**
- ACM for ELB/CloudFront is always free
- CloudFront certificates MUST be in us-east-1
- Automatic renewal requires DNS validation
- Cannot export certificates for ELB/CloudFront (must use exportable type for EC2, etc.)
- Wildcard certificates supported (*.example.com)

---

## Compliance and Data Residency

### HIPAA (Healthcare)

**Requirements:**
- Protected Health Information (PHI) encryption
- Access controls and audit trails
- Business Associate Addendum (BAA) with AWS
- Use HIPAA-eligible services only

**HIPAA-Eligible AWS Services:**
- **Compute**: EC2, ECS, EKS, Lambda, Fargate
- **Storage**: S3, EBS, EFS, Glacier
- **Database**: RDS, Aurora, DynamoDB, Redshift, DocumentDB
- **Security**: KMS, CloudHSM, Secrets Manager, Certificate Manager
- **Networking**: VPC, CloudFront, Route 53, Direct Connect
- **Analytics**: EMR, Kinesis, Glue, Data Pipeline

**Implementation Checklist:**
- ✅ Sign BAA with AWS
- ✅ Enable encryption at rest (KMS or CloudHSM)
- ✅ Enable encryption in transit (TLS 1.2+)
- ✅ Implement access controls (IAM least privilege)
- ✅ Enable audit logging (CloudTrail, VPC Flow Logs)
- ✅ Implement backup and DR
- ✅ Conduct risk assessments
- ✅ Use only HIPAA-eligible services

---

### PCI DSS (Payment Card Industry)

**12 Requirements (6 Control Objectives):**
1. Install and maintain firewall configuration
2. Do not use vendor-supplied defaults
3. Protect stored cardholder data
4. Encrypt transmission of cardholder data
5. Protect systems against malware
6. Develop and maintain secure systems
7. Restrict access to cardholder data
8. Identify and authenticate access
9. Restrict physical access
10. Track and monitor access
11. Regularly test security systems
12. Maintain information security policy

**AWS Shared Responsibility:**
- **AWS**: Infrastructure Level 1 compliance
- **Customer**: Application and data compliance

**Implementation Checklist:**
- ✅ Encrypt cardholder data at rest (KMS)
- ✅ Encrypt cardholder data in transit (TLS 1.2+)
- ✅ Use AWS WAF for web application protection
- ✅ Implement strong access controls (IAM, MFA)
- ✅ Enable CloudTrail for audit logging
- ✅ Use GuardDuty for threat detection
- ✅ Regular vulnerability scans (Inspector)
- ✅ Network segmentation (VPC, security groups)
- ✅ Log retention (CloudWatch Logs)

---

### GDPR (EU Data Protection)

**Key Requirements:**
- Data subject rights (access, deletion, portability)
- Data protection by design
- Breach notification (72 hours)
- Data Processing Addendum (DPA)
- Data residency (EU regions for EU residents)

**AWS GDPR Support:**
- **DPA**: Available on AWS Artifact
- **Data residency**: EU regions (Frankfurt, Ireland, Paris, Stockholm, Milan, Zurich)
- **Encryption**: KMS, CloudHSM for data protection
- **Data deletion**: Tools to delete across services
- **Data portability**: APIs to export data

**Implementation Checklist:**
- ✅ Sign DPA with AWS
- ✅ Use EU regions for EU resident data
- ✅ Implement data classification (Macie)
- ✅ Enable encryption (KMS)
- ✅ Implement access controls (IAM)
- ✅ Enable audit logging (CloudTrail)
- ✅ Implement data lifecycle policies
- ✅ Support data subject rights (access, deletion, portability)
- ✅ Incident response plan (< 72 hours notification)

---

### Data Residency

**Control Data Location:**

**1. Region Selection:**
- Data never leaves selected region without permission
- Choose region based on data sovereignty requirements
- Multi-region architectures require explicit configuration

**2. Services with Global Scope:**
- **IAM**: Global service (metadata replicated globally)
- **Route 53**: Global DNS service
- **CloudFront**: Global CDN (can restrict distribution)
- **WAF (Global)**: For CloudFront, deployed globally

**3. Data Localization Services:**
- S3: Regional, data stays in region
- EBS: Regional, attached to instance in region
- RDS: Regional, can restrict to specific AZs
- DynamoDB: Regional, or global tables (explicit)

**4. Cross-Border Data Transfer:**
- Requires explicit configuration
- Cross-Region Replication (S3, RDS, DynamoDB)
- Data never automatically moved across borders

**GDPR-Specific:**
- Use EU regions: eu-west-1, eu-west-2, eu-west-3, eu-central-1, eu-north-1, eu-south-1, eu-central-2
- Disable cross-region features
- Implement data residency monitoring

---

## Exam Tips and Tricky Scenarios

### Common Exam Patterns

**Scenario 1: Cross-Account KMS Access**
- **Requirement**: Account A has KMS-encrypted S3 objects, Account B needs access
- **Answer**: Three permission layers required:
  1. KMS key policy in Account A (allow Account B)
  2. S3 bucket policy in Account A (allow Account B)
  3. IAM policy in Account B (allow both kms:Decrypt and s3:GetObject)
- **Trap**: Forgetting any one of these three layers

**Scenario 2: Encrypt Existing RDS**
- **Requirement**: Encrypt existing unencrypted RDS database
- **Answer**: Snapshot → Copy with encryption → Restore from encrypted snapshot
- **Trap**: Thinking you can enable encryption in-place (you cannot)

**Scenario 3: NACL for Web Traffic**
- **Requirement**: Allow web traffic through NACL
- **Answer**: Inbound allow 80/443 + Outbound allow ephemeral ports 1024-65535
- **Trap**: Forgetting ephemeral ports (stateless!)

**Scenario 4: Direct Connect Encryption**
- **Requirement**: Compliance requires encrypted Direct Connect
- **Answer**: MACsec (10/100 Gbps) OR VPN over Direct Connect + application TLS
- **Trap**: Assuming Direct Connect is encrypted by default (it's not)

**Scenario 5: Shield Cost Protection**
- **Requirement**: Need cost protection for DDoS scaling charges
- **Answer**: Shield Advanced (only it provides cost protection)
- **Trap**: Thinking Shield Standard includes cost protection

**Scenario 6: WAF Rate Limiting (2025)**
- **Requirement**: Block IP sending >10 requests per minute
- **Answer**: Now possible! (2025 update reduced minimum from 100 to 10)
- **Trap**: Old knowledge (pre-2025 minimum was 100)

**Scenario 7: Secrets Rotation**
- **Requirement**: Database password with automatic 30-day rotation
- **Answer**: Secrets Manager (built-in rotation for RDS)
- **Trap**: Choosing Parameter Store (doesn't have automatic rotation)

**Scenario 8: Multi-Region Key**
- **Requirement**: Encrypt data in us-east-1, decrypt in us-west-2
- **Answer**: KMS multi-region key (same key ID, different regions)
- **Trap**: Thinking regular KMS keys work cross-region (they don't)

**Scenario 9: CloudFront Certificate**
- **Requirement**: Custom domain certificate for CloudFront
- **Answer**: ACM certificate in **us-east-1** (must be us-east-1!)
- **Trap**: Requesting certificate in CloudFront distribution's origin region

**Scenario 10: Block Specific IP**
- **Requirement**: Block specific malicious IP address from accessing instances
- **Answer**: NACL (security groups can't deny, only allow)
- **Trap**: Trying to use security group to block IP

---

## Summary

**Key Takeaways:**

**1. Encryption Decision Tree:**
```
Need encryption?
├─ Standard integration → KMS ($1/month)
├─ FIPS 140-2 Level 3 required → CloudHSM ($1,044/month)
├─ High throughput (>30K TPS) → CloudHSM
└─ Cost-effective for most → KMS
```

**2. Secrets Management:**
```
Need to store secrets?
├─ Automatic rotation → Secrets Manager ($0.40/month)
├─ Database credentials → Secrets Manager
├─ Cross-region secrets → Secrets Manager
├─ Configuration values → Parameter Store (FREE)
└─ Cost-sensitive → Parameter Store
```

**3. Network Security:**
```
Need to block IP? → NACL (deny rules)
Need stateful filtering? → Security Groups
Need automatic return traffic? → Security Groups (stateful)
Need subnet-level protection? → NACL
Best practice → Use both (layered security)
```

**4. Web Application Protection:**
```
Layer 7 attacks? → WAF
Layer 3/4 DDoS basic? → Shield Standard (free)
Need cost protection? → Shield Advanced ($3,000/month)
Need DRT support? → Shield Advanced
```

**5. Threat Detection:**
```
Runtime threats? → GuardDuty
Sensitive data discovery? → Macie
Configuration compliance? → Config
Vulnerability scanning? → Inspector
Centralized security view → Security Hub
```

**6. Compliance:**
```
Healthcare (PHI)? → HIPAA (BAA, encrypt, HIPAA-eligible services)
Credit cards? → PCI DSS (encrypt, WAF, audit)
EU residents? → GDPR (DPA, EU regions, data subject rights)
Need compliance reports? → AWS Artifact
```

---

*Remember: Security is about layers. Use defense in depth: encryption + network security + access controls + monitoring + incident response.*

*2025 Exam Focus: Know the latest features (WAF rate limiting, GuardDuty Extended Threat Detection, ACM exportable certificates, Parameter Store cross-account sharing).*
