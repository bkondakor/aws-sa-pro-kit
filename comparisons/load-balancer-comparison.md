# AWS Load Balancer Services - Comprehensive Comparison

## High-Level Overview

AWS provides multiple types of Elastic Load Balancers, each operating at different layers of the OSI model and optimized for specific use cases. Understanding the differences between ALB, NLB, GLB, and CLB is critical for the SA Pro exam.

### Key Services

1. **Application Load Balancer (ALB)** - Layer 7 load balancer for HTTP/HTTPS with advanced routing
2. **Network Load Balancer (NLB)** - Layer 4 load balancer for TCP/UDP with ultra-low latency and static IPs
3. **Gateway Load Balancer (GLB)** - Layer 3 Gateway + Layer 4 load balancing for third-party virtual appliances
4. **Classic Load Balancer (CLB)** - Legacy load balancer supporting both Layer 4 and Layer 7 (NOT recommended for new applications)

---

## Detailed Comparison Table

| Feature | ALB | NLB | GLB | CLB |
|---------|-----|-----|-----|-----|
| **OSI Layer** | Layer 7 (Application) | Layer 4 (Transport) | Layer 3 (Gateway) + Layer 4 | Layer 4 & 7 (Limited) |
| **Protocols** | HTTP, HTTPS, gRPC | TCP, UDP, TLS | IP packets (all protocols) | TCP, SSL/TLS, HTTP, HTTPS |
| **Target Types** | IP, Instance, Lambda | IP, Instance, ALB | IP, Instance | Instance only |
| **Static IP** | No (use DNS) | Yes (Elastic IP per AZ) | No | No |
| **Preserve Source IP** | Via X-Forwarded-For header | Yes (client IP preserved) | Yes | Via X-Forwarded-For (HTTP) |
| **WebSocket** | Yes | Yes | N/A | No |
| **Path-based Routing** | Yes | No | No | No |
| **Host-based Routing** | Yes | No | No | No |
| **Query String Routing** | Yes | No | No | No |
| **HTTP Header Routing** | Yes | No | No | No |
| **SSL Termination** | Yes | Yes (TLS) | No | Yes |
| **SNI (Multiple Certs)** | Yes | Yes | N/A | No |
| **Sticky Sessions** | Yes (cookie-based) | Yes (flow hash) | No | Yes (cookie-based) |
| **Cross-Zone Load Balancing** | Always enabled (no charge) | Optional (with charge) | Optional (required for HA) | Optional |
| **Health Checks** | HTTP/HTTPS (advanced) | TCP, HTTP, HTTPS | TCP, HTTP, HTTPS | TCP, SSL, HTTP, HTTPS |
| **Connection Draining** | Yes (deregistration delay) | Yes (deregistration delay) | Yes (deregistration delay) | Yes (connection draining) |
| **Performance** | ~100ms latency | ~100 microseconds latency | Low latency for inline appliances | Higher latency than ALB/NLB |
| **Use Case** | Web apps, microservices | Extreme performance, gaming, IoT | Firewall, IDS/IPS, DPI | Legacy (not recommended) |
| **Pricing Model** | Per hour + LCU (Load Balancer Capacity Units) | Per hour + NLCU | Per hour + GLCU | Per hour + data processed |

---

## Detailed Service Breakdowns

### 1. Application Load Balancer (ALB)

**What it does:** Layer 7 load balancer that routes HTTP/HTTPS traffic based on content of the request.

**How it works:**
- Operates at the application layer (Layer 7)
- Inspects request content (path, headers, query strings)
- Routes to different target groups based on rules
- Terminates SSL/TLS connections
- Provides content-based routing capabilities

**Key Features:**
- **Path-based Routing:**
  - Route `/api/*` to API servers
  - Route `/images/*` to image servers
  - Multiple applications on single load balancer
- **Host-based Routing:**
  - Route `api.example.com` to API target group
  - Route `www.example.com` to web target group
  - Multiple domains on single ALB
- **HTTP Header Routing:**
  - Route based on custom headers
  - User-Agent based routing
  - API version routing
- **Query String/Parameter Routing:**
  - Route `?version=v2` to new version
  - A/B testing capabilities
- **Fixed Response:**
  - Return static HTTP response without targets
  - Custom error pages
- **Redirect Actions:**
  - HTTP to HTTPS redirect
  - Redirect to different domain/path
- **Authentication:**
  - Cognito User Pools integration
  - OIDC (OpenID Connect) providers
  - Authenticate users before routing
- **Target Types:**
  - EC2 instances
  - IP addresses (including on-premises)
  - Lambda functions (serverless)
  - Containers (ECS/EKS)
- **SNI (Server Name Indication):**
  - Multiple SSL certificates
  - One ALB, many domains
- **WebSocket Support:**
  - Persistent connections
  - Real-time applications
- **HTTP/2 and gRPC:**
  - Modern protocol support
  - Microservices communication

**Performance:**
- Latency: ~100 milliseconds
- Throughput: Scales automatically
- Concurrent connections: Hundreds of thousands

**Best for:**
- Web applications
- Microservices architectures
- Container-based applications
- API routing
- Applications requiring content-based routing
- Multi-tenant applications
- A/B testing scenarios
- Applications with multiple subdomains

**⚠️ EXAM TIP:**
- ALB operates at **Layer 7** (Application layer)
- Use ALB when you need **content-based routing** (path, host, header, query string)
- ALB is the **ONLY** load balancer that supports **Lambda targets**
- ALB provides **native authentication** (Cognito, OIDC)
- ALB supports **multiple SSL certificates via SNI**
- Client IP available via **X-Forwarded-For** header
- ALB **always** has cross-zone load balancing enabled (no extra charge)
- Keywords: "microservices", "containers", "path-based routing", "host-based routing"

**Pricing:**
- Hourly charge: ~$0.0225/hour
- LCU (Load Balancer Capacity Unit): ~$0.008/hour
- LCU dimensions: New connections, active connections, bandwidth, rule evaluations
- Cross-zone load balancing: No additional charge

**Common Exam Scenario:** "Route requests to different microservices based on URL path" → ALB with path-based routing

---

### 2. Network Load Balancer (NLB)

**What it does:** Layer 4 load balancer for extreme performance, handling millions of requests per second with ultra-low latency.

**How it works:**
- Operates at the transport layer (Layer 4)
- Routes based on IP protocol data (TCP/UDP ports)
- Does NOT inspect packet content
- Preserves source IP address
- Provides static IP addresses (Elastic IPs)
- Handles massive scale with minimal latency

**Key Features:**
- **Ultra-High Performance:**
  - Millions of requests per second
  - ~100 microsecond latency
  - Handles sudden traffic spikes
- **Static IP Addresses:**
  - One Elastic IP per Availability Zone
  - Whitelisting in firewalls
  - Fixed endpoint for clients
- **Preserve Source IP:**
  - Client IP address preserved
  - No X-Forwarded-For needed
  - Targets see actual client IP
- **Protocol Support:**
  - TCP (Layer 4)
  - UDP (Layer 4)
  - TLS (SSL termination)
- **Target Types:**
  - EC2 instances
  - IP addresses (on-premises, other VPCs)
  - Application Load Balancer (NLB → ALB chaining)
- **TLS Termination:**
  - Offload TLS processing from targets
  - Multiple certificates via SNI
  - Centralized certificate management
- **Zonal Isolation:**
  - Each AZ is independent
  - Failure in one AZ doesn't affect others
  - Optional cross-zone load balancing
- **Connection-based Load Balancing:**
  - Flow hash algorithm (5-tuple)
  - Source IP, source port, destination IP, destination port, protocol
  - Sticky sessions based on flow hash
- **PrivateLink Integration:**
  - Expose services via PrivateLink
  - NLB is the interface for PrivateLink endpoints
- **Health Checks:**
  - TCP, HTTP, HTTPS
  - More granular than basic TCP checks

**Performance:**
- Latency: ~100 microseconds (1000x faster than ALB)
- Throughput: Millions of requests per second
- Concurrent connections: Millions
- Handles sudden traffic spikes without pre-warming

**Best for:**
- Extreme performance requirements
- TCP/UDP applications
- Gaming servers
- IoT applications
- Financial trading platforms
- Real-time communications
- Applications requiring static IP
- WhitelistingIP addresses in firewalls
- On-premises connectivity (Direct Connect)
- PrivateLink services
- Applications where source IP must be preserved
- Low latency requirements

**⚠️ EXAM TIP:**
- NLB operates at **Layer 4** (Transport layer)
- Use NLB for **extreme performance** and **ultra-low latency**
- NLB provides **static IP addresses** (Elastic IPs) - ONLY load balancer with this capability
- NLB **preserves source IP** without headers
- NLB can have **ALB as target** (combine Layer 4 + Layer 7 benefits)
- NLB is required for **AWS PrivateLink** (VPC Endpoint Services)
- NLB supports **TCP, UDP, and TLS** protocols
- Cross-zone load balancing is **optional** and incurs data transfer charges
- Keywords: "static IP", "millions of requests", "low latency", "preserve source IP", "PrivateLink"

**Pricing:**
- Hourly charge: ~$0.0225/hour
- NLCU (Network Load Balancer Capacity Unit): ~$0.006/hour
- NLCU dimensions: New connections, active connections, bandwidth
- Cross-zone load balancing: Additional data transfer charges

**Common Exam Scenario:** "Application requires static IP addresses for firewall whitelisting and handles millions of requests per second" → NLB

---

### 3. Gateway Load Balancer (GLB)

**What it does:** Layer 3 Gateway + Layer 4 Load Balancer for deploying, scaling, and managing third-party virtual appliances.

**How it works:**
- Operates at Layer 3 (Network layer) as a transparent gateway
- Uses GENEVE protocol (port 6081) for tunneling
- Routes all traffic to virtual appliances (firewalls, IDS/IPS, DPI)
- Returns traffic to GLB after inspection
- Distributes traffic across multiple appliances
- Single entry/exit point for all traffic

**Key Features:**
- **Transparent Network Gateway:**
  - Single entry/exit point for traffic
  - Operates at Layer 3 (IP packets)
  - Transparent to source and destination
- **Third-party Virtual Appliances:**
  - Firewalls (Palo Alto, Fortinet, Check Point)
  - Intrusion Detection/Prevention Systems (IDS/IPS)
  - Deep Packet Inspection (DPI)
  - Network monitoring tools
  - Available via AWS Marketplace
- **GENEVE Encapsulation:**
  - Encapsulates traffic in GENEVE tunnels
  - Preserves original packet
  - Port 6081 for communication
- **Load Distribution:**
  - Distributes traffic across appliance fleet
  - Scales appliances horizontally
  - Health checks ensure only healthy appliances receive traffic
- **High Availability:**
  - Redundant appliances across AZs
  - Automatic failover
  - Zonal isolation
- **Integration Points:**
  - Gateway Load Balancer Endpoints (GWLBE)
  - VPC route tables
  - Internet Gateway
  - Can be in same VPC or different (centralized inspection VPC)
- **Use with AWS Services:**
  - Inspection VPC pattern
  - Centralized egress/ingress inspection
  - Works with Transit Gateway

**Architecture:**
```
Client → IGW/VPC → GWLBE → GLB → Virtual Appliances (Firewall/IDS/IPS)
                     ↓                        ↓
                  GENEVE Tunnel         Inspection/Processing
                     ↓                        ↓
                    GLB ← Return Traffic ← Appliances
                     ↓
                  GWLBE → Application/Destination
```

**Performance:**
- Low latency (inline inspection)
- Scales with number of appliances
- No impact on existing application architecture

**Best for:**
- Third-party security appliances
- Centralized traffic inspection
- Firewall requirements (next-gen firewalls)
- Intrusion Detection/Prevention Systems
- Deep Packet Inspection (DPI)
- Network anomaly detection
- Compliance requirements (inspect all traffic)
- Multi-VPC inspection architecture
- Inline network monitoring

**⚠️ EXAM TIP:**
- GLB operates at **Layer 3** (IP layer) as a transparent gateway
- Use GLB for **third-party virtual appliances** (firewalls, IDS/IPS)
- GLB uses **GENEVE protocol** (port 6081) for encapsulation
- GLB is deployed with **Gateway Load Balancer Endpoints (GWLBE)**
- GLB enables **centralized inspection VPC** pattern
- All traffic flows through GLB to appliances and back
- Keywords: "firewall", "IDS/IPS", "deep packet inspection", "third-party appliance", "security appliance"

**Pricing:**
- Hourly charge: ~$0.0125/hour (GLB)
- GLCU (Gateway Load Balancer Capacity Unit): ~$0.004/hour
- GWLBE: ~$0.01/hour per endpoint
- Data processing charges

**Common Exam Scenario:** "Centralized inspection of all VPC traffic using third-party firewalls" → Gateway Load Balancer with inspection VPC

---

### 4. Classic Load Balancer (CLB)

**What it does:** Legacy load balancer supporting basic Layer 4 (TCP) and Layer 7 (HTTP/HTTPS) load balancing.

**How it works:**
- Operates at both Layer 4 and Layer 7 (but limited features)
- Simple round-robin or least connections routing
- Basic health checks
- Legacy EC2-Classic network support
- Connection-based or request-based routing

**Key Features:**
- **Layer 4 (TCP/SSL):**
  - Basic TCP load balancing
  - SSL termination
  - No content inspection
- **Layer 7 (HTTP/HTTPS):**
  - Basic HTTP/HTTPS routing
  - No path-based or host-based routing
  - Sticky sessions via cookies
- **SSL Termination:**
  - Single SSL certificate only
  - No SNI support (one cert per CLB)
- **Health Checks:**
  - TCP, SSL, HTTP, HTTPS
  - Basic health check configuration
- **Sticky Sessions:**
  - Cookie-based session affinity
  - Duration-based or application-controlled
- **Connection Draining:**
  - Graceful shutdown of instances
  - Complete in-flight requests
- **EC2-Classic Support:**
  - Works with EC2-Classic (deprecated)
  - Legacy compatibility

**Limitations:**
- ❌ No path-based routing
- ❌ No host-based routing
- ❌ No HTTP header routing
- ❌ No Lambda targets
- ❌ No containers/IP targets (instances only)
- ❌ No SNI (one SSL cert only)
- ❌ No WebSocket support
- ❌ No HTTP/2 support
- ❌ No static IP addresses
- ❌ Less granular health checks
- ❌ No native authentication

**Performance:**
- Lower performance than ALB/NLB
- Higher latency than modern load balancers
- Less efficient scaling

**Best for:**
- **Legacy applications** (already using CLB)
- **EC2-Classic networks** (deprecated)
- **Simple load balancing** with no advanced features

**⚠️ EXAM TIP:**
- CLB is **LEGACY** - AWS recommends migrating to ALB or NLB
- CLB supports **Layer 4 and Layer 7** but with **LIMITED features**
- CLB **does NOT support**: SNI, path-based routing, host-based routing, Lambda targets, containers
- CLB **only supports EC2 instances** as targets (not IP addresses)
- On the exam: If CLB is an option, there's usually a **better modern alternative** (ALB or NLB)
- Choose CLB only if: "existing CLB" or "EC2-Classic" mentioned
- Keywords: "legacy", "EC2-Classic", "migrate from CLB"

**Migration Path:**
- CLB → ALB (for HTTP/HTTPS applications)
- CLB → NLB (for TCP/UDP applications)
- AWS provides migration tools

**Pricing:**
- Hourly charge: ~$0.025/hour
- Data processed: ~$0.008/GB
- Generally more expensive than ALB/NLB for similar workloads

**Common Exam Scenario:** "Existing Classic Load Balancer needs to support multiple SSL certificates" → Migrate to ALB or NLB (both support SNI)

---

## Decision Tree

```
Need load balancing in AWS?
│
├─ What layer / use case?
│  │
│  ├─ LAYER 7 (Application) - HTTP/HTTPS
│  │  │
│  │  ├─ Need content-based routing (path, host, headers)?
│  │  │  └─ YES → Application Load Balancer (ALB)
│  │  │     - Path-based routing (/api, /images)
│  │  │     - Host-based routing (api.example.com, www.example.com)
│  │  │     - HTTP header routing
│  │  │     - Query string routing
│  │  │     - Lambda targets
│  │  │     - Native authentication
│  │  │
│  │  ├─ Microservices or container-based?
│  │  │  └─ YES → Application Load Balancer (ALB)
│  │  │     - ECS/EKS integration
│  │  │     - Multiple target groups
│  │  │     - Dynamic port mapping
│  │  │
│  │  ├─ Need serverless (Lambda) targets?
│  │  │  └─ YES → Application Load Balancer (ALB)
│  │  │     - ONLY ALB supports Lambda targets
│  │  │
│  │  └─ Simple HTTP load balancing?
│  │     └─ Application Load Balancer (ALB)
│  │        - Modern replacement for CLB
│  │        - Better performance and features
│  │
│  ├─ LAYER 4 (Transport) - TCP/UDP
│  │  │
│  │  ├─ Need extreme performance / ultra-low latency?
│  │  │  └─ YES → Network Load Balancer (NLB)
│  │  │     - Millions of requests per second
│  │  │     - ~100 microsecond latency
│  │  │     - Gaming, IoT, real-time apps
│  │  │
│  │  ├─ Need static IP addresses?
│  │  │  └─ YES → Network Load Balancer (NLB)
│  │  │     - Elastic IP per AZ
│  │  │     - Firewall whitelisting
│  │  │     - Fixed endpoints
│  │  │
│  │  ├─ Need to preserve source IP?
│  │  │  └─ YES → Network Load Balancer (NLB)
│  │  │     - Client IP preserved natively
│  │  │     - No X-Forwarded-For needed
│  │  │
│  │  ├─ PrivateLink / VPC Endpoint Service?
│  │  │  └─ YES → Network Load Balancer (NLB)
│  │  │     - REQUIRED for PrivateLink
│  │  │     - Expose services privately
│  │  │
│  │  ├─ TCP/UDP protocols?
│  │  │  └─ YES → Network Load Balancer (NLB)
│  │  │     - Full TCP/UDP support
│  │  │     - Non-HTTP protocols
│  │  │
│  │  └─ Need both Layer 4 performance AND Layer 7 features?
│  │     └─ YES → NLB with ALB as target
│  │        - Static IP (NLB)
│  │        - Content routing (ALB)
│  │        - Best of both worlds
│  │
│  ├─ LAYER 3 (Network) - Third-party Appliances
│  │  │
│  │  ├─ Need third-party security appliances?
│  │  │  └─ YES → Gateway Load Balancer (GLB)
│  │  │     - Firewalls (Palo Alto, Fortinet, Check Point)
│  │  │     - IDS/IPS systems
│  │  │     - Deep Packet Inspection
│  │  │
│  │  ├─ Centralized traffic inspection required?
│  │  │  └─ YES → Gateway Load Balancer (GLB)
│  │  │     - Inspection VPC pattern
│  │  │     - All traffic flows through appliances
│  │  │     - Multi-VPC architecture
│  │  │
│  │  └─ Compliance requires inline inspection?
│  │     └─ YES → Gateway Load Balancer (GLB)
│  │        - Transparent inspection
│  │        - No application changes needed
│  │
│  └─ LEGACY Application?
│     │
│     ├─ Using EC2-Classic?
│     │  └─ YES → Classic Load Balancer (CLB)
│     │     - Legacy support only
│     │     - Plan migration to ALB/NLB
│     │
│     └─ Existing CLB?
│        └─ Migrate to ALB or NLB
│           - Better performance
│           - More features
│           - Lower cost

├─ What are the requirements?
│  │
│  ├─ STATIC IP REQUIRED
│  │  └─ Network Load Balancer (NLB)
│  │     - ONLY load balancer with static IPs
│  │
│  ├─ CONTENT-BASED ROUTING
│  │  └─ Application Load Balancer (ALB)
│  │     - ONLY load balancer with Layer 7 routing
│  │
│  ├─ LAMBDA TARGETS
│  │  └─ Application Load Balancer (ALB)
│  │     - ONLY load balancer supporting Lambda
│  │
│  ├─ ULTRA-LOW LATENCY
│  │  └─ Network Load Balancer (NLB)
│  │     - ~100 microsecond latency
│  │
│  ├─ PRIVATELINK
│  │  └─ Network Load Balancer (NLB)
│  │     - REQUIRED for PrivateLink
│  │
│  ├─ THIRD-PARTY APPLIANCES
│  │  └─ Gateway Load Balancer (GLB)
│  │     - ONLY load balancer for appliances
│  │
│  └─ WEBSOCKET
│     └─ Application Load Balancer (ALB) or NLB
│        - Both support WebSocket
│        - ALB for HTTP-based, NLB for raw TCP

└─ What protocols?
   │
   ├─ HTTP/HTTPS/gRPC
   │  └─ Application Load Balancer (ALB)
   │
   ├─ TCP/UDP/TLS
   │  └─ Network Load Balancer (NLB)
   │
   ├─ Any IP Protocol
   │  └─ Gateway Load Balancer (GLB)
   │
   └─ Legacy TCP/HTTP
      └─ Migrate CLB to ALB or NLB
```

---

## Common Exam Scenarios

### Scenario 1: Microservices Architecture with Multiple APIs

**Question:** Company has microservices architecture. Need to route `/api/users` to user service, `/api/products` to product service, and `/api/orders` to order service. All services run in ECS containers.

**Answer:** **Application Load Balancer (ALB) with path-based routing**

**Why:**
- ALB supports path-based routing rules
- Can route different paths to different target groups
- Native ECS integration with dynamic port mapping
- Single load balancer for multiple services
- Cost-effective (one ALB vs multiple load balancers)

**Configuration:**
- Create ALB with listener on port 443 (HTTPS)
- Create target groups for each microservice
- Add routing rules:
  - `/api/users*` → User service target group
  - `/api/products*` → Product service target group
  - `/api/orders*` → Order service target group
- Enable container-level health checks

**Wrong Answers:**
- ❌ NLB: Layer 4, no path-based routing
- ❌ Multiple ALBs: More expensive, unnecessary
- ❌ CLB: No path-based routing support
- ❌ GLB: Not for application routing

---

### Scenario 2: High-Performance Gaming Backend

**Question:** Gaming company needs to handle 10 million concurrent players with ultra-low latency. Game uses UDP protocol for real-time communication. Firewall team requires static IP addresses for whitelisting.

**Answer:** **Network Load Balancer (NLB)**

**Why:**
- Extreme performance (millions of requests per second)
- Ultra-low latency (~100 microseconds)
- UDP protocol support
- Static IP addresses (Elastic IPs) for firewall whitelisting
- Preserves source IP for player tracking
- Handles sudden traffic spikes without pre-warming

**Configuration:**
- Create NLB with UDP listener
- Assign Elastic IP to each AZ
- Target groups: EC2 instances running game servers
- Health checks: TCP or HTTP on management port
- Enable cross-zone load balancing for even distribution

**⚠️ EXAM TIP:** "Gaming", "millions of requests", "UDP", "static IP" = NLB

**Wrong Answers:**
- ❌ ALB: Layer 7 only, no UDP support, no static IPs
- ❌ CLB: Lower performance, no static IPs
- ❌ GLB: For appliances, not application load balancing

---

### Scenario 3: Multi-Domain Web Application

**Question:** Company hosts multiple customer websites on same infrastructure: `customer1.example.com`, `customer2.example.com`, `customer3.example.com`. Each customer needs separate SSL certificate and routes to different target groups.

**Answer:** **Application Load Balancer (ALB) with SNI**

**Why:**
- ALB supports SNI (Server Name Indication)
- Multiple SSL certificates on single load balancer
- Host-based routing to different target groups
- Cost-effective (one ALB vs multiple)
- Easy to add new customers

**Configuration:**
- Create ALB with HTTPS listener (port 443)
- Add multiple SSL certificates via ACM
- Create host-based routing rules:
  - Host: `customer1.example.com` → Customer 1 target group
  - Host: `customer2.example.com` → Customer 2 target group
  - Host: `customer3.example.com` → Customer 3 target group
- SNI automatically routes to correct certificate

**⚠️ EXAM TIP:** "Multiple SSL certificates" or "multiple domains" = ALB with SNI (or NLB with SNI)

**Wrong Answers:**
- ❌ CLB: No SNI support (one cert per CLB)
- ❌ Multiple ALBs: Unnecessary and expensive
- ❌ NLB: Works but ALB better for HTTP/HTTPS routing

---

### Scenario 4: Centralized Security Inspection

**Question:** Enterprise requires all VPC traffic (ingress and egress) to flow through Palo Alto firewalls for deep packet inspection. Must support multiple VPCs and scale firewall fleet horizontally.

**Answer:** **Gateway Load Balancer (GLB) with Inspection VPC**

**Why:**
- GLB designed for third-party virtual appliances
- Transparent traffic inspection at Layer 3
- Distributes traffic across firewall fleet
- Scales firewalls horizontally
- Centralized inspection VPC pattern
- GENEVE encapsulation preserves original packets
- High availability across AZs

**Architecture:**
- Create inspection VPC with GLB
- Deploy Palo Alto firewall instances as GLB targets
- Create Gateway Load Balancer Endpoints (GWLBE) in workload VPCs
- Configure route tables to send traffic through GWLBE
- Traffic flow: Workload VPC → GWLBE → GLB → Firewalls → GLB → GWLBE → Destination

**⚠️ EXAM TIP:** "Third-party firewall/IDS/IPS" + "all traffic inspection" = Gateway Load Balancer

**Wrong Answers:**
- ❌ ALB: Layer 7, not for transparent inspection
- ❌ NLB: Could work but not designed for this use case
- ❌ Transit Gateway: Routes traffic but doesn't provide load balancing for appliances

---

### Scenario 5: PrivateLink Service Exposure

**Question:** SaaS company wants to expose their service to customers privately without internet exposure. Customers will access via VPC endpoint in their own VPCs.

**Answer:** **Network Load Balancer (NLB) with VPC Endpoint Service (PrivateLink)**

**Why:**
- NLB is **REQUIRED** for AWS PrivateLink
- Enables private connectivity without internet
- Customers access via VPC endpoint in their VPC
- No VPC peering or Transit Gateway needed
- Secure, scalable, private access
- Provider controls who can connect (accept/reject requests)

**Configuration:**
- Create NLB in service provider VPC
- Create VPC Endpoint Service pointing to NLB
- Set acceptance required (manual approval) or auto-accept
- Customers create VPC endpoints in their VPCs
- Provider approves connection requests
- Traffic flows privately through AWS backbone

**⚠️ EXAM TIP:** "PrivateLink" or "VPC Endpoint Service" = NLB (ONLY option)

**Wrong Answers:**
- ❌ ALB: Cannot be used with PrivateLink
- ❌ GLB: Not for PrivateLink
- ❌ VPC Peering: Different use case, not scalable for many customers

---

### Scenario 6: Serverless API with Lambda

**Question:** Company building serverless API. All requests should be handled by Lambda functions. Need HTTPS endpoint with custom domain and SSL certificate.

**Answer:** **Application Load Balancer (ALB) with Lambda targets**

**Why:**
- ALB is the **ONLY** load balancer supporting Lambda targets
- Provides HTTPS endpoint for Lambda functions
- Can attach custom domain and SSL certificate
- Content-based routing if needed (multiple Lambda functions)
- No need for API Gateway (simpler for some use cases)

**Configuration:**
- Create ALB with HTTPS listener
- Create target group with type: Lambda
- Add Lambda function as target
- Configure SSL certificate via ACM
- Set up DNS (Route 53) to point to ALB

**Alternative:** API Gateway (different use case, more features for APIs)

**⚠️ EXAM TIP:** "Lambda targets" + "load balancer" = ALB (ONLY option)

**Wrong Answers:**
- ❌ NLB: Cannot target Lambda functions
- ❌ CLB: Cannot target Lambda functions
- ❌ GLB: Not for application load balancing

---

### Scenario 7: HTTP to HTTPS Redirect

**Question:** Web application needs to redirect all HTTP traffic to HTTPS. Should be handled at load balancer level without reaching backend servers.

**Answer:** **Application Load Balancer (ALB) with redirect rules**

**Why:**
- ALB supports built-in redirect actions
- No backend processing needed
- HTTP listener with redirect rule to HTTPS
- HTTPS listener routes to backend
- Simple configuration

**Configuration:**
- Create ALB with two listeners:
  - HTTP (port 80): Redirect to HTTPS (port 443)
  - HTTPS (port 443): Forward to target group
- Redirect returns 301 (permanent) or 302 (temporary)
- No targets needed for HTTP listener

**⚠️ EXAM TIP:** "HTTP to HTTPS redirect" at load balancer = ALB redirect action

**Wrong Answers:**
- ❌ NLB: Layer 4, cannot perform HTTP redirects
- ❌ Backend redirect: Less efficient, wastes backend resources
- ❌ CloudFront: Could work but ALB is simpler if you already need LB

---

### Scenario 8: Static IP for Partner Integration

**Question:** Application needs to integrate with partner who requires IP whitelisting. Partner can only whitelist 2 IP addresses. Application runs across 3 AZs with Auto Scaling.

**Answer:** **Network Load Balancer (NLB) with Elastic IPs**

**Why:**
- NLB provides static Elastic IP per AZ
- One Elastic IP for each of 2 AZs (partner whitelists these)
- IPs don't change even as backend instances scale
- Handles Auto Scaling without IP changes
- Ultra-reliable static endpoints

**Configuration:**
- Create NLB in 2 AZs (or 3 AZs, provide 2 IPs to partner)
- Assign Elastic IP to each subnet
- Partner whitelists the Elastic IPs
- Backend instances can scale without affecting IPs

**⚠️ EXAM TIP:** "IP whitelisting" or "static IP" = NLB (ONLY load balancer with static IPs)

**Wrong Answers:**
- ❌ ALB: No static IPs (DNS name changes)
- ❌ Elastic IP on instance: Doesn't work with Auto Scaling/multiple instances
- ❌ NAT Gateway: For outbound, not inbound load balancing

---

### Scenario 9: WebSocket Application

**Question:** Real-time chat application uses WebSocket protocol for persistent connections. Needs load balancing across multiple backend servers with SSL termination.

**Answer:** **Application Load Balancer (ALB)** or **Network Load Balancer (NLB)**

**Why:**
- Both ALB and NLB support WebSocket
- ALB if you need Layer 7 features (routing, authentication)
- NLB if you need extreme performance or static IPs
- Persistent connections maintained through load balancer
- SSL termination offloads encryption from backends

**ALB Configuration:**
- Create ALB with HTTPS listener
- WebSocket upgrade handled automatically
- Can use path-based routing if multiple services
- Session affinity if needed (sticky sessions)

**NLB Configuration:**
- Create NLB with TLS listener
- WebSocket connections maintained
- Lower latency than ALB
- Static IPs if needed

**⚠️ EXAM TIP:** "WebSocket" = ALB (if Layer 7 features needed) or NLB (if performance/static IP needed)

**Wrong Answers:**
- ❌ CLB: No WebSocket support
- ❌ HTTP-only load balancing: WebSocket requires persistent connections

---

### Scenario 10: Blue/Green Deployment

**Question:** Application team wants to perform blue/green deployment. Route 90% traffic to blue environment, 10% to green (testing). Gradually shift traffic to green.

**Answer:** **Application Load Balancer (ALB) with weighted target groups**

**Why:**
- ALB supports weighted target groups
- Can assign weights to different target groups
- Blue: 90%, Green: 10%
- Gradually adjust weights for cutover
- Easy rollback if issues detected

**Configuration:**
- Create two target groups: blue and green
- Create ALB listener rule with weighted targets
- Set weights: blue=90, green=10
- Monitor green environment
- Adjust weights: blue=50, green=50
- Full cutover: blue=0, green=100
- Remove blue environment when ready

**⚠️ EXAM TIP:** "Blue/green deployment" or "traffic weighting" = ALB weighted targets

**Wrong Answers:**
- ❌ Route 53 weighted routing: Works but ALB better for granular control
- ❌ NLB: No weighted routing capability
- ❌ Two separate load balancers: More complex

---

## Key Differences Summary

### ALB vs NLB

| Aspect | ALB | NLB |
|--------|-----|-----|
| **OSI Layer** | Layer 7 (Application) | Layer 4 (Transport) |
| **Protocols** | HTTP, HTTPS, gRPC | TCP, UDP, TLS |
| **Routing** | Content-based (path, host, header, query) | Connection-based (IP/port) |
| **Static IP** | No | Yes (Elastic IP) |
| **Latency** | ~100 milliseconds | ~100 microseconds |
| **Performance** | Thousands of requests/sec | Millions of requests/sec |
| **Target Types** | Instance, IP, Lambda | Instance, IP, ALB |
| **SSL Termination** | Yes | Yes (TLS) |
| **Source IP** | Via X-Forwarded-For header | Preserved natively |
| **WebSocket** | Yes | Yes |
| **PrivateLink** | No | Yes |
| **Use Case** | Web apps, microservices, APIs | Extreme performance, gaming, IoT |
| **When to Use** | Need content routing | Need performance or static IP |

**⚠️ EXAM TIP:**
- Need **content routing** (path, host, header) → **ALB**
- Need **static IP** or **extreme performance** → **NLB**
- HTTP/HTTPS application → **ALB** (default choice)
- TCP/UDP or non-HTTP → **NLB**

---

### ALB vs GLB

| Aspect | ALB | GLB |
|--------|-----|-----|
| **OSI Layer** | Layer 7 (Application) | Layer 3 (Network) + Layer 4 |
| **Purpose** | Load balance applications | Load balance virtual appliances |
| **Routing** | Content-based | Transparent gateway |
| **Use Case** | Web applications | Firewalls, IDS/IPS, DPI |
| **Targets** | Instances, IPs, Lambda | Virtual appliances (instances, IPs) |
| **Traffic Flow** | Terminates connections | Transparent (GENEVE encapsulation) |
| **Inspection** | No | Yes (via appliances) |

**⚠️ EXAM TIP:**
- **ALB** for **application load balancing**
- **GLB** for **security appliance load balancing**

---

### NLB vs GLB

| Aspect | NLB | GLB |
|--------|-----|-----|
| **OSI Layer** | Layer 4 (Transport) | Layer 3 (Network) + Layer 4 |
| **Purpose** | High-performance load balancing | Virtual appliance load balancing |
| **Transparency** | Visible to application (new connection) | Transparent gateway (no connection termination) |
| **Use Case** | Application load balancing | Security inspection |
| **Targets** | Application instances/IPs/ALB | Virtual appliances |
| **PrivateLink** | Yes | No |

**⚠️ EXAM TIP:**
- **NLB** for **application load balancing** with performance needs
- **GLB** for **appliance-based traffic inspection**

---

### CLB vs Modern Load Balancers (ALB/NLB)

| Feature | CLB | ALB/NLB |
|---------|-----|---------|
| **Status** | Legacy | Modern, recommended |
| **Features** | Limited | Rich feature set |
| **SNI** | No | Yes |
| **Target Types** | Instance only | Instance, IP, Lambda (ALB) |
| **Path Routing** | No | Yes (ALB) |
| **Performance** | Lower | Higher |
| **Cost** | Generally higher | Generally lower |
| **Recommendation** | Migrate away | Use for new apps |

**⚠️ EXAM TIP:** CLB is **legacy** - always prefer ALB or NLB unless question specifically says "existing CLB"

---

### Feature Comparison Matrix

| Feature | ALB | NLB | GLB | CLB |
|---------|-----|-----|-----|-----|
| **Path-based Routing** | ✓ | ✗ | ✗ | ✗ |
| **Host-based Routing** | ✓ | ✗ | ✗ | ✗ |
| **HTTP Header Routing** | ✓ | ✗ | ✗ | ✗ |
| **Query String Routing** | ✓ | ✗ | ✗ | ✗ |
| **Lambda Targets** | ✓ | ✗ | ✗ | ✗ |
| **Static IP** | ✗ | ✓ | ✗ | ✗ |
| **Preserve Source IP** | Via header | ✓ | ✓ | Via header |
| **SNI (Multiple Certs)** | ✓ | ✓ | ✗ | ✗ |
| **WebSocket** | ✓ | ✓ | ✗ | ✗ |
| **HTTP/2** | ✓ | ✗ | ✗ | ✗ |
| **gRPC** | ✓ | ✓ | ✗ | ✗ |
| **UDP Support** | ✗ | ✓ | ✓ | ✗ |
| **PrivateLink** | ✗ | ✓ | ✗ | ✗ |
| **Native Authentication** | ✓ | ✗ | ✗ | ✗ |
| **Redirect Actions** | ✓ | ✗ | ✗ | ✗ |
| **Fixed Response** | ✓ | ✗ | ✗ | ✗ |
| **Weighted Targets** | ✓ | ✗ | ✗ | ✗ |
| **Cross-Zone LB** | Always (free) | Optional (paid) | Optional | Optional |
| **IP as Target** | ✓ | ✓ | ✓ | ✗ |
| **ALB as Target** | ✗ | ✓ | ✗ | ✗ |

---

## Exam Strategy - Keywords to Watch For

### Service Selection by Keywords

| Keywords in Question | Likely Answer |
|---------------------|---------------|
| "Path-based routing", "microservices", "container", "ECS", "EKS" | **ALB** |
| "Host-based routing", "multiple domains", "multiple SSL certificates" | **ALB** (or NLB with SNI) |
| "Lambda function", "serverless", "Lambda target" | **ALB** |
| "HTTP header routing", "query string routing", "A/B testing" | **ALB** |
| "Static IP", "Elastic IP", "IP whitelisting" | **NLB** |
| "Millions of requests", "ultra-low latency", "microsecond latency" | **NLB** |
| "Gaming", "IoT", "real-time", "extreme performance" | **NLB** |
| "PrivateLink", "VPC Endpoint Service", "private connectivity" | **NLB** |
| "TCP", "UDP", "non-HTTP protocol" | **NLB** |
| "Preserve source IP", "client IP address" | **NLB** |
| "Firewall", "IDS/IPS", "third-party appliance", "Palo Alto", "Fortinet" | **GLB** |
| "Deep packet inspection", "DPI", "centralized inspection" | **GLB** |
| "GENEVE", "security appliance", "inspection VPC" | **GLB** |
| "Legacy", "EC2-Classic", "migrate from Classic Load Balancer" | **CLB** (migrate to ALB/NLB) |
| "Existing Classic Load Balancer" | **Migrate to ALB or NLB** |

---

### Protocol Keywords

| Protocol | Service Options |
|----------|-----------------|
| **HTTP/HTTPS** | ALB (preferred), NLB (with TLS), CLB (legacy) |
| **TCP** | NLB (preferred), CLB (legacy) |
| **UDP** | NLB, GLB (for appliances) |
| **TLS** | NLB, ALB (as HTTPS) |
| **gRPC** | ALB, NLB |
| **WebSocket** | ALB, NLB |
| **Any IP protocol** | GLB |

---

### Use Case Keywords

**Web Applications:**
- "Web application", "website" → **ALB**
- "Multiple microservices" → **ALB** (path-based routing)
- "API routing" → **ALB**
- "Content delivery" → **ALB** (or CloudFront + ALB)

**High Performance:**
- "Millions of requests per second" → **NLB**
- "Ultra-low latency" → **NLB**
- "Gaming server" → **NLB**
- "Financial trading" → **NLB**
- "IoT devices" → **NLB**

**Security:**
- "Firewall" → **GLB**
- "Intrusion detection" → **GLB**
- "Deep packet inspection" → **GLB**
- "Compliance inspection" → **GLB**
- "Third-party security" → **GLB**

**Modern Architecture:**
- "Containers (ECS/EKS)" → **ALB**
- "Serverless (Lambda)" → **ALB**
- "Microservices" → **ALB**
- "Service mesh" → **ALB** or **NLB** (depending on needs)

**Connectivity:**
- "PrivateLink" → **NLB**
- "VPC Endpoint Service" → **NLB**
- "Private service exposure" → **NLB**

**Legacy:**
- "EC2-Classic" → **CLB**
- "Existing Classic Load Balancer" → **Migrate to ALB/NLB**

---

### Routing Requirements

**Content-based Routing:**
- Path-based (URL path) → **ALB**
- Host-based (domain/subdomain) → **ALB**
- HTTP header → **ALB**
- Query string → **ALB**
- Source IP (CIDR) → **ALB**

**Connection-based Routing:**
- IP/Port only → **NLB**
- No content inspection → **NLB**

**Transparent Routing:**
- All traffic through appliances → **GLB**

---

### Performance Requirements

| Requirement | Service |
|-------------|---------|
| **Latency ~100 ms** | ALB |
| **Latency ~100 μs** | NLB |
| **Thousands of RPS** | ALB |
| **Millions of RPS** | NLB |
| **Auto-scaling performance** | ALB, NLB |
| **Pre-warming not needed** | ALB, NLB (GLB) |

**⚠️ EXAM TIP:**
- **Microsecond latency** = NLB
- **Millisecond latency** = ALB (acceptable)
- **Millions of requests** = NLB

---

## Common Misconceptions

### ❌ "NLB is always better because it's faster"
**✓ Reality:** NLB is faster but **lacks Layer 7 features**. Use ALB for HTTP/HTTPS applications unless performance is critical or static IP needed. ALB's ~100ms latency is acceptable for most web applications.

### ❌ "ALB can't handle high traffic"
**✓ Reality:** ALB can handle **very high traffic** and auto-scales. It can handle thousands to tens of thousands of requests per second. Use NLB only when you need **millions** of requests per second or microsecond latency.

### ❌ "You can't use multiple load balancers together"
**✓ Reality:** You can chain load balancers:
- **NLB → ALB**: Get static IP (NLB) + content routing (ALB)
- **ALB → NLB**: Less common but possible
- Multiple load balancers for different tiers

### ❌ "GLB is a replacement for ALB/NLB"
**✓ Reality:** GLB is **NOT for application load balancing**. It's specifically for **virtual appliances** (firewalls, IDS/IPS). You still need ALB/NLB for your applications.

### ❌ "CLB is cheaper than ALB/NLB"
**✓ Reality:** CLB is generally **more expensive** than ALB/NLB for equivalent workloads and provides **fewer features**. Always migrate to modern load balancers.

### ❌ "Static IP means I should always use NLB"
**✓ Reality:** Only use NLB if you **truly need static IPs** (IP whitelisting, partner requirements). For most applications, ALB's DNS name is sufficient.

### ❌ "Cross-zone load balancing is always free"
**✓ Reality:**
- **ALB**: Cross-zone always enabled, **NO CHARGE**
- **NLB**: Cross-zone optional, **DATA TRANSFER CHARGES**
- **CLB**: Cross-zone optional, **NO CHARGE**
- **GLB**: Cross-zone optional, **DATA TRANSFER CHARGES**

### ❌ "NLB doesn't support SSL/TLS"
**✓ Reality:** NLB **DOES support TLS termination** (since 2019). Can offload TLS and supports SNI for multiple certificates.

### ❌ "ALB can only target EC2 instances"
**✓ Reality:** ALB can target:
- EC2 instances
- IP addresses (including on-premises)
- Lambda functions
- Containers (ECS/EKS)

### ❌ "You need API Gateway for Lambda functions"
**✓ Reality:** ALB can **directly target Lambda** functions. Use API Gateway for advanced API features (throttling, caching, API keys), use ALB for simpler HTTP→Lambda routing.

---

## Cost Implications

### Cost Comparison (Approximate)

| Load Balancer | Hourly Cost | Capacity Units | Total Monthly (Small App) |
|---------------|-------------|----------------|---------------------------|
| **ALB** | $0.0225/hour | LCU: $0.008/hour | ~$22/month + LCU |
| **NLB** | $0.0225/hour | NLCU: $0.006/hour | ~$22/month + NLCU |
| **GLB** | $0.0125/hour | GLCU: $0.004/hour | ~$12/month + GLCU + GWLBE |
| **CLB** | $0.025/hour | Data: $0.008/GB | ~$25/month + data |

**GWLBE (Gateway Load Balancer Endpoint):** ~$0.01/hour = ~$7.50/month per endpoint

### Capacity Units Explained

**ALB - LCU (Load Balancer Capacity Unit):**
- Billed on maximum of 4 dimensions:
  1. New connections/sec: 25 per LCU
  2. Active connections: 3,000 per LCU
  3. Bandwidth: 1 GB/hour per LCU
  4. Rule evaluations: 1,000 per LCU
- Example: 100 new conn/sec = 4 LCU, 10,000 active = 3.3 LCU, 5 GB/hour = 5 LCU → Billed for 5 LCU

**NLB - NLCU (Network Load Balancer Capacity Unit):**
- Billed on maximum of 3 dimensions:
  1. New connections/sec: 800 per NLCU
  2. Active connections: 100,000 per NLCU
  3. Bandwidth: 1 GB/hour per NLCU
- Example: 5,000 new conn/sec = 6.25 NLCU, 200,000 active = 2 NLCU, 10 GB/hour = 10 NLCU → Billed for 10 NLCU

**GLB - GLCU (Gateway Load Balancer Capacity Unit):**
- Billed on maximum of 3 dimensions:
  1. New connections/sec: 600 per GLCU
  2. Active connections: 60,000 per GLCU
  3. Bandwidth: 1 GB/hour per GLCU

### Cost Optimization Strategies

**ALB:**
- ✅ Consolidate multiple applications on one ALB (path/host routing)
- ✅ Use rules efficiently (each rule evaluation counts)
- ✅ Monitor LCU usage via CloudWatch
- ✅ Delete unused load balancers
- ✅ Use target group weighting for blue/green instead of multiple LBs

**NLB:**
- ✅ Consider cross-zone load balancing costs (data transfer charges)
- ✅ Disable cross-zone if traffic is zone-balanced naturally
- ✅ Monitor NLCU usage
- ✅ Use connection multiplexing where possible
- ✅ NLB can be cheaper than ALB for very high connection counts

**GLB:**
- ✅ Minimize number of Gateway Load Balancer Endpoints
- ✅ Centralize inspection (one GLB for multiple VPCs)
- ✅ Right-size appliance fleet
- ✅ Use inspection only where required (not all traffic)

**CLB:**
- ✅ **Migrate to ALB or NLB** - usually cheaper and better performance
- ✅ Data processing charges make CLB expensive at scale

### Cost Scenarios

**Scenario 1: Multi-tenant SaaS with 100 customers**
- **Option 1:** 100 ALBs (one per customer) = $2,200/month + LCU
- **Option 2:** 1 ALB with host-based routing = $22/month + LCU
- **Winner:** Single ALB with routing (99% cost reduction)

**Scenario 2: High-volume API (1 million req/sec)**
- **ALB:** Not suitable (performance)
- **NLB:** $22/month + NLCU for millions of connections
- **Winner:** NLB (only option that scales)

**Scenario 3: Centralized firewall for 10 VPCs**
- **Option 1:** Firewall per VPC = 10x appliance costs
- **Option 2:** GLB + 10 GWLBEs = $12/month (GLB) + $75/month (10 endpoints) + appliance costs
- **Winner:** Centralized GLB (shared appliance costs)

**⚠️ EXAM TIP:**
- "Minimize costs" + "multiple applications" = Single ALB with routing (not multiple load balancers)
- "Minimize costs" + "simple workload" = ALB or NLB (not CLB)
- Cross-zone load balancing: Free on ALB, charged on NLB/GLB

---

## Advanced Features Deep Dive

### 1. ALB: Native Authentication

ALB can authenticate users before routing to targets:

**Cognito User Pools:**
- Managed user directory
- Social identity providers (Google, Facebook, Amazon)
- Built-in sign-up/sign-in
- User sessions managed by ALB

**OIDC (OpenID Connect):**
- Enterprise identity providers (Okta, Auth0, Azure AD)
- Standards-based authentication
- ALB validates tokens

**Flow:**
1. User accesses ALB
2. ALB redirects to identity provider
3. User authenticates
4. Provider returns to ALB with token
5. ALB validates and creates session
6. ALB routes to backend with user info in headers

**Use Cases:**
- Protect entire application at load balancer
- No authentication code in application
- Centralized access control

**⚠️ EXAM TIP:** "Authenticate users" + "no backend changes" = ALB native authentication

---

### 2. NLB: Preserve Source IP

**How it works:**
- NLB operates at Layer 4 (connection level)
- Does NOT change source IP in packet
- Targets see actual client IP address
- No headers needed (unlike ALB's X-Forwarded-For)

**Important for:**
- Logging actual client IPs
- Security rules based on source IP
- Compliance requirements
- Geolocation
- Rate limiting per client

**Configuration:**
- Enable "preserve client IP" in target group settings
- Default: Enabled for instance targets, disabled for IP targets
- Security groups must allow client IP ranges (not just LB)

**⚠️ EXAM TIP:** "Need actual client IP" or "source IP preservation" = NLB (native) or ALB (via headers)

---

### 3. ALB: Fixed Response and Redirects

**Fixed Response:**
- Return static content without backend
- HTTP status codes: 200, 400, 404, 500, etc.
- Custom response body
- Custom headers

**Use Cases:**
- Maintenance pages
- Error pages
- Simple status endpoints
- Blocked requests

**Example:**
- Rule: IF path = `/maintenance` THEN return 503 with custom HTML

**Redirects:**
- HTTP to HTTPS
- Domain redirects (old.com → new.com)
- Path redirects (/old → /new)
- Status codes: 301 (permanent), 302 (temporary)

**Example:**
- Rule: IF protocol = HTTP THEN redirect to HTTPS (port 443)

**⚠️ EXAM TIP:** "Redirect HTTP to HTTPS" or "maintenance page" = ALB redirect/fixed response

---

### 4. NLB: TLS Termination

**Features:**
- Offload TLS processing from targets
- Centralized certificate management via ACM
- SNI support (multiple certificates)
- Security policy selection (TLS versions, ciphers)

**How it works:**
- Client connects to NLB with TLS
- NLB terminates TLS connection
- NLB forwards to target (TCP or TLS)

**Options:**
- **TLS termination:** NLB→Target is TCP (unencrypted)
- **TLS passthrough:** NLB→Target is TLS (end-to-end encryption)

**⚠️ EXAM TIP:** NLB supports **both** TLS termination and passthrough

---

### 5. GLB: GENEVE Encapsulation

**What is GENEVE:**
- Generic Network Virtualization Encapsulation
- Port 6081
- Preserves original packet for inspection
- Metadata for routing decisions

**How it works:**
1. Traffic arrives at GWLBE
2. GWLBE encapsulates in GENEVE tunnel
3. Sends to GLB
4. GLB load balances to appliance
5. Appliance inspects/processes
6. Returns to GLB
7. GLB sends back to GWLBE
8. GWLBE decapsulates and forwards

**Appliance Requirements:**
- Must support GENEVE protocol
- Available in AWS Marketplace
- Palo Alto, Fortinet, Check Point, Cisco, etc.

**⚠️ EXAM TIP:** GLB uses **GENEVE protocol** on port 6081

---

### 6. Sticky Sessions (Session Affinity)

**ALB:**
- Cookie-based sticky sessions
- Duration: 1 second to 7 days
- Application-generated cookie or load balancer-generated cookie
- Cookie name: AWSALB (load balancer), custom (application)

**NLB:**
- Flow hash-based sticky sessions
- Based on 5-tuple: source IP, source port, destination IP, destination port, protocol
- Duration: 1 second to 7 days
- More deterministic than ALB cookies

**CLB:**
- Cookie-based (HTTP) or source IP (TCP)
- Similar to ALB but less flexible

**When to Use:**
- Stateful applications (session data in memory)
- Shopping carts
- User sessions not stored externally

**When NOT to Use:**
- Stateless applications
- Session data in external store (Redis, DynamoDB)
- Can cause uneven distribution

**⚠️ EXAM TIP:**
- "Session affinity" or "sticky sessions" = Enable on ALB or NLB
- ALB = cookie-based, NLB = flow hash-based

---

### 7. Cross-Zone Load Balancing

**How it works:**
- Distributes traffic evenly across ALL targets in ALL enabled AZs
- Without: Traffic distributed only to targets in same AZ as LB node

**Example:**
- AZ-A: 2 targets
- AZ-B: 8 targets
- **With cross-zone:** Each target gets 10% traffic (1/10)
- **Without cross-zone:** AZ-A targets get 25% each, AZ-B targets get 6.25% each

**ALB:**
- Always enabled
- Cannot be disabled
- **No extra charges**

**NLB:**
- Optional (disabled by default)
- **Cross-zone data transfer charges apply**
- Enable for even distribution

**GLB:**
- Optional
- Cross-zone data transfer charges apply

**CLB:**
- Optional
- No extra charges (included)

**⚠️ EXAM TIP:**
- **ALB**: Cross-zone always on, free
- **NLB**: Cross-zone optional, **data transfer charges**
- "Even distribution across AZs" = Enable cross-zone load balancing

---

### 8. Health Checks

**ALB:**
- Protocol: HTTP, HTTPS
- Path: Custom (e.g., `/health`, `/api/status`)
- Success codes: 200-299 (configurable)
- Advanced settings: Timeout, interval, thresholds
- More sophisticated than NLB

**NLB:**
- Protocol: TCP, HTTP, HTTPS
- TCP: Simple connection test
- HTTP/HTTPS: Can specify path and success codes
- Fast failover (10-second intervals)

**GLB:**
- Protocol: TCP, HTTP, HTTPS
- Checks health of virtual appliances
- Removes unhealthy appliances from rotation

**CLB:**
- Protocol: TCP, SSL, HTTP, HTTPS
- Less configurable than modern load balancers

**Best Practices:**
- Use dedicated health check endpoint
- Check dependencies (database, cache)
- Return 200 only when truly healthy
- Monitor failed health checks (CloudWatch)

**⚠️ EXAM TIP:**
- ALB: HTTP/HTTPS health checks (application-level)
- NLB: TCP, HTTP, HTTPS (connection-level or application-level)

---

### 9. Connection Draining / Deregistration Delay

**What it does:**
- Allows in-flight requests to complete before removing target
- Prevents connection errors during scaling or deployments
- Configurable timeout

**How it works:**
1. Target marked for deregistration (unhealthy or removed)
2. Load balancer stops sending **new** requests to target
3. Existing connections allowed to complete
4. After timeout or all connections closed, target fully deregistered

**Configuration:**
- Timeout: 0-3600 seconds
- Default: 300 seconds (5 minutes)
- 0 = immediate deregistration

**All Load Balancers:**
- ALB: Deregistration delay
- NLB: Deregistration delay
- GLB: Deregistration delay
- CLB: Connection draining

**⚠️ EXAM TIP:** "Graceful shutdown" or "complete in-flight requests" = Enable deregistration delay

---

### 10. Target Group Configuration

**ALB Target Groups:**
- Target type: instance, IP, Lambda
- Protocol: HTTP, HTTPS
- Port: Can be different per target
- Health check: Custom path
- Attributes: Deregistration delay, slow start, stickiness

**NLB Target Groups:**
- Target type: instance, IP, ALB
- Protocol: TCP, UDP, TCP_UDP, TLS
- Port: Can be different per target
- Health check: TCP, HTTP, HTTPS
- Attributes: Deregistration delay, preserve client IP, proxy protocol

**GLB Target Groups:**
- Target type: instance, IP
- Protocol: GENEVE (fixed)
- Health check: TCP, HTTP, HTTPS

**⚠️ EXAM TIP:**
- Only ALB supports **Lambda** targets
- Only NLB supports **ALB** as target (chaining)
- IP targets allow on-premises servers, other VPCs

---

## Decision Matrix for Exam

### Quick Decision Table

| Requirement | Load Balancer |
|-------------|---------------|
| Path-based routing | ALB |
| Host-based routing | ALB |
| Lambda targets | ALB (only option) |
| HTTP/HTTPS web app | ALB (default) |
| gRPC | ALB or NLB |
| Static IP required | NLB (only option) |
| PrivateLink | NLB (only option) |
| TCP/UDP protocols | NLB |
| Millions of RPS | NLB |
| Ultra-low latency (microseconds) | NLB |
| Preserve source IP (native) | NLB |
| Third-party firewall | GLB (only option) |
| IDS/IPS systems | GLB |
| Deep packet inspection | GLB |
| Centralized security inspection | GLB |
| WebSocket | ALB or NLB |
| Multiple SSL certificates | ALB or NLB (SNI) |
| Native authentication | ALB (only option) |
| Redirect HTTP→HTTPS | ALB |
| Weighted target groups | ALB |
| Legacy application | Migrate CLB to ALB/NLB |
| EC2-Classic | CLB (legacy only) |

---

## Integration Patterns

### Pattern 1: Internet-facing Web Application

```
Internet
   ↓
Route 53 (DNS)
   ↓
ALB (HTTPS)
   ├─ SSL Termination
   ├─ Path-based routing
   └─ Multiple target groups
       ↓
   ┌───┴───┬───────┐
   ↓       ↓       ↓
 Web    API    Admin
(ECS)  (ECS)   (EC2)
```

**Why:** ALB provides content routing, SSL termination, container support

---

### Pattern 2: High-Performance Gaming Backend

```
Internet
   ↓
Route 53 (DNS)
   ↓
NLB (static IPs)
   ├─ UDP listeners
   ├─ Millions of connections
   └─ Ultra-low latency
       ↓
   ┌───┴───┬───────┐
   ↓       ↓       ↓
Game    Game    Game
Server  Server  Server
(c5.large)
```

**Why:** NLB provides performance, static IPs, UDP support

---

### Pattern 3: Multi-VPC Security Inspection

```
Workload VPC A              Inspection VPC           Workload VPC B
     ↓                           ↓                         ↓
  GWLBE ──────────────→  GLB ←──────────────── GWLBE
                          ↓
                    ┌─────┴─────┐
                    ↓           ↓
              Firewall-1  Firewall-2
           (Palo Alto instances)
```

**Why:** GLB enables centralized inspection for multiple VPCs

---

### Pattern 4: Static IP + Content Routing (NLB → ALB)

```
Internet
   ↓
Route 53
   ↓
NLB (static IPs)
   ├─ TLS termination
   └─ Elastic IPs
       ↓
      ALB (target of NLB)
       ├─ Path-based routing
       ├─ Host-based routing
       └─ Multiple certificates
           ↓
        Targets
```

**Why:** Combines NLB static IPs with ALB content routing

**Use Case:** Partner requires IP whitelisting + need microservices routing

---

### Pattern 5: Serverless API with Authentication

```
Internet
   ↓
Route 53
   ↓
ALB (HTTPS)
   ├─ Cognito authentication
   ├─ Path routing
   └─ Lambda targets
       ↓
   ┌───┴───┬───────┐
   ↓       ↓       ↓
Lambda  Lambda  Lambda
(/users) (/products) (/orders)
```

**Why:** ALB provides authentication, Lambda targets, path routing

---

### Pattern 6: PrivateLink Service Exposure

```
Service Provider VPC              Customer VPC
       ↓                                ↓
     NLB ←────────────────→  VPC Endpoint
       ↓                          (Interface)
   Application                        ↓
    (private)                   Customer Apps
                              (private access)
```

**Why:** NLB required for PrivateLink, enables private connectivity

---

### Pattern 7: Blue/Green Deployment

```
ALB
 ├─ Listener Rule (weighted)
 │   ├─ Blue Target Group (90%)
 │   │   └─ Blue Environment
 │   └─ Green Target Group (10%)
 │       └─ Green Environment
 │
 └─ Shift weights over time
     → Blue (50%) / Green (50%)
     → Blue (0%) / Green (100%)
```

**Why:** ALB weighted target groups enable gradual traffic shifting

---

## Best Practices for the Exam

### 1. Start with OSI Layer

**Process:**
1. Identify what layer the application operates on
2. Layer 7 (HTTP/HTTPS) → Consider ALB first
3. Layer 4 (TCP/UDP) → Consider NLB
4. Layer 3 (IP/appliances) → Consider GLB
5. Eliminate CLB unless explicitly legacy

### 2. Check for Unique Requirements

**Unique to ALB:**
- Lambda targets
- Content-based routing
- Native authentication
- HTTP/2, gRPC
- Fixed response/redirect

**Unique to NLB:**
- Static IP addresses
- PrivateLink
- Preserve source IP (native)
- Ultra-low latency

**Unique to GLB:**
- Third-party appliances
- GENEVE protocol
- Transparent inspection

### 3. Performance Indicators

- "Thousands of requests" → ALB sufficient
- "Millions of requests" → NLB required
- "Microsecond latency" → NLB
- "Millisecond latency" → ALB acceptable

### 4. Protocol Requirements

- HTTP/HTTPS only → ALB (preferred)
- TCP/UDP → NLB
- Mixed protocols → NLB (more flexible)
- Any IP protocol → GLB

### 5. Cost Optimization

- Multiple apps → Single ALB with routing (not multiple LBs)
- Simple workload → Modern LB (ALB/NLB), not CLB
- Cross-zone on NLB → Evaluate if needed (data transfer costs)

### 6. Target Types

- Lambda functions → ALB (only option)
- On-premises servers → ALB or NLB with IP targets
- Containers → ALB (preferred)
- EC2 instances → Any (ALB for HTTP, NLB for TCP)

### 7. Security Requirements

- SSL termination → ALB or NLB
- Multiple certificates → ALB or NLB (SNI)
- Authentication → ALB (native)
- Firewall/IDS/IPS → GLB

### 8. Connectivity Patterns

- Internet-facing → ALB or NLB
- Internal → ALB or NLB
- PrivateLink → NLB (only option)
- VPC Endpoint Service → NLB

### 9. Simplicity Principle

- AWS prefers **modern** solutions
- ALB for HTTP/HTTPS (default)
- NLB when specific features needed
- GLB for appliances only
- Avoid CLB (always migrate if possible)

### 10. Common Patterns

- Microservices → ALB (path routing)
- Gaming → NLB (performance)
- Serverless → ALB (Lambda targets)
- Security inspection → GLB (appliances)
- PrivateLink → NLB (requirement)

---

## Real-World Scenarios

### Scenario: E-commerce Platform

**Requirements:**
- Product catalog (read-heavy)
- User authentication
- Payment processing (PCI compliance)
- Mobile app + web app
- 100,000 concurrent users

**Solution:**
```
CloudFront
   ↓
ALB (HTTPS)
   ├─ Cognito authentication
   ├─ /api/products → Product service
   ├─ /api/users → User service
   └─ /api/payments → Payment service (via NLB for PCI)
       ↓
    Microservices (ECS)
```

**Why:**
- ALB for path-based routing to microservices
- Cognito for authentication
- Separate NLB for payment service (PCI compliance, static IP for audit)

---

### Scenario: Multi-Tenant SaaS

**Requirements:**
- 1,000 customers
- Separate subdomain per customer
- Different SSL certificate per customer
- Cost-effective

**Solution:**
```
Route 53
   ├─ customer1.saas.com → ALB
   ├─ customer2.saas.com → ALB (same ALB)
   └─ customer3.saas.com → ALB (same ALB)
       ↓
      ALB (SNI for multiple certs)
       ├─ Host-based routing
       └─ Different target groups per customer
```

**Why:**
- Single ALB with SNI (1,000 certificates)
- Host-based routing to customer-specific target groups
- Much cheaper than 1,000 separate load balancers

---

### Scenario: Real-Time Trading Platform

**Requirements:**
- Ultra-low latency (<1ms)
- Millions of connections
- TCP protocol
- Source IP logging required

**Solution:**
```
Internet
   ↓
NLB (static IPs)
   ├─ TCP listeners
   ├─ Preserve source IP
   └─ Microsecond latency
       ↓
   Trading servers
   (c5n.18xlarge)
```

**Why:**
- NLB for ultra-low latency
- Preserves source IP for compliance/logging
- Handles millions of connections
- Static IPs for partner connectivity

---

### Scenario: Enterprise Security Architecture

**Requirements:**
- Inspect all traffic (ingress/egress)
- Palo Alto next-gen firewalls
- 50 VPCs (workloads)
- Centralized management

**Solution:**
```
50 Workload VPCs
   ├─ GWLBE in each VPC
   │   └─ Route all traffic through GWLBE
   └─ All traffic to Inspection VPC
       ↓
   Inspection VPC
       ↓
      GLB
       ├─ Distributes to firewall fleet
       └─ Auto-scales firewalls
           ↓
      Palo Alto Firewalls (10 instances)
```

**Why:**
- GLB for firewall load balancing
- GWLBE in each workload VPC
- Centralized inspection (shared firewall costs)
- Transparent to applications

---

## Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│              LOAD BALANCER SELECTOR                             │
└─────────────────────────────────────────────────────────────────┘

BY OSI LAYER:
├─ Layer 7 (Application) → ALB
├─ Layer 4 (Transport) → NLB
└─ Layer 3 (Network) → GLB

BY PROTOCOL:
├─ HTTP/HTTPS → ALB (preferred)
├─ TCP/UDP → NLB
├─ gRPC → ALB or NLB
├─ WebSocket → ALB or NLB
└─ Any IP → GLB

BY USE CASE:
├─ Web applications → ALB
├─ Microservices → ALB
├─ Containers → ALB
├─ Serverless (Lambda) → ALB (only option)
├─ Gaming → NLB
├─ IoT → NLB
├─ Real-time apps → NLB
├─ PrivateLink → NLB (only option)
├─ Firewalls/IDS/IPS → GLB (only option)
└─ Legacy → Migrate CLB

BY REQUIREMENT:
├─ Content routing → ALB (only option)
├─ Static IP → NLB (only option)
├─ Ultra-low latency → NLB
├─ Millions of RPS → NLB
├─ Authentication → ALB (native)
├─ Lambda targets → ALB (only option)
├─ Virtual appliances → GLB (only option)
└─ Preserve source IP → NLB (native)

┌─────────────────────────────────────────────────────────────────┐
│                    EXAM DECISION MATRIX                         │
└─────────────────────────────────────────────────────────────────┘

Question Says...                      → Answer
──────────────────────────────────────────────────────────────
"Path-based routing"                  → ALB
"Microservices"                       → ALB
"Lambda function target"              → ALB (only option)
"Static IP", "Elastic IP"             → NLB (only option)
"PrivateLink"                         → NLB (only option)
"Millions of requests"                → NLB
"Ultra-low latency", "microsecond"    → NLB
"Firewall", "IDS/IPS"                 → GLB
"Third-party appliance"               → GLB
"Multiple SSL certificates"           → ALB or NLB (SNI)
"HTTP to HTTPS redirect"              → ALB
"WebSocket"                           → ALB or NLB
"Preserve source IP"                  → NLB (native)
"Authenticate users"                  → ALB (native auth)
"Gaming", "IoT"                       → NLB
"EC2-Classic"                         → CLB (migrate)
"Existing Classic Load Balancer"      → Migrate to ALB/NLB

┌─────────────────────────────────────────────────────────────────┐
│                    FEATURE COMPARISON                           │
└─────────────────────────────────────────────────────────────────┘

Feature                    │ ALB │ NLB │ GLB │ CLB
───────────────────────────┼─────┼─────┼─────┼─────
OSI Layer                  │  7  │  4  │ 3+4 │ 4+7
Path-based Routing         │  ✓  │  ✗  │  ✗  │  ✗
Host-based Routing         │  ✓  │  ✗  │  ✗  │  ✗
Lambda Targets             │  ✓  │  ✗  │  ✗  │  ✗
Static IP                  │  ✗  │  ✓  │  ✗  │  ✗
PrivateLink                │  ✗  │  ✓  │  ✗  │  ✗
UDP Support                │  ✗  │  ✓  │  ✓  │  ✗
SNI (Multi-cert)           │  ✓  │  ✓  │  ✗  │  ✗
WebSocket                  │  ✓  │  ✓  │  ✗  │  ✗
Native Authentication      │  ✓  │  ✗  │  ✗  │  ✗
Preserve Source IP         │ Hdr │  ✓  │  ✓  │ Hdr
HTTP/2                     │  ✓  │  ✗  │  ✗  │  ✗
Latency                    │~100│~100│ Low │High
                           │ ms │ μs  │     │
Throughput                 │High │Very│High │ Low
                           │     │High│     │
Cross-Zone (free)          │  ✓  │  ✗  │  ✗  │  ✓
Recommended                │  ✓  │  ✓  │  ✓  │  ✗

┌─────────────────────────────────────────────────────────────────┐
│                 PRICING QUICK REFERENCE                         │
└─────────────────────────────────────────────────────────────────┘

Load Balancer │ Hourly  │ Capacity Unit │ Notes
──────────────┼─────────┼───────────────┼──────────────────
ALB           │ $0.0225 │ LCU: $0.008   │ Cross-zone free
NLB           │ $0.0225 │ NLCU: $0.006  │ Cross-zone paid
GLB           │ $0.0125 │ GLCU: $0.004  │ + GWLBE cost
CLB           │ $0.025  │ Data: $0.008/GB│ Legacy (migrate)

Cost Optimization:
├─ Multiple apps → 1 ALB with routing (not multiple ALBs)
├─ Simple workload → ALB/NLB (not CLB)
└─ Cross-zone on NLB → Evaluate need (data transfer cost)

┌─────────────────────────────────────────────────────────────────┐
│                    PROTOCOL SUPPORT                             │
└─────────────────────────────────────────────────────────────────┘

Protocol      │ ALB │ NLB │ GLB │ CLB
──────────────┼─────┼─────┼─────┼─────
HTTP          │  ✓  │  ✗  │  ✗  │  ✓
HTTPS         │  ✓  │  ✗  │  ✗  │  ✓
TCP           │  ✗  │  ✓  │  ✗  │  ✓
UDP           │  ✗  │  ✓  │  ✓  │  ✗
TLS           │HTTPS│  ✓  │  ✗  │ SSL
gRPC          │  ✓  │  ✓  │  ✗  │  ✗
WebSocket     │  ✓  │  ✓  │  ✗  │  ✗
GENEVE        │  ✗  │  ✗  │  ✓  │  ✗

┌─────────────────────────────────────────────────────────────────┐
│                    TARGET TYPES                                 │
└─────────────────────────────────────────────────────────────────┘

Target Type   │ ALB │ NLB │ GLB │ CLB
──────────────┼─────┼─────┼─────┼─────
Instance      │  ✓  │  ✓  │  ✓  │  ✓
IP Address    │  ✓  │  ✓  │  ✓  │  ✗
Lambda        │  ✓  │  ✗  │  ✗  │  ✗
ALB           │  ✗  │  ✓  │  ✗  │  ✗
```

---

## Last-Minute Review Questions

**Q: When do you choose ALB over NLB?**
A: HTTP/HTTPS applications needing content-based routing (path, host, header) or Lambda targets.

**Q: When do you choose NLB over ALB?**
A: Need static IP, ultra-low latency, millions of RPS, TCP/UDP protocols, or PrivateLink.

**Q: What's the ONLY load balancer supporting Lambda targets?**
A: ALB (Application Load Balancer).

**Q: What's the ONLY load balancer with static IP addresses?**
A: NLB (Network Load Balancer) with Elastic IPs.

**Q: What's the ONLY load balancer for PrivateLink?**
A: NLB (Network Load Balancer).

**Q: What's the ONLY load balancer for third-party appliances?**
A: GLB (Gateway Load Balancer).

**Q: Which load balancer operates at Layer 7?**
A: ALB (Application Load Balancer).

**Q: Which load balancer has the lowest latency?**
A: NLB (~100 microseconds vs ALB ~100 milliseconds).

**Q: Can you use multiple SSL certificates on one load balancer?**
A: Yes, ALB and NLB support SNI (Server Name Indication) for multiple certificates.

**Q: Does CLB support SNI?**
A: No, CLB supports only one SSL certificate per load balancer.

**Q: How does ALB preserve client IP?**
A: Via X-Forwarded-For header (not native like NLB).

**Q: How does NLB preserve client IP?**
A: Natively preserves source IP in packet (no headers needed).

**Q: Which load balancers support WebSocket?**
A: ALB and NLB (not CLB or GLB).

**Q: Which load balancer is always cross-zone without extra cost?**
A: ALB (always enabled, no charge).

**Q: Does NLB charge for cross-zone load balancing?**
A: Yes, data transfer charges apply for cross-zone on NLB.

**Q: What protocol does GLB use?**
A: GENEVE protocol on port 6081.

**Q: Can NLB target an ALB?**
A: Yes, NLB can have ALB as a target (chaining for static IP + content routing).

**Q: Can ALB target an NLB?**
A: No, ALB cannot target another load balancer.

**Q: Should you use CLB for new applications?**
A: No, CLB is legacy. Always use ALB or NLB for new applications.

**Q: How do you migrate from CLB?**
A: Migrate to ALB (for HTTP/HTTPS) or NLB (for TCP/UDP).

**Q: Which load balancer supports native authentication?**
A: ALB (Cognito User Pools or OIDC).

**Q: Which load balancer can return fixed responses?**
A: ALB (fixed response and redirect actions).

**Q: What's the use case for NLB→ALB chaining?**
A: Get static IP (NLB) + content-based routing (ALB).

---

## Summary - Load Balancer Selection in One Line

| Load Balancer | One-Line Purpose |
|---------------|------------------|
| **ALB** | Layer 7 load balancer for HTTP/HTTPS with content-based routing |
| **NLB** | Layer 4 load balancer for extreme performance with static IPs |
| **GLB** | Layer 3 gateway for third-party virtual appliance load balancing |
| **CLB** | Legacy load balancer - migrate to ALB or NLB |

---

## Final Exam Strategy

### When You See These Keywords:

**"Microservices", "Containers", "Path-based", "Host-based"**
→ **Application Load Balancer (ALB)**

**"Static IP", "Millions of requests", "Ultra-low latency", "PrivateLink"**
→ **Network Load Balancer (NLB)**

**"Firewall", "IDS/IPS", "Third-party appliance", "Deep packet inspection"**
→ **Gateway Load Balancer (GLB)**

**"Legacy", "EC2-Classic", "Existing Classic Load Balancer"**
→ **Migrate to ALB or NLB**

---

### The Decision Flow:

1. **Is it for virtual appliances?** → YES = GLB
2. **Is it HTTP/HTTPS?** → YES = ALB (default for web)
3. **Does it need Lambda targets?** → YES = ALB (only option)
4. **Does it need content routing?** → YES = ALB (only option)
5. **Does it need static IP?** → YES = NLB (only option)
6. **Does it need PrivateLink?** → YES = NLB (only option)
7. **Is it TCP/UDP?** → YES = NLB
8. **Does it need extreme performance?** → YES = NLB
9. **Is it legacy/EC2-Classic?** → Migrate CLB to ALB/NLB

---

**Good luck on your AWS SA Pro exam!**
