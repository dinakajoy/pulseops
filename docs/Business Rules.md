# Business Rules
Users & Roles
* Only admins may delete users.
* Users belong to exactly one organization.
Incidents
* very incident must belong to exactly one project.
* Every incident must have exactly one current status and one severity.
* Closed or archived incidents must not be modified unless they are reopened.
* Only an Engineering Manager or Administrator may change an incident's severity.
* Only an Engineering Manager or Administrator may close an incident.
* Archived incidents remain searchable and retain their complete history.
* Incident timeline entries must not be deleted.
* An incident must not be resolved until at least one investigation note has been recorded.
* A closed incident must not return to the Investigating state without first being reopened.
* Every incident must have at least one timeline event (its creation).
Assignments
* Only Engineering Managers and Admins may assign or reassign incidents.
* An engineer may only mark an incident as Resolved if it is currently assigned to them.
* An incident may have only one active assignee at a time (assignment history is retained).
Severity
* Every incident must have a severity assigned before investigation begins.
Attachments
* Attachments must not exist independently of an incident.
Comments & Investigation
* Users involved in an incident may add comments.
* Investigation notes may only be added by engineering roles (Backend, Frontend, DevOps, Engineering Manager).
* Investigation notes are immutable; corrections are added as new notes to preserve history.
Audit & History
* Significant business actions must be recorded in the audit log.
* Incidents are soft-deleted (archived) rather than permanently removed.
* Timeline events must not be modified.
* Investigation Notes must not be deleted.
Customer Reports
* Every customer report belongs to exactly one tenant.
* Multiple customer reports may result in a single incident.
* A customer report may not exist without an affected tenant.