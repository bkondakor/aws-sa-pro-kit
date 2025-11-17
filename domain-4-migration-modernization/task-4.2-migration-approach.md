# Task 4.2: Determine the Optimal Migration Approach

## Overview

Task 4.2 focuses on **selecting and implementing** the right migration tools and techniques based on workload characteristics. This represents approximately **30% of Domain 4** questions on the exam.

**Key Objectives:**
- Choose appropriate migration tools for servers, databases, and data
- Implement AWS Application Migration Service (MGN) migrations
- Design database migration strategies with DMS
- Select optimal large-scale data transfer methods
- Plan wave-based migration execution
- Minimize downtime during migrations

---

## Server Migration with AWS Application Migration Service (MGN)

### Overview

**AWS Application Migration Service (MGN)** is the **primary recommended service** for migrating servers to AWS (replaces AWS Server Migration Service).

**Key Characteristics:**
- Agent-based continuous replication
- Application-centric approach
- Non-disruptive testing
- Minimal downtime cutover
- Supports physical, virtual, and cloud-based servers
- Works with Windows and Linux

### How MGN Works

**Architecture:**
```
Source Server (on-prem/other cloud)
    ↓ (AWS Replication Agent installed)
    ↓ (Continuous block-level replication)
AWS Replication Server (Staging Area)
    ↓ (Lightweight EC2 instances, automated)
    ↓ (Converts to boot volumes)
EBS Snapshots (Point-in-time copies)
    ↓ (Launch test or cutover)
Target EC2 Instances (Converted for AWS)
```

### MGN Migration Phases

**Phase 1: Install Replication Agent**
- Download agent from MGN console
- Install on source servers (requires admin/root privileges)
- Agent begins continuous replication to AWS
- Initial sync starts (can take hours/days depending on data size)

**Phase 2: Initial Sync**
- Full block-level copy to AWS Staging Area
- Creates lightweight replication servers automatically
- Data stored in EBS volumes in staging subnet
- Monitor: "Replication Status" in console
- Typically takes: 24-72 hours for 500GB-1TB servers

**Phase 3: Continuous Replication**
- Ongoing delta sync of changed blocks
- Near real-time replication (typically < 1 minute lag)
- Minimal impact on source server (< 3% CPU, network bandwidth varies)
- Ready state: "Ready for testing" appears in console

**Phase 4: Launch Settings Configuration**
- Configure how instances will launch in AWS
  - Instance type (can auto-recommend or manual)
  - Subnet placement
  - Security groups
  - IAM role
  - Private IP addressing
  - License settings (BYOL or AWS-provided)
  - Post-launch scripts

**Phase 5: Test Launch (Non-Disruptive)**
- Launch test instance from replicated data
- Source server continues running (no impact)
- Test application functionality in AWS
- Validate performance, connectivity, licenses
- Identify issues before cutover
- **Best Practice:** Test 2+ weeks before cutover
- Can launch up to 100 servers simultaneously
- Delete test instances when validated

**Phase 6: Cutover**
- Launch production instance in AWS
- Automated process:
  1. Delete any previous test instances
  2. Launch cutover instance with latest replicated data
  3. Source server continues replication (for rollback)
  4. Switch DNS/load balancer to AWS instance
  5. Validate application functionality
- Typical cutover window: 15-60 minutes

**Phase 7: Finalize Cutover**
- Once confirmed successful
- Stops replication
- Deletes replication servers
- Removes staging area resources
- Decommission source server
- **Warning:** Cannot roll back after finalization

### MGN Launch Settings Deep Dive

**Instance Type Selection:**
- **Recommended:** Let MGN auto-recommend based on source specs
- **Manual:** Override for right-sizing
- **Exam Tip:** Auto-recommendations may over-provision; review and optimize

**Network Settings:**
- **Subnet:** Target subnet for instance
- **Private IP:** Keep same IP (if available) or auto-assign
- **Security Groups:** Map from source firewall rules
- **Public IP:** Assign elastic IP if needed

**License Settings (Critical for Windows):**
- **AWS-provided licenses:** Use AWS Windows licenses
- **BYOL (Bring Your Own License):** Use existing licenses
- **Dedicated Hosts:** For license compliance (Oracle, Windows Server)

**Post-Launch Actions:**
- SSM documents to run after launch
- Install agents (monitoring, security)
- Configure applications
- Join domain
- Validate with custom scripts

### MGN Free Tier

**90-Day Free Usage:**
- Each source server free for 2,160 hours (90 days)
- Starts when agent installed
- Replication servers and storage included
- After 90 days: pay for replication instance costs
- **Exam Tip:** Plan to finalize within 90 days to avoid extra costs

### MGN vs SMS (Legacy)

| Feature | MGN (Modern) | SMS (Legacy) |
|---------|-------------|--------------|
| **Approach** | Application-centric | Server-centric |
| **Replication** | Continuous, block-level | Incremental, scheduled |
| **Downtime** | Minimal (minutes) | Higher (hours) |
| **Testing** | Non-disruptive testing | Limited testing |
| **Supported Platforms** | Physical, VM, cloud | Primarily VMware |
| **AWS Recommendation** | ✅ Use for all new migrations | ❌ Legacy, use MGN instead |
| **Cutover Control** | Precise control | Less flexible |
| **Post-migration Optimization** | Automated recommendations | Manual |

**Exam Tip:** Always choose MGN over SMS for new migrations

### MGN Exam Scenarios

**Scenario 1: Large Windows Server Fleet**
**Q:** Migrate 200 Windows servers with minimal downtime. What approach?

**A:** Use AWS MGN
- Install agents on all 200 servers
- Continuous replication to AWS
- Test instances to validate
- Cutover in waves (e.g., 20-50 servers per wave)
- Minimize downtime to 15-30 minutes per server

**Scenario 2: Database Server Migration**
**Q:** Physical SQL Server with 2TB database, minimize downtime

**A:** Use MGN for server migration
- Continuous block-level replication includes database files
- Test database functionality in AWS
- Cutover during maintenance window
- Alternative: DMS for data migration + MGN for application tier

---

## Database Migration with AWS DMS

### Overview

**AWS Database Migration Service (DMS)** migrates databases with minimal downtime using continuous replication.

**Key Use Cases:**
- Homogeneous migrations (same DB engine)
- Heterogeneous migrations (different DB engines)
- Database consolidation
- Continuous replication for DR
- Database to data lake (S3, Redshift)

### DMS Architecture

```
Source Database
    ↓
DMS Replication Instance (EC2-based)
    ↓ (Reads changes via native CDC)
    ↓ (Transforms if heterogeneous)
Target Database
```

### Homogeneous vs Heterogeneous Migrations

**Homogeneous (Same Engine):**
- Oracle → RDS Oracle
- MySQL → Aurora MySQL
- SQL Server → RDS SQL Server
- PostgreSQL → Aurora PostgreSQL

**Process:**
- Use DMS only
- No schema conversion needed
- Faster setup
- Full load + CDC

**Heterogeneous (Different Engine):**
- Oracle → Aurora PostgreSQL
- SQL Server → Aurora MySQL
- Commercial → Open Source

**Process:**
- Use SCT (Schema Conversion Tool) first
- Convert schema, stored procedures, functions
- Then use DMS for data migration
- More complex, requires testing

### AWS Schema Conversion Tool (SCT)

**What SCT Does:**
- Converts database schemas
- Converts stored procedures and functions
- Converts application SQL code
- Provides assessment report (% auto-convertible)
- Highlights manual conversion needed

**Installation:**
- Desktop application (Windows, Linux, macOS)
- Free download from AWS
- Connects to source and target databases
- Generates conversion scripts

**Conversion Assessment:**
- **Green (70-90%+):** Most code auto-converts (good candidate)
- **Yellow (40-70%):** Moderate manual work
- **Red (< 40%):** Significant manual conversion (consider alternatives)

**Exam Tip:** Heterogeneous migration = SCT + DMS (two-step process)

### DMS Replication Instance

**Sizing:**
- Based on: data volume, change rate, transformation complexity
- Instance types: dms.t3.micro to dms.r5.24xlarge
- **General Guidance:**
  - < 100 GB: dms.t3.medium
  - 100 GB - 1 TB: dms.c5.xlarge
  - 1 TB - 10 TB: dms.c5.4xlarge
  - > 10 TB: dms.c5.9xlarge or larger

**Multi-AZ:**
- Option for high availability
- Standby replication instance in different AZ
- Automatic failover
- Slight performance impact
- **Use when:** Production migrations requiring HA

**Exam Tip:** Multi-AZ DMS for production, single-AZ for dev/test

### DMS Task Types

**1. Full Load**
- One-time complete data copy
- No ongoing replication
- Use when: Read-only migration, data warehouse refresh
- Duration: Until complete, then stops

**2. Full Load + CDC (Change Data Capture)**
- Initial full copy + ongoing replication
- **Most common for live migrations**
- Captures changes during and after full load
- Continuous until manually stopped
- Use when: Minimal downtime required

**3. CDC Only**
- Replicates only changes (no full load)
- Assumes target already has data
- Use when: Ongoing replication, keeping databases in sync
- Requires binary logging/CDC enabled on source

### DMS Migration Process

**Step 1: Enable CDC on Source**
- **Oracle:** ARCHIVELOG mode, supplemental logging
- **MySQL:** Binary logging (binlog_format = ROW)
- **SQL Server:** SQL Server Agent, change tracking or CDC
- **PostgreSQL:** Logical replication (wal_level = logical)

**Step 2: Create Replication Instance**
- Choose instance size
- Select VPC and subnet
- Configure Multi-AZ if needed
- Allocate storage (min 50 GB, recommended 100-200 GB)

**Step 3: Create Source and Target Endpoints**
- Connection details (host, port, database)
- Credentials (user with replication privileges)
- SSL settings
- Test connections (verify connectivity)

**Step 4: Create Replication Task**
- Select task type (full load, full + CDC, CDC only)
- Table mappings (which tables to migrate)
- Transformation rules (rename, filter)
- Task settings (batch size, commit rate)
- Start task automatically or manual start

**Step 5: Monitor Replication**
- CloudWatch metrics:
  - **CDCLatencySource:** Lag reading from source (target: < 5 sec)
  - **CDCLatencyTarget:** Lag writing to target (target: < 10 sec)
  - **FullLoadThroughputBandwidth:** Data transfer rate
  - **CPUUtilization:** Replication instance CPU
  - **FreeableMemory:** Available memory

**Step 6: Cutover**
- Stop application writes to source
- Wait for CDC lag to reach zero (fully synced)
- Validate row counts match
- Switch application to target database
- Decommission source (after validation period)

### DMS Performance Tuning

**1. Reduce CDC Lag**

**Problem:** CDCLatencySource or CDCLatencyTarget high

**Solutions:**
- Increase replication instance size (more CPU/memory)
- Enable Multi-AZ if disabled (network optimization)
- Use BatchApplyEnabled for high-change scenarios
- Increase MaxFullLoadSubTasks (parallel load)
- Reduce CommitRate (batch larger transactions)

**2. Improve Full Load Performance**

**Solutions:**
- Use ParallelLoadThreads (load multiple tables simultaneously)
- Partition large tables (migrate table segments in parallel)
- Disable foreign keys on target during migration (re-enable after)
- Use provisioned IOPS for target database
- Increase replication instance storage (larger working area)

**3. Handle Large Transactions**

**Problem:** Transaction exceeds memory, causes swapping

**Solutions:**
- Increase MemoryLimitTotal (hold more in memory)
- Break large batch operations on source
- Use TransactionConsistencyTimeout

### DMS Best Practices

**1. Test Before Production**
- Run test migration with sample data
- Validate data integrity (row counts, checksums)
- Test application connectivity
- Measure CDC lag under load

**2. Network Optimization**
- Use AWS Direct Connect for large migrations
- Ensure sufficient bandwidth (calculate based on data size)
- Minimize network hops (same region preferred)

**3. Security**
- Use SSL/TLS for source and target connections
- Encrypt replication instance storage
- Use IAM roles for AWS targets
- Restrict security groups to only necessary traffic

**4. Ongoing Replication**
- Monitor CDC lag continuously
- Set CloudWatch alarms (lag > 30 seconds)
- Plan for source database maintenance (ensure DMS handles)

**5. Large Databases (> 10 TB)**
- Consider Snowball Edge for initial load + DMS CDC
- Partition tables for parallel migration
- Use multiple DMS tasks for table groups

### DMS with Snowball Edge (Very Large Databases)

**When to Use:**
- Database > 10 TB
- Limited network bandwidth
- Migration timeline is tight

**Process:**
1. **Extract:** Use SCT to extract data to Snowball Edge
2. **Ship:** Physical shipment to AWS
3. **Load:** AWS imports to S3
4. **Import:** SCT loads from S3 to target database
5. **CDC:** DMS replicates changes since extraction
6. **Cutover:** Once CDC catches up

**Exam Tip:** Large DB + limited bandwidth = Snowball + DMS CDC

### DMS Serverless (2025 Feature)

**What is DMS Serverless:**
- Automatically provisions and scales resources
- No instance sizing decisions
- Pay for actual usage (GB transferred)
- Scales from zero to handle varying loads

**When to Use:**
- Unpredictable workload sizes
- Don't want to manage instance sizing
- Sporadic migrations

**Limitations:**
- Fewer customization options
- May be more expensive for large continuous migrations
- Limited to specific source/target combinations (check docs)

---

## Large-Scale Data Transfer

### Decision Framework

**Key Factors:**
1. **Data size** (GB, TB, PB)
2. **Network bandwidth** (Mbps, Gbps)
3. **Timeline** (days, weeks, months)
4. **Frequency** (one-time, recurring)
5. **Location** (on-prem, remote, edge)

### Transfer Time Calculation

**Formula:**
```
Transfer Time (hours) = (Data Size in GB × 8) / (Bandwidth in Gbps) / 3600
```

**Efficiency Factor:** Multiply by 1.25-1.5 for real-world overhead

**Example:**
- Data: 10 TB = 10,000 GB
- Bandwidth: 1 Gbps
- Time = (10,000 × 8) / 1 / 3600 = 22.2 hours (theoretical)
- Real-world: ~30-35 hours (with overhead)

**Rule of Thumb:**
- If transfer time > 1 week → Consider Snow Family
- If network cost > device cost → Use Snow Family

### AWS DataSync

**What is DataSync:**
- Online data transfer service
- 10x faster than open-source tools
- Automated, scheduled transfers
- Handles encryption, integrity checks, metadata

**Use Cases:**
- Migrate file systems to AWS (EFS, FSx, S3)
- Replicate data for backup/DR
- Move data for processing (on-prem → AWS → on-prem)
- Archive cold data to S3 Glacier

**Supported Sources:**
- NFS (Network File System)
- SMB (Server Message Block)
- HDFS (Hadoop Distributed File System)
- Self-managed object storage
- AWS Snowcone (with DataSync agent pre-installed)

**Supported Targets:**
- Amazon S3 (all storage classes)
- Amazon EFS
- Amazon FSx for Windows File Server
- Amazon FSx for Lustre
- Amazon FSx for OpenZFS
- Amazon FSx for NetApp ONTAP

**How DataSync Works:**
```
On-Premises File System
    ↓
DataSync Agent (VM on-prem or Snowcone)
    ↓ (Encrypted transfer over internet or Direct Connect)
    ↓ (Network optimization, compression)
AWS DataSync Service
    ↓ (Parallel multi-threaded transfer)
Target (S3, EFS, FSx)
```

**Setup:**
1. Deploy DataSync agent (VMware, Hyper-V, KVM, or Snowcone)
2. Activate agent (connects to AWS)
3. Create source location (NFS/SMB share)
4. Create destination location (S3/EFS/FSx)
5. Create task (schedule, filters, options)
6. Run task (one-time or scheduled)

**Performance:**
- Single DataSync agent: Up to 10 Gbps
- Automatically scales (parallel transfers)
- Bandwidth throttling available (limit impact)

**Pricing:**
- Per GB transferred
- Typical: $0.0125/GB (varies by region)
- No upfront costs, no minimum fees

**Exam Scenarios:**
- **Migrate file server to EFS:** DataSync (NFS/SMB to EFS)
- **Archive to S3 Glacier:** DataSync with S3 lifecycle policies
- **Recurring sync:** DataSync scheduled tasks
- **Large file sets with good network:** DataSync

### AWS Transfer Family

**What is Transfer Family:**
- Managed SFTP, FTPS, FTP, AS2 service
- Transfers files directly to/from S3 or EFS
- Maintains legacy protocols for partners/applications

**Supported Protocols:**
- **SFTP (SSH File Transfer Protocol):** Secure, most common
- **FTPS (FTP over SSL):** Secure FTP
- **FTP (File Transfer Protocol):** Insecure, legacy support
- **AS2 (Applicability Statement 2):** B2B data exchange

**Use Cases:**
- Partner file exchanges (EDI, financial data)
- Legacy application integration
- Migrate from on-prem SFTP servers
- Receive files from external vendors

**How It Works:**
```
External Partner/Application
    ↓ (SFTP/FTPS client)
Transfer Family Endpoint (managed)
    ↓ (Authentication via service-managed, AD, custom)
Amazon S3 or Amazon EFS
```

**Authentication Options:**
- **Service-managed:** Store SSH keys in Transfer Family
- **Active Directory:** Authenticate against AD
- **Custom identity provider:** Lambda function for custom auth
- **AWS Secrets Manager:** Programmatic credential storage

**Endpoint Types:**
- **Public:** Internet-accessible
- **VPC:** Internal-only (with VPC endpoint)
- **VPC with internet:** Elastic IP attached

**Pricing:**
- Per hour per protocol enabled (~$0.30/hour)
- Per GB uploaded/downloaded (~$0.04/GB)
- **Exam Tip:** More expensive than DataSync for bulk transfer

**When to Use Transfer Family:**
- Partner requires SFTP/FTP protocol
- Legacy application can't change protocols
- Receiving files from external sources
- EDI or B2B integrations

**When NOT to Use:**
- Bulk data migration (use DataSync instead)
- Modern API-based integration (use API Gateway + S3)
- One-time large transfer (use Snow Family or DataSync)

### Snow Family

**Overview:**
Physical devices for offline data transfer when network transfer is impractical.

#### AWS Snowcone

**Specifications:**
- **Storage:** 8 TB HDD or 14 TB SSD
- **Dimensions:** 9" × 6" × 3" (very portable)
- **Weight:** 4.5 lbs (2.1 kg)
- **Power:** USB-C powered (12W)
- **Edge Compute:** 2 vCPUs, 4 GB RAM (optional)

**Use Cases:**
- Edge computing in rugged environments
- Drones, vehicles, remote locations
- Small datasets (< 14 TB)
- Pre-installed DataSync agent for data transfer

**Exam Tip:** Snowcone for remote/edge locations with small data

#### AWS Snowball Edge

**Two Variants:**

**1. Snowball Edge Storage Optimized**
- **Storage:** 80 TB usable (100 TB total)
- **Compute:** 40 vCPUs, 80 GB RAM (optional)
- **Use Case:** Large data migrations, local storage

**2. Snowball Edge Compute Optimized**
- **Storage:** 28 TB usable (42 TB SSD)
- **Compute:** 104 vCPUs, 416 GB RAM, GPU (optional)
- **Use Case:** Edge computing, ML inference, video processing

**Common Features:**
- **Dimensions:** Suitcase-sized (65 lbs / 29 kg)
- **Clustering:** Connect up to 10 devices
- **Network:** 10 Gbps, 25 Gbps, 40 Gbps, 100 Gbps
- **Encryption:** 256-bit encryption (hardware)
- **Tamper-resistant:** Trusted Platform Module (TPM)

**Data Transfer Process:**
1. **Order:** Request via AWS console
2. **Ship to you:** AWS ships device (1-6 days)
3. **Transfer data:** Copy data to device using NFS/S3 API
4. **Ship to AWS:** Return using pre-paid label
5. **Import:** AWS imports to S3 (1-2 days)
6. **Erase:** Device securely wiped (NIST standards)

**Transfer Speed:**
- 10 Gbps network → ~80 TB in 1-2 days
- Parallel copy jobs for faster transfer

**Use Cases:**
- 10 TB - 80 TB datasets
- Limited bandwidth locations
- Datacenter migrations
- Tape replacement

**Exam Tip:** 10-80 TB + limited network = Snowball Edge

#### AWS Snowmobile

**Specifications:**
- **Storage:** Up to 100 PB per Snowmobile
- **Form Factor:** 45-foot shipping container
- **Security:** GPS tracking, 24/7 video surveillance, escort vehicle
- **Dedicated:** AWS personnel escort throughout

**Use Cases:**
- Exabyte-scale migrations (> 10 PB)
- Entire datacenter shutdowns
- Video production archives
- Genomics datasets

**Process:**
1. **Plan:** Work with AWS team (months of planning)
2. **Deploy:** Snowmobile brought to your site
3. **Transfer:** Direct high-speed connection to datacenter
4. **Transport:** Secure transport to AWS region
5. **Import:** AWS imports data to S3
6. **Return:** Snowmobile returned to AWS

**When to Use:**
- **> 10 PB data**
- Multiple Snowball Edge devices not practical
- Single location with massive data

**Exam Tip:** Snowmobile for PB-scale (10+ PB), single location

### Snow Family Comparison Table

| Feature | Snowcone | Snowball Edge Storage | Snowball Edge Compute | Snowmobile |
|---------|----------|----------------------|----------------------|------------|
| **Capacity** | 8-14 TB | 80 TB | 28 TB | 100 PB |
| **Size** | Tiny (4.5 lbs) | Suitcase | Suitcase | Truck |
| **Network** | Wi-Fi, wired | 10-100 Gbps | 10-100 Gbps | Multi-100 Gbps |
| **Use Case** | Edge, small data | Medium migration | Edge compute | Exabyte migration |
| **Cost/TB** | Higher | Medium | Higher | Lowest (massive scale) |
| **Compute** | Limited | 40 vCPUs | 104 vCPUs + GPU | N/A |

### AWS Direct Connect for Migration

**What is Direct Connect:**
- Dedicated network connection to AWS
- Bypass internet for private, consistent bandwidth
- 1 Gbps, 10 Gbps, 100 Gbps ports

**Use Cases for Migration:**
- Large datasets with good on-prem bandwidth
- Hybrid migrations (keep some on-prem)
- Ongoing replication needs
- Combine with DataSync for accelerated transfer

**Setup Time:**
- **Hosted Connection:** 2-4 weeks
- **Dedicated Connection:** 4-12 weeks (physical circuit provisioning)

**Cost:**
- Port hour charges (~$0.30/hour for 1 Gbps)
- Data transfer out charges (~$0.02/GB)
- May require colocation facility access

**Exam Scenario:**
- **Ongoing hybrid:** Direct Connect + Storage Gateway
- **Large migration with time:** Direct Connect + DataSync
- **Urgent migration:** Snow Family (faster than waiting for DX)

### S3 Transfer Acceleration

**What is it:**
- Leverages CloudFront edge locations
- Optimized network paths to S3
- 50-500% faster for long-distance uploads

**How it works:**
```
Client (anywhere in world)
    ↓ (Upload to nearest edge location)
CloudFront Edge Location
    ↓ (Optimized AWS backbone)
S3 Bucket (any region)
```

**Use Cases:**
- Global users uploading to central S3
- Large file uploads from far distances
- Improved upload performance needed

**Cost:**
- Additional $0.04/GB over standard S3 transfer
- Only charged if acceleration is faster

**Exam Tip:** Global users uploading to S3 → S3 Transfer Acceleration

---

## Migration Execution Strategies

### Wave-Based Execution

**Wave Structure:**
```
Wave 1: Pilot (2-4 weeks)
├── 3-5 low-risk applications
├── Validate processes
└── Train team

Wave 2: Quick Wins (4-6 weeks)
├── 10-20 high-value, low-complexity apps
├── Demonstrate ROI
└── Build momentum

Waves 3-N: Bulk Migration (3-6 months)
├── 50-100 servers per wave
├── Standardized execution
└── Migration factory approach

Final Wave: Complex Apps (2-4 months)
├── Business-critical applications
├── Extensive testing
└── Phased rollout
```

### Cutover Planning

**Pre-Cutover:**
- Communicate to stakeholders
- Schedule maintenance window
- Prepare rollback plan
- Document validation steps
- Brief support teams

**During Cutover:**
- Stop writes to source (read-only mode)
- Wait for replication lag = 0
- Validate data consistency
- Update DNS/load balancer
- Route traffic to AWS
- Monitor closely (first 1-2 hours)

**Post-Cutover:**
- Validate application functionality
- Check performance metrics
- Monitor error rates
- Keep source running for rollback (24-72 hours)
- After validation: finalize migration

**Rollback Plan:**
- If critical issues discovered
- Revert DNS/load balancer to source
- Investigate issues
- Fix and re-attempt cutover

### Parallel Running Pattern

**What is it:**
Run old and new systems simultaneously during transition.

**Use Cases:**
- High-risk migrations
- Complex validation requirements
- Regulatory compliance needs
- Financial systems

**Process:**
1. Deploy new system in AWS
2. Route subset of traffic (10%) to AWS
3. Compare results between old and new
4. Gradually increase traffic to AWS (25%, 50%, 75%)
5. Monitor for issues
6. Full cutover when validated
7. Decommission old system

**Duration:** 2-8 weeks typical

---

## Exam Scenarios and Solutions

### Scenario 1: 500 Servers, Fast Migration

**Q:** Company must migrate 500 Windows and Linux servers in 4 months. Minimize downtime. What approach?

**A:** AWS Application Migration Service (MGN)
- Install agents on all 500 servers
- Wave-based migration (50-100 servers per wave)
- Non-disruptive testing before cutover
- Cutover in batches during maintenance windows
- Minimal downtime (15-30 minutes per server)

### Scenario 2: 50 TB Database, Minimal Downtime

**Q:** Migrate 50 TB Oracle database to Aurora PostgreSQL. Downtime < 2 hours. Limited 500 Mbps network.

**A:** Snowball Edge + SCT + DMS
1. Use SCT to convert Oracle schema to PostgreSQL
2. Export data to Snowball Edge (80 TB device)
3. Ship Snowball to AWS
4. AWS imports to S3
5. Load from S3 to Aurora using SCT
6. Start DMS CDC from Oracle → Aurora (captures changes since export)
7. Cutover when DMS lag reaches zero

**Why not DMS only?**
- 50 TB over 500 Mbps = ~200 hours (8+ days) just for initial load
- Unacceptable for minimal downtime

### Scenario 3: File Server Migration

**Q:** Migrate 20 TB file server (SMB) to AWS. Ongoing sync for 2 months before full cutover.

**A:** AWS DataSync
- Deploy DataSync agent on-prem
- Create task: SMB source → FSx for Windows target
- Schedule daily sync (incremental after initial)
- Initial sync: 20 TB transferred
- Ongoing: Only changed files synced
- After 2 months: Final sync, cutover users to FSx

### Scenario 4: Partner SFTP Integration

**Q:** Partners upload files via SFTP daily. Want to migrate to AWS, partners cannot change process.

**A:** AWS Transfer Family
- Create Transfer Family SFTP endpoint
- Configure authentication (service-managed or AD)
- Target: S3 bucket for file storage
- Provide partners with new SFTP endpoint
- Same SFTP protocol, seamless to partners

**Why not DataSync?**
- DataSync doesn't provide SFTP endpoint
- Partners require SFTP protocol

### Scenario 5: Continuous Database Replication

**Q:** Keep on-prem MySQL and Aurora MySQL in sync for DR. Bidirectional not needed.

**A:** AWS DMS with CDC
- Create DMS replication instance
- Configure endpoints (on-prem MySQL → Aurora)
- Task type: CDC only (ongoing replication)
- Monitor CDC lag (keep < 5 seconds)
- Use for DR or gradual migration

### Scenario 6: Global File Distribution

**Q:** Users worldwide upload large files to central S3 bucket. Improve upload speed.

**A:** S3 Transfer Acceleration
- Enable on S3 bucket
- Provide transfer-accelerated endpoint to users
- Users upload to nearest edge location
- Optimized path to S3 bucket
- 50-500% faster uploads

---

## Summary: Exam Quick Reference

### Tool Selection Matrix

| Workload | Data Size | Network | Downtime | Tool |
|----------|-----------|---------|----------|------|
| Servers | Any | Good | Minimal | **MGN** |
| Database (same engine) | < 10 TB | Good | Minimal | **DMS** (full + CDC) |
| Database (different engine) | < 10 TB | Good | Minimal | **SCT + DMS** |
| Database | > 10 TB | Limited | Minimal | **Snowball + DMS CDC** |
| Files | < 10 TB | Good | N/A | **DataSync** |
| Files | > 10 TB | Limited | N/A | **Snowball Edge** |
| Files (ongoing sync) | Any | Good | N/A | **DataSync** (scheduled) |
| Partner file exchange | Any | Any | N/A | **Transfer Family** (SFTP) |
| Massive data | > 10 PB | Any | N/A | **Snowmobile** |
| Global S3 uploads | Any | Internet | N/A | **S3 Transfer Acceleration** |

### Key Formulas

**Network Transfer Time:**
```
Hours = (Data in GB × 8) / (Bandwidth in Gbps) / 3600 × 1.3
```

**Snow Family Decision:**
```
If (Transfer Time > 7 days) OR (Network Cost > Device Cost):
    Use Snow Family
```

### Critical Exam Points

1. **MGN is preferred over SMS** for all new server migrations
2. **Heterogeneous DB migration** = SCT + DMS (two steps)
3. **Large DB (> 10 TB) + limited network** = Snowball + DMS CDC
4. **DataSync for file systems**, Transfer Family for SFTP protocol
5. **Snowball Edge** for 10-80 TB, **Snowmobile** for > 10 PB
6. **DMS CDC lag** should be < 5 seconds for cutover readiness
7. **MGN testing** is non-disruptive (source keeps running)
8. **S3 Transfer Acceleration** for global users uploading to S3

---

*Last Updated: 2025-11-17*
*Always verify current AWS service capabilities*
