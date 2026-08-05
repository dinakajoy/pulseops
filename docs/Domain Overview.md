# Domain Overview

## Overview
PulseOps is an internal engineering operations platform for multi-tenant SaaS organizations. Its domain focuses on coordinating the lifecycle of production incidents—from initial customer reports through investigation, resolution, and post-incident review.

The domain is centered around Incident Management, with supporting capabilities for user administration, collaboration, notifications, and auditing.

The following sections describe the major business concepts that make up the PulseOps domain.

## Core Domain
The Core Domain represents the primary business capability that differentiates PulseOps from other software systems. It contains the concepts directly involved in managing production incidents.
| Domain Concept          | Description                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| **Incident**            | A production issue affecting one or more services that requires investigation and resolution.        |
| **Incident Assignment** | Represents responsibility for investigating and resolving an incident, including assignment history. |
| **Incident Timeline**   | A chronological record of all significant events during an incident's lifecycle.                     |
| **Investigation Note**  | Technical findings, observations, and progress updates recorded during an investigation.             |
| **Comment**             | Communication between support, engineering, and management teams regarding an incident.              |
| **Resolution**          | The documented outcome of an incident, including how it was resolved.                                |
| **Affected Tenant**     | A customer organization whose use of the SaaS platform is impacted by an incident.                   |
| **Customer Report**     | A complaint or issue reported by a tenant that may lead to the creation of an incident.              |


## Supporting Domains
Supporting Domains provide capabilities required by the Core Domain but are not the primary business value of the platform.
| Domain                      | Purpose                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------- |
| **User Management**         | Manages users, roles, and organizational membership.                                   |
| **Project Management**      | Organizes projects and services monitored by PulseOps.                                 |
| **Notification Management** | Delivers notifications for assignments, status changes, and important incident events. |
| **Audit Management**        | Records significant business actions for compliance and traceability.                  |
| **Attachment Management**   | Stores and manages files associated with incidents.                                    |
| **Reporting & Dashboard**   | Provides operational metrics and management visibility into incidents.                 |


## Generic Domains
Generic Domains are common technical capabilities that are not unique to PulseOps but are required by most modern applications.
| Domain                   | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| **Authentication**       | Verifies user identity.                                                 |
| **Authorization**        | Controls access to system functionality based on roles and permissions. |
| **Search**               | Enables searching and filtering of incidents and related data.          |
| **Email Delivery**       | Sends invitations, password resets, and notifications.                  |
| **File Storage**         | Stores uploaded attachments.                                            |
| **Logging & Monitoring** | Captures operational logs and application health metrics.               |


## Core Business Entities
| Entity                  | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| **Organization**        | A SaaS company that uses PulseOps to manage operational incidents. |
| **User**                | An employee of an organization who interacts with PulseOps.        |
| **Role**                | Defines the responsibilities and capabilities assigned to users.   |
| **Project**             | A logical grouping of related services managed together.           |
| **Service**             | A deployable software component monitored for operational health.  |
| **Customer Report**     | A reported issue submitted by a tenant.                            |
| **Incident**            | A production issue requiring investigation and resolution.         |
| **Incident Assignment** | Tracks responsibility for an incident over time.                   |
| **Timeline Event**      | Records important events during an incident's lifecycle.           |
| **Investigation Note**  | Records technical findings during an investigation.                |
| **Comment**             | Captures discussion related to an incident.                        |
| **Attachment**          | Stores supporting files associated with an incident.               |
| **Notification**        | Represents messages sent to users regarding incident activity.     |
| **Audit Log**           | Records significant actions performed within the system.           |


## High-Level Domain Relationships
Organization
│
├── Users
│     └── Role
│
├── Projects
│      └── Services
│
├── Customer Reports
│      └── Affected Tenant
│
└── Incidents
       │
       ├── Incident Assignment
       ├── Timeline Events
       ├── Investigation Notes
       ├── Comments
       ├── Attachments
       ├── Notifications
       └── Audit Logs

## Domain Principles
The PulseOps domain is governed by the following principles:
- Every incident belongs to a single project.
- Every incident has a complete and chronological history.
- Responsibility for incidents is explicitly assigned and traceable.
- Operational decisions are documented through investigation notes, comments, and timeline events.
- Significant business actions are auditable.
- Business data is isolated between organizations.
- Customer reports provide the initial business context for incidents.