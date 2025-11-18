# AWS Migration Services - Comprehensive Comparison

## High-Level Overview

AWS provides multiple migration services, each optimized for specific migration scenarios. Understanding when to use each service is critical for the SA Pro exam.

### Key Services

1. **AWS Application Migration Service (MGN)** - Lift-and-shift server migrations
2. **AWS Database Migration Service (DMS)** - Database migration with minimal downtime
3. **AWS DataSync** - Online data transfer and synchronization
4. **AWS Transfer Family** - SFTP/FTPS/FTP file transfers to AWS
5. **AWS Snow Family** - Offline/edge data transfer for large-scale migrations
6. **AWS Storage Gateway** - Hybrid cloud storage integration
7. **AWS Migration Hub** - Centralized migration tracking and orchestration

---

## Detailed Comparison Table

| Service | Primary Use Case | Data Transfer Method | Typical Volume | Downtime | Network Required | Key Features |
|---------|-----------------|---------------------|----------------|----------|------------------|--------------|
| **Application Migration Service (MGN)** | Server migration (lift-and-shift) | Continuous block-level replication | Server workloads | Minimal (minutes) | Yes (Internet/DX) | Automated conversion, minimal downtime, supports physical/virtual/cloud |
| **Database Migration Service (DMS)** | Database migration & replication | Logical replication | Databases | Near-zero | Yes | Homogeneous/heterogeneous, CDC, Schema Conversion Tool (SCT) |
| **DataSync** | Online data transfer to/from AWS | Scheduled/continuous file transfer | TBs-PBs | None (online) | Yes (1.5-10 Gbps) | 10x faster than open-source, bandwidth throttling, data validation |
| **Transfer Family** | SFTP/FTPS/FTP workflows | Standard protocols | File-based | None | Yes | Managed SFTP/FTPS/FTP, integrates S3/EFS, existing workflows |
| **Snow Family** | Offline large-scale data transfer | Physical device shipping | 80TB-100PB | Offline period | No (optional) | Edge computing, rugged devices, disconnected environments |
| **Storage Gateway** | Hybrid cloud storage | Gateway appliance | Ongoing hybrid | None | Yes | File/Volume/Tape Gateway, local cache, seamless cloud integration |
| **Migration Hub** | Migration orchestration | N/A (tracking) | N/A | N/A | Yes | Centralized tracking, integrates all migration tools, progress visibility |

---

## Detailed Service Breakdowns

### 1. AWS Application Migration Service (MGN)

**What it does:** Automates lift-and-shift migrations of physical, virtual, or cloud servers to AWS.

**How it works:**
- Installs replication agent on source servers
- Continuous block-level replication to AWS staging area
- Automated conversion and launch in AWS
- Cutover with minutes of downtime

**Best for:**
- Migrating entire servers/applications
- Minimal application changes required
- Heterogeneous migrations (any source to AWS)
- Large-scale datacenter migrations

**⚠️ EXAM TIP:** MGN replaced Server Migration Service (SMS). If you see SMS on the exam, it's deprecated - choose MGN instead.

**Pricing:** Based on hours servers are in use (replication + testing)

---

### 2. AWS Database Migration Service (DMS)

**What it does:** Migrates databases to AWS with minimal downtime.

**How it works:**
- Creates replication instance
- Source and target endpoints
- Migration task with CDC (Change Data Capture)
- Schema Conversion Tool (SCT) for heterogeneous migrations

**Best for:**
- Database migrations (homogeneous or heterogeneous)
- Continuous data replication
- Database consolidation
- Development/test copy

**Migration Types:**
- **Homogeneous:** Oracle → RDS Oracle (no schema conversion)
- **Heterogeneous:** Oracle → Aurora PostgreSQL (requires SCT)

**⚠️ EXAM TIP:**
- Use DMS for **databases**, not file systems
- SCT required for heterogeneous migrations
- Supports continuous replication (not just one-time)
- Can replicate to S3 for data lakes

**Common Sources:** Oracle, SQL Server, MySQL, PostgreSQL, MongoDB, SAP, DB2
**Common Targets:** RDS, Aurora, DynamoDB, Redshift, S3, DocumentDB, Neptune

---

### 3. AWS DataSync

**What it does:** Automates online data transfer between on-premises and AWS, or between AWS services.

**How it works:**
- Deploys DataSync agent (on-premises) or uses service endpoints (AWS-to-AWS)
- Scheduled or continuous transfers
- Automatic data validation and encryption
- Bandwidth throttling

**Best for:**
- Migrating active datasets to AWS
- Ongoing data synchronization
- Data archival to Glacier
- Data replication for DR

**Transfer Performance:**
- Up to 10 Gbps per agent
- 10x faster than open-source tools
- Automatic parallel transfers
- Network optimization

**Supported Endpoints:**
- **Sources:** NFS, SMB, HDFS, S3, EFS, FSx
- **Destinations:** S3, EFS, FSx for Windows, FSx for Lustre, FSx for OpenZFS, FSx for NetApp ONTAP

**⚠️ EXAM TIP:**
- Use DataSync for **file-based** migrations (not block-level)
- Requires network connectivity (online transfer)
- Handles scheduling, retries, validation automatically
- Can transfer directly to Glacier Deep Archive

---

### 4. AWS Transfer Family

**What it does:** Managed SFTP, FTPS, and FTP service for file transfers to/from S3 and EFS.

**How it works:**
- Creates managed transfer endpoint
- Integrates with S3 or EFS
- User authentication via service-managed or custom (API Gateway, Lambda, AD)
- Maintains existing client workflows

**Best for:**
- Migrating existing SFTP/FTP workflows
- Third-party file exchanges
- Legacy application integration
- Compliance requirements (SFTP/FTPS)

**⚠️ EXAM TIP:**
- Use when scenario mentions **SFTP/FTP protocols**
- Don't migrate away from protocols - integrate them with AWS
- Supports user authentication via Active Directory, LDAP, custom identity providers
- Zone-redundant within region

**Pricing:** Hourly endpoint cost + data transfer

---

### 5. AWS Snow Family

**What it does:** Physical devices for offline data transfer and edge computing.

| Device | Capacity | Use Case | Network | Compute |
|--------|----------|----------|---------|---------|
| **Snowcone** | 8TB HDD / 14TB SSD | Edge computing, small transfers | Optional (DataSync agent) | 2 vCPUs, 4GB |
| **Snowball Edge Storage Optimized** | 80TB | Large transfers, local storage | Optional | 40 vCPUs, 80GB |
| **Snowball Edge Compute Optimized** | 28TB + 42TB NVMe | Edge ML, video processing | Optional | 104 vCPUs, 416GB, GPU |
| **Snowmobile** | 100PB | Datacenter-scale migrations | N/A | N/A |

**How it works:**
- Order device from AWS
- Receive and load data
- Ship back to AWS
- AWS loads data into S3

**Best for:**
- Limited or no network bandwidth
- Petabyte-scale migrations
- Remote/disconnected environments
- Edge computing at remote sites

**⚠️ EXAM TIP:**
- Use Snow when **network is not feasible** (cost, speed, bandwidth)
- Rule of thumb: >100TB over limited bandwidth → consider Snow
- Snowcone is **smallest**, Snowmobile is **largest**
- Can run EC2 instances and Lambda functions on Snowball Edge
- Export from S3 supported (not just import)

---

### 6. AWS Storage Gateway

**What it does:** Hybrid cloud storage that connects on-premises environments with AWS cloud storage.

**Gateway Types:**

| Type | Protocol | Cache | Primary Use | Backing Storage |
|------|----------|-------|-------------|-----------------|
| **S3 File Gateway** | NFS, SMB | Local cache | File shares backed by S3 | S3 Standard, S3 IA, S3 One Zone-IA |
| **FSx File Gateway** | SMB | Local cache | Low-latency access to FSx for Windows | FSx for Windows File Server |
| **Volume Gateway** | iSCSI | Local/Cloud | Block storage for applications | S3 (EBS snapshots) |
| **Tape Gateway** | iSCSI VTL | Cloud | Virtual tape backup | S3, Glacier, Glacier Deep Archive |

**Volume Gateway Modes:**
- **Cached Volumes:** Primary data in S3, frequently accessed data cached locally
- **Stored Volumes:** Primary data on-premises, asynchronously backed up to S3

**Best for:**
- **NOT primarily for migration** - for ongoing hybrid operations
- Maintaining on-premises access to cloud data
- Backup and archival
- Cloud-backed file shares
- Disaster recovery

**⚠️ EXAM TIP:**
- Storage Gateway is for **hybrid operations**, not one-time migrations
- File Gateway for NFS/SMB file shares → S3
- Volume Gateway for iSCSI block storage → S3 snapshots
- Tape Gateway for backup applications → Virtual tapes in cloud
- Requires VMware, Hyper-V, or hardware appliance

---

### 7. AWS Migration Hub

**What it does:** Centralized service to track and manage migrations across multiple AWS and partner tools.

**How it works:**
- Connects to migration tools (MGN, DMS, etc.)
- Aggregates progress data
- Provides unified view of migrations
- Tracks application groupings

**Integrations:**
- Application Migration Service (MGN)
- Database Migration Service (DMS)
- CloudEndure Migration
- ATADATA ATAmotion
- RiverMeadow Server Migration SaaS

**Best for:**
- Large-scale migrations with multiple tools
- Portfolio-level migration tracking
- Organizational visibility
- Migration planning and assessment

**Features:**
- Application Discovery Service integration
- Migration progress tracking
- Strategy recommendations
- Migration templates

**⚠️ EXAM TIP:**
- Migration Hub **doesn't migrate** - it tracks migrations
- Use for **centralized visibility** in complex migrations
- Free service (pay only for migration tools used)

---

## Decision Tree

```
Need to migrate to AWS?
│
├─ What are you migrating?
│
├─ SERVERS/APPLICATIONS (entire VMs/physical servers)
│  └─ Use: Application Migration Service (MGN)
│     - Lift-and-shift migrations
│     - Minimal downtime
│     - Automated conversion
│
├─ DATABASES
│  └─ Use: Database Migration Service (DMS)
│     ├─ Same engine (Oracle → Oracle): Homogeneous
│     └─ Different engine (Oracle → PostgreSQL): Use SCT + DMS
│
├─ FILES/FILE SYSTEMS
│  │
│  ├─ Online transfer possible?
│  │  │
│  │  ├─ YES → AWS DataSync
│  │  │   - Fast, automated file transfer
│  │  │   - Scheduled or continuous
│  │  │   - Data validation included
│  │  │
│  │  └─ NO → AWS Snow Family
│  │      - Limited bandwidth
│  │      - Large datasets (>100TB)
│  │      - Physical device shipping
│  │
│  └─ Need to maintain SFTP/FTP workflows?
│     └─ AWS Transfer Family
│        - Managed SFTP/FTPS/FTP
│        - Backend: S3 or EFS
│
├─ HYBRID (ongoing operations, not one-time migration)
│  └─ AWS Storage Gateway
│     ├─ File shares → S3 File Gateway
│     ├─ Block volumes → Volume Gateway
│     └─ Tape backups → Tape Gateway
│
└─ TRACKING/ORCHESTRATION (multiple migrations)
   └─ AWS Migration Hub
      - Centralized tracking
      - No data migration itself
```

---

## Common Exam Scenarios

### Scenario 1: Datacenter Migration - 500 Servers
**Question:** Company needs to migrate 500 physical and virtual servers to AWS with minimal downtime.

**Answer:** **AWS Application Migration Service (MGN)**

**Why:**
- Lift-and-shift of entire servers
- Continuous replication with minimal cutover time
- Supports physical, virtual, and cloud sources
- Automated conversion to AWS-native

**Wrong Answers:**
- ❌ DMS: For databases, not entire servers
- ❌ DataSync: For file systems, not server migration
- ❌ Snow: For data transfer, not server replication

---

### Scenario 2: Oracle to Aurora PostgreSQL
**Question:** Migrate Oracle database to Aurora PostgreSQL with minimal downtime. Database is 5TB with continuous transactions.

**Answer:** **AWS Schema Conversion Tool (SCT) + AWS Database Migration Service (DMS)**

**Why:**
- Heterogeneous migration (different engines)
- SCT converts schema
- DMS handles data migration with CDC
- Near-zero downtime with continuous replication

**⚠️ EXAM TIP:** Always use SCT for heterogeneous database migrations.

---

### Scenario 3: 10 PB Data Migration, Limited Bandwidth
**Question:** Company needs to migrate 10PB of data. Internet connection is 100 Mbps. Cost-effective solution with reasonable timeline?

**Answer:** **AWS Snowball Edge (multiple devices) or Snowmobile**

**Why:**
- Calculate transfer time over network: 10PB over 100Mbps ≈ 3 years
- Snow Family provides physical transfer
- Snowmobile for 10PB is appropriate (or multiple Snowball Edge)
- Cost-effective vs. years of data transfer costs

**Calculation:**
- 10 PB = 10,000 TB = 80,000,000 Gb
- 100 Mbps = 0.1 Gbps
- 80,000,000 / 0.1 / 86,400 (seconds/day) ≈ 9,259 days ≈ 25 years
- (Actual: with overhead, about 3-4 years)

**Wrong Answers:**
- ❌ DataSync: Would take years over 100 Mbps
- ❌ DMS: For databases, not general data
- ❌ Direct Connect: Still limited by bandwidth

---

### Scenario 4: SFTP File Exchange with Partners
**Question:** Company receives files from external partners via SFTP. Need to store files in S3 and process with Lambda. Partners can't change their workflows.

**Answer:** **AWS Transfer Family (SFTP)**

**Why:**
- Maintains existing SFTP protocol
- Partners no workflow changes needed
- Direct integration with S3
- S3 events can trigger Lambda

**Wrong Answers:**
- ❌ DataSync: Partners need SFTP endpoint
- ❌ S3 direct: No SFTP protocol support
- ❌ EC2 with SFTP server: Not managed, more operational overhead

---

### Scenario 5: NFS File Server Migration
**Question:** Migrate 50TB of NFS file shares to AWS. Files accessed daily. Need fast transfer with automated validation.

**Answer:** **AWS DataSync**

**Why:**
- Supports NFS source
- Fast transfer (up to 10 Gbps)
- Automated data validation
- Can schedule transfers
- Destinations: S3, EFS, FSx

**Process:**
1. Deploy DataSync agent on-premises
2. Create DataSync task (NFS → S3/EFS/FSx)
3. Schedule or run immediately
4. Automatic validation

**Wrong Answers:**
- ❌ Storage Gateway: For hybrid operations, not one-time migration
- ❌ MGN: For servers, not file systems
- ❌ Snow: Overkill for 50TB with network available

---

### Scenario 6: Hybrid Cloud File Shares
**Question:** Company wants to keep on-premises file server but back files to S3. Users need low-latency access to frequently used files via SMB.

**Answer:** **AWS Storage Gateway (S3 File Gateway)**

**Why:**
- **Not a migration** - hybrid operations
- Local cache for frequently accessed files
- SMB protocol support
- Backed by S3
- Ongoing synchronization

**Wrong Answers:**
- ❌ DataSync: For scheduled transfers, not real-time hybrid access
- ❌ Transfer Family: For SFTP/FTP, not SMB with caching
- ❌ FSx File Gateway: If FSx for Windows specifically needed

---

### Scenario 7: Continuous Database Replication
**Question:** Replicate on-premises MySQL database to Aurora MySQL for reporting. Production database must remain on-premises. Near real-time replication needed.

**Answer:** **AWS Database Migration Service (DMS) with ongoing replication**

**Why:**
- Continuous data replication (CDC)
- Homogeneous migration (MySQL → Aurora MySQL)
- Near real-time updates
- Source remains on-premises

**Configuration:**
- Migration type: **Full load + CDC (Change Data Capture)**
- Not one-time migration

**Wrong Answers:**
- ❌ DataSync: For files, not database replication
- ❌ Storage Gateway: Not for database replication

---

## Key Differences Summary

### MGN vs DMS
| Aspect | MGN | DMS |
|--------|-----|-----|
| **Migrates** | Entire servers | Databases only |
| **Replication** | Block-level | Logical (SQL) |
| **Downtime** | Minutes | Near-zero |
| **Use Case** | Lift-and-shift VMs | Database migration |

---

### DataSync vs Storage Gateway
| Aspect | DataSync | Storage Gateway |
|--------|----------|-----------------|
| **Purpose** | **Migration/Transfer** | **Hybrid operations** |
| **Pattern** | Scheduled/one-time | Continuous hybrid |
| **Data Flow** | One direction typically | Bidirectional |
| **Use Case** | Move data to AWS | Ongoing cloud-backed storage |

**⚠️ EXAM TIP:** DataSync = migration, Storage Gateway = hybrid operations

---

### DataSync vs Transfer Family
| Aspect | DataSync | Transfer Family |
|--------|----------|-----------------|
| **Protocol** | Proprietary (agent) | SFTP/FTPS/FTP |
| **Use Case** | Fast bulk transfers | Protocol-specific workflows |
| **Speed** | Up to 10 Gbps | Standard protocol speeds |
| **Client** | DataSync agent | Any SFTP/FTP client |

---

### DataSync vs Snow Family
| Aspect | DataSync | Snow Family |
|--------|----------|-------------|
| **Transfer** | Online (network) | Offline (physical device) |
| **Speed** | Up to 10 Gbps | Ships in days/weeks |
| **Best for** | <100TB with good network | >100TB or limited network |
| **Cost** | Data transfer charges | Device + shipping + data transfer |

**Decision Rule:** If transfer over network would take >1 week or cost more than Snow device, consider Snow.

---

### Snow Family Devices
| Device | Capacity | When to Use |
|--------|----------|-------------|
| **Snowcone** | 8-14TB | Edge computing, small datasets, portable |
| **Snowball Edge Storage** | 80TB | Large transfers, standard migration |
| **Snowball Edge Compute** | 28TB + GPU | Edge ML, processing at edge |
| **Snowmobile** | 100PB | Datacenter-scale, exabyte migrations |

---

## Exam Strategy - Keywords to Watch For

| Keywords in Question | Likely Answer |
|---------------------|---------------|
| "lift-and-shift", "minimal downtime", "server migration" | **Application Migration Service (MGN)** |
| "database", "schema conversion", "Oracle to PostgreSQL" | **DMS + SCT** |
| "database", "same engine", "MySQL to MySQL" | **DMS (homogeneous)** |
| "NFS", "SMB", "fast transfer", "validation" | **DataSync** |
| "SFTP", "existing workflows", "partners" | **Transfer Family** |
| "limited bandwidth", "petabytes", "no network" | **Snow Family** |
| "hybrid cloud", "on-premises access", "backed by S3" | **Storage Gateway** |
| "track migrations", "centralized view", "multiple tools" | **Migration Hub** |
| "file gateway", "NFS shares backed by S3" | **S3 File Gateway** |
| "backup to tape", "virtual tape library" | **Tape Gateway** |
| "iSCSI", "block storage", "EBS snapshots in S3" | **Volume Gateway** |

---

## Common Misconceptions

### ❌ "Storage Gateway is for migration"
**✓ Reality:** Storage Gateway is for **hybrid cloud operations**, not one-time migrations. Use DataSync for migrations.

### ❌ "Use DataSync for SFTP requirements"
**✓ Reality:** Use **Transfer Family** when SFTP/FTP protocol is required.

### ❌ "DMS only does one-time migrations"
**✓ Reality:** DMS supports **continuous replication** with CDC for ongoing synchronization.

### ❌ "Snow Family is always cheapest for large data"
**✓ Reality:** Calculate actual costs. If you have 10 Gbps Direct Connect, DataSync might be faster and cheaper than Snow for 50TB.

### ❌ "MGN and SMS are different services"
**✓ Reality:** MGN **replaced** SMS. SMS is deprecated. Always choose MGN on the exam.

### ❌ "Can't migrate from cloud to cloud"
**✓ Reality:** MGN supports cloud-to-AWS migrations (Azure VMs, GCP instances, other AWS accounts).

---

## Cost Implications

### Application Migration Service (MGN)
- **Pricing:** Per hour of use (90 days free per server)
- **Cost factors:** Number of servers, replication duration, testing hours
- **Tip:** Minimize testing time; cutover quickly after testing

### Database Migration Service (DMS)
- **Pricing:** Replication instance hours + storage + data transfer
- **Cost factors:** Instance size, replication duration, data transfer out
- **Tip:** Right-size replication instance; use VPN/DX to reduce data transfer costs

### DataSync
- **Pricing:** Per GB transferred
- **Cost factors:** Data volume, transfer frequency
- **Tip:** Schedule transfers during off-peak if possible; use incremental transfers

### Transfer Family
- **Pricing:** Per protocol enabled per hour + data transferred
- **Cost factors:** Number of protocols, always-on endpoints, data volume
- **Tip:** Use VPC endpoints to reduce data transfer costs

### Snow Family
- **Pricing:** Device fee + shipping + data transfer out (no inbound transfer fee to S3)
- **Cost factors:** Device rental duration, expedited shipping
- **Tip:** Prepare data before device arrives; return quickly to minimize rental costs

### Storage Gateway
- **Pricing:** Storage used + requests + data transfer
- **Cost factors:** Cache size, S3 storage class, access patterns
- **Tip:** Use appropriate S3 storage classes (IA for infrequent access)

---

## Quick Reference Cheat Sheet

### Migration Service Selection - 30 Second Guide

**Server Migration:**
- → **Application Migration Service (MGN)**

**Database Migration:**
- Same engine → **DMS**
- Different engine → **SCT + DMS**
- Continuous replication → **DMS with CDC**

**File Transfer:**
- Fast online transfer → **DataSync**
- Need SFTP/FTP → **Transfer Family**
- No/limited network → **Snow Family**
- Hybrid operations → **Storage Gateway**

**When to Use Snow:**
- Data > 100TB + limited bandwidth
- Calculate: Transfer time over network > 1 week
- Cost of network transfer > Snow device cost
- No reliable network connection

**Storage Gateway Types:**
- NFS/SMB shares → **S3 File Gateway**
- FSx Windows → **FSx File Gateway**
- iSCSI block → **Volume Gateway**
- Tape backup → **Tape Gateway**

**Migration Hub:**
- Only for tracking, not actual migration

---

## Real-World Migration Patterns

### Pattern 1: Large Datacenter Exit
**Scenario:** 500 servers, 100 databases, 2 PB of file data

**Solution:**
1. **Servers:** Application Migration Service (MGN)
2. **Databases:** DMS with SCT (as needed)
3. **Files:** DataSync (if network sufficient) or Snow Family
4. **Tracking:** Migration Hub for visibility

**Timeline:** 6-12 months typically

---

### Pattern 2: Hybrid Cloud Strategy
**Scenario:** Keep on-premises, extend to AWS, maintain seamless access

**Solution:**
1. **File shares:** S3 File Gateway or FSx File Gateway
2. **Block storage:** Volume Gateway
3. **Backups:** Tape Gateway to Glacier
4. **Databases:** DMS for replication to AWS for DR/reporting

**Not one-time migration** - ongoing hybrid operations

---

### Pattern 3: Partner Ecosystem Integration
**Scenario:** 50+ partners send files via SFTP, need to process in AWS

**Solution:**
1. **Ingestion:** Transfer Family (SFTP endpoint)
2. **Storage:** S3
3. **Processing:** Lambda triggered by S3 events
4. **Archives:** S3 Lifecycle to Glacier

**Partners maintain existing SFTP clients** - no changes required

---

### Pattern 4: DR Setup
**Scenario:** On-premises production, AWS as DR site

**Solution:**
1. **Servers:** MGN with continuous replication (don't launch)
2. **Databases:** DMS with ongoing replication
3. **Files:** DataSync scheduled sync or Storage Gateway
4. **Orchestration:** CloudFormation + Lambda for failover

**Recovery Time Objective (RTO):** Minutes to hours
**Recovery Point Objective (RPO):** Minutes

---

## Advanced Exam Tips

### 1. Bandwidth Calculations
Be ready to calculate transfer times:
- 1 TB over 100 Mbps ≈ 24 hours (theoretical)
- Include 30-50% overhead in real scenarios
- If calculation > 1 week, consider Snow Family

**Formula:**
```
Transfer Time (hours) = Data (GB) × 8 / Bandwidth (Gbps) / 3600 × 1.5 (overhead)
```

### 2. DMS Task Types
- **Full Load:** One-time migration
- **CDC Only:** Replicate changes only (requires existing data)
- **Full Load + CDC:** Initial migration + ongoing replication (most common)

**⚠️ EXAM TIP:** For minimal downtime, always use Full Load + CDC

### 3. DataSync Task Scheduling
- Can schedule transfers during off-peak hours
- Supports bandwidth throttling
- Automated retries and error handling
- Data integrity verification built-in

### 4. MGN Staging Area
- Replicated servers stored in low-cost staging area
- Can launch test instances before cutover
- Automated conversion to AWS instance types
- Cleanup staging area after cutover to save costs

### 5. Transfer Family Authentication
Supports multiple identity providers:
- Service-managed users
- AWS Directory Service (Microsoft AD)
- Custom identity provider (API Gateway + Lambda)
- LDAP integration via custom provider

**⚠️ EXAM TIP:** Choose custom identity provider for existing LDAP/AD integration

---

## Migration Phases (General Pattern)

### 1. Assess
- **Tool:** Migration Hub + Application Discovery Service
- Discover and inventory applications
- Understand dependencies
- Estimate costs

### 2. Mobilize
- **Tools:** Migration Hub
- Create migration strategy (6 R's)
- Build migration team
- Set up AWS environment (Landing Zone)

### 3. Migrate & Modernize
- **Tools:** MGN, DMS, DataSync, Transfer Family, Snow
- Execute migrations in waves
- Validate and test
- Cutover

### 4. Operate & Optimize
- **Tools:** CloudWatch, Cost Explorer, Trusted Advisor
- Monitor performance
- Optimize costs
- Plan modernization

---

## The 6 R's of Migration (Context)

1. **Rehost** (Lift-and-Shift) → **MGN**
2. **Replatform** (Lift-and-Reshape) → **MGN + some config changes**
3. **Repurchase** (Move to SaaS) → **DataSync or DMS for data**
4. **Refactor** (Re-architect) → **DMS for data, rebuild apps**
5. **Retire** (Decommission) → **No migration**
6. **Retain** (Keep on-premises) → **Storage Gateway for hybrid**

---

## Final Exam Strategy

### When You See These Scenarios:

**"Migrate with minimal downtime"**
- Server → MGN
- Database → DMS (Full Load + CDC)

**"Limited network bandwidth"**
- Consider Snow Family
- Calculate transfer time

**"Existing SFTP/FTP workflows"**
- Always Transfer Family
- Don't force protocol changes

**"Hybrid cloud" or "on-premises access"**
- Storage Gateway (not DataSync)
- Ongoing operations, not migration

**"Different database engines"**
- Must use SCT + DMS
- Heterogeneous migration

**"Track multiple migrations"**
- Migration Hub
- Doesn't do actual migration

**"Fast file transfer with validation"**
- DataSync
- Not Snow unless network insufficient

---

## Summary - Service Purpose in One Line

| Service | One-Line Purpose |
|---------|------------------|
| **MGN** | Lift-and-shift server migrations with minimal downtime |
| **DMS** | Database migration and replication with CDC |
| **DataSync** | Fast online file transfer and synchronization |
| **Transfer Family** | Managed SFTP/FTPS/FTP to S3/EFS |
| **Snow Family** | Offline data transfer via physical devices |
| **Storage Gateway** | Hybrid cloud storage with on-premises access |
| **Migration Hub** | Centralized migration tracking (doesn't migrate) |

---

## Last-Minute Review Questions

**Q: When should you use SCT?**
A: Heterogeneous database migrations (different engines)

**Q: What's the difference between DataSync and Storage Gateway?**
A: DataSync = migration/transfer; Storage Gateway = hybrid operations

**Q: When do you choose Snow over DataSync?**
A: When network transfer time > 1 week or insufficient bandwidth

**Q: What does Migration Hub do?**
A: Tracks migrations across tools; doesn't migrate itself

**Q: SFTP requirement in question - what's the answer?**
A: AWS Transfer Family

**Q: Migrate 500 servers - which service?**
A: Application Migration Service (MGN)

**Q: Continuous database replication - which service?**
A: DMS with CDC (Change Data Capture)

**Q: What replaced Server Migration Service (SMS)?**
A: Application Migration Service (MGN)

---

**Good luck on your AWS SA Pro exam! 🎯**
