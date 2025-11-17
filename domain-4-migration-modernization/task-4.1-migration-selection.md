# Task 4.1: Select Existing Workloads and Processes for Potential Migration

## Overview

Task 4.1 focuses on **identifying and selecting** the right workloads for migration to AWS. This is the critical first step in any migration journey and represents approximately **25% of Domain 4** questions on the exam.

**Key Objectives:**
- Apply the 7 R's migration framework to categorize workloads
- Conduct Migration Readiness Assessments (MRA)
- Perform portfolio discovery and dependency mapping
- Build migration business cases with TCO analysis
- Prioritize workloads for migration waves

---

## The 7 R's Migration Framework (Deep Dive)

The 7 R's provide a structured approach to categorizing each application in your portfolio. Understanding when to apply each strategy is critical for the exam.

### 1. Retire - Decommission Unused Applications

**Definition:** Identify and turn off applications that are no longer needed.

**When to Use:**
- Application has less than 5% usage
- Functionality is duplicated elsewhere
- Business process has changed, making app obsolete
- License renewal coming up with no business justification
- Shadow IT applications that aren't sanctioned

**Migration Process:**
1. Identify through usage metrics and stakeholder interviews
2. Validate with business owners
3. Archive data if needed (compliance)
4. Decommission infrastructure
5. Cancel licenses and support contracts

**Exam Scenario Indicators:**
- "Used by only 3 people in the organization"
- "Duplicate functionality with newer system"
- "No business owner can be identified"
- "License cost of $50K/year with minimal usage"

**Typical Portfolio Percentage:** 10-20%

**Benefits:**
- Immediate cost savings (infrastructure + licenses)
- Reduced migration scope and complexity
- Lower ongoing operational overhead
- Improved security posture (fewer attack surfaces)

**Tricky Exam Scenarios:**
- ❌ **Wrong:** Migrate everything "just in case"
- ✅ **Correct:** Conduct usage analysis, retire 15% of portfolio, save migration costs

### 2. Retain - Keep in Current Environment

**Definition:** Keep applications in their current state, don't migrate now.

**When to Use:**
- Recently invested in on-premises upgrade
- Application requires major refactoring (not ready yet)
- Regulatory/compliance requires on-premises
- Dependencies haven't been migrated yet
- Mainframe applications with unclear migration path
- Applications nearing end-of-life (< 2 years)
- No business case for migration exists

**Migration Process:**
1. Document reason for retention
2. Set review date for reconsideration
3. Maintain current support and operations
4. Plan for eventual migration or retirement

**Exam Scenario Indicators:**
- "Just upgraded hardware 6 months ago"
- "Compliance requires data remain on-premises until 2027"
- "Application scheduled for retirement in 18 months"
- "Dependent systems not yet migrated"

**Typical Portfolio Percentage:** 15-25%

**Benefits:**
- Avoid premature migration costs
- Focus resources on high-value migrations
- Respect regulatory constraints
- Maintain stability for legacy systems

**Tricky Exam Scenarios:**
- **Scenario:** "Database on new hardware, app retiring in 1 year, migrate now?"
- ❌ **Wrong:** Rehost to cloud immediately
- ✅ **Correct:** Retain on-premises, avoid migration costs for soon-to-retire app

### 3. Relocate - Hypervisor-Level Migration

**Definition:** Transfer VMs from on-premises VMware to VMware Cloud on AWS without modifying the VMs.

**When to Use:**
- Running VMware vSphere on-premises
- Want to maintain VMware tools and processes
- Need to migrate quickly with minimal changes
- Team has strong VMware expertise
- Want to maintain same management interface
- Applications certified on VMware only

**Migration Process:**
1. Set up VMware Cloud on AWS
2. Use VMware HCX for migration
3. Migrate at hypervisor level (vMotion)
4. No guest OS changes required
5. Maintain VMware tools and management

**Exam Scenario Indicators:**
- "VMware environment with 500 VMs"
- "Team expertise in VMware vSphere"
- "Want to maintain existing management tools"
- "Need rapid datacenter exit"

**Typical Portfolio Percentage:** 5-10% (VMware-specific)

**Benefits:**
- Fastest VMware migration path
- Maintains existing operational model
- No application changes required
- Minimal downtime (vMotion capable)

**AWS Service:** VMware Cloud on AWS

**Tricky Exam Scenarios:**
- **Scenario:** "Large VMware environment, want cloud benefits, maintain tools"
- ❌ **Wrong:** Rehost all VMs to EC2
- ✅ **Correct:** Relocate to VMware Cloud on AWS, maintain VMware management

### 4. Rehost - "Lift and Shift"

**Definition:** Move applications to AWS without making changes to the application itself.

**When to Use:**
- Need to migrate quickly (datacenter closure, hardware EOL)
- Applications are stable and well-understood
- Want to migrate first, optimize later
- Limited cloud expertise in team
- Proven applications with no major issues
- Large number of servers to migrate

**Migration Process:**
1. Use AWS Application Migration Service (MGN)
2. Install replication agent on source servers
3. Continuous replication to AWS staging
4. Test in AWS (non-disruptive)
5. Cutover to AWS with minimal downtime
6. Right-size after migration

**Exam Scenario Indicators:**
- "Datacenter contract ends in 6 months"
- "Need to migrate 300 servers quickly"
- "Stable application, no changes needed"
- "Limited AWS expertise in team"
- "Want to get to cloud fast, optimize later"

**Typical Portfolio Percentage:** 40-50% (largest category)

**Benefits:**
- Fastest migration for most workloads
- Proven approach with low risk
- Minimal application testing required
- Can optimize after migration
- Immediate infrastructure benefits (backups, DR)

**AWS Services:**
- AWS Application Migration Service (MGN) - recommended
- AWS Server Migration Service (SMS) - legacy

**Cost Considerations:**
- Initial costs may be similar to on-premises
- Savings come from: no hardware refresh, better utilization, pay-as-you-go
- Can optimize costs 20-30% post-migration

**Tricky Exam Scenarios:**
- **Scenario:** "500 Windows servers, datacenter closing in 4 months, what strategy?"
- ❌ **Wrong:** Refactor all applications to serverless
- ✅ **Correct:** Rehost with MGN for speed, plan optimization later

### 5. Replatform - "Lift, Tinker, and Shift"

**Definition:** Migrate to AWS and make some cloud optimizations, but don't change core application architecture.

**When to Use:**
- Want immediate cloud benefits without full re-architecture
- Can make minor changes to leverage AWS services
- Database to managed service (RDS, Aurora)
- Application server to managed platform (Elastic Beanstalk)
- Want to reduce operational overhead
- Balance speed and optimization

**Common Replatforming Examples:**

| Source | Target | Benefit |
|--------|--------|---------|
| Self-managed MySQL on VM | Amazon RDS for MySQL | Managed backups, patching, HA |
| Oracle on physical server | Amazon RDS for Oracle | Automated operations, Multi-AZ |
| SQL Server on Windows | Amazon Aurora PostgreSQL + Babelfish | License cost savings, performance |
| Java app on WebLogic | AWS Elastic Beanstalk | Simplified deployment, auto-scaling |
| File server on Windows | Amazon FSx for Windows | Fully managed, integrated with AD |
| Custom caching layer | Amazon ElastiCache | Managed Redis/Memcached |

**Migration Process:**
1. Identify optimization opportunities (databases, middleware)
2. Plan minor application changes (connection strings, etc.)
3. Migrate to AWS managed services
4. Test thoroughly (behavior may differ slightly)
5. Cutover with validation
6. Enjoy reduced operational overhead

**Exam Scenario Indicators:**
- "Database currently managed in-house, high admin overhead"
- "Want to reduce patching and backup management"
- "Willing to make minor configuration changes"
- "Want some cloud benefits without re-architecting"

**Typical Portfolio Percentage:** 20-30%

**Benefits:**
- Immediate operational benefits (managed services)
- Reduced DBA/admin overhead
- Better availability (Multi-AZ, automated backups)
- Cost savings from managed services
- Faster than full refactor

**Tricky Exam Scenarios:**
- **Scenario:** "MySQL database with heavy admin overhead, app can change connection string"
- ❌ **Wrong:** Rehost MySQL on EC2 (continues admin burden)
- ✅ **Correct:** Replatform to RDS for MySQL (reduced overhead, managed service benefits)

### 6. Repurchase - "Drop and Shop"

**Definition:** Move to a different product, typically by switching to a SaaS solution.

**When to Use:**
- Software vendor offers cloud/SaaS version
- High licensing costs for legacy software
- Want to eliminate infrastructure management completely
- SaaS offering has needed features
- Willing to accept different UX/workflows
- Want predictable subscription pricing

**Common Repurchase Examples:**

| Current System | SaaS Alternative | Driver |
|---------------|------------------|--------|
| Self-hosted CRM | Salesforce | Eliminate infrastructure, modern features |
| On-prem Exchange | Microsoft 365 | Reduce email infrastructure overhead |
| Custom HR system | Workday | Modern HR features, mobile access |
| Legacy ERP | SAP S/4HANA Cloud | Modernize business processes |
| On-prem collaboration | Slack, Microsoft Teams | Modern collaboration, mobile |
| Self-hosted helpdesk | ServiceNow, Zendesk | Eliminate infrastructure, integrations |

**Migration Process:**
1. Evaluate SaaS alternatives
2. Conduct proof of concept
3. Plan data migration
4. Train users on new system
5. Migrate data
6. Cutover to SaaS
7. Decommission legacy system

**Exam Scenario Indicators:**
- "High licensing costs for legacy software"
- "Vendor offers cloud version"
- "Want to eliminate all infrastructure management"
- "IT team spending too much time on maintenance"

**Typical Portfolio Percentage:** 5-10%

**Benefits:**
- Zero infrastructure to manage
- Vendor manages updates, security, availability
- Predictable subscription costs
- Often includes modern features
- Rapid deployment

**Tradeoffs:**
- May require business process changes
- Less customization available
- Subscription costs ongoing (vs perpetual licenses)
- Vendor lock-in considerations
- Data migration complexity

**Tricky Exam Scenarios:**
- **Scenario:** "Custom-built CRM, high maintenance, limited features, Salesforce has all needed features"
- ❌ **Wrong:** Rehost custom CRM on EC2
- ✅ **Correct:** Repurchase with Salesforce, eliminate custom code maintenance

### 7. Refactor / Re-architect - Cloud-Native Transformation

**Definition:** Re-imagine application architecture to fully leverage cloud-native features and capabilities.

**When to Use:**
- Need significant scalability improvements
- Application is business-critical with high ROI potential
- Existing architecture has performance/scaling issues
- Want to add features difficult in current architecture
- Willing to invest in transformation
- Have cloud-native development skills
- Application has long runway (5+ years)

**Common Refactoring Patterns:**

| From | To | Benefit |
|------|-----|---------|
| Monolith on VMs | Microservices on ECS/EKS | Independent scaling, faster deployments |
| Scheduled batch jobs | Event-driven Lambda functions | Pay per execution, automatic scaling |
| Tightly coupled apps | Loosely coupled via SQS/SNS | Better resilience, independent scaling |
| Polling architecture | Event-driven with EventBridge | Real-time, reduced overhead |
| File-based integration | API-first with API Gateway | Modern integration, better security |
| On-prem SQL database | DynamoDB (NoSQL) | Massive scale, single-digit millisecond latency |
| VM-based processing | Serverless Step Functions | No server management, automatic scaling |

**Migration Process:**
1. Analyze current architecture and pain points
2. Design cloud-native target architecture
3. Break work into iterative phases
4. Build and test new architecture
5. Migrate data
6. Run parallel (old and new) if possible
7. Cutover incrementally (strangler fig pattern)
8. Decommission legacy

**Exam Scenario Indicators:**
- "Need to scale to 10x current traffic"
- "Competitive advantage depends on new features"
- "Current architecture cannot support requirements"
- "High-value application with 10-year runway"
- "Want to minimize operational overhead"
- "Monolithic application with scaling issues"

**Typical Portfolio Percentage:** 10-20%

**Benefits:**
- Maximum cloud-native benefits
- Dramatic scalability improvements
- Reduced operational overhead (serverless)
- Improved resilience and availability
- Faster feature delivery (microservices)
- Pay-per-use cost model

**Tradeoffs:**
- Highest migration effort and cost
- Longest timeline (months to years)
- Requires significant testing
- Team needs cloud-native skills
- Higher initial investment

**Refactoring Techniques:**
1. **Strangler Fig Pattern** - Gradually replace functionality
2. **Database Decomposition** - Split monolithic database
3. **CQRS** - Separate read and write models
4. **Event Sourcing** - Store state changes as events
5. **API Gateway Pattern** - Abstract backend services
6. **Service Mesh** - Manage microservice communication

**Tricky Exam Scenarios:**
- **Scenario:** "E-commerce platform, 10M users, current architecture can't scale, 5-year strategic focus"
- ❌ **Wrong:** Rehost monolith to larger EC2 instances
- ✅ **Correct:** Refactor to microservices on ECS with DynamoDB, API Gateway, Lambda

---

## Migration Readiness Assessment (MRA)

### What is MRA?

A structured assessment that evaluates organizational readiness to migrate to AWS across six perspectives.

### Six Perspectives of MRA

**1. Business Perspective**
- Executive sponsorship and commitment
- Business case and value drivers
- Cloud strategy alignment
- Stakeholder engagement
- Change management readiness

**Key Questions:**
- Is there executive-level sponsorship?
- Is the business case clearly defined?
- Are success metrics established?

**2. People Perspective**
- Skills and capabilities assessment
- Training needs analysis
- Organizational structure readiness
- Resource availability
- Resistance to change

**Key Questions:**
- Does team have AWS skills?
- What training is needed?
- Are resources dedicated to migration?

**3. Governance Perspective**
- Decision-making processes
- Program management approach
- Risk management framework
- Compliance requirements
- Financial management

**Key Questions:**
- Who approves migration decisions?
- How are risks identified and managed?
- What compliance requirements exist?

**4. Platform Perspective**
- Application portfolio analysis
- Infrastructure readiness
- Network and connectivity
- Migration tooling selection
- Landing zone design

**Key Questions:**
- What is the current technology stack?
- Are networks prepared for cloud connectivity?
- Is landing zone designed?

**5. Security Perspective**
- Security controls mapping
- Identity and access management
- Data protection requirements
- Compliance frameworks
- Incident response procedures

**Key Questions:**
- What security controls are needed?
- How will identity be managed?
- What data classification exists?

**6. Operations Perspective**
- Operational processes
- Monitoring and alerting
- Incident management
- Backup and recovery
- Runbook documentation

**Key Questions:**
- Are operational runbooks prepared?
- Is monitoring strategy defined?
- Are backup procedures established?

### MRA Maturity Levels

Organizations are scored on a maturity scale:

**Level 1 - Initial:** Ad hoc processes, no cloud experience
**Level 2 - Repeatable:** Some processes defined, limited cloud usage
**Level 3 - Defined:** Documented processes, active cloud usage
**Level 4 - Managed:** Measured processes, cloud center of excellence
**Level 5 - Optimized:** Continuous improvement, cloud-first culture

### MRA Deliverables

1. **Current State Assessment** - Where you are today
2. **Gap Analysis** - What's missing for cloud readiness
3. **Action Plan** - Steps to close gaps
4. **Timeline** - When gaps will be addressed
5. **Risk Register** - Identified risks and mitigations

### Exam Focus: MRA Red Flags

Watch for these indicators in exam scenarios:

❌ **Not Ready for Large Migration:**
- No executive sponsorship
- No dedicated resources
- No AWS skills in team
- No defined processes
- Resistance to change high

✅ **Ready for Migration:**
- Strong executive support
- Dedicated migration team
- Cloud training underway
- Defined governance
- Pilot projects completed

---

## Portfolio Discovery and Analysis

### Discovery Process

**Step 1: Inventory Assets**
- Identify all servers, databases, applications
- Document current infrastructure
- Capture dependencies
- Record configurations

**Step 2: Collect Data**
- Performance metrics (CPU, memory, disk, network)
- Utilization patterns (peak vs average)
- Application dependencies
- Network flows and communication
- Licensing information
- Compliance requirements

**Step 3: Analyze and Categorize**
- Assign to 7 R's categories
- Identify dependencies and groupings
- Determine complexity levels
- Prioritize for migration

### AWS Discovery Tools

**IMPORTANT UPDATE (2025):** AWS Application Discovery Service is no longer open to new customers as of November 7, 2025. **AWS Transform** is now the recommended solution.

### AWS Transform (Current Recommendation)

**What it does:**
- Comprehensive discovery and assessment
- Agent-based and agentless collectors
- Enhanced VMware environment analysis
- Automated application dependency mapping
- Wave planning capabilities
- Rightsized EC2 instance recommendations

**Data Collection Methods:**

**1. Agentless Discovery (VMware)**
- Deploy AWS Transform Agentless Collector (OVA)
- Discovers VMs through vCenter
- Collects: configuration, performance, network connections
- Best for: VMware environments
- No installation on guest OS needed

**2. Agent-Based Discovery**
- Install AWS Discovery Agent on servers
- Collects: system config, performance, processes, network connections
- Provides process-level dependency data
- Best for: detailed dependency mapping
- Works on: Windows, Linux (on-prem or other clouds)

**3. Import-Based Discovery**
- Import existing CMDB data
- CSV format with server specifications
- Supplements agent/agentless data
- Best for: Jump-starting discovery with known data

### Discovery Data Collected

| Data Type | Agentless | Agent-Based | Use Case |
|-----------|-----------|-------------|----------|
| Server configuration | ✓ | ✓ | Rightsizing recommendations |
| CPU, memory, disk | ✓ | ✓ | Performance analysis |
| Network connections | ✓ | ✓ | Dependency mapping |
| Running processes | ✗ | ✓ | Deep dependency analysis |
| Inbound connections | ✓ | ✓ | Security group planning |
| Outbound connections | ✓ | ✓ | Network architecture |
| Database discovery | ✓ | ✗ | Database migration planning |

### Dependency Mapping

**Why Dependencies Matter:**
- Can't migrate an app without its database
- Can't migrate API consumers before the API
- Load balancers must migrate with backend servers
- Batch jobs depend on data sources

**Dependency Types to Identify:**

1. **Application Dependencies**
   - Web tier → App tier → Database tier
   - Application → Authentication service
   - App → File storage
   - App → External APIs

2. **Infrastructure Dependencies**
   - Servers → Storage
   - Servers → Network services (DNS, LDAP, AD)
   - Servers → Monitoring systems
   - Servers → Backup systems

3. **Data Dependencies**
   - Primary database → Read replicas
   - Source systems → Data warehouse
   - Application → Shared file systems
   - Batch jobs → Data feeds

4. **Time-Based Dependencies**
   - Nightly batch processes
   - Monthly reporting jobs
   - Scheduled integrations

**Creating Application Groups:**

Based on dependency analysis, group servers that must migrate together:

**Example:**
```
Application Group: E-Commerce Platform
├── Web Tier (3 servers)
├── Application Tier (5 servers)
├── Database Tier (2 servers - primary + replica)
├── Redis Cache (2 servers)
├── File Storage (1 NFS server)
└── Background Workers (3 servers)

Dependencies:
- Active Directory (external, migrate first)
- Payment Gateway API (no migration needed)
- Email Service (SaaS, no migration needed)
```

This group would migrate as a single wave.

### Portfolio Categorization Matrix

Assess applications on two key dimensions to prioritize:

**Dimension 1: Business Value**
- High: Revenue-generating, customer-facing, strategic
- Medium: Important business processes, good ROI
- Low: Nice-to-have, limited business impact

**Dimension 2: Technical Complexity**
- Low: Simple architecture, few dependencies, proven technology
- Medium: Multi-tier, some dependencies, standard tech stack
- High: Complex integrations, many dependencies, custom/legacy tech

**Migration Prioritization:**

| Business Value | Low Complexity | Medium Complexity | High Complexity |
|---------------|----------------|-------------------|-----------------|
| **High** | **Wave 1** - Quick wins | **Wave 2** - Strategic | **Wave 3** - High value, plan carefully |
| **Medium** | **Wave 2** - Good candidates | **Wave 3** - Moderate priority | **Wave 4** - Defer or simplify first |
| **Low** | **Wave 3** - Easy migrations | **Wave 4** - Lower priority | **Retire or Retain** |

**Exam Tip:** High value + low complexity = migrate early for quick wins and build momentum

---

## TCO Analysis and Business Case

### Total Cost of Ownership (TCO) Components

**On-Premises TCO (Often Underestimated):**

**1. Capital Expenses (CapEx)**
- Server hardware purchase
- Storage arrays
- Network equipment
- Datacenter build-out
- Power and cooling infrastructure
- Upfront software licenses

**2. Operating Expenses (OpEx)**
- Datacenter rent/lease
- Power and cooling costs
- Network bandwidth
- Hardware maintenance contracts
- Software maintenance and support
- IT staff salaries (infrastructure team)
- Storage administration
- Database administration
- Security personnel
- Compliance auditing
- Disaster recovery site costs
- Hardware refresh (every 3-5 years)

**3. Hidden Costs**
- Over-provisioning for peak capacity (30-40% typical)
- Unused server capacity (average 15-20% utilization)
- Inefficient manual processes
- Slow time-to-market
- Opportunity cost of innovation
- Unplanned outages

### AWS TCO (More Predictable)

**1. Direct AWS Costs**
- EC2 instances (can use Reserved Instances/Savings Plans)
- EBS storage
- S3 object storage
- RDS databases
- Data transfer out
- Additional services (Lambda, etc.)

**2. Operational Costs**
- Reduced infrastructure team (typically 30-50% reduction)
- Monitoring and management tools
- Training and skill development
- AWS support plan
- Third-party tools (monitoring, security)

**3. Migration Costs (One-Time)**
- Discovery and assessment
- Migration tooling
- Professional services
- Staff time for migration
- Testing and validation
- Parallel running period

### TCO Calculation Example

**Scenario:** 100 servers, mix of web, app, and database

**On-Premises Annual Cost:**
```
Hardware (depreciated over 3 years): $500K ÷ 3 = $166K/year
Datacenter space and power: $120K/year
Network costs: $60K/year
Software licenses: $200K/year
IT staff (4 FTEs dedicated to infrastructure): $400K/year
Maintenance contracts: $80K/year
Storage: $100K/year
Disaster recovery: $150K/year
───────────────────────────────────
Total On-Premises: $1,276K/year
```

**AWS Annual Cost:**
```
EC2 instances (Reserved Instances): $180K/year
EBS storage: $40K/year
RDS databases (Reserved): $120K/year
S3 storage: $20K/year
Data transfer: $30K/year
Reduced IT staff (2 FTEs): $200K/year
AWS support: $30K/year
───────────────────────────────────
Total AWS: $620K/year
```

**Annual Savings: $656K (51% reduction)**

**3-Year TCO:**
```
On-Premises 3-year: $3,828K
AWS 3-year (including $200K migration): $2,060K
───────────────────────────────────
3-Year Savings: $1,768K (46% reduction)
ROI: 88% return over 3 years
Payback Period: 4 months
```

### AWS Pricing Calculator

Use the **AWS Pricing Calculator** (https://calculator.aws) to estimate:
- Monthly service costs
- Upfront costs
- 1-year and 3-year costs
- Compare on-demand vs Reserved Instances
- Regional pricing differences

### Migration Business Case Components

A complete migration business case includes:

**1. Executive Summary**
- Strategic goals alignment
- High-level cost savings
- Timeline overview
- Key risks and mitigations

**2. Financial Analysis**
- 3-year TCO comparison
- Migration costs breakdown
- ROI calculation
- Payback period
- NPV (Net Present Value)
- Cash flow analysis

**3. Qualitative Benefits**
- Improved agility (deploy faster)
- Better disaster recovery (lower RTO/RPO)
- Enhanced security (AWS security services)
- Innovation enablement (AI/ML, analytics)
- Global reach (deploy in multiple regions)
- Improved reliability (99.99% SLA)

**4. Risk Analysis**
- Technical risks and mitigations
- Business risks and mitigations
- Migration execution risks
- Post-migration operational risks

**5. Timeline and Approach**
- Migration phases
- Wave planning
- Resource requirements
- Key milestones

### AWS Migration Evaluator (Formerly TSO Logic)

**What it does:**
- Automated TCO analysis
- Provides quick insights (within 1-2 weeks)
- Creates data-driven business case
- No cost for the assessment
- Minimal data collection (agentless)

**Process:**
1. Deploy data collector (agentless, read-only)
2. Collect 30 days of usage data
3. AWS analyzes patterns
4. Receive detailed TCO report
5. Get rightsizing recommendations

**Deliverables:**
- Current state cost analysis
- Projected AWS costs
- Cost comparison by workload
- Rightsized EC2 recommendations
- Migration pattern suggestions (7 R's)

**Exam Tip:** When scenario mentions "quick business case needed" → Migration Evaluator

---

## Wave Planning and Prioritization

### What is Wave Planning?

Grouping applications into migration batches (waves) based on dependencies, business priorities, and risk tolerance.

### Wave Planning Principles

**1. Start Small (Pilot Wave)**
- Choose low-risk, low-complexity applications
- Build confidence and experience
- Validate processes and tools
- Typical size: 5-10 servers

**2. Build Momentum (Early Waves)**
- Migrate quick wins (high value, low complexity)
- Demonstrate business value
- Generate executive support
- Typical size: 20-50 servers per wave

**3. Scale Up (Main Migration Waves)**
- Migrate bulk of portfolio
- Leverage lessons learned
- Use migration factory approach
- Typical size: 100-200 servers per wave

**4. Complex Last (Final Waves)**
- High-complexity applications
- Major refactoring candidates
- Applications requiring significant changes
- Typical size: varies widely

### Wave Sequencing Factors

**Priority 1: Dependencies**
- Migrate shared services first (AD, DNS, monitoring)
- Migrate APIs before consumers
- Migrate databases with applications

**Priority 2: Business Value**
- High-value applications get priority
- Quick wins build momentum
- Strategic applications get focus

**Priority 3: Risk**
- Low-risk applications first
- Build expertise before high-risk
- Validate processes on simple apps

**Priority 4: Timeline Constraints**
- Datacenter contract expiration
- Hardware end-of-life
- License renewal dates
- Compliance deadlines

**Priority 5: Resources**
- Team availability
- Business change windows
- Testing capacity
- Budget cycles

### Sample Wave Plan

**Wave 0: Foundation (Week 1-4)**
- Set up AWS Organizations and accounts
- Create landing zone
- Establish network connectivity (Direct Connect/VPN)
- Deploy shared services (AD, DNS, monitoring)
- Set up migration tools (MGN, DMS)

**Wave 1: Pilot (Week 5-8)**
- 3 low-complexity web applications (10 servers)
- Validate migration process
- Test runbooks
- Train team
- **Goal:** Prove migration approach

**Wave 2: Quick Wins (Week 9-16)**
- 5 high-value, low-complexity applications (50 servers)
- Demonstrate business value
- Build executive confidence
- Refine processes
- **Goal:** Show ROI, build momentum

**Wave 3-8: Bulk Migration (Week 17-40)**
- 40-50 applications per wave (600 servers total)
- Use migration factory approach
- Parallel execution where possible
- Continuous optimization
- **Goal:** Migrate majority of portfolio

**Wave 9: Complex Applications (Week 41-52)**
- 3 business-critical, complex applications
- Extensive testing required
- Possible refactoring
- Extra validation
- **Goal:** Successful migration of critical apps

**Post-Migration: Optimization (Ongoing)**
- Right-size resources
- Implement cost optimization
- Modernize over time
- Retire source infrastructure

### Migration Factory Approach

For large-scale migrations, establish a "migration factory":

**Characteristics:**
- Standardized processes and runbooks
- Automated tools and scripts
- Specialized teams (discovery, migration, testing, cutover)
- Continuous execution
- Metrics-driven

**Teams:**
1. **Discovery Team:** Continuous application assessment
2. **Migration Team:** Execute migrations using MGN/DMS
3. **Testing Team:** Validate migrated applications
4. **Cutover Team:** Plan and execute production cutover
5. **Optimization Team:** Right-size and optimize post-migration

**Benefits:**
- Increased velocity (more servers per week)
- Lower cost per server migrated
- Improved quality through standardization
- Knowledge sharing across teams

---

## Exam Scenarios and Answers

### Scenario 1: Datacenter Exit

**Question:** A company must exit their datacenter in 6 months. They have 500 servers running a mix of web applications, databases, and file servers. The team has limited AWS experience. What migration strategy should be prioritized?

**Analysis:**
- Time constraint: 6 months (urgent)
- Large number of servers: 500
- Limited AWS skills
- Need for speed

**Answer:** **Rehost (Lift and Shift)** using AWS Application Migration Service (MGN)
- Fastest migration approach
- Minimal changes reduces risk
- MGN automates much of the process
- Can optimize after migration
- Proven approach for large-scale migrations

**Wrong Answers:**
- ❌ Refactor all applications (too slow, too risky)
- ❌ Retain on-premises (doesn't meet datacenter exit requirement)
- ❌ Repurchase all with SaaS (unrealistic timeline)

### Scenario 2: Database Admin Overhead

**Question:** A company has 15 MySQL databases running on physical servers. The DBA team spends significant time on backups, patching, and high availability management. The applications can tolerate minor configuration changes. What strategy is most appropriate?

**Analysis:**
- Admin overhead is pain point
- MySQL databases (managed service available)
- Apps can handle minor changes
- Want operational improvement

**Answer:** **Replatform** to Amazon RDS for MySQL
- Eliminates backup/patching overhead
- Provides automated high availability (Multi-AZ)
- Minor change (connection strings)
- Immediate operational benefits

**Wrong Answers:**
- ❌ Rehost on EC2 (continues admin overhead)
- ❌ Refactor to DynamoDB (major application changes, likely unnecessary)
- ❌ Retain (doesn't address admin overhead problem)

### Scenario 3: Unused Applications

**Question:** During portfolio discovery, 50 out of 300 applications are found to have less than 5% utilization. Business owners cannot justify their continued use. Some data must be retained for 7 years for compliance. What strategy should be applied?

**Analysis:**
- Very low utilization (< 5%)
- No business justification
- Compliance requires data retention
- 50 applications (significant cost savings opportunity)

**Answer:** **Retire** the applications
- Archive data to S3 Glacier for compliance (7-year retention)
- Decommission infrastructure
- Save migration costs and ongoing operational costs
- Reduce migration scope

**Calculation:**
- 50 servers not migrated = reduced migration effort
- Ongoing savings: 50 servers × $500/month = $25K/month saved
- Archive data: S3 Glacier Deep Archive ($1/TB/month) very low cost

**Wrong Answers:**
- ❌ Rehost all 300 applications (wastes resources on unused apps)
- ❌ Retain unused applications (continues unnecessary costs)

### Scenario 4: VMware Environment

**Question:** A company runs 400 VMs on VMware vSphere. They need to migrate quickly but want to maintain their existing VMware tools, processes, and team expertise. What migration strategy should they use?

**Analysis:**
- Large VMware environment
- Want to maintain VMware tools and processes
- Team has VMware expertise
- Need for speed

**Answer:** **Relocate** to VMware Cloud on AWS
- Maintains VMware management interface
- Uses VMware HCX for migration
- No changes to VMs or applications
- Team continues using familiar tools
- Fastest migration path for VMware

**Wrong Answers:**
- ❌ Rehost to EC2 (loses VMware tools, requires new management approach)
- ❌ Refactor to containers (too slow, requires significant changes)

### Scenario 5: High-Transaction Database

**Question:** A company needs to migrate a 20TB Oracle database with 10,000 transactions per second. Downtime must be less than 1 hour. What approach should be used?

**Analysis:**
- Very large database (20 TB)
- High transaction volume
- Minimal downtime requirement (< 1 hour)
- Network transfer time: 20TB would take days/weeks

**Answer:** Use **AWS Snowball Edge with AWS DMS**
- Snowball Edge for initial 20TB load (offline)
- DMS for continuous change data capture (CDC)
- Final cutover with minimal downtime
- Process:
  1. Export database to Snowball Edge
  2. Ship to AWS, import to staging
  3. Start DMS CDC replication for ongoing changes
  4. Monitor replication lag (< 5 seconds)
  5. During maintenance window: stop application, let DMS catch up, cutover

**Wrong Answers:**
- ❌ DMS only over network (would take too long for 20TB initial load)
- ❌ Snowball only (doesn't handle ongoing transactions during migration)
- ❌ Native database tools (may not meet downtime requirement)

### Scenario 6: E-Commerce Scalability

**Question:** An e-commerce platform experiences 10x traffic during Black Friday but runs on monolithic architecture that cannot scale. The application is business-critical with a 10-year runway. What strategy should be applied?

**Analysis:**
- Scalability is critical business need
- Current architecture inadequate
- Long runway (10 years) - investment justified
- Business-critical (high value)

**Answer:** **Refactor** to microservices architecture
- Break monolith into scalable microservices
- Use ECS/EKS for container orchestration
- Implement auto-scaling
- Decouple services for independent scaling
- Use managed services (RDS, ElastiCache, SQS)
- Apply strangler fig pattern for gradual migration

**Architecture:**
- Frontend → CloudFront, S3
- API layer → API Gateway
- Services → ECS Fargate (auto-scaling microservices)
- Database → Aurora (separate read replicas for scaling)
- Cache → ElastiCache
- Queue → SQS for asynchronous processing

**Wrong Answers:**
- ❌ Rehost to larger EC2 instances (doesn't solve scaling architecture problem)
- ❌ Replatform (won't provide needed scalability improvements)

### Scenario 7: Compliance Constraints

**Question:** A healthcare application processes PHI (Protected Health Information) and must remain in an on-premises datacenter until 2027 due to regulatory interpretation. What strategy should be applied?

**Analysis:**
- Regulatory constraint requires on-premises
- Fixed timeline (until 2027)
- No choice in migration timing

**Answer:** **Retain** until 2027
- Document regulatory constraint
- Set review date for 2027
- Plan migration for when permitted
- Focus resources on applications that can migrate now

**Wrong Answers:**
- ❌ Rehost now (violates compliance requirements)
- ❌ Use AWS Outposts (may not satisfy regulatory interpretation)

---

## Summary: Exam Tips for Task 4.1

### Key Decision Factors for 7 R's

| Factor | Strategy Indicator |
|--------|-------------------|
| **Time Pressure** | Rehost (fast), Relocate (VMware, fast) |
| **Operational Overhead** | Replatform (managed services), Repurchase (SaaS) |
| **Scalability Needs** | Refactor (cloud-native), Replatform (managed scaling) |
| **Limited Usage** | Retire (save costs) |
| **Compliance/Dependencies** | Retain (not ready yet) |
| **Large VMware Environment** | Relocate (VMware Cloud) |
| **High Business Value + Long Runway** | Refactor (maximize cloud benefits) |
| **Database Admin Burden** | Replatform (RDS/Aurora) |
| **Software License Costs** | Repurchase (SaaS alternative) |
| **Vendor Offers Cloud Version** | Repurchase or Replatform |

### Must Remember

1. **7 R's complexity order:** Retire < Retain < Relocate < Rehost < Repurchase < Replatform < Refactor
2. **Largest portfolio %:** Rehost (40-50%), then Replatform (20-30%)
3. **MRA evaluates:** 6 perspectives (Business, People, Governance, Platform, Security, Operations)
4. **Discovery tools:** AWS Transform (current), combines agentless + agent-based
5. **Dependency mapping:** Critical for wave planning and migration order
6. **TCO includes:** Hidden costs (over-provisioning, inefficiencies, opportunity costs)
7. **Wave planning:** Start small (pilot), build momentum (quick wins), scale up (bulk), complex last
8. **Migration factory:** Standardized approach for large-scale migrations

### Common Exam Traps

❌ **Over-engineering:** Don't choose refactor when rehost is sufficient
❌ **Under-optimizing:** Don't rehost databases when replatform to RDS reduces overhead
❌ **Ignoring retirement:** Always consider if applications should be retired
❌ **Forgetting retention:** Not everything needs to migrate now
❌ **Wrong VMware path:** Use Relocate (VMware Cloud) not Rehost (EC2) for VMware
❌ **Ignoring dependencies:** Can't migrate app without its dependencies
❌ **Bad TCO:** Remember hidden on-prem costs (over-provisioning, opportunity cost)

---

*Last Updated: 2025-11-17*
*Verify current AWS service names and capabilities as services evolve*
