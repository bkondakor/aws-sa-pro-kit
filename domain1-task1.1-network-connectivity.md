# Domain 1 - Task 1.1: Architect Network Connectivity Strategies

## Overview
Network connectivity is a foundational skill for the AWS Solutions Architect Professional exam. This task focuses on designing hybrid and multi-VPC architectures that are scalable, resilient, and cost-effective.

---

## 1. Hybrid Connectivity Options

### AWS Direct Connect

**What it is:**
AWS Direct Connect establishes a dedicated private connection from your on-premises data center to AWS, bypassing the public internet.

**Key Features:**
- Dedicated bandwidth: 1 Gbps, 10 Gbps, 100 Gbps connections
- Consistent network performance and reduced latency
- Private connectivity to VPCs via Virtual Private Gateway (VGW) or Transit Gateway
- Supports both private and public Virtual Interfaces (VIFs)

**Connection Types:**
- **Dedicated Connection:** Full physical connection from AWS (1/10/100 Gbps)
- **Hosted Connection:** Provided by AWS Direct Connect Partners (50 Mbps to 10 Gbps)

**Virtual Interface (VIF) Types:**
1. **Private VIF:** Connects to VPC via VGW or Direct Connect Gateway
2. **Public VIF:** Access AWS public services (S3, DynamoDB) without internet
3. **Transit VIF:** Connects to Transit Gateway for multi-VPC access

**Maximum Resiliency Architecture (99.99% SLA):**
- Two Direct Connect locations
- Multiple connections at each location (total of 4 connections)
- Separate devices in more than one on-premises location
- Dynamic BGP routing enabled

**Cost Structure (2025):**
- Port Hours: ~$0.30/hour for 1 Gbps, ~$2.25/hour for 10 Gbps (varies by location)
- Data Transfer Out: ~$0.02/GB (significantly cheaper than internet egress)
- No inbound data transfer charges

**When to Use:**
- Consistent high-bandwidth requirements (>1 Gbps sustained)
- Compliance requirements for dedicated connectivity
- Predictable network performance requirements
- Significant data transfer volumes to/from AWS
- Hybrid applications requiring low latency

### AWS Site-to-Site VPN

**What it is:**
IPsec VPN tunnels over the internet connecting on-premises networks to AWS VPCs.

**Key Features:**
- Two tunnels per VPN connection for redundancy (active/active or active/passive)
- Each tunnel supports up to 1.25 Gbps throughput
- Encrypted traffic using IPsec
- Supports both static and dynamic (BGP) routing
- Can terminate on Virtual Private Gateway or Transit Gateway

**VPN Connection Types:**
1. **VPN to Virtual Private Gateway:** Single VPC connectivity
2. **VPN to Transit Gateway:** Multi-VPC connectivity with ECMP support (up to 50 Gbps aggregate)

**Cost Structure (2025):**
- VPN Connection: ~$0.05/hour per VPN connection
- Data Transfer Out: Standard AWS data transfer rates (~$0.09/GB for first 10 TB)

**When to Use:**
- Temporary or backup connectivity
- Bandwidth requirements <1.25 Gbps per tunnel
- Quick setup needed (can be operational in hours)
- Cost-sensitive hybrid connectivity
- Geographic locations without Direct Connect availability

### Direct Connect + VPN (Redundancy Best Practice)

**Architecture:**
- Primary: Direct Connect for main traffic
- Secondary: Site-to-Site VPN as backup

**Key Benefits:**
- Cost-effective redundancy
- IPsec encryption over Direct Connect (if needed)
- Automatic failover with dynamic BGP routing

**Configuration:**
- Use MACsec for Direct Connect encryption (Layer 2)
- Or establish VPN tunnel over Direct Connect public VIF for encryption
- Configure BGP route preferences (AS Path prepending, Local Preference)

**Failover Optimization (2025 Best Practice):**
- Enable BFD (Bidirectional Forwarding Detection) with unpinned tunnels
- Reduces failover time from 90 seconds to ~300 milliseconds (99% improvement)

---

## 2. AWS Transit Gateway

### Overview
AWS Transit Gateway acts as a cloud router connecting VPCs, VPN connections, Direct Connect gateways, and peering connections through a centralized hub.

**Key Capabilities:**
- Hub-and-spoke network topology
- Supports up to 5,000 attachments per Transit Gateway
- Inter-region peering for global networks
- Supports multicast traffic
- Transitive routing between all attachments
- Route table association for traffic segmentation

### Transit Gateway Attachments

**Attachment Types:**
1. **VPC Attachment:** Connect VPCs in same region
2. **VPN Attachment:** Site-to-Site VPN connections
3. **Direct Connect Gateway Attachment:** Via Transit VIF
4. **Peering Attachment:** Connect to Transit Gateway in another region
5. **Transit Gateway Connect:** For SD-WAN appliances (GRE/BGP)

### Routing and Segmentation

**Route Tables:**
- Each attachment associates with a route table
- Multiple route tables enable network segmentation
- Supports static and dynamic (BGP) routes

**Use Cases for Multiple Route Tables:**
- **Security Isolation:** Separate production from development VPCs
- **Traffic Inspection:** Route traffic through security appliances
- **Compliance:** Isolate regulated workloads
- **Multi-tenancy:** Separate customer environments

**Example Architecture:**
```
Production Route Table:
  - Production VPC A → Production VPC B ✓
  - Production VPC A → Development VPC ✗

Development Route Table:
  - Development VPC → Shared Services VPC ✓
  - Development VPC → Production VPCs ✗

Shared Services Route Table:
  - Shared Services → All VPCs ✓
```

### Transit Gateway Pricing (2025)

**Hourly Attachment Charges:**
- $0.05/hour per VPC attachment (~$36/month)
- Each attachment owner pays separately
- Peering attachments: both Transit Gateway owners pay

**Data Processing Charges:**
- $0.02/GB for data sent through Transit Gateway
- Applies to traffic from VPC, VPN, or Direct Connect to Transit Gateway
- Exception: No processing charges for peering attachment traffic

**Cost Example:**
- 10 VPCs attached 24/7: 10 × $0.05/hour = $0.50/hour = ~$360/month
- 100 GB/day transferred through TGW: 100 GB × $0.02 = $2/day = ~$60/month
- Total: ~$420/month

### Transit Gateway vs Alternatives

**Transit Gateway vs VPC Peering:**
- **Use Transit Gateway when:**
  - Managing 5+ VPCs requiring full mesh connectivity
  - Need transitive routing (A → B → C)
  - Centralized routing control required
  - Future scalability expected

- **Use VPC Peering when:**
  - Connecting 2-4 VPCs with simple requirements
  - Cost optimization is priority
  - No transitive routing needed
  - Regional isolation acceptable

**Transit Gateway vs PrivateLink:**
- **Different use cases** - not direct alternatives
- Transit Gateway: Full network connectivity (all resources)
- PrivateLink: Service-level connectivity (specific endpoints)
- **Can be used together** for hybrid architectures

---

## 3. AWS PrivateLink (VPC Endpoint Services)

### Overview
AWS PrivateLink provides private connectivity between VPCs, AWS services, and on-premises applications without using public IPs or traversing the internet.

**Key Characteristics:**
- **Unidirectional:** Consumer → Service Provider
- **Service-level access:** Expose specific applications/services
- **Overlapping IPs supported:** Uses ENIs in consumer VPC
- **Highly available:** Automatically redundant across AZs
- **Scalable:** Handles millions of requests

### VPC Endpoint Types

**1. Interface Endpoints (PrivateLink)**
- Elastic Network Interfaces (ENIs) in your VPC subnets
- Private IP addresses from your VPC CIDR
- Accessed via endpoint-specific DNS names
- Supports most AWS services and custom services

**Supported AWS Services (Examples):**
- EC2 API, Lambda, SNS, SQS, Step Functions
- CloudWatch, CloudFormation, Systems Manager
- KMS, Secrets Manager
- S3 and DynamoDB (also have Gateway Endpoints)

**2. Gateway Endpoints**
- Route table entries (not ENIs)
- No hourly charges or data processing fees
- Only for S3 and DynamoDB
- Highly scalable by design

**3. Gateway Load Balancer Endpoints**
- For traffic inspection appliances
- Transparent network gateway + load balancer
- Supports third-party security appliances

### PrivateLink Architecture Patterns

**Pattern 1: AWS Service Access**
```
Private Subnet → Interface Endpoint → AWS Service (S3, Lambda, etc.)
- No internet gateway required
- All traffic stays on AWS network
- Access AWS services from private subnets
```

**Pattern 2: Service Provider / Consumer**
```
Service Provider VPC:
  - Application Load Balancer or Network Load Balancer
  - VPC Endpoint Service configuration

Consumer VPC(s):
  - Interface Endpoint
  - Private DNS name resolution
  - Initiates connections to service
```

**Pattern 3: Multi-Account Service Sharing**
- Create VPC Endpoint Service in central account
- Grant permissions to specific AWS accounts or organizations
- Consumers create Interface Endpoints in their VPCs
- No VPC peering or Transit Gateway required

### When to Use PrivateLink

**Ideal Scenarios:**
- **Microservices architecture:** Service-to-service private communication
- **SaaS provider:** Offer services to customers privately
- **Shared services:** Central authentication, logging, or monitoring
- **Overlapping IP addresses:** Multiple VPCs with same CIDR ranges
- **Security requirement:** Prevent internet exposure of services
- **Third-party integration:** Private access to partner services

**PrivateLink vs VPC Peering:**
- PrivateLink: Unidirectional, service-level, supports IP overlap, higher cost
- VPC Peering: Bidirectional, full network access, no IP overlap, lower cost

**Cost Structure (2025):**
- Interface Endpoint: ~$0.01/hour per AZ (~$7.20/month per endpoint)
- Data Processing: ~$0.01/GB
- Gateway Endpoint: No charges (S3 and DynamoDB only)

---

## 4. Multi-VPC Architectures

### Connectivity Patterns

**1. VPC Peering**

**Characteristics:**
- One-to-one connectivity between VPCs
- Non-transitive (A↔B and B↔C doesn't allow A↔C)
- Supports cross-region and cross-account
- No single point of failure
- Lowest latency between VPCs

**Limitations:**
- No overlapping CIDR blocks
- Maximum 125 peering connections per VPC
- Becomes complex with many VPCs (n×(n-1)/2 connections for full mesh)
- No central routing management

**When to Use:**
- Simple connectivity between 2-5 VPCs
- Cost optimization priority
- Low latency required
- Specific VPC-to-VPC isolation

**Cost:**
- No hourly charges
- Standard data transfer rates (lower than Transit Gateway)
- Same region: $0.01/GB, Cross region: $0.02/GB

**2. Shared VPC (Resource Access Manager)**

**What it is:**
AWS Resource Access Manager (RAM) allows VPC owner to share subnets with other AWS accounts within the same organization.

**Key Features:**
- Participants deploy resources into shared subnets
- Owner retains control over VPC configuration
- Centralized network management
- Reduces VPC proliferation

**Shared Resources:**
- VPC subnets (most common)
- Transit Gateway attachments
- Route 53 Resolver rules
- License Manager configurations

**Use Cases:**
- Centralized networking team manages VPCs
- Multiple application teams deploy workloads
- Consistent security group and network ACL enforcement
- Cost allocation by participant accounts

**3. Hub-and-Spoke with Transit Gateway**

**Architecture:**
- Central Transit Gateway as hub
- VPCs, VPN, Direct Connect as spokes
- Centralized routing and inspection

**Benefits:**
- Simplified network management
- Scalable to thousands of VPCs
- Transitive routing enabled
- Traffic inspection at central point

**Example Design:**
```
              Transit Gateway (Hub)
                    |
      +-------------+-------------+
      |             |             |
  Production    Development   Shared
     VPCs          VPCs       Services
                                 |
                           (Inspection,
                            DNS, Auth)
```

---

## 5. Network Segmentation and Traffic Flow

### Security Best Practices

**1. Network Segmentation Strategies**

**By Environment:**
- Separate Production, Staging, Development
- Isolated route tables in Transit Gateway
- SCPs to prevent cross-environment access

**By Compliance:**
- Dedicated VPCs for PCI, HIPAA workloads
- Network isolation with NACLs
- Traffic inspection for regulated data

**By Trust Level:**
- DMZ/Public tier
- Application tier
- Database tier
- Isolated inspection VPC

**2. Traffic Flow Control**

**Security Groups:**
- Stateful firewall at instance/ENI level
- Allow rules only (implicit deny)
- Can reference other security groups
- Supports up to 60 inbound + 60 outbound rules (soft limit)

**Network ACLs:**
- Stateless firewall at subnet level
- Both allow and deny rules
- Numbered rules processed in order
- Separate inbound and outbound rules

**Route Tables:**
- Control traffic routing at subnet level
- Most specific route wins
- Can blackhole traffic (no target)

**Traffic Inspection Architecture:**
```
Internet → IGW → Inspection VPC (Firewall) → Transit Gateway → Application VPC
```

**Inspection VPC Pattern:**
- Deploy third-party firewalls or AWS Network Firewall
- Use Gateway Load Balancer for scalability
- Centralized egress and ingress inspection
- Logged traffic for compliance

### DNS Resolution

**Route 53 Resolver**

**Hybrid DNS Resolution:**
- Resolver Endpoints enable DNS between on-premises and AWS
- **Inbound Endpoint:** On-premises queries AWS-hosted zones
- **Outbound Endpoint:** AWS queries on-premises DNS servers

**Resolver Rules:**
- Forward rules for specific domains
- System rules for AWS default behavior
- Shared across accounts via RAM

**Private Hosted Zones:**
- DNS for resources within VPCs
- Can be associated with multiple VPCs
- Supports cross-account association
- Useful for service discovery

---

## 6. Global Network Design

### AWS Global Accelerator

**What it is:**
Network service that uses AWS global network to optimize path to your application endpoints.

**Key Features:**
- Provides 2 static anycast IP addresses
- Automatic routing to nearest healthy endpoint
- Instant regional failover (30 seconds)
- DDoS protection via AWS Shield Standard (free)

**Use Cases:**
- Global user base requiring low latency
- Applications requiring static IP addresses
- Quick disaster recovery failover
- Non-HTTP(S) protocols (TCP/UDP)
- Multi-region active/active architectures

**Global Accelerator vs CloudFront:**
- **Global Accelerator:** TCP/UDP traffic, static IPs, instant failover, no caching
- **CloudFront:** HTTP(S) only, content caching, edge locations, TTL-based updates

### CloudFront for Global Content Delivery

**What it is:**
Content Delivery Network (CDN) that caches content at edge locations worldwide.

**Key Features:**
- 400+ edge locations globally
- Caches static and dynamic content
- Supports HTTP/HTTPS, WebSocket
- SSL/TLS termination at edge
- Integrates with AWS Shield, WAF, Lambda@Edge

**Use Cases:**
- Static website hosting (S3 origin)
- API acceleration (ALB/API Gateway origin)
- Video streaming (MediaPackage, S3)
- Software distribution
- Global web applications

**Origin Types:**
- S3 bucket (with Origin Access Control)
- Application Load Balancer
- EC2 instance
- Custom HTTP server (on-premises)

### Multi-Region Architectures

**Route 53 Routing Policies for Multi-Region:**

**1. Latency-Based Routing**
- Routes to region with lowest latency
- Requires resources in multiple regions
- Automatic health checking

**2. Geolocation Routing**
- Routes based on user's geographic location
- Data sovereignty compliance
- Localized content delivery

**3. Geoproximity Routing**
- Routes based on geographic location with bias
- Traffic Flow visual editor
- Control traffic distribution percentage

**4. Failover Routing**
- Primary and secondary resources
- Health checks determine failover
- Simple disaster recovery

**Health Checks:**
- Endpoint monitoring (every 10 or 30 seconds)
- CloudWatch alarm monitoring
- Calculated health checks (combine multiple checks)
- String matching for content validation

---

## 7. Tricky Scenarios and Exam Tips

### Scenario 1: Transit Gateway vs VPC Peering Decision

**Question Pattern:**
"A company has 15 VPCs across 3 regions requiring full mesh connectivity with centralized routing control..."

**Analysis:**
- **Many VPCs (>5):** Favor Transit Gateway
- **Full mesh:** VPC Peering would require 105 connections (15×14/2)
- **Centralized routing:** Only Transit Gateway provides this
- **Cross-region:** Transit Gateway supports peering

**Answer:** Transit Gateway with inter-region peering

### Scenario 2: PrivateLink for Overlapping IPs

**Question Pattern:**
"Company acquired another organization with VPCs using identical CIDR ranges. Need to access specific services..."

**Key Insight:**
- VPC Peering CANNOT work with overlapping CIDRs
- Transit Gateway CANNOT work with overlapping CIDRs
- PrivateLink CAN work because it uses ENIs in consumer VPC

**Answer:** Use PrivateLink/VPC Endpoint Service

### Scenario 3: Direct Connect Redundancy

**Question Pattern:**
"Design a hybrid architecture with 99.99% availability SLA..."

**Required Elements:**
- Two Direct Connect locations (different geographic)
- Two connections at each location (total 4)
- Connections from separate providers
- Separate on-premises routers
- Dynamic BGP routing

**Bonus:** Add VPN as backup for cost-effective redundancy

### Scenario 4: Minimizing Data Transfer Costs

**Cost Comparison (per GB):**
- Same AZ: Free
- Same Region, Different AZ: $0.01
- Cross Region: $0.02
- Internet egress: $0.09 (first 10 TB)
- Direct Connect: $0.02
- Transit Gateway processing: $0.02

**Optimization Strategies:**
- Use same region for frequently communicating resources
- Leverage Gateway Endpoints for S3/DynamoDB (free)
- Direct Connect for large sustained transfers
- CloudFront for public content distribution

### Scenario 5: Egress Traffic Control

**Question Pattern:**
"All internet-bound traffic must pass through centralized security inspection..."

**Architecture:**
```
Application VPCs → Transit Gateway → Egress VPC
Egress VPC: NAT Gateway + Network Firewall + Internet Gateway
```

**Key Components:**
- Transit Gateway route: 0.0.0.0/0 → Egress VPC attachment
- Egress VPC routes traffic through inspection appliances
- Return traffic properly routed via Transit Gateway

### Scenario 6: VPN Performance Requirements

**Question:**
"Application requires 5 Gbps throughput over encrypted connection..."

**Options:**
1. Single VPN to VGW: Max 1.25 Gbps ✗
2. VPN to Transit Gateway with ECMP: Up to 50 Gbps ✓
3. Direct Connect with MACsec: 10/100 Gbps ✓
4. Multiple VPNs to Transit Gateway: ✓ (ECMP across tunnels)

**Answer:** Option 2 or 4 (VPN to Transit Gateway) or Option 3 (Direct Connect with encryption)

---

## 8. Hands-On Practice Scenarios

### Lab 1: Build Transit Gateway Hub-and-Spoke
1. Create 3 VPCs in different AZs
2. Create Transit Gateway
3. Attach all VPCs to Transit Gateway
4. Configure route tables for connectivity
5. Test connectivity between VPCs
6. Implement route table isolation for segmentation

### Lab 2: PrivateLink Service Provider/Consumer
1. Create service provider VPC with NLB
2. Create VPC Endpoint Service
3. Create consumer VPC
4. Create Interface Endpoint
5. Test private connectivity
6. Configure endpoint policies

### Lab 3: Hybrid Connectivity with VPN
1. Set up Site-to-Site VPN connection
2. Configure on-premises side (simulated with another VPC)
3. Enable BGP dynamic routing
4. Test failover scenarios
5. Monitor CloudWatch metrics

### Lab 4: Multi-Region with Route 53
1. Deploy application in two regions
2. Configure Route 53 health checks
3. Set up failover routing policy
4. Test failover by stopping primary region
5. Measure failover time

---

## 9. Key Takeaways

**Decision Tree:**

```
Need to connect VPCs?
├─ 2-5 VPCs, simple connectivity → VPC Peering
├─ 5+ VPCs, centralized routing → Transit Gateway
└─ Service-level access, overlapping IPs → PrivateLink

Need hybrid connectivity?
├─ <1 Gbps, cost-sensitive → Site-to-Site VPN
├─ >1 Gbps, consistent performance → Direct Connect
├─ Maximum redundancy → Direct Connect (2 locations) + VPN backup
└─ Encrypted high bandwidth → Direct Connect with MACsec

Need global distribution?
├─ HTTP(S) content caching → CloudFront
├─ Static IPs, TCP/UDP, instant failover → Global Accelerator
└─ Multi-region DR → Route 53 health checks + failover routing
```

**Cost Optimization:**
- Use Gateway Endpoints for S3/DynamoDB (free)
- VPC Peering cheaper than Transit Gateway for simple cases
- Same region connectivity cheaper than cross-region
- Direct Connect for large sustained data transfers

**Performance Optimization:**
- Direct Connect for consistent latency
- Global Accelerator for TCP/UDP global applications
- CloudFront for HTTP(S) content delivery
- VPC Peering for lowest latency between VPCs

**Security Best Practices:**
- PrivateLink for service exposure without internet
- Centralized egress through inspection VPC
- Network segmentation with multiple Transit Gateway route tables
- Use MACsec or VPN for encrypted Direct Connect

---

## 10. Common Exam Traps

**Trap 1:** Choosing Transit Gateway when VPC Peering would suffice
- **Red Flag:** Small number of VPCs, cost is priority
- **Correct:** VPC Peering for 2-5 VPCs

**Trap 2:** Forgetting PrivateLink for overlapping IPs
- **Red Flag:** "VPCs with identical CIDR blocks"
- **Correct:** PrivateLink is the only solution

**Trap 3:** Single Direct Connect for HA requirements
- **Red Flag:** "99.99% availability" or "maximum resilience"
- **Correct:** Multiple Direct Connect locations + connections

**Trap 4:** Incorrect VPN throughput assumptions
- **Red Flag:** ">1.25 Gbps encrypted throughput"
- **Correct:** VPN to Transit Gateway with ECMP, or Direct Connect with MACsec

**Trap 5:** Using internet for AWS service access from private subnets
- **Red Flag:** "No internet access" but need S3/DynamoDB
- **Correct:** Gateway Endpoints (free) or Interface Endpoints

---

**Next Steps:**
- Study Task 1.2: Security Controls
- Practice hands-on labs in your AWS account
- Review AWS networking whitepapers
- Complete practice questions focused on network connectivity
