# AWS Storage Services - Comprehensive Comparison

## High-Level Overview

AWS provides multiple managed file storage services, each optimized for specific use cases and workload requirements. Understanding the nuances between EFS and the FSx family is critical for the SA Pro exam.

### Key Services

1. **Amazon EFS (Elastic File System)** - Fully managed, elastic NFS file system for Linux workloads
2. **Amazon FSx for Windows File Server** - Fully managed native Windows file systems with SMB support
3. **Amazon FSx for Lustre** - High-performance file system for compute-intensive workloads
4. **Amazon FSx for NetApp ONTAP** - Fully managed NetApp ONTAP file system with enterprise features
5. **Amazon FSx for OpenZFS** - Fully managed OpenZFS file system for migration and ZFS features

---

## Detailed Comparison Table

| Service | Protocol | OS Support | Performance | Use Case | Deployment | Key Features |
|---------|----------|------------|-------------|----------|------------|--------------|
| **EFS** | NFS v4.0/4.1 | Linux only | Up to 10+ GB/s, millions of IOPS | General-purpose Linux file shares | Regional (multi-AZ) | Elastic, auto-scaling, lifecycle management, Standard/IA tiers |
| **FSx for Windows** | SMB | Windows + Linux (SMB) | Up to 2 GB/s, hundreds of thousands of IOPS | Windows applications, Active Directory | Single-AZ or Multi-AZ | Native Windows features, AD integration, DFS namespaces, shadow copies |
| **FSx for Lustre** | Lustre | Linux | Up to 100+ GB/s, millions of IOPS | HPC, ML, video processing | Single-AZ or persistent multi-AZ | S3 integration, sub-millisecond latencies, POSIX-compliant |
| **FSx for NetApp ONTAP** | NFS, SMB, iSCSI | Linux, Windows, macOS | Up to 4 GB/s per HA pair | Multi-protocol, hybrid cloud | Multi-AZ HA pairs | Data deduplication, snapshots, SnapMirror replication, thin provisioning |
| **FSx for OpenZFS** | NFS v3/4.0/4.1 | Linux, Windows (NFS), macOS | Up to 10 GB/s, 1 million IOPS | ZFS migrations, advanced features | Single-AZ or multi-AZ | Point-in-time snapshots, data compression, Z-Standard compression |

---

## Detailed Service Breakdowns

### 1. Amazon EFS (Elastic File System)

**What it does:** Fully managed, elastic, shared file storage for Linux-based workloads using NFS protocol.

**How it works:**
- Presents as a standard NFS file system
- Automatically scales storage capacity (elastic)
- Multi-AZ deployment by default
- No capacity planning needed
- Pay only for storage used

**Key Features:**
- **Elastic Scaling:** Automatically grows and shrinks as you add/remove files
- **Storage Classes:**
  - Standard (frequently accessed)
  - Infrequent Access (IA) - 92% cost savings
- **Lifecycle Management:** Automatically moves files to IA based on access patterns
- **Performance Modes:**
  - General Purpose (default) - latency-sensitive workloads
  - Max I/O - higher aggregate throughput and IOPS
- **Throughput Modes:**
  - Bursting - scales with storage size
  - Provisioned - fixed throughput independent of size
  - Elastic - automatically scales throughput with workload

**Performance:**
- Up to 10+ GB/s throughput
- 500,000+ IOPS
- Single-digit millisecond latencies
- Scales to petabytes

**Best for:**
- Linux-based applications requiring shared file storage
- Content management systems
- Web serving and content publishing
- Development and build environments
- Container storage (ECS, EKS)
- Home directories
- WordPress, Drupal, and other CMS platforms

**⚠️ EXAM TIP:**
- EFS is **ONLY for Linux** - do not use for Windows workloads
- Automatically multi-AZ and elastic (no capacity planning)
- Use IA storage class for cost optimization (lifecycle policies)
- EFS Access Points provide application-specific entry points

**Pricing:**
- Standard: $0.30/GB-month
- IA: $0.025/GB-month (92% cheaper)
- Pay only for storage used

---

### 2. Amazon FSx for Windows File Server

**What it does:** Fully managed native Windows file system built on Windows Server with full SMB support.

**How it works:**
- Runs actual Windows Server in AWS
- Provides fully managed SMB file shares
- Integrates with Active Directory
- Supports Windows-native features
- Automatic backups and maintenance

**Key Features:**
- **Active Directory Integration:** Seamless integration with AWS Managed AD or on-premises AD
- **SMB Protocol:** Full SMB 2.0/3.0/3.1.1 support
- **Windows Features:**
  - DFS (Distributed File System) namespaces
  - Shadow copies (user-initiated file restore)
  - ACLs (Access Control Lists)
  - User quotas
- **Data Deduplication:** Reduces storage costs for duplicate data
- **Deployment Options:**
  - Single-AZ (lower cost)
  - Multi-AZ (high availability)
- **SSD and HDD Storage Options:** Choose based on performance needs

**Performance:**
- Up to 2 GB/s throughput
- Hundreds of thousands of IOPS
- Sub-millisecond latencies
- Consistent, predictable performance

**Best for:**
- Windows-based applications
- SQL Server file shares
- SharePoint
- IIS web servers
- .NET applications
- Home directories for Windows users
- Lift-and-shift Windows file servers to AWS
- Any application requiring SMB protocol

**⚠️ EXAM TIP:**
- FSx for Windows is for **Windows workloads** or when **SMB protocol** is required
- Requires Active Directory (AWS Managed AD or on-premises AD)
- Multi-AZ deployment provides automatic failover
- DFS namespaces for consolidating multiple file systems
- If question mentions "Windows", "SMB", "Active Directory" → FSx for Windows

**Pricing:**
- SSD: $0.13/GB-month + throughput capacity
- HDD: $0.013/GB-month + throughput capacity
- Pay for storage capacity and throughput separately

---

### 3. Amazon FSx for Lustre

**What it does:** High-performance file system for compute-intensive workloads, tightly integrated with S3.

**How it works:**
- Based on Lustre open-source parallel file system
- Optimized for fast processing of large datasets
- Can link to S3 bucket for seamless integration
- POSIX-compliant for Linux applications
- Parallel architecture for massive throughput

**Key Features:**
- **S3 Integration:**
  - Link file system to S3 bucket
  - Lazy load data from S3 (on first access)
  - Write results back to S3
  - Ideal for cloud-bursting HPC
- **Deployment Types:**
  - **Scratch:** Temporary storage, no replication, lowest cost (200 MB/s per TiB)
  - **Persistent:** Replicated within AZ, durable storage (50, 100, 200 MB/s per TiB options)
- **Metadata Performance:** Sub-millisecond access to metadata
- **Data Compression:** Automatic LZ4 compression

**Performance:**
- Up to 100+ GB/s throughput
- Millions of IOPS
- Sub-millisecond latencies
- Scales to hundreds of petabytes

**Best for:**
- High Performance Computing (HPC)
- Machine learning training
- Video processing and transcoding
- Financial modeling and simulations
- Electronic Design Automation (EDA)
- Genomics analysis
- Seismic processing
- Any workload requiring massive parallel throughput

**⚠️ EXAM TIP:**
- FSx for Lustre is for **HPC and compute-intensive** workloads
- Tight **S3 integration** - can present S3 bucket as file system
- **Scratch** = temporary, no replication (processing jobs)
- **Persistent** = durable, replicated (long-term workloads)
- Keywords: "HPC", "machine learning training", "video processing", "millions of IOPS"
- Not for general-purpose file shares

**Pricing:**
- Scratch: $0.14/GB-month
- Persistent: $0.14-$0.21/GB-month (based on throughput)
- S3 data transfer included

**Common Exam Scenario:** "Process data from S3, run ML training, write results back to S3" → FSx for Lustre

---

### 4. Amazon FSx for NetApp ONTAP

**What it does:** Fully managed NetApp ONTAP file system providing enterprise-grade features and multi-protocol support.

**How it works:**
- Provides NetApp ONTAP operating system as a service
- Multi-protocol support (NFS, SMB, iSCSI)
- Deployed as HA pairs across multiple AZs
- Storage Virtual Machines (SVMs) for multi-tenancy
- FlexVol and FlexGroup volumes

**Key Features:**
- **Multi-Protocol:** Simultaneous NFS, SMB, and iSCSI access
- **NetApp Features:**
  - Snapshots (instant, point-in-time copies)
  - SnapMirror (replication to another FSx ONTAP or on-premises)
  - FlexClone (instant, space-efficient clones)
  - Data deduplication and compression
  - Thin provisioning
- **High Availability:** Automatic failover between AZs
- **Storage Efficiency:** Up to 65% storage savings with deduplication/compression
- **Data Tiering:** Automatically tier cold data to capacity pool (cheaper storage)

**Performance:**
- Up to 4 GB/s throughput per HA pair
- Hundreds of thousands of IOPS
- Microsecond latencies (NVMe)
- Multiple HA pairs for higher performance

**Best for:**
- Multi-protocol environments (Linux + Windows)
- NetApp users migrating to AWS
- Hybrid cloud with on-premises NetApp
- Enterprise applications requiring advanced data management
- Database workloads (Oracle, SQL Server, PostgreSQL)
- VDI (Virtual Desktop Infrastructure)
- SAP, Oracle, VMware workloads
- Applications requiring snapshots and cloning

**⚠️ EXAM TIP:**
- FSx for ONTAP when you need **multi-protocol** support (NFS + SMB simultaneously)
- **NetApp migration** or existing NetApp users
- Advanced features like **SnapMirror, snapshots, clones**
- **Hybrid cloud** scenarios with on-premises NetApp
- Storage efficiency (deduplication/compression) requirements
- If "NetApp", "multi-protocol", or "advanced data management" appears → FSx ONTAP

**Pricing:**
- SSD: $0.23/GB-month
- Capacity pool (tiered storage): $0.04/GB-month
- Throughput capacity: separate charge
- Storage efficiency can reduce costs by 65%

---

### 5. Amazon FSx for OpenZFS

**What it does:** Fully managed OpenZFS file system for high-performance workloads and ZFS migrations.

**How it works:**
- Built on OpenZFS file system
- Provides ZFS features (snapshots, compression, clones)
- NFS v3, v4.0, v4.1, v4.2 protocol support
- Single-AZ or multi-AZ deployment
- Designed for sub-millisecond latencies

**Key Features:**
- **ZFS Snapshots:** Instant, point-in-time copies (up to 10,000 per volume)
- **Data Cloning:** Instant, space-efficient copies for testing/development
- **Data Compression:** Z-Standard and LZ4 compression
- **Performance:** Consistently low latency
- **Multi-AZ Option:** Automatic failover for high availability
- **NFS Protocol:** Compatible with Linux, macOS, Windows (via NFS client)

**Performance:**
- Up to 10 GB/s throughput
- 1 million IOPS
- Microsecond latencies (read) / hundreds of microseconds (write)
- Designed for latency-sensitive workloads

**Best for:**
- ZFS users migrating to AWS (on-premises ZFS to FSx OpenZFS)
- Linux/Unix workloads requiring high performance
- Financial services applications (low latency requirements)
- Media processing workflows
- Development environments (instant clones)
- Databases requiring consistent low latency
- Workloads needing many snapshots

**⚠️ EXAM TIP:**
- FSx for OpenZFS for **ZFS migrations** or when you need **ZFS features**
- **Low latency** requirements (microseconds)
- Need for **many snapshots** (up to 10,000)
- **Instant cloning** for dev/test environments
- Linux/Unix workloads with NFS
- If "ZFS", "microsecond latency", or "10,000 snapshots" → FSx OpenZFS

**Pricing:**
- SSD storage: $0.20/GB-month
- Throughput capacity: separate charge
- Compression can reduce storage costs

---

## Decision Tree

```
Need shared file storage in AWS?
│
├─ What operating system / protocol?
│  │
│  ├─ LINUX ONLY (NFS)
│  │  │
│  │  ├─ General-purpose, auto-scaling needed?
│  │  │  └─ YES → Amazon EFS
│  │  │     - Elastic (no capacity planning)
│  │  │     - Multi-AZ by default
│  │  │     - Pay for what you use
│  │  │
│  │  ├─ High-performance computing, ML, video processing?
│  │  │  └─ YES → FSx for Lustre
│  │  │     - Massive throughput (100+ GB/s)
│  │  │     - S3 integration
│  │  │     - Scratch or Persistent
│  │  │
│  │  ├─ ZFS migration or need ZFS features?
│  │  │  └─ YES → FSx for OpenZFS
│  │  │     - ZFS snapshots and clones
│  │  │     - Microsecond latencies
│  │  │     - Up to 10,000 snapshots
│  │  │
│  │  └─ Need advanced NetApp features?
│  │     └─ YES → FSx for NetApp ONTAP
│  │        - SnapMirror, FlexClone
│  │        - Deduplication/compression
│  │
│  ├─ WINDOWS (SMB Protocol)
│  │  │
│  │  ├─ Pure Windows environment, AD integration?
│  │  │  └─ YES → FSx for Windows File Server
│  │  │     - Native Windows features
│  │  │     - Active Directory integration
│  │  │     - DFS, shadow copies
│  │  │
│  │  └─ Need both Windows AND Linux access?
│  │     └─ YES → FSx for NetApp ONTAP
│  │        - Multi-protocol (SMB + NFS)
│  │        - Advanced data management
│  │
│  └─ MULTI-PROTOCOL (NFS + SMB + iSCSI)
│     └─ FSx for NetApp ONTAP
│        - Simultaneous protocol access
│        - Enterprise data management
│        - Hybrid cloud with NetApp

├─ What's the primary use case?
│  │
│  ├─ HPC, ML Training, Video Processing
│  │  └─ FSx for Lustre
│  │
│  ├─ Windows Applications, SQL Server shares
│  │  └─ FSx for Windows File Server
│  │
│  ├─ Container Storage (ECS/EKS), Web Serving
│  │  └─ Amazon EFS
│  │
│  ├─ NetApp Migration, Hybrid Cloud
│  │  └─ FSx for NetApp ONTAP
│  │
│  └─ ZFS Migration, Low Latency Requirements
│     └─ FSx for OpenZFS

└─ What's the priority?
   │
   ├─ SIMPLICITY & ELASTICITY
   │  └─ Amazon EFS (if Linux)
   │
   ├─ MAXIMUM PERFORMANCE
   │  └─ FSx for Lustre (HPC) or FSx for OpenZFS (general)
   │
   ├─ FEATURE RICHNESS
   │  └─ FSx for NetApp ONTAP
   │
   └─ WINDOWS COMPATIBILITY
      └─ FSx for Windows File Server
```

---

## Common Exam Scenarios

### Scenario 1: Linux Containers Need Shared Storage

**Question:** Company running containerized applications on EKS. Multiple pods need to read/write to shared file storage. Cost-effective, elastic solution needed.

**Answer:** **Amazon EFS**

**Why:**
- Native integration with EKS/ECS
- Multiple pods can mount same EFS volume
- Elastic - no capacity planning
- Multi-AZ by default (high availability)
- Pay only for storage used
- Lifecycle management for cost optimization

**Configuration:**
- Use EFS Storage Class in Kubernetes
- Standard tier for active data, IA tier for infrequent access
- Provisioned throughput if consistent performance needed

**Wrong Answers:**
- ❌ FSx for Windows: Windows-only, not for Linux containers
- ❌ FSx for Lustre: Overkill for general containerized apps
- ❌ EBS: Not shared storage (single instance only)

---

### Scenario 2: Windows File Server Migration

**Question:** Migrate on-premises Windows file server (10TB) to AWS. Applications require SMB protocol, Active Directory authentication, and DFS namespaces.

**Answer:** **Amazon FSx for Windows File Server**

**Why:**
- Native Windows file system
- Full SMB protocol support
- Active Directory integration (seamless authentication)
- DFS namespaces support
- Shadow copies for user-initiated restore
- Lift-and-shift compatible

**Migration Path:**
- Use AWS DataSync to migrate data
- Join FSx to existing AD (on-premises or AWS Managed AD)
- Configure DFS namespaces if needed
- Multi-AZ deployment for high availability

**Wrong Answers:**
- ❌ EFS: Linux-only (NFS), doesn't support SMB
- ❌ S3: Object storage, not file system
- ❌ Storage Gateway: For hybrid, not pure AWS migration

---

### Scenario 3: Machine Learning Training Pipeline

**Question:** ML team needs to process 500TB dataset from S3, run training jobs on EC2 GPU instances, and write results back to S3. Requires maximum throughput and IOPS.

**Answer:** **Amazon FSx for Lustre** (linked to S3 bucket)

**Why:**
- Massive throughput (100+ GB/s)
- Millions of IOPS
- Native S3 integration (lazy loading from S3)
- POSIX-compliant for ML frameworks
- Can write results directly to S3
- Optimized for compute-intensive workloads

**Configuration:**
- Create FSx for Lustre with S3 repository link
- Use Scratch deployment (lower cost for processing jobs)
- Data automatically loaded from S3 on first access
- Write results back to S3 with export option

**⚠️ EXAM TIP:** "S3 data + compute-intensive + write back to S3" = FSx for Lustre

**Wrong Answers:**
- ❌ EFS: Too slow for this scale and use case
- ❌ FSx for Windows: Windows-only, not for ML
- ❌ S3 directly: Not a file system, incompatible with many ML frameworks

---

### Scenario 4: Multi-Protocol Development Environment

**Question:** Development teams use both Windows and Linux. Need shared file system accessible via SMB from Windows and NFS from Linux. Require snapshots for backup.

**Answer:** **Amazon FSx for NetApp ONTAP**

**Why:**
- Multi-protocol support (SMB + NFS simultaneously)
- Single file system accessible from both Windows and Linux
- Built-in snapshots (instant, space-efficient)
- Deduplication and compression for cost savings
- Multi-AZ for high availability

**Configuration:**
- Create FSx ONTAP file system with Storage Virtual Machine (SVM)
- Configure both NFS and SMB protocols
- Set up regular snapshot schedule
- Windows users mount via SMB, Linux users via NFS

**⚠️ EXAM TIP:** "Both Windows AND Linux" or "multi-protocol" = FSx for NetApp ONTAP

**Wrong Answers:**
- ❌ EFS: NFS only, no SMB support
- ❌ FSx for Windows: SMB only, NFS not ideal
- ❌ Two separate file systems: Not shared across OS types

---

### Scenario 5: Video Rendering Farm

**Question:** Media company needs high-performance storage for video rendering pipeline. Hundreds of EC2 instances reading source files, rendering, writing output. Peak throughput 50 GB/s required.

**Answer:** **Amazon FSx for Lustre** (Persistent deployment)

**Why:**
- Extremely high throughput (50-100+ GB/s)
- Optimized for parallel access from many instances
- Sub-millisecond latencies
- Persistent deployment for durability
- POSIX-compliant for media applications

**Alternative:** FSx for OpenZFS if lower throughput sufficient and instant cloning needed

**Configuration:**
- Persistent deployment type (data durability)
- Size for required throughput (200 MB/s per TiB)
- Can link to S3 for source/destination storage

**Wrong Answers:**
- ❌ EFS: Insufficient throughput for this scale
- ❌ FSx for Windows: Windows-focused, lower performance
- ❌ EBS: Not shared across instances

---

### Scenario 6: On-Premises NetApp to AWS Migration

**Question:** Company has NetApp storage on-premises with SnapMirror replication, FlexClone, and deduplication. Want to migrate to AWS maintaining same features and hybrid cloud capability.

**Answer:** **Amazon FSx for NetApp ONTAP**

**Why:**
- Native NetApp ONTAP features
- SnapMirror support (replicate from on-premises to AWS)
- FlexClone for instant cloning
- Deduplication and compression
- Hybrid cloud architecture maintained
- Familiar NetApp management tools

**Migration Strategy:**
- Set up FSx for ONTAP in AWS
- Configure SnapMirror from on-premises to FSx ONTAP
- Cutover when ready
- Can maintain hybrid operations with continuous replication

**⚠️ EXAM TIP:** "NetApp migration" or "SnapMirror" = FSx for NetApp ONTAP

**Wrong Answers:**
- ❌ EFS: Different feature set, no NetApp compatibility
- ❌ FSx for OpenZFS: Different ZFS features, not NetApp
- ❌ Storage Gateway: Gateway appliance, not full NetApp features

---

### Scenario 7: Financial Trading Application

**Question:** High-frequency trading application requires shared storage with microsecond latencies. Linux-based, NFS protocol. Need point-in-time snapshots for regulatory compliance.

**Answer:** **Amazon FSx for OpenZFS**

**Why:**
- Microsecond read latencies
- Low write latencies (hundreds of microseconds)
- NFS protocol support
- Instant snapshots (up to 10,000)
- Consistent performance
- Multi-AZ option for availability

**Configuration:**
- Multi-AZ deployment for high availability
- Provision sufficient throughput capacity
- Regular snapshot schedule for compliance
- NFS v4.1 for best performance

**⚠️ EXAM TIP:** "Microsecond latency" or "low latency" + Linux = FSx for OpenZFS

**Wrong Answers:**
- ❌ EFS: Millisecond latencies, not microsecond
- ❌ FSx for Lustre: Optimized for throughput, not latency
- ❌ FSx for Windows: Windows-focused

---

### Scenario 8: Home Directories for Linux Users

**Question:** 10,000 Linux users need home directories. Storage requirements vary widely per user. Need automatic scaling and cost optimization.

**Answer:** **Amazon EFS with Lifecycle Management**

**Why:**
- Elastic - automatically scales to petabytes
- No capacity planning needed
- Pay only for storage used
- Lifecycle management (move infrequent files to IA)
- Multi-AZ by default
- Can set up EFS Access Points per user/group

**Configuration:**
- Create EFS file system with lifecycle management (30-day policy)
- Set up EFS Access Points for user groups
- Standard tier for active files, IA for older files
- 92% cost savings on IA storage

**Cost Optimization:**
- Files not accessed for 30 days → automatically moved to IA
- Significant savings as home directories contain many inactive files

**Wrong Answers:**
- ❌ FSx for OpenZFS: Need to provision capacity
- ❌ FSx for Windows: Windows-only
- ❌ S3: Object storage, not POSIX file system

---

### Scenario 9: SQL Server Shared Storage

**Question:** SQL Server AlwaysOn Failover Cluster Instance requires shared storage accessible via SMB. Multi-AZ deployment for high availability.

**Answer:** **Amazon FSx for Windows File Server (Multi-AZ)**

**Why:**
- Native SMB protocol required for SQL FCI
- Multi-AZ deployment for automatic failover
- Active Directory integration
- Consistent performance
- Built for Windows workloads
- Supports witness file share for clustering

**Configuration:**
- Multi-AZ deployment
- Join to Active Directory
- Size appropriately for SQL workload
- SSD storage for performance

**⚠️ EXAM TIP:** "SQL Server" + "shared storage" = FSx for Windows File Server

**Wrong Answers:**
- ❌ EFS: Linux/NFS only, SQL requires SMB
- ❌ FSx for ONTAP: Could work but FSx Windows is more native for pure Windows SQL
- ❌ EBS: Can't share across instances

---

### Scenario 10: Genomics Processing Pipeline

**Question:** Genomics research lab processes DNA sequences. 100TB datasets in S3, run analysis on HPC cluster with hundreds of nodes, write results to S3. Runs weekly.

**Answer:** **Amazon FSx for Lustre (Scratch deployment, S3 linked)**

**Why:**
- Massive parallel throughput for HPC
- S3 integration (lazy load from S3)
- Scratch deployment (lower cost for temporary processing)
- Optimized for compute-intensive genomics workflows
- Sub-millisecond latencies
- Write results directly back to S3

**Configuration:**
- Scratch deployment (temporary storage, lowest cost)
- Link to S3 bucket with genomics data
- Data loaded on-demand when accessed
- Export results to S3 after processing
- Delete file system when job completes

**Cost Benefit:** Only pay for file system during processing, not for permanent storage (data in S3)

**⚠️ EXAM TIP:** "HPC" + "S3 data" + "temporary processing" = FSx Lustre Scratch

**Wrong Answers:**
- ❌ EFS: Insufficient performance for HPC
- ❌ FSx Persistent: More expensive for temporary workloads
- ❌ Direct S3 access: Not POSIX file system, poor for random access

---

## Key Differences Summary

### EFS vs FSx for Windows

| Aspect | EFS | FSx for Windows |
|--------|-----|-----------------|
| **OS Support** | Linux only | Windows (and Linux via SMB) |
| **Protocol** | NFS v4.0/4.1 | SMB 2.0/3.0/3.1.1 |
| **Capacity** | Elastic (automatic) | Provisioned (manual sizing) |
| **Pricing** | Pay for usage | Pay for provisioned capacity |
| **Multi-AZ** | Always | Optional (Single-AZ or Multi-AZ) |
| **Active Directory** | No | Yes (required) |
| **Best For** | Linux apps, containers | Windows apps, SQL Server |

**⚠️ EXAM TIP:** Linux/NFS = EFS; Windows/SMB = FSx for Windows

---

### FSx for Lustre vs FSx for OpenZFS

| Aspect | FSx for Lustre | FSx for OpenZFS |
|--------|----------------|-----------------|
| **Primary Use** | HPC, ML, video processing | General high-performance, ZFS migrations |
| **Throughput** | Up to 100+ GB/s | Up to 10 GB/s |
| **Latency** | Sub-millisecond | Microseconds |
| **S3 Integration** | Native (lazy load) | No native integration |
| **Snapshots** | Limited | Up to 10,000 per volume |
| **Deployment** | Scratch or Persistent | Single-AZ or Multi-AZ |
| **Best For** | Compute-intensive, S3 workflows | Low-latency apps, dev/test clones |

**⚠️ EXAM TIP:**
- Lustre = maximum throughput, HPC, S3 integration
- OpenZFS = low latency, many snapshots, instant clones

---

### FSx for NetApp ONTAP vs Others

| Aspect | FSx ONTAP | EFS | FSx Windows | FSx Lustre |
|--------|-----------|-----|-------------|------------|
| **Multi-Protocol** | Yes (NFS+SMB+iSCSI) | No (NFS only) | No (SMB only) | No (Lustre only) |
| **Advanced Features** | Many (SnapMirror, FlexClone, dedup) | Basic | Moderate | Basic |
| **Storage Efficiency** | Dedup, compression, thin provisioning | Compression, IA tier | Dedup | Compression |
| **Hybrid Cloud** | Yes (SnapMirror to on-prem) | No | No | No |
| **Complexity** | Higher | Low | Moderate | Moderate |
| **Cost** | Higher (but efficiency reduces) | Low to moderate | Moderate | Moderate |

**⚠️ EXAM TIP:** FSx ONTAP is the "Swiss Army knife" - multi-protocol, feature-rich, hybrid cloud

---

### Deployment Type Comparison (FSx Services)

| Service | Single-AZ | Multi-AZ | Notes |
|---------|-----------|----------|-------|
| **EFS** | N/A | Always Multi-AZ | Cannot be Single-AZ |
| **FSx Windows** | Yes | Yes | Multi-AZ for HA, automatic failover |
| **FSx Lustre** | Yes (Scratch/Persistent) | Persistent only | Multi-AZ for persistent only |
| **FSx ONTAP** | N/A | Always Multi-AZ (HA pairs) | Deployed as HA pairs |
| **FSx OpenZFS** | Yes | Yes | Multi-AZ for automatic failover |

---

### Performance Comparison

| Service | Max Throughput | Max IOPS | Latency | Best Performance For |
|---------|---------------|----------|---------|---------------------|
| **EFS** | 10+ GB/s | 500,000+ | Milliseconds | Large-scale parallel access |
| **FSx Windows** | 2 GB/s | 100,000s | Sub-millisecond | Windows workloads |
| **FSx Lustre** | 100+ GB/s | Millions | Sub-millisecond | HPC, maximum throughput |
| **FSx ONTAP** | 4 GB/s (per HA pair) | 100,000s | Microseconds | Balanced performance |
| **FSx OpenZFS** | 10 GB/s | 1 million | Microseconds | Low latency workloads |

**⚠️ EXAM TIP:**
- Highest throughput: FSx for Lustre
- Lowest latency: FSx for OpenZFS (microseconds)
- Elastic performance: EFS
- Windows performance: FSx for Windows

---

## Exam Strategy - Keywords to Watch For

### Service Selection by Keywords

| Keywords in Question | Likely Answer |
|---------------------|---------------|
| "Linux", "NFS", "containers", "elastic", "auto-scaling" | **Amazon EFS** |
| "Windows", "SMB", "Active Directory", "DFS", "SQL Server" | **FSx for Windows** |
| "HPC", "machine learning training", "video processing", "S3 integration", "Lustre" | **FSx for Lustre** |
| "NetApp", "SnapMirror", "multi-protocol", "NFS and SMB", "hybrid cloud" | **FSx for NetApp ONTAP** |
| "ZFS", "microsecond latency", "10,000 snapshots", "low latency" | **FSx for OpenZFS** |
| "shared storage", "ECS", "EKS", "Kubernetes" | **Amazon EFS** |
| "compute-intensive", "millions of IOPS", "100 GB/s" | **FSx for Lustre** |
| "both Windows and Linux access", "simultaneous protocols" | **FSx for NetApp ONTAP** |

---

### Protocol Keywords

| Protocol Mentioned | Service Options |
|-------------------|-----------------|
| **NFS** | EFS, FSx for Lustre, FSx for ONTAP, FSx for OpenZFS |
| **SMB** | FSx for Windows, FSx for ONTAP |
| **iSCSI** | FSx for ONTAP |
| **Lustre** | FSx for Lustre |

**⚠️ EXAM TIP:** If only protocol mentioned is SMB and it's Windows → FSx for Windows

---

### Use Case Keywords

**High Performance Computing:**
- "HPC" → **FSx for Lustre**
- "Parallel processing" → **FSx for Lustre**
- "Genomics", "seismic analysis", "financial modeling" → **FSx for Lustre**

**Machine Learning:**
- "ML training" + "S3 data" → **FSx for Lustre**
- "ML inference" + shared storage → **EFS** (if Linux containers)

**Windows Applications:**
- "SharePoint" → **FSx for Windows**
- "SQL Server file shares" → **FSx for Windows**
- "IIS web server" → **FSx for Windows**
- ".NET applications" → **FSx for Windows**

**Multi-OS Environments:**
- "Windows and Linux" → **FSx for NetApp ONTAP**
- "Heterogeneous environment" → **FSx for NetApp ONTAP**

**Cost Optimization:**
- "Elastic", "pay for what you use" → **EFS**
- "Auto-scaling storage" → **EFS**
- "Lifecycle management" → **EFS**

**Low Latency:**
- "Microsecond latency" → **FSx for OpenZFS**
- "Trading application", "financial services" → **FSx for OpenZFS**

**Data Management:**
- "Snapshots", "clones", "replication" → **FSx for ONTAP** or **FSx for OpenZFS**
- "NetApp migration" → **FSx for ONTAP**
- "ZFS migration" → **FSx for OpenZFS**

---

## Common Misconceptions

### ❌ "EFS works with Windows"
**✓ Reality:** EFS is **Linux-only**, uses NFS protocol. Windows requires FSx for Windows (SMB).

### ❌ "FSx for Windows can't be accessed from Linux"
**✓ Reality:** Linux clients can mount FSx for Windows via SMB protocol (though not ideal). But EFS cannot be used from Windows.

### ❌ "All FSx services are the same, just different names"
**✓ Reality:** FSx services are fundamentally different:
- FSx Windows = Windows Server file system
- FSx Lustre = Parallel file system for HPC
- FSx ONTAP = NetApp enterprise features
- FSx OpenZFS = ZFS file system

### ❌ "EFS is always cheaper than FSx"
**✓ Reality:**
- EFS can be cheaper for variable workloads (pay for usage)
- FSx can be cheaper for consistent workloads with provisioned capacity
- FSx for Lustre Scratch is cost-effective for temporary processing

### ❌ "FSx for Lustre requires S3"
**✓ Reality:** S3 linking is **optional**. You can use FSx for Lustre without S3, but S3 integration is a major benefit.

### ❌ "You must choose between EFS and FSx"
**✓ Reality:** You can use multiple storage services. Example: EFS for web servers, FSx for Windows for SQL Server, FSx for Lustre for ML training.

### ❌ "Multi-AZ is always better"
**✓ Reality:**
- Multi-AZ provides higher availability but costs more
- Single-AZ appropriate for dev/test or cost-sensitive workloads
- EFS is always Multi-AZ (no choice)

### ❌ "FSx for ONTAP is only for NetApp customers"
**✓ Reality:** While great for NetApp migrations, FSx ONTAP is useful for anyone needing multi-protocol support, advanced snapshots, or hybrid cloud.

---

## Cost Implications

### Cost Comparison (Approximate, per GB-month)

| Service | Storage Cost | Notes |
|---------|-------------|-------|
| **EFS Standard** | $0.30 | Pay only for used storage |
| **EFS IA** | $0.025 | 92% cheaper, lifecycle management |
| **FSx Windows SSD** | $0.13 + throughput | Provisioned capacity |
| **FSx Windows HDD** | $0.013 + throughput | Lower performance, cheaper |
| **FSx Lustre Scratch** | $0.14 | Temporary, no replication |
| **FSx Lustre Persistent** | $0.14-$0.21 | Depends on throughput tier |
| **FSx ONTAP SSD** | $0.23 + throughput | Dedup/compression reduces effective cost |
| **FSx ONTAP Capacity Pool** | $0.04 | Tiered cold data |
| **FSx OpenZFS** | $0.20 + throughput | Compression can reduce costs |

### Cost Optimization Strategies

**EFS:**
- ✅ Enable lifecycle management (move to IA after 30 days)
- ✅ Use Bursting throughput for variable workloads
- ✅ Monitor access patterns and adjust lifecycle policy
- ⚠️ Use Provisioned throughput only when necessary

**FSx for Windows:**
- ✅ Use HDD storage for throughput-insensitive workloads (90% cheaper)
- ✅ Enable data deduplication (saves 50-60% for user shares)
- ✅ Right-size throughput capacity
- ✅ Use Single-AZ for dev/test environments

**FSx for Lustre:**
- ✅ Use Scratch deployment for temporary processing jobs
- ✅ Size appropriately (pay for provisioned capacity)
- ✅ Delete file system when processing complete
- ✅ Leverage S3 for permanent storage (cheaper than FSx)

**FSx for NetApp ONTAP:**
- ✅ Enable deduplication and compression (up to 65% savings)
- ✅ Use capacity pool storage tier for cold data (83% cheaper)
- ✅ Thin provisioning (over-provision logically)
- ✅ Monitor storage efficiency ratio

**FSx for OpenZFS:**
- ✅ Enable Z-Standard compression
- ✅ Use snapshots instead of full copies
- ✅ Right-size throughput capacity
- ✅ Delete old snapshots (up to 10,000 supported but not all needed)

### Cost Scenarios

**Scenario: 10TB file storage, variable access patterns**
- EFS with lifecycle management: ~$500/month (50% in IA)
- FSx Windows SSD: ~$1,300/month
- **Winner:** EFS (60% cheaper)

**Scenario: 100TB HPC processing, weekly jobs**
- FSx Lustre Scratch (created/deleted): ~$14,000/month (runtime only)
- FSx Lustre Persistent: ~$21,000/month (always running)
- **Winner:** Scratch deployment (33% cheaper)

**Scenario: 20TB Windows file shares, AD integration**
- FSx Windows HDD: ~$260/month + throughput
- FSx Windows SSD: ~$2,600/month + throughput
- **Winner:** HDD (if throughput requirements allow) - 90% cheaper

**⚠️ EXAM TIP:**
- "Minimize costs" + variable workload = EFS with lifecycle management
- "Minimize costs" + temporary processing = FSx Lustre Scratch
- "Minimize costs" + Windows = FSx Windows HDD (if performance allows)

---

## Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│                 STORAGE SERVICE SELECTOR                        │
└─────────────────────────────────────────────────────────────────┘

BY OPERATING SYSTEM:
├─ Linux only → EFS or FSx for Lustre or FSx for OpenZFS
├─ Windows only → FSx for Windows File Server
└─ Both Linux & Windows → FSx for NetApp ONTAP

BY PROTOCOL:
├─ NFS → EFS, FSx Lustre, FSx ONTAP, FSx OpenZFS
├─ SMB → FSx for Windows, FSx for ONTAP
├─ iSCSI → FSx for ONTAP
└─ Lustre → FSx for Lustre

BY USE CASE:
├─ Containers (ECS/EKS) → EFS
├─ HPC / ML Training → FSx for Lustre
├─ Windows Apps → FSx for Windows
├─ Low Latency → FSx for OpenZFS
├─ Multi-protocol → FSx for ONTAP
├─ NetApp migration → FSx for ONTAP
└─ ZFS migration → FSx for OpenZFS

BY PERFORMANCE NEED:
├─ Maximum throughput (100+ GB/s) → FSx for Lustre
├─ Lowest latency (microseconds) → FSx for OpenZFS
├─ Elastic performance → EFS
└─ Balanced → FSx for ONTAP

BY CAPACITY MODEL:
├─ Elastic (no planning) → EFS
└─ Provisioned (plan capacity) → All FSx services

┌─────────────────────────────────────────────────────────────────┐
│                    EXAM DECISION MATRIX                         │
└─────────────────────────────────────────────────────────────────┘

Question Says...                        → Answer
────────────────────────────────────────────────────────────────
"Linux containers", "EKS", "auto-scale"  → EFS
"Windows", "SMB", "Active Directory"     → FSx for Windows
"HPC", "ML training", "S3 integration"   → FSx for Lustre
"Both Windows and Linux"                 → FSx for NetApp ONTAP
"NetApp migration", "SnapMirror"         → FSx for NetApp ONTAP
"ZFS", "microsecond latency"             → FSx for OpenZFS
"Millions of IOPS", "video processing"   → FSx for Lustre
"SQL Server", "shared storage"           → FSx for Windows
"Multi-protocol", "NFS and SMB"          → FSx for NetApp ONTAP
"10,000 snapshots", "instant clones"     → FSx for OpenZFS
"Elastic", "no capacity planning"        → EFS
"Scratch processing", "temporary"        → FSx for Lustre Scratch

┌─────────────────────────────────────────────────────────────────┐
│                    FEATURE COMPARISON                           │
└─────────────────────────────────────────────────────────────────┘

Feature                  │ EFS │ Windows │ Lustre │ ONTAP │ OpenZFS
─────────────────────────┼─────┼─────────┼────────┼───────┼─────────
NFS Protocol             │  ✓  │    -    │   ✓    │   ✓   │    ✓
SMB Protocol             │  -  │    ✓    │   -    │   ✓   │    -
iSCSI                    │  -  │    -    │   -    │   ✓   │    -
Elastic Capacity         │  ✓  │    -    │   -    │   -   │    -
Auto Multi-AZ            │  ✓  │Optional │Optional│   ✓   │Optional
Active Directory         │  -  │Required │   -    │   ✓   │    -
S3 Integration           │  -  │    -    │   ✓    │   -   │    -
Snapshots                │  -  │    ✓    │   -    │   ✓   │    ✓
Deduplication            │  -  │    ✓    │   -    │   ✓   │    -
Compression              │  ✓  │    -    │   ✓    │   ✓   │    ✓
Instant Clones           │  -  │    -    │   -    │   ✓   │    ✓
Replication              │  -  │    -    │   -    │   ✓   │    -
Max Throughput           │ 10+ │    2    │  100+  │   4   │   10
                         │ GB/s│  GB/s   │  GB/s  │ GB/s  │  GB/s

┌─────────────────────────────────────────────────────────────────┐
│                 PRICING QUICK REFERENCE                         │
└─────────────────────────────────────────────────────────────────┘

Service          │ Cost Model              │ Starting Price
─────────────────┼─────────────────────────┼────────────────────
EFS Standard     │ Pay for usage           │ $0.30/GB-month
EFS IA           │ Pay for usage           │ $0.025/GB-month
FSx Windows SSD  │ Provisioned + throughput│ $0.13/GB-month
FSx Windows HDD  │ Provisioned + throughput│ $0.013/GB-month
FSx Lustre       │ Provisioned             │ $0.14/GB-month
FSx ONTAP        │ Provisioned + throughput│ $0.23/GB-month
FSx OpenZFS      │ Provisioned + throughput│ $0.20/GB-month

Cost Optimization:
├─ Variable workload → EFS (pay for usage)
├─ Windows low throughput → FSx Windows HDD
├─ Temporary processing → FSx Lustre Scratch
├─ ONTAP efficiency → Enable dedup/compression (65% savings)
└─ Infrequent access → EFS with lifecycle to IA (92% savings)
```

---

## Integration Patterns

### Pattern 1: Kubernetes Storage

```
EKS/ECS Cluster
├─ Application Pods
│  └─ Mount EFS via Storage Class
│     ├─ Shared configuration files
│     ├─ Shared application data
│     └─ Persistent logs
│
└─ EFS File System (Multi-AZ)
   ├─ Standard tier (active data)
   └─ IA tier (archived logs)
```

**Why:** EFS integrates natively with Kubernetes, elastic scaling, multi-AZ

---

### Pattern 2: Windows Application Stack

```
Windows Application Tier
├─ Multiple EC2 Windows instances
│  └─ Mount FSx for Windows via SMB
│     ├─ Shared application files
│     └─ User data
│
├─ Active Directory (AWS Managed AD)
│  └─ Authentication and authorization
│
└─ FSx for Windows (Multi-AZ)
   ├─ DFS Namespace (unified path)
   └─ Shadow Copies (user restore)
```

**Why:** FSx for Windows provides native Windows features, AD integration

---

### Pattern 3: HPC Processing Pipeline

```
S3 Bucket (Source Data: 500TB)
     ↓
FSx for Lustre (linked to S3)
     ├─ Lazy load data on access
     ├─ EC2 HPC Cluster (100s of instances)
     │  └─ Parallel processing
     └─ Write results
         ↓
S3 Bucket (Results)
```

**Configuration:** Scratch deployment for temporary processing

**Why:** Maximum throughput, S3 integration, cost-effective for temporary workloads

---

### Pattern 4: Multi-OS Development Environment

```
Development Environment
├─ Windows Developers
│  └─ Mount via SMB → FSx for NetApp ONTAP
│
├─ Linux Developers
│  └─ Mount via NFS → FSx for NetApp ONTAP (same file system)
│
└─ FSx for NetApp ONTAP (Multi-AZ)
   ├─ Storage Virtual Machine (SVM)
   ├─ Regular snapshots (backup/restore)
   └─ FlexClone (instant dev environments)
```

**Why:** Single file system, multi-protocol access, instant clones for dev/test

---

### Pattern 5: Video Production Workflow

```
Video Source Files (S3 or FSx)
     ↓
FSx for Lustre or OpenZFS
     ├─ EC2 Rendering Farm (GPU instances)
     │  ├─ Read source files
     │  ├─ Render video
     │  └─ Write output
     └─ High throughput, low latency
         ↓
Final Output (S3 or Archive)
```

**Choice:**
- FSx for Lustre: Maximum throughput (100+ GB/s)
- FSx for OpenZFS: Lower latency, instant snapshots for versioning

---

### Pattern 6: Database Shared Storage

```
SQL Server AlwaysOn Failover Cluster
├─ Primary Node (AZ-a)
│  └─ Mounts FSx for Windows
│
├─ Secondary Node (AZ-b)
│  └─ Mounts FSx for Windows (same share)
│
└─ FSx for Windows File Server (Multi-AZ)
   └─ Automatic failover between AZs
```

**Why:** SQL Server FCI requires SMB shared storage, Multi-AZ for HA

---

## Best Practices for the Exam

### 1. Operating System is Primary Discriminator
- **Linux-only** → EFS (general) or FSx Lustre (HPC) or FSx OpenZFS (low latency)
- **Windows** → FSx for Windows
- **Both** → FSx for NetApp ONTAP

### 2. Protocol Requirements
- **NFS only** → Multiple options (EFS, FSx Lustre, FSx OpenZFS, FSx ONTAP)
- **SMB required** → FSx for Windows or FSx for ONTAP
- **Multi-protocol** → FSx for ONTAP (only option)

### 3. Performance Indicators
- **"Millions of IOPS"**, **"100+ GB/s"**, **"HPC"** → FSx for Lustre
- **"Microsecond latency"**, **"trading application"** → FSx for OpenZFS
- **"Elastic"**, **"auto-scale"** → EFS
- **"Video processing"**, **"ML training"** → FSx for Lustre

### 4. Cost Optimization Signals
- **"Minimize costs"** + **"variable workload"** → EFS with lifecycle management
- **"Minimize costs"** + **"temporary processing"** → FSx Lustre Scratch
- **"Minimize costs"** + **"Windows"** → FSx Windows HDD (if performance allows)
- **"Pay for what you use"** → EFS

### 5. Feature Requirements
- **"Snapshots"** + **"10,000+"** → FSx for OpenZFS
- **"SnapMirror"**, **"FlexClone"**, **"NetApp"** → FSx for NetApp ONTAP
- **"Active Directory"**, **"DFS"** → FSx for Windows
- **"S3 integration"**, **"lazy loading"** → FSx for Lustre
- **"Deduplication"** → FSx for Windows or FSx for ONTAP

### 6. Deployment Model
- **"Multi-AZ by default"** → EFS or FSx for ONTAP
- **"High availability"** + **Windows** → FSx for Windows Multi-AZ
- **"Cost-effective HA"** → EFS (always multi-AZ, pay for usage)

### 7. Capacity Planning
- **"No capacity planning"**, **"elastic"** → EFS (only option)
- All FSx services require provisioned capacity

### 8. Migration Scenarios
- **"NetApp migration"** → FSx for NetApp ONTAP
- **"ZFS migration"** → FSx for OpenZFS
- **"Windows file server migration"** → FSx for Windows
- **"General Linux NFS migration"** → EFS or FSx for OpenZFS

### 9. Workload Patterns
- **Containers (ECS/EKS)** → EFS
- **HPC, ML training** → FSx for Lustre
- **Windows applications** → FSx for Windows
- **Hybrid cloud** → FSx for NetApp ONTAP (SnapMirror)
- **Dev/test with clones** → FSx for OpenZFS or FSx for ONTAP

### 10. Simplicity Principle
- AWS prefers simpler, managed solutions
- If EFS meets requirements (Linux, NFS, elastic) → choose EFS
- Don't over-engineer with FSx if EFS works

---

## Advanced Exam Tips

### 1. EFS Access Points
- Provide application-specific entry points to EFS
- Enforce POSIX user/group
- Enforce root directory
- Useful for multi-tenant applications

**Exam scenario:** "Multiple applications sharing EFS with different permissions" → Use EFS Access Points

---

### 2. FSx for Lustre Deployment Types

**Scratch:**
- ✓ Temporary storage (data not replicated)
- ✓ Lower cost ($0.14/GB-month)
- ✓ 200 MB/s per TiB throughput
- ✓ Use for: Processing jobs, temporary compute

**Persistent:**
- ✓ Data replicated within AZ
- ✓ Higher durability
- ✓ 50, 100, or 200 MB/s per TiB
- ✓ Use for: Long-term workloads, durable storage

**⚠️ EXAM TIP:**
- "Temporary processing" or "weekly jobs" → Scratch
- "Durable" or "long-term" → Persistent

---

### 3. FSx for Windows Throughput Capacity

- Provisioned separately from storage
- Determines file system performance
- Can be increased/decreased
- Minimum: 8 MB/s (HDD) or 16 MB/s (SSD)
- Maximum: 2 GB/s

**⚠️ EXAM TIP:** If performance issues with FSx Windows → increase throughput capacity

---

### 4. FSx for ONTAP Storage Efficiency

- Deduplication: Eliminates duplicate blocks
- Compression: LZ4 compression
- Thin provisioning: Over-provision logically
- Capacity pool storage: Tier cold data (83% cheaper)

**Typical savings:** 65% with dedup + compression

**⚠️ EXAM TIP:** "Reduce storage costs" + FSx ONTAP → Enable storage efficiency features

---

### 5. Multi-AZ vs Single-AZ Costs

**Multi-AZ:**
- Higher cost (2x resources in different AZs)
- Automatic failover
- Higher availability

**Single-AZ:**
- Lower cost
- Manual recovery if AZ fails
- Appropriate for dev/test

**⚠️ EXAM TIP:**
- Production + "high availability" → Multi-AZ
- Dev/test + "minimize costs" → Single-AZ

---

### 6. EFS Lifecycle Management

- Automatically moves files to IA tier based on access
- Policies: 7, 14, 30, 60, or 90 days
- 92% cost savings on IA storage
- Transparent to applications

**⚠️ EXAM TIP:** "Reduce EFS costs" → Enable lifecycle management (typically 30-day policy)

---

### 7. FSx for Lustre and S3

**S3 Repository Link:**
- Lazy loading: Data loaded from S3 on first access
- Export: Write new/changed files to S3
- Use case: Process S3 data, write results to S3

**Data Repository Tasks (DRT):**
- Import: Load files from S3 to Lustre
- Export: Write files from Lustre to S3
- Release: Free up space by removing files (metadata retained)

**⚠️ EXAM TIP:** "Process S3 data" + "HPC" → FSx for Lustre with S3 link

---

### 8. FSx Backup Strategies

All FSx services support automatic backups:
- Daily backup window
- Retention: 1-90 days
- Stored in S3 (invisible to user)
- Point-in-time restore

**Additional for FSx ONTAP:**
- Snapshots (instant, space-efficient)
- SnapMirror (replication)

**Additional for FSx OpenZFS:**
- Snapshots (up to 10,000)
- Instant clones

**⚠️ EXAM TIP:**
- "Backup" → All FSx services support automatic backups
- "10,000 snapshots" → FSx OpenZFS
- "Replication to on-premises" → FSx ONTAP (SnapMirror)

---

### 9. Performance Optimization

**EFS:**
- Use General Purpose mode (default) for latency-sensitive
- Use Max I/O mode for maximum aggregate throughput
- Use Provisioned Throughput if throughput independent of size needed
- Enable Elastic Throughput for variable workloads (GA in 2023)

**FSx for Windows:**
- Enable data deduplication for user shares
- Use SSD for performance-sensitive, HDD for throughput-sensitive
- Increase throughput capacity if needed

**FSx for Lustre:**
- Size for required throughput (MB/s per TiB)
- Scratch: 200 MB/s per TiB (fixed)
- Persistent: 50, 100, or 200 MB/s per TiB
- Use data compression (LZ4)

**FSx for ONTAP:**
- Add HA pairs for higher performance
- Use NVMe for lowest latency
- Enable storage efficiency (doesn't impact performance)

**FSx for OpenZFS:**
- Provision sufficient throughput capacity
- Enable Z-Standard or LZ4 compression
- Use snapshots instead of copies

---

### 10. When NOT to Use File Storage

Sometimes object storage (S3) or block storage (EBS) is better:

**Use S3 instead:**
- Static website hosting
- Data lakes
- Long-term archival
- Infrequent access patterns
- Object-based applications

**Use EBS instead:**
- Single instance persistent storage
- Boot volumes
- Database storage (single instance)
- Low latency + single instance

**⚠️ EXAM TIP:**
- "Shared across instances" → File storage (EFS/FSx)
- "Single instance" → EBS
- "Object storage", "data lake" → S3

---

## Summary - Service Purpose in One Line

| Service | One-Line Purpose |
|---------|------------------|
| **Amazon EFS** | Elastic, auto-scaling NFS file storage for Linux workloads |
| **FSx for Windows** | Native Windows file system with SMB and Active Directory |
| **FSx for Lustre** | High-performance parallel file system for HPC and ML |
| **FSx for NetApp ONTAP** | Enterprise NetApp features with multi-protocol support |
| **FSx for OpenZFS** | ZFS file system with microsecond latency and many snapshots |

---

## Last-Minute Review Questions

**Q: When do you choose EFS over FSx?**
A: Linux workload + NFS + need elastic/auto-scaling capacity

**Q: What's the difference between FSx for Windows and FSx for ONTAP for Windows workloads?**
A: FSx for Windows is native Windows, simpler. FSx for ONTAP adds multi-protocol, advanced features, but more complex.

**Q: When do you choose FSx for Lustre Scratch vs Persistent?**
A: Scratch for temporary processing (lower cost, no replication). Persistent for durable, long-term workloads.

**Q: How does FSx for Lustre integrate with S3?**
A: Can link to S3 bucket, lazy load data on access, write results back to S3.

**Q: What's unique about FSx for OpenZFS?**
A: Microsecond latencies, up to 10,000 snapshots, instant clones, Z-Standard compression.

**Q: What's unique about FSx for NetApp ONTAP?**
A: Multi-protocol (NFS+SMB+iSCSI), SnapMirror replication, FlexClone, storage efficiency.

**Q: How do you reduce EFS costs?**
A: Enable lifecycle management to move infrequent files to IA tier (92% savings).

**Q: Which service for both Windows and Linux access?**
A: FSx for NetApp ONTAP (multi-protocol support).

**Q: Which service for HPC with millions of IOPS?**
A: FSx for Lustre (up to 100+ GB/s, millions of IOPS).

**Q: Which service auto-scales capacity?**
A: Only EFS. All FSx services require provisioned capacity.

**Q: Which services are always Multi-AZ?**
A: EFS and FSx for NetApp ONTAP.

**Q: SQL Server Failover Cluster storage?**
A: FSx for Windows File Server (Multi-AZ) - SMB shared storage required.

**Q: NetApp SnapMirror replication to AWS?**
A: FSx for NetApp ONTAP (supports SnapMirror from on-premises).

**Q: ZFS migration to AWS?**
A: FSx for OpenZFS (ZFS-compatible).

**Q: Active Directory integration required?**
A: FSx for Windows File Server (AD required).

---

## Real-World Patterns

### Pattern 1: Enterprise File Migration

**Scenario:** Migrate 100TB on-premises file server to AWS

**Linux NFS:**
1. Use AWS DataSync to migrate to EFS
2. Enable lifecycle management for cost optimization
3. Multi-AZ by default (no additional config)

**Windows SMB:**
1. Use AWS DataSync to migrate to FSx for Windows
2. Join FSx to Active Directory
3. Configure Multi-AZ for production

**NetApp:**
1. Set up FSx for NetApp ONTAP in AWS
2. Configure SnapMirror from on-premises to AWS
3. Cutover when ready

**ZFS:**
1. Set up FSx for OpenZFS in AWS
2. Use ZFS send/receive or DataSync for migration
3. Leverage ZFS snapshots for minimal downtime

---

### Pattern 2: Hybrid Cloud Strategy

**Scenario:** Maintain on-premises presence, extend to AWS

**Best Service:** FSx for NetApp ONTAP
- SnapMirror replication between on-premises NetApp and FSx ONTAP
- Bidirectional sync
- Unified data management
- Disaster recovery capability

**Alternative:** Storage Gateway (for non-NetApp environments)

---

### Pattern 3: Cost Optimization

**Scenario:** Reduce file storage costs

**EFS:**
- Enable lifecycle management (30-day policy)
- Move to IA tier (92% savings)
- Use Bursting throughput mode

**FSx for Windows:**
- Use HDD instead of SSD (90% cheaper)
- Enable data deduplication (50-60% savings)
- Right-size throughput capacity

**FSx for ONTAP:**
- Enable deduplication and compression (65% savings)
- Use capacity pool tier for cold data (83% cheaper)
- Thin provisioning

**FSx for Lustre:**
- Use Scratch deployment for temporary workloads
- Store permanent data in S3 (cheaper)
- Delete file system when not in use

---

### Pattern 4: Multi-Region Disaster Recovery

**EFS:**
- Use AWS Backup for cross-region backups
- Or use DataSync for replication

**FSx for Windows:**
- Use AWS Backup for cross-region backups
- Configure DFS Replication if needed

**FSx for ONTAP:**
- SnapMirror cross-region replication
- Native NetApp DR capabilities

**FSx for OpenZFS:**
- Use AWS Backup for cross-region backups
- ZFS send/receive for replication

---

## Final Exam Strategy

### When You See These Scenarios:

**"Containers", "Kubernetes", "EKS", "auto-scaling"**
→ Amazon EFS

**"Windows", "Active Directory", "SMB"**
→ FSx for Windows File Server

**"HPC", "ML training", "video processing", "S3 data"**
→ FSx for Lustre

**"Both Windows and Linux", "multi-protocol", "NetApp"**
→ FSx for NetApp ONTAP

**"ZFS", "microsecond latency", "trading", "many snapshots"**
→ FSx for OpenZFS

**"Minimize costs", "variable access", "lifecycle"**
→ EFS with lifecycle management

**"SQL Server", "shared storage", "failover cluster"**
→ FSx for Windows (Multi-AZ)

**"Temporary processing", "weekly jobs"**
→ FSx for Lustre Scratch

**"NetApp migration", "SnapMirror", "hybrid cloud"**
→ FSx for NetApp ONTAP

**"Millions of IOPS", "100 GB/s throughput"**
→ FSx for Lustre

---

**Good luck on your AWS SA Pro exam!**
