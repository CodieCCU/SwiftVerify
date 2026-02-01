# SwiftVerify Compliance Documentation

## Document Information
- **Document Title**: Social Security Number (SSN) Non-Storage Policy
- **Document Version**: 1.0
- **Last Updated**: 2026-02-01
- **Document Owner**: SwiftVerify Compliance Team
- **Review Cycle**: Annual

---

## Executive Summary

SwiftVerify maintains a strict policy of **NOT storing Social Security Numbers (SSNs)** in any form on our servers. This policy is fundamental to our commitment to user privacy, data security, and regulatory compliance.

---

## Policy Statement

### Social Security Number Non-Storage Policy

**SwiftVerify does NOT store Social Security Numbers (SSNs) in any form whatsoever.**

This policy explicitly covers:

1. **Plaintext Storage**: SSNs are NEVER stored in plaintext form
2. **Encrypted Storage**: SSNs are NEVER stored in encrypted form
3. **Hashed Storage**: SSNs are NEVER stored as secure hashes (one-way or otherwise)
4. **Equivalent Forms**: SSNs are NEVER stored in any equivalent or derivative form

### Scope

This policy applies to:
- All user types: Tenants, Landlords, and Property Managers
- All system components: Frontend, Backend, Database, and Third-party Integrations
- All environments: Development, Staging, and Production
- All data storage mechanisms: Databases, File Systems, Caches, and Logs

---

## Implementation Details

### User Communication

1. **Onboarding Flow**
   - SSN non-storage notice is displayed on the Login page
   - Users are informed before creating an account or beginning verification

2. **Dashboard Display**
   - SSN non-storage disclaimer is prominently featured on the Home dashboard
   - Notice includes lock icon (🔒) to emphasize security

3. **Verification Process**
   - SSN non-storage notice is shown on the Driver's License verification page
   - Users are reminded immediately before submitting sensitive information

4. **Privacy Policy**
   - Dedicated section on SSN non-storage policy
   - Highlighted with distinctive styling for visibility
   - Accessible from all major pages via link

### Technical Implementation

1. **Data Flow**
   - If SSN verification is required, data is processed in real-time
   - SSN data is transmitted directly to verified third-party services
   - No SSN data is retained in SwiftVerify systems after verification
   - No logging of SSN data in application logs or audit trails

2. **Third-Party Integration**
   - Third-party verification services are vetted for compliance
   - Data processing agreements ensure no SSN storage by SwiftVerify
   - All SSN data transmission uses end-to-end encryption

3. **Database Schema**
   - No database fields exist for SSN storage
   - Database design review confirms no SSN storage capability
   - Schema documentation reflects SSN non-storage policy

---

## Compliance Framework

### Applicable Regulations

This policy supports compliance with:

1. **Fair Credit Reporting Act (FCRA)**
   - Minimizes risk associated with sensitive personal information
   - Reduces liability for data breaches

2. **Gramm-Leach-Bliley Act (GLBA)**
   - Protects consumer financial information
   - Implements appropriate safeguards for sensitive data

3. **State Privacy Laws**
   - California Consumer Privacy Act (CCPA)
   - Other state-level data protection regulations

4. **Industry Standards**
   - Payment Card Industry Data Security Standard (PCI DSS) principles
   - NIST Cybersecurity Framework alignment

### Risk Mitigation

By not storing SSNs, SwiftVerify achieves:

1. **Reduced Data Breach Impact**
   - SSN data cannot be compromised in a database breach
   - Lower risk of identity theft for users

2. **Simplified Compliance**
   - Fewer regulatory requirements for SSN protection
   - Reduced audit scope and complexity

3. **Enhanced User Trust**
   - Transparent privacy practices
   - Demonstrable commitment to data minimization

---

## User Rights and Transparency

### User Notification

Users are informed of the SSN non-storage policy through:

1. **Multiple Touchpoints**
   - Login/Onboarding screen
   - Home dashboard
   - Verification pages
   - Privacy Policy page

2. **Clear Language**
   - Simple, non-technical explanations
   - Explicit statements about what is NOT stored
   - Visual emphasis (colored boxes, icons)

3. **Accessibility**
   - Privacy Policy link on login page
   - Easy navigation to policy information

### User Rights

Users have the right to:

1. Verify that no SSN data is stored by SwiftVerify
2. Request information about data processing practices
3. Contact privacy team with questions or concerns
4. Review the complete Privacy Policy at any time

---

## Monitoring and Enforcement

### Compliance Monitoring

1. **Regular Audits**
   - Annual review of SSN non-storage policy implementation
   - Database schema audits to confirm no SSN fields
   - Code reviews to verify no SSN storage logic

2. **Third-Party Assessments**
   - Periodic security assessments by external auditors
   - Verification of third-party service compliance

3. **Incident Response**
   - Immediate investigation of any suspected policy violations
   - Mandatory reporting to compliance team

### Policy Violations

Any attempt to store SSN data will result in:

1. Immediate escalation to compliance team
2. System design review and correction
3. User notification if applicable
4. Process improvement to prevent recurrence

---

## Documentation and Record Keeping

### Policy Changes

All changes to the SSN non-storage policy will be:

1. Documented with version history
2. Reviewed and approved by compliance team
3. Communicated to users via updated Privacy Policy
4. Recorded in this compliance documentation

### Change Log

| Date       | Version | Changes                          | Approved By         |
|------------|---------|----------------------------------|---------------------|
| 2026-02-01 | 1.0     | Initial SSN non-storage policy   | Compliance Team     |

---

## Contact Information

### Compliance Team
- **Email**: compliance@swiftverify.com
- **Response Time**: Within 2 business days

### Privacy Inquiries
- **Email**: privacy@swiftverify.com
- **Response Time**: Within 2 business days

### General Support
- **Email**: support@swiftverify.com
- **Response Time**: Within 1 business day

---

## Appendix

### A. Related Policies

1. Data Privacy Policy
2. Information Security Policy
3. Data Retention Policy
4. Third-Party Vendor Management Policy
5. Incident Response Policy

### B. Review and Approval

This document has been reviewed and approved by:

- Compliance Team
- Legal Department
- Engineering Leadership
- Product Management

### C. Training Requirements

All employees with access to user data must complete:

1. Annual privacy and security training
2. SSN non-storage policy acknowledgment
3. Compliance certification

---

**END OF DOCUMENT**
