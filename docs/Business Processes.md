# Business Processes

## Business Actors
- Admin
- Engineering Manager
- Engineer
- Support Engineer
- Customer Success
- Client

## Roles & Responsibilities
| Role                | Responsibilities                                                   | Key Capabilities                                                                                           |
| ------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Admin               | Manage the PulseOps workspace and system configuration.            | Manage users, roles, projects, statuses, priorities, delete incidents, view all data.                     |
| Engineering Manager | Coordinate incident response and engineering work.                 | Create incidents, assign responders, update severity, reopen and close incidents, view reports.           |
| Engineer            | Investigate and resolve assigned incidents.                        | View assigned incidents, add investigation notes, upload attachments, resolve incidents.                  |
| Support Engineer    | Receive customer reports and initiate incident response.           | Create incidents, attach evidence, escalate incidents.                                                    |
| Customer Success    | Monitor incident progress and communicate with affected customers. | View incidents, monitor status, notify customers after resolution.                                        |
| Client              | Report issues affecting the SaaS platform.                         | Submit customer reports through the SaaS product or support channels (does not access PulseOps directly). |


## Core Business Processes (Workflow)
1. Report Incident
2. Validate & Triage Incident
3. Prioritize Incident
4. Assign Responders
5. Investigate Incident
6. Communicate Progress
7. Resolve Incident
8. Verify Resolution
9. Close Incident
10. Review Incident History

## High-Level Workflow
```
  Client experiences issue 
       ↓
  Client reports issue
        ↓
  Support validates report
        ↓
  Incident created
        ↓
  Engineering Manager triages incident
        ↓
  Severity assigned
        ↓
  Responders assigned
        ↓
  Engineers investigate
        ↓
  Incident updates communicated
        ↓
  Issue resolved
        ↓
  Resolution verified
        ↓
  Customer Success notifies affected tenants
        ↓
  Incident closed
        ↓
  Reporting & analytics
```

## Process Ownership
| Process                 | Primary Owner       |
| ----------------------- | ------------------- |
| Report Incident         | Support Engineer    |
| Triage Incident         | Engineering Manager |
| Assign Responders       | Engineering Manager |
| Investigation           | Engineer            |
| Resolution Verification | Engineering Manager |
| Customer Communication  | Customer Success    |
| Incident Closure        | Engineering Manager |

## Entry & Exit Criteria
### Incident Lifecycle
| Stage         | Entry Criteria         | Exit Criteria                               |
| ------------- | ---------------------- | ------------------------------------------- |
| Open          | Incident created       | Assigned for investigation                  |
| Investigating | Responder assigned     | Root cause identified or workaround applied |
| Resolved      | Fix deployed           | Resolution verified                         |
| Closed        | Verification completed | Incident archived                           |
