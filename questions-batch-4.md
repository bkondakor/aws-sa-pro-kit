# Advanced Scenario Questions - Batch 4
## Domain 4: Accelerate Workload Migration and Modernization (15 Questions)

### Question 1: AWS DMS CDC with Oracle Source Limitations
**Scenario:** A company uses AWS DMS to migrate an Oracle database to Aurora PostgreSQL with ongoing replication (CDC). After the initial full load completes successfully, CDC replication starts but only captures changes from some tables. DMS task logs show "table has no primary key" warnings for tables that aren't replicating. What's the issue?

**Options:**
A) DMS CDC requires all tables to have primary keys; add primary keys to the missing tables or use table-level transformations
B) Oracle supplemental logging is not enabled at the database level for tables without primary keys
C) Aurora PostgreSQL doesn't support CDC for tables without primary keys; add unique indexes instead
D) DMS task configuration must explicitly enable CDC for tables without primary keys in the table mappings

**Answer:** B

**Explanation:** AWS DMS Change Data Capture (CDC) from Oracle requires supplemental logging to be enabled. For tables WITH primary keys, minimal supplemental logging at the database level is sufficient. However, for tables WITHOUT primary keys, you must enable supplemental logging at the table level or use database-level supplemental logging with ALL COLUMNS. The warning "table has no primary key" indicates DMS cannot properly track changes because it doesn't have enough information from Oracle redo logs to identify which row changed. The solution is to enable supplemental logging: ALTER TABLE schema.table ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS; or enable it database-wide. Option A is incorrect - while primary keys help, DMS can handle tables without them if supplemental logging is configured. Option C is false - Aurora PostgreSQL support isn't the issue; Oracle configuration is. Option D is incorrect - table mappings don't have a CDC enable/disable per table based on primary keys. This tests understanding of Oracle-specific DMS requirements for CDC.

---

### Question 2: AWS Application Migration Service (MGN) Replication Lag
**Scenario:** During an application migration using AWS MGN, the source server shows "Replication lag: 6 hours" despite having a stable network connection and the replication server running. The source disk has 80% free space. What is the MOST likely cause?

**Options:**
A) The source server is experiencing high disk write activity that exceeds the replication bandwidth
B) The replication server instance type is too small to handle the replication workload
C) MGN replication lag is normal and will catch up after cutover
D) The source server's MGN agent is not properly configured for continuous replication

**Answer:** A

**Explanation:** AWS MGN (Application Migration Service, formerly CloudEndure) performs continuous block-level replication. Replication lag occurs when changes on the source are generated faster than they can be replicated to AWS. High disk write activity (database updates, log files, temporary files, etc.) creates change rate that exceeds available bandwidth or replication throughput. Even with sufficient network bandwidth, the replication process must read changed blocks, compress them, transmit, and write to staging disks. If the source has sustained high I/O (e.g., busy database), lag accumulates. Solutions: (1) Increase bandwidth, (2) Reduce source write activity during migration, (3) Exclude high-churn non-essential files from replication, or (4) Schedule cutover during low-activity periods to allow lag to catch up. Option B is possible but less common - MGN auto-sizes replication servers. Option C is dangerous - significant lag means the target is hours behind the source. Option D is unlikely if replication is working, just lagging. This tests understanding of MGN replication dynamics and troubleshooting lag issues.

---

### Question 3: Database Migration Service (DMS) LOB Data Migration
**Scenario:** A DMS task migrates a PostgreSQL database containing tables with BYTEA (binary) columns storing images averaging 5 MB each. The task uses "Full LOB mode" but runs extremely slowly. Switching to "Limited LOB mode" with 100 KB lob_max_size causes data truncation errors. What's the BEST solution?

**Options:**
A) Use "Limited LOB mode" with lob_max_size set to 10 MB to accommodate the largest LOBs
B) Use "Inline LOB mode" which handles LOBs more efficiently than Full or Limited modes
C) Split tables with LOBs into separate DMS tasks using parallel processing
D) Migrate the table structure with DMS, then use S3 and custom scripts for LOB data migration

**Answer:** A

**Explanation:** AWS DMS has three LOB handling modes: (1) Full LOB mode - migrates LOBs of any size but very slow (fetches each LOB separately), (2) Limited LOB mode - faster, loads LOBs inline up to lob_max_size, truncates larger ones, (3) Inline LOB mode - treats all LOBs as limited with a default size. For LOBs averaging 5 MB, Limited LOB mode with lob_max_size of 10 MB (to handle variability) provides the best performance without truncation. Full LOB mode's performance issue is that it requires extra round trips to fetch each LOB. Limited LOB mode with appropriate max size gives near-inline performance. Option B is incorrect - Inline LOB is essentially Limited LOB with a fixed default. Option C adds complexity without addressing the fundamental LOB handling issue. Option D is overly complex when DMS can handle it with proper configuration. The key is choosing the right LOB mode and sizing: use Limited LOB with max size set to slightly larger than your largest expected LOB for optimal migration performance. This tests understanding of DMS LOB migration modes and performance tuning.

---

### Question 4: AWS Migration Hub Strategy Recommendations Accuracy
**Scenario:** A company uses AWS Migration Hub Strategy Recommendations to analyze their application portfolio. The tool recommends "Rehost" for a .NET Framework 4.5 application currently running on Windows Server 2012. However, the application team knows the application could easily be containerized. Why might the tool recommend Rehost over Replatform?

**Options:**
A) Migration Hub only analyzes technical dependencies, not code quality or containerization readiness
B) The tool prioritizes low-risk migrations and recommends Rehost as the safest option by default
C) Migration Hub Strategy Recommendations requires application source code access for Replatform recommendations
D) The tool detected dependencies on Windows-specific features that would complicate containerization

**Answer:** B

**Explanation:** AWS Migration Hub Strategy Recommendations uses automated analysis (runtime data, dependencies, resource utilization) to provide migration strategy suggestions. It follows the 7 Rs framework: Retire, Retain, Rehost, Relocate, Repurchase, Replatform, Refactor. The tool tends toward conservative recommendations - it suggests Rehost (lift-and-shift) as the default lowest-risk option unless it identifies clear opportunities for other strategies. Just because an application CAN be containerized doesn't mean the tool will recommend it. The tool looks for specific patterns like: stateless applications, modern frameworks, microservices architecture, etc. A .NET Framework 4.5 app on Windows Server 2012 might not show strong signals for containerization in the automated analysis. The recommendations are a starting point - you should apply business and technical judgment to choose the optimal strategy. Option A is partially true but doesn't explain the Rehost recommendation. Option C is false - the tool doesn't require source code. Option D is possible but not the primary reason. This tests understanding that migration tools provide guidance, not prescriptive decisions, and tend toward conservative recommendations.

---

### Question 5: AWS Server Migration Service (SMS) vs Application Migration Service (MGN)
**Scenario:** A company needs to migrate 500 VMs from VMware to AWS with minimal downtime (under 30 minutes). They're choosing between AWS SMS and AWS MGN. The VMs include database servers with continuous write activity. What should they choose and why?

**Options:**
A) AWS SMS because it's specifically designed for VMware migrations with lower cutover time
B) AWS MGN because it provides continuous block-level replication and supports minimal downtime cutover
C) AWS SMS because MGN doesn't support VMware source environments
D) Either service is equally appropriate; the choice depends on licensing preference

**Answer:** B

**Explanation:** AWS MGN (Application Migration Service) has largely replaced AWS SMS (Server Migration Service) as the recommended migration tool. Key differences: (1) SMS does scheduled snapshot-based replication (incremental after initial), suitable for low-change workloads, longer cutover windows acceptable. (2) MGN does continuous block-level replication, suitable for high-change workloads (like databases), minimal downtime cutover (minutes). For the scenario with database servers requiring under 30 minutes downtime, MGN is appropriate because it continuously replicates changes, keeping the target very close to source (minimal lag), allowing quick cutover. SMS would require a final snapshot replication before cutover, which could take significant time for active databases. Option A is incorrect - SMS has longer cutover times. Option C is false - MGN supports VMware, Physical, and Azure sources. Option D is incorrect - MGN is technically superior for this use case. Note: AWS has announced SMS will reach end of support, making MGN the strategic choice. This tests understanding of migration service selection based on downtime requirements and workload characteristics.

---

### Question 6: DMS Task Performance Tuning with ParallelLoadThreads
**Scenario:** A DMS task migrates a 2 TB MySQL database with 200 tables to Aurora MySQL. The task uses a dms.c5.4xlarge replication instance but throughput is only 50 MB/s. CloudWatch shows the replication instance CPU at 25% and network at 30%. What optimization would MOST likely improve throughput?

**Options:**
A) Increase MaxFullLoadSubTasks to parallelize loading more tables simultaneously
B) Increase ParallelLoadThreads for each table to use multiple threads per table
C) Upgrade to a larger replication instance class for more CPU and network capacity
D) Enable Multi-AZ for the replication instance to distribute load across availability zones

**Answer:** A

**Explanation:** AWS DMS full load performance can be tuned using two key parameters: (1) MaxFullLoadSubTasks - number of tables loaded in parallel (default 8), (2) ParallelLoadThreads - number of threads used per table for partitioned loads. With 200 tables and low resource utilization (25% CPU, 30% network), the bottleneck is not hardware but parallelism. Increasing MaxFullLoadSubTasks from the default 8 to 16 or 32 allows more tables to be migrated simultaneously, better utilizing the replication instance. The c5.4xlarge has 16 vCPUs, so it can easily handle more parallel tasks. Option B (ParallelLoadThreads) helps when you have a few very large tables, but requires LOB columns or partitioning configuration. With 200 tables, table-level parallelism (MaxFullLoadSubTasks) is more impactful. Option C is premature - the existing instance is underutilized. Option D is incorrect - Multi-AZ is for high availability, not performance. The key insight: DMS performance tuning starts with parallelism settings before hardware scaling. This tests understanding of DMS performance tuning parameters.

---

### Question 7: Storage Gateway Volume Gateway Cached vs Stored Mode
**Scenario:** A company has a 50 TB on-premises file server that needs low-latency access to frequently used files (10 TB) while maintaining access to all data. They have 100 Mbps internet connectivity. Which Storage Gateway configuration is MOST appropriate?

**Options:**
A) File Gateway with S3 bucket, using caching for frequently accessed files
B) Volume Gateway in Cached mode with 10 TB local cache
C) Volume Gateway in Stored mode with all data stored locally and backed up to S3
D) Tape Gateway for cost-effective long-term storage of infrequently accessed files

**Answer:** A

**Explanation:** The scenario describes a file server use case with tier-based access patterns (hot 10 TB, total 50 TB). AWS Storage Gateway File Gateway is designed for this: it presents SMB/NFS shares backed by S3, with local cache for frequently accessed files. The cache (sized based on your local hardware) stores hot data for low-latency access, while all data resides in S3. Metadata is cached locally for fast file listing. This is ideal for file servers, backups, content repositories. Volume Gateway (Options B & C) is for block-level storage (iSCSI volumes), typically used for application volumes, not file shares. Cached Volume Gateway keeps primary data in S3 with local cache, but it's block-level, not file-level. Stored Volume Gateway keeps all data locally (need 50 TB local storage) and asynchronously backs up to S3. Option D (Tape Gateway) is for backup applications using VTL, not primary file access. The key distinction: File Gateway = file access (NFS/SMB), Volume Gateway = block access (iSCSI), Tape Gateway = backup (VTL). This tests understanding of Storage Gateway types and their use cases.

---

### Question 8: AWS DataSync with Bandwidth Throttling
**Scenario:** An organization uses AWS DataSync to transfer 100 TB from on-premises NAS to S3. They schedule transfers during off-hours (8 PM - 6 AM) to avoid impacting business. However, users still complain about slow network during transfers. DataSync bandwidth is configured to "unlimited." What should they do?

**Options:**
A) Configure DataSync bandwidth limit to a specific value (e.g., 500 Mbps) to leave headroom for other traffic
B) Use AWS Direct Connect instead of internet for DataSync transfers
C) Schedule DataSync tasks to run in smaller batches spread throughout the night
D) Enable DataSync network optimizations in the task settings to reduce bandwidth usage

**Answer:** A

**Explanation:** AWS DataSync, when configured with unlimited bandwidth, will use all available network capacity to maximize transfer speed. This can saturate the internet connection, affecting other traffic even during off-hours (monitoring, backups, remote access, global operations). Configuring a bandwidth limit on the DataSync task (e.g., 500 Mbps on a 1 Gbps link) ensures DataSync doesn't monopolize the connection. You can adjust based on your network capacity and other traffic needs. Option B (Direct Connect) helps by providing dedicated bandwidth but is a much larger architectural change and may not be justified for a one-time 100 TB transfer. Option C (smaller batches) doesn't solve bandwidth saturation during each batch's execution. Option D is incorrect - there's no "network optimization" setting that reduces bandwidth usage; DataSync is already optimized for efficient transfers. The key learning: DataSync bandwidth configuration is critical for managing network impact. Use bandwidth limits to balance transfer speed with network availability for other services. This tests understanding of DataSync bandwidth management.

---

### Question 9: AWS Transfer Family SFTP with VPC Endpoint
**Scenario:** A company configures AWS Transfer Family SFTP server with a VPC endpoint to allow partners to upload files. Partners report they cannot connect to the SFTP server from the internet. The Transfer Family server is configured with a public endpoint type. What's the issue?

**Options:**
A) VPC endpoint type is for internal access only; use PUBLIC endpoint type for internet-accessible SFTP
B) The server's VPC endpoint doesn't have Elastic IPs attached for internet accessibility
C) Security groups associated with the VPC endpoint are blocking inbound SFTP traffic on port 22
D) PUBLIC endpoint type and VPC endpoint are mutually exclusive; the configuration is invalid

**Answer:** C

**Explanation:** AWS Transfer Family supports three endpoint types: (1) PUBLIC - internet-accessible via AWS-managed endpoint, (2) VPC - private access within VPC using VPC endpoint, (3) VPC_ENDPOINT with Elastic IPs - internet-accessible via VPC endpoint with Elastic IPs attached to endpoint's ENIs. The scenario states "VPC endpoint" and "public endpoint type," which is contradictory in the question, but the actual issue in practice is typically security group configuration. When using VPC or VPC_ENDPOINT types, the VPC endpoint has associated security groups that must allow inbound traffic on port 22 (SFTP) from the internet (0.0.0.0/0 for public access, or specific partner IPs for restricted access). Many architects configure the Transfer Family server but forget to update security groups on the VPC endpoint. Option A is partially correct but doesn't address the security group issue. Option B is partially correct - VPC_ENDPOINT type needs EIPs for internet access, but the question is about connectivity being blocked. Option D is incorrect - you can have internet-accessible VPC endpoints with EIPs. This tests understanding of Transfer Family endpoint types and network access control.

---

### Question 10: VMware Cloud on AWS vs AWS Outposts for Hybrid Workloads
**Scenario:** A company wants to run VMware workloads with strict latency requirements (under 2 ms) to on-premises databases. They're evaluating VMware Cloud on AWS and AWS Outposts. Their data center has limited rack space (4U available). Which solution is MORE appropriate?

**Options:**
A) VMware Cloud on AWS because it provides native VMware vSphere with lower operational overhead
B) AWS Outposts because it runs in the customer data center, ensuring ultra-low latency to on-premises systems
C) VMware Cloud on AWS because Outposts requires minimum 42U rack space, which exceeds availability
D) Neither solution works; use AWS Wavelength for low-latency edge computing instead

**Answer:** C

**Explanation:** AWS Outposts comes in two form factors: (1) Outposts racks - minimum 42U rack, provides full AWS infrastructure in customer data center, (2) Outposts servers - 1U or 2U form factors with limited capacity (introduced later). VMware Cloud on AWS runs in AWS data centers, not on-premises, providing VMware-native environment but with typical AWS-to-on-premises latency (not sub-2ms). For sub-2ms latency requirements, the workload needs to run on-premises, making Outposts the logical choice. However, with only 4U rack space available, a standard Outposts rack won't fit. The customer would need to either: (1) Allocate more rack space for Outposts rack, (2) Use Outposts servers (1U/2U) if capacity meets needs, or (3) Reconsider architecture. Option A doesn't meet latency requirements. Option B is technically correct about latency but ignores the rack space constraint. Option D is incorrect - Wavelength is for 5G edge, not data center latency. This tests understanding of hybrid deployment options and their physical and latency constraints.

---

### Question 11: AWS Schema Conversion Tool (SCT) Heterogeneous Migration
**Scenario:** A company uses AWS SCT to migrate from Oracle to Aurora PostgreSQL. SCT's assessment report shows many database objects marked as "action required" with conversion complexity HIGH. What does this indicate and what should they do?

**Options:**
A) These objects cannot be automatically converted; manual rewriting in PostgreSQL-compatible syntax is required
B) SCT requires additional licenses to convert complex objects; purchase SCT Professional edition
C) The source Oracle database has unsupported features; upgrade to a newer Oracle version first
D) Run SCT in "force conversion" mode to automatically convert all objects regardless of complexity

**Answer:** A

**Explanation:** AWS Schema Conversion Tool (SCT) analyzes source database schemas and provides an assessment report with traffic light indicators: (1) GREEN - automatic conversion, (2) YELLOW - mostly automatic with minor manual fixes, (3) RED/"Action Required" - cannot be automatically converted, requires manual effort. Objects marked HIGH complexity typically include: proprietary Oracle features (DBMS_* packages not available in PostgreSQL), complex PL/SQL that doesn't map to PL/pgSQL, hierarchical queries, certain data types, etc. The solution is to manually rewrite these objects or refactor the application to avoid them. SCT provides recommendations and equivalent PostgreSQL patterns. Option B is false - SCT is free; there's no "Professional edition." Option C may help in some cases but doesn't solve fundamental Oracle-to-PostgreSQL incompatibilities. Option D is incorrect - there's no "force conversion" mode; SCT won't convert what it can't. The key insight: heterogeneous migrations (different database engines) require careful assessment and often significant manual conversion effort. SCT automates what it can but architects must budget for manual work on complex objects. This tests understanding of SCT limitations and migration effort estimation.

---

### Question 12: AWS DMS Ongoing Replication (CDC) Performance Degradation
**Scenario:** A DMS task successfully completes full load and begins CDC. Initially, CDC lag is under 1 second. After several days, CDC lag grows to 10+ minutes and continues increasing. The source database write rate hasn't increased. What's the MOST likely cause?

**Options:**
A) The target Aurora database is experiencing write throttling due to too many concurrent transactions
B) The DMS replication instance is running out of disk space for transaction logs and change data
C) Network bandwidth between source and target has degraded over time
D) The source database's transaction log is not being archived properly, causing DMS to re-read old transactions

**Answer:** B

**Explanation:** AWS DMS replication instances have local storage used for task logs, cached transactions, and swap space. During CDC, if the target cannot keep up with applying changes (due to write contention, latency, or throttling), DMS queues transactions on the replication instance's disk. Over time, if the apply rate is consistently slower than the capture rate, disk space fills up, slowing DMS performance further. Eventually, disk exhaustion causes severe lag or task failure. This is progressive degradation - starts well, degrades over days. Solutions: (1) Monitor replication instance disk metrics (FreeStorageSpace), (2) Increase storage or instance size, (3) Optimize target database write performance (add indexes, increase IOPS), (4) Tune DMS task settings (BatchApplyEnabled, parallel apply). Option A is possible but would likely show constant lag, not progressive. Option C is unlikely to degrade progressively. Option D is incorrect - archive log issues would prevent CDC from reading new changes. The key insight: DMS replication instances need adequate storage for sustained CDC workloads, especially when target apply performance varies. This tests understanding of DMS operational monitoring and troubleshooting.

---

### Question 13: Application Discovery Service vs Migration Hub Import
**Scenario:** A company wants to inventory their 5,000 on-premises servers for migration planning. Some servers are physical, some virtual, across multiple data centers. They want to collect detailed dependency information (network connections between servers). What's the BEST discovery approach?

**Options:**
A) Deploy AWS Application Discovery Service Agents on all servers for detailed dependency and performance data
B) Use Application Discovery Service Agentless Discovery (vCenter integration) for VMware VMs only
C) Import server inventory from existing CMDB using Migration Hub import templates
D) Use a combination of agents for critical servers and agentless for VMs, importing physical server data from CMDB

**Answer:** D

**Explanation:** AWS provides multiple discovery mechanisms: (1) Application Discovery Service Agent-based - installed on servers (VM or physical), collects detailed data including network connections, processes, performance metrics; works across all platforms but requires installation on each server. (2) Agentless Discovery - integrates with VMware vCenter, collects configuration and utilization data for VMs; no installation required but limited to VMware and less detailed. (3) Migration Hub import - upload CSV files from existing tools/CMDBs; quick but static snapshot. For 5,000 servers across physical and virtual, a hybrid approach is most practical: deploy agents on critical servers where detailed dependency mapping is crucial, use agentless for VMware VMs (easier at scale), and import physical server inventory from existing CMDB. This balances detail with operational feasibility. Option A (agents everywhere) is ideal but operationally challenging for 5,000 servers. Option B misses physical servers. Option C lacks dependency information. The key insight: large-scale discovery requires pragmatic hybrid approaches. This tests understanding of discovery tool selection and trade-offs.

---

### Question 14: AWS Elastic Disaster Recovery (DRS) RPO Considerations
**Scenario:** A company uses AWS Elastic Disaster Recovery (DRS, formerly CloudEndure DR) for business-critical servers. Their RTO requirement is 1 hour, RPO requirement is 15 minutes. During a DR test, they fail over and discover the recovered server's data is 45 minutes old. What's the issue?

**Options:**
A) DRS replication lag exceeded 15 minutes due to high change rate on source servers
B) DRS cannot achieve 15-minute RPO; minimum RPO is 1 hour for block-level replication
C) The DR drill initiated failover before replication caught up to the current point in time
D) DRS was configured in "scheduled snapshot" mode instead of "continuous replication" mode

**Answer:** A

**Explanation:** AWS Elastic Disaster Recovery (DRS) provides continuous block-level replication with typical RPO of seconds to minutes, depending on change rate and network conditions. However, if the source server has a high change rate (disk writes) that exceeds the replication throughput, lag accumulates, increasing RPO. The scenario's 45-minute lag suggests replication cannot keep up with source changes. Solutions: (1) Increase bandwidth between source and AWS, (2) Reduce source change rate (pause non-critical writes during DR prep), (3) Exclude high-churn non-critical volumes from replication, (4) Optimize network path. Option B is false - DRS can achieve sub-minute RPO under normal conditions. Option C is possible but the scenario says they "fail over," not that they initiated failover prematurely; lag is the root cause. Option D is incorrect - DRS doesn't have "snapshot mode"; it's continuous replication. The key learning: DR tools provide technical capability for low RPO, but actual RPO depends on workload characteristics (change rate) and infrastructure (bandwidth). Always test DR with realistic workload conditions. This tests understanding of replication-based DR limitations.

---

### Question 15: AWS Mainframe Modernization Automated Refactoring Limitations
**Scenario:** A company evaluates AWS Mainframe Modernization service for migrating COBOL applications. The service's automated refactoring option promises to convert COBOL to Java. After analysis, what should they expect regarding the automated conversion?

**Options:**
A) Fully automated conversion with no manual coding required; applications run immediately after conversion
B) Automated conversion handles 60-80% of code; business logic requires manual review and potential refactoring
C) Automated conversion only works for COBOL programs under 10,000 lines of code
D) Conversion is automated but requires rewriting all database access layers and transaction logic

**Answer:** B

**Explanation:** AWS Mainframe Modernization provides two migration patterns: (1) Replatform - lift-and-shift mainframe applications to managed mainframe runtime on AWS (Micro Focus or Blu Age runtime), minimal code changes; (2) Refactor - automated conversion of COBOL to Java with business logic preserved, runs on modern stack. The automated refactoring is sophisticated but not 100% automated. Typically, the conversion handles 60-80% of code automatically, converting COBOL syntax to Java. However, business logic, complex data transformations, and integration points require review and potential manual refactoring. Additionally, mainframe-specific concepts (like CICS transactions, VSAM files, JCL) need mapping to modern equivalents (microservices, databases, orchestration). Option A is unrealistic - no automated conversion is perfect. Option C is false - there's no such line-of-code limit. Option D overstates the manual work - data access can often be converted, though it needs validation. The key insight: automated mainframe modernization significantly reduces effort but requires experienced developers to review, test, and refine converted code. It's a tool to accelerate migration, not a magic button. This tests realistic expectations of modernization tools.

---
