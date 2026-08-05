# Non-Functional Requirements

## Performance
| ID               | Requirement                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| **NFR-PERF-001** | The dashboard shall load within **300 ms** under normal operating conditions.        |
| **NFR-PERF-002** | Search operations shall return results within **500 ms** for typical datasets.       |
| **NFR-PERF-003** | API requests shall complete within **300 ms** for 95% of requests under normal load. |

## Availability
| ID                | Requirement                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------- |
| **NFR-AVAIL-001** | The system shall achieve **99.9% monthly availability**, excluding scheduled maintenance. |

## Reliability
| ID              | Requirement                                                                           |
| --------------- | ------------------------------------------------------------------------------------- |
| **NFR-REL-001** | Timeline events shall not be modified after they are recorded.                        |
| **NFR-REL-002** | Audit log entries shall be immutable.                                                 |
| **NFR-REL-003** | Notification delivery shall be reliable, with automatic retry for transient failures. |
| **NFR-REL-004** | The system shall preserve data consistency during unexpected failures.                |

## Security
| ID              | Requirement                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| **NFR-SEC-001** | All authenticated endpoints shall require user authentication.               |
| **NFR-SEC-002** | Access to protected resources shall be restricted based on user permissions. |
| **NFR-SEC-003** | User passwords shall be stored using a strong one-way hashing algorithm.     |
| **NFR-SEC-004** | File uploads shall be validated before being stored.                         |
| **NFR-SEC-005** | All communication between clients and the API shall use HTTPS.               |

## Scalability
| ID                | Requirement                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| **NFR-SCALE-001** | The application shall support horizontal scaling of API servers.                                                    |
| **NFR-SCALE-002** | The system shall support organizations with thousands of incidents without significant degradation in performance.  |
| **NFR-SCALE-003** | The architecture shall support multiple organizations sharing the same deployment while maintaining data isolation. |

## Auditability
| ID                | Requirement                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| **NFR-AUDIT-001** | Significant user actions shall be recorded with the acting user, timestamp, and affected resource. |
| **NFR-AUDIT-002** | Audit records shall be searchable.                                                                 |

## API
| ID              | Requirement                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| **NFR-API-001** | The system shall expose all business capabilities through documented REST APIs. |
| **NFR-API-002** | APIs shall support versioning to maintain backward compatibility.               |
| **NFR-API-003** | APIs shall validate all client input before processing requests.                |
| **NFR-API-004** | APIs shall enforce rate limits to protect against abuse.                        |

## Monitoring & Observability
| ID              | Requirement                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| **NFR-MON-001** | The application shall expose health check endpoints.                                 |
| **NFR-MON-002** | Application errors shall be logged with sufficient diagnostic information.           |
| **NFR-MON-003** | Operational metrics shall be collected for system health and performance monitoring. |
