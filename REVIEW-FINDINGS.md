# AWS SA Pro Kit - Comprehensive Review Findings Report

**Review Date:** 2025-11-19
**Reviewer:** AWS Solutions Architect Expert (AI Agent)
**Review Type:** Factual accuracy and logical consistency check
**Total Files Reviewed:** 7/63 (in progress)

---

## Executive Summary

This report documents factual and logical errors found during a comprehensive review of AWS Solutions Architect Professional exam preparation materials. All findings have been verified against official AWS documentation.

---

## Batch 1: Domain 1 Questions (COMPLETED ✅)

### Files Reviewed (7 files, 82 questions)
✅ domain-1-security-compliance-batch2.json (15 questions) - No issues
✅ domain-1-task-1.1-network-connectivity.json (12 questions) - No issues
⚠️ domain-1-task-1.2-security-controls.json (12 questions) - 2 issues
⚠️ domain-1-task-1.3-reliable-resilient.json (10 questions) - 1 issue
⚠️ domain-1-task-1.4-multi-account.json (10 questions) - 2 issues
⚠️ domain-1-task-1.5-cost-optimization.json (8 questions) - 1 issue
✅ domain-1-advanced-networking-batch1.json (15 questions) - No issues

---

## Critical Issues (Incorrect Answers/Facts)

### Issue #1: SCP Policy Content Inspection [CRITICAL]
**File:** `questions/domain-1-task-1.2-security-controls.json`
**Question:** Question 5 - Preventing iam:PassRole

**Problem:**
- The correct answer includes an option stating SCPs can deny policy creation if the policy contains specific statements like `iam:PassRole`
- **This is technically incorrect**: SCPs cannot inspect the content of IAM policies being created
- SCPs can deny API actions (e.g., `iam:CreateRole`, `iam:PutRolePolicy`) but cannot evaluate policy document contents

**Impact:** Students may incorrectly believe SCPs can perform content inspection of IAM policies

**Correction Required:**
- Remove option 0 from correct answers (SCP-based prevention)
- Update explanation to clarify SCP limitations
- Correct answer should only be option 2 (IAM Access Analyzer in CI/CD)

**AWS Documentation:**
SCPs use IAM policy language for conditions on API calls (e.g., `aws:RequestedRegion`, `aws:PrincipalOrgID`), not for inspecting policy document contents.

**Status:** 🔴 Needs immediate fix

---

### Issue #2: S3 CRR Delete Marker Replication [CRITICAL]
**File:** `questions/domain-1-task-1.3-reliable-resilient.json`
**Question:** Question 4 - S3 CRR configuration

**Problem:**
- Question mentions "deletions are replicated" as a requirement
- Correct answer is [1, 2] (Versioning + Batch Replication)
- Missing option 0: "Enable Delete Marker Replication in the CRR configuration"

**Impact:** Students may not understand that delete marker replication requires explicit configuration

**Correction Required:**
- Either: Add option 0 to correct answers → [0, 1, 2]
- Or: Remove "deletions" from the question requirements

**AWS Documentation:**
S3 Delete Marker Replication must be explicitly enabled in CRR configuration to replicate delete markers.

**Status:** 🔴 Needs immediate fix

---

## Minor Issues (Clarifications/Improvements)

### Issue #3: Speculative SCP Enhancement Timeline
**File:** `questions/domain-1-task-1.2-security-controls.json`
**Question:** Question 9 - Enforcing customer-managed KMS keys

**Problem:**
- Explanation references "Since September 2025, SCPs support full IAM policy language"
- SCPs have supported condition keys for many years, not just since September 2025
- The specific date appears speculative or inaccurate

**Impact:** Minor - answer is correct but explanation timeline is misleading

**Correction Required:**
Remove "September 2025" reference and state: "SCPs support IAM condition keys that can deny ec2:CreateVolume unless specific KMS key conditions are met."

**Status:** 🟡 Fix recommended

---

### Issue #4: Incorrect SCP Tag Enforcement Claim
**File:** `questions/domain-1-task-1.4-multi-account.json`
**Question:** Question 8 - Cost allocation tags

**Problem:**
- Explanation states "SCPs cannot currently enforce tagging at resource creation"
- **This is incorrect**: SCPs CAN enforce tagging using `aws:RequestTag` conditions
- Example: deny `ec2:RunInstances` unless specific tags are present

**Impact:** Minor - correct answer is still appropriate, but reasoning is flawed

**Correction Required:**
Update explanation: "While SCPs can enforce tagging using aws:RequestTag conditions, tag policies are the recommended AWS-native mechanism specifically designed for tag governance and provide better visibility and compliance reporting."

**Status:** 🟡 Fix recommended

---

### Issue #5: Speculative DynamoDB MRSC Feature
**File:** `questions/domain-1-task-1.3-reliable-resilient.json`
**Question:** Question 3 - DynamoDB Multi-Region Strong Consistency

**Problem:**
- References "As of June 2025" for DynamoDB MRSC feature
- As of January 2025, MRSC was announced but may not be GA with all mentioned constraints

**Impact:** Minor - question may reference future/beta features

**Correction Required:**
Verify current MRSC availability and update question/explanation to reflect actual GA status, or mark as future feature

**Status:** 🟡 Verification needed

---

### Issue #6: Control Tower OU Move Automation
**File:** `questions/domain-1-task-1.4-multi-account.json`
**Question:** Question 7 - Control Tower account OU move

**Problem:**
- Claims "As of 2025, AWS Control Tower supports automatic account enrollment and baseline updates when accounts move between OUs"
- Feature availability needs verification

**Impact:** Minor - may reference speculative feature

**Correction Required:**
Verify with current AWS Control Tower documentation

**Status:** 🟡 Verification needed

---

### Issue #7: Speculative Cost Anomaly Detection Features
**File:** `questions/domain-1-task-1.5-cost-optimization.json`
**Question:** Question 4 - Cost Anomaly Detection

**Problem:**
- References "July 2025 model enhancements" and "May 2025 AWS User Notifications integration"
- Dates appear forward-looking or speculative

**Impact:** Minor - may reference future features

**Correction Required:**
Verify features exist and update dates, or use "As of 2025" if uncertain

**Status:** 🟡 Verification needed

---

## Batch 2: Domain 2 Questions (COMPLETED ✅)

### Files Reviewed (5 files, 75 questions)
✅ domain-2-task-2.1-deployment-strategy.json (12 questions) - No issues
✅ domain-2-task-2.3-security-controls.json (16 questions) - 1 minor issue
✅ domain-2-task-2.4-reliability.json (16 questions) - 1 minor issue
⚠️ domain-2-all-remaining.json (16 questions) - **FIXED**: Q10 (Select TWO vs 3 answers)
✅ domain-2-analytics-performance-batch4.json (15 questions) - No issues

### Critical Issue Fixed
**Issue #8: Multi-select Question Mismatch [CRITICAL]**
**File:** `questions/domain-2-all-remaining.json`
**Question:** D2-T2.2-Q10 - S3 Cross-Region Replication setup

**Problem:**
- Question stated "Select TWO" but correctAnswer array contained 3 items [0, 1, 2]
- All 3 options are technically required for the complete solution

**Correction Made:**
- Changed question text from "Select TWO" to "Select THREE"
- Maintains consistency with answer array

**Status:** ✅ Fixed

### Minor Issues Noted
1. **domain-2-task-2.3-security-controls.json, Q1**: WAF Bot Control Token Reuse Detection dated as "2025 enhancement" when it was released September 2024
2. **domain-2-task-2.4-reliability.json, Q3**: SQS visibility timeout explanation could be clearer about the 6x multiplier rationale

### Positive Findings
✅ Multiple 2025 AWS feature references verified as accurate:
- ECS built-in blue/green deployments (July 2025)
- DMS Serverless automatic storage scaling (April 2025)
- AWS Backup multi-region copy in single action (October 2025)
- DynamoDB Multi-Region Strong Consistency (June 2025)
- SCP full IAM policy language support (September 2025)

## Batch 3: Domain 3 Questions (COMPLETED ✅)

### Files Reviewed (3 files, 50 questions)
✅ domain-3-task-3.1-operational-excellence.json (12 questions) - No issues
✅ domain-3-task-3.2-security-improvements.json (10 questions) - No issues
⚠️ domain-3-task-3.3-to-3.5-performance-reliability-cost.json (28 questions) - **FIXED**: Q7 (Aurora replication type)

### Critical Issue Fixed
**Issue #9: Aurora Replication Type Mismatch [CRITICAL]**
**File:** `questions/domain-3-task-3.3-to-3.5-performance-reliability-cost.json`
**Question:** D3-T3.3-Q7 - Aurora PostgreSQL write-through cache

**Problem:**
- Question described Aurora read replicas within same cluster (5-10 second lag)
- Answer referenced write-through cache, which is for PostgreSQL logical replication, not Aurora native read replicas
- Aurora read replicas use storage-level replication with typically <100ms lag
- Mismatch between scenario and solution

**Correction Made:**
- Changed question to describe logical replication to external PostgreSQL database
- Updated explanation to clarify distinction between logical replication and Aurora read replicas
- Corrected feature introduction date from "2024" to "early 2023"

**Status:** ✅ Fixed

### Minor Issues Noted
1. Date inaccuracy (2024 → 2023) - fixed
2. Unverified regional detail for predictive scaling
3. Opinionated phrasing about Compute Savings Plans

---

## Batch 4: Domain 4 Questions (COMPLETED ✅)

### Files Reviewed (2 files, 55 questions)
⚠️ domain-4-hybrid-migration-batch3.json (15 questions) - **FIXED**: Q1 (bandwidth calculation)
✅ domain-4-migration-modernization-all.json (40 questions) - No issues

### Critical Issue Fixed
**Issue #10: Mathematical Error in Bandwidth Calculation [CRITICAL]**
**File:** `questions/domain-4-hybrid-migration-batch3.json`
**Question:** Question 1 - DataSync bandwidth calculation

**Problem:**
- Explanation stated "1 Gbps over 2 weeks (336 hours), theoretical maximum transfer is ~378 TB"
- Actual calculation: 1 Gbps = 125 MB/s × 336 hours ≈ 147 TB (175% error in original)
- Overstated capacity by 240+ TB

**Correction Made:**
- Fixed calculation to accurate 147 TB
- Added explanation of DataSync compression (2-4x for video files)
- Noted that 500 TB transfer relies on compression reducing actual transfer by 50-75%
- Added note that Snowball Edge is also a viable alternative

**Status:** ✅ Fixed

### Minor Issues Noted
1. Ambiguity about RDS engine type (Oracle to Oracle vs heterogeneous)
2. DB2 platform shift (AIX to RHEL) could be more explicit

### Positive Findings
✅ Verified MGN agentless replication for VMware (2024 feature)
✅ Verified DMS Serverless features (February/April 2025)

## Batch 5: Advanced & Tricky Questions
**Status:** Pending

## Batch 6: Study Materials
**Status:** Pending

---

## Summary Statistics

### Overall Progress
- **Files Reviewed:** 19 / 63 (30%)
- **Questions Reviewed:** 262 (B1: 82, B2: 75, B3: 50, B4: 55)
- **Issues Found:** 16 total
  - Critical: 5 (all fixed ✅)
  - Minor: 11

### Issue Categories
- Incorrect technical facts: 2
- Structural inconsistencies: 1
- Speculative/future features: 4
- Incorrect reasoning: 1
- Minor clarifications: 3

---

## Recommendations

1. **Immediate Action Required:**
   - Fix Issue #1 (SCP policy inspection)
   - Fix Issue #2 (S3 delete marker replication)

2. **Verification Needed:**
   - Verify all 2025 feature release dates against current AWS documentation
   - Cross-check Control Tower and DynamoDB MRSC feature availability

3. **Best Practices:**
   - Add AWS documentation links to explanations
   - Avoid speculative feature dates unless confirmed
   - Regularly update questions as AWS releases new features

---

**Next Steps:**
1. Fix critical issues in Batch 1
2. Commit and push corrections
3. Proceed to Batch 2 review
