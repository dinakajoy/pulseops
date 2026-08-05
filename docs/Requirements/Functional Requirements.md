# Functional Requirements

## 1. Authentication & Authorization
### Authentication
| ID              | Requirement                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------- |
| **FR-AUTH-001** | The system shall allow users to register an account.                                        |
| **FR-AUTH-002** | The system shall authenticate users using email and password.                               |
| **FR-AUTH-003** | The system shall issue JWT access and refresh tokens upon successful authentication.        |
| **FR-AUTH-004** | The system shall allow users to refresh expired access tokens.                              |
| **FR-AUTH-005** | The system shall support password reset via email.                                          |
| **FR-AUTH-006** | The system shall verify user email addresses before allowing access to protected resources. |
| **FR-AUTH-007** | The system shall allow authenticated users to log out.                                      |
| **FR-AUTH-008** | The system shall support OAuth authentication using GitHub and Google.                      |

### Authorization
| ID               | Requirement                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| **FR-AUTHZ-001** | The system shall restrict access based on user roles and permissions (RBAC).    |
| **FR-AUTHZ-002** | The system shall prevent unauthorized users from performing restricted actions. |

## User Management
| ID              | Requirement                                                     |
| --------------- | --------------------------------------------------------------- |
| **FR-USER-001** | The system shall allow administrators to invite users.          |
| **FR-USER-002** | The system shall allow administrators to assign roles to users. |
| **FR-USER-003** | The system shall allow administrators to disable user accounts. |

## Incident Management
### Incident
| ID             | Requirement                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| **FR-INC-001** | The system shall allow Support Engineers to create incidents.                            |
| **FR-INC-002** | The system shall allow authorized users to update incident details.                      |
| **FR-INC-003** | The system shall allow Incident Managers to assign responders.                           |
| **FR-INC-004** | The system shall allow reassignment of responders.                                       |
| **FR-INC-005** | The system shall allow incidents to be archived.                                         |
| **FR-INC-006** | The system shall allow archived incidents to be restored.                                |
| **FR-INC-007** | The system shall allow authorized users to delete incidents according to business rules. |

### Incident Status
| ID                | Requirement                                                                      |
| ----------------- | -------------------------------------------------------------------------------- |
| **FR-STATUS-001** | The system shall support the statuses Open, Investigating, Resolved, and Closed. |
| **FR-STATUS-002** | Every status transition shall create a timeline event.                           |

### Severity
| ID             | Requirement                                                               |
| -------------- | ------------------------------------------------------------------------- |
| **FR-SEV-001** | The system shall support Critical, High, Medium, and Low severity levels. |
| **FR-SEV-002** | Authorized users shall be able to update incident severity.               |

### Timeline
| ID              | Requirement                                                            |
| --------------- | ---------------------------------------------------------------------- |
| **FR-TIME-001** | The system shall maintain a chronological timeline of incident events. |
| **FR-TIME-002** | Timeline events shall be appended rather than modified.                |

### Comments
| ID             | Requirement                                           |
| -------------- | ----------------------------------------------------- |
| **FR-COM-001** | The system shall allow users to comment on incidents. |
| **FR-COM-002** | The system shall support threaded discussions.        |

### Investigation Notes
| ID              | Requirement                                                     |
| --------------- | --------------------------------------------------------------- |
| **FR-NOTE-001** | The system shall allow engineers to record investigation notes. |
| **FR-NOTE-002** | Investigation notes shall become part of the incident history.  |

### Attachments
| ID             | Requirement                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| **FR-ATT-001** | The system shall allow users to upload attachments to incidents.              |
| **FR-ATT-002** | The system shall support screenshots, log files, stack traces, and HAR files. |

## Search & Discovery
| ID                | Requirement                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| **FR-SEARCH-001** | The system shall allow users to search incidents by keyword.                                   |
| **FR-SEARCH-002** | The system shall support filtering by status, severity, responder, service, and creation date. |
| **FR-SEARCH-003** | The system shall support sorting by newest, oldest, severity, and status.                      |
| **FR-SEARCH-004** | The system shall support paginated results.                                                    |

## Audit Logs
| ID               | Requirement                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **FR-AUDIT-001** | The system shall record significant user actions in an audit log.                           |
| **FR-AUDIT-002** | Audit logs shall be retained and protected from deletion or modification by standard users. |

## Dashboard
| ID              | Requirement                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| **FR-DASH-001** | The system shall provide incident summary statistics.                             |
| **FR-DASH-002** | The dashboard shall display counts by status, severity, and responder assignment. |

## Notifications
| ID               | Requirement                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- |
| **FR-NOTIF-001** | The system shall notify relevant users of important incident events.                    |
| **FR-NOTIF-002** | The system shall notify responders when they are assigned or reassigned to an incident. |
 