# Diagrams

## Use Case Diagram
                                    +--------------------+
                                    |       Client       |
                                    +--------------------+
                                              |
                                              |
                                   Report Issue/Complaint
                                              |
                                              v
+--------------------------------------------------------------------------------------+
|                                     PulseOps                                         |
|                                                                                      |
|  +----------------------+                                                            |
|  |  Create Incident     |<------------------------+                                  |
|  +----------------------+                         |                                  |
|                                                  |                                  |
|  +----------------------+                         |                                  |
|  |  Assign Incident     |<--------------------+   |                                  |
|  +----------------------+                     |   |                                  |
|                                               |   |                                  |
|  +----------------------+                     |   |                                  |
|  | Investigate Incident |<-------------+      |   |                                  |
|  +----------------------+              |      |   |                                  |
|                                        |      |   |                                  |
|  +----------------------+              |      |   |                                  |
|  | Update Timeline      |<-------------+      |   |                                  |
|  +----------------------+                     |   |                                  |
|                                               |   |                                  |
|  +----------------------+                     |   |                                  |
|  | Add Comments         |<-------------+      |   |                                  |
|  +----------------------+              |      |   |                                  |
|                                        |      |   |                                  |
|  +----------------------+              |      |   |                                  |
|  | Upload Attachment    |<-------------+      |   |                                  |
|  +----------------------+                     |   |                                  |
|                                               |   |                                  |
|  +----------------------+                     |   |                                  |
|  | Resolve Incident     |<-------------+      |   |                                  |
|  +----------------------+              |      |   |                                  |
|                                        |      |   |                                  |
|  +----------------------+              |      |   |                                  |
|  | Close Incident       |<---------------------+   |                                  |
|  +----------------------+                         |                                  |
|                                                   |                                  |
|  +----------------------+                         |                                  |
|  | View Reports         |<------------------------+                                  |
|  +----------------------+                                                            |
|                                                                                      |
+--------------------------------------------------------------------------------------+

Actors

Client
    |
Support Engineer
    |
Engineering Manager
    |
Engineer
    |
Customer Success
    |
Admin

## Activity Diagram
                 ┌───────────────┐
                 │     Start     │
                 └───────┬───────┘
                         │
                         ▼
              Client reports issue
                         │
                         ▼
          Support validates complaint
                         │
             Is it a real incident?
                ┌───────┴────────┐
                │                │
               No               Yes
                │                │
                ▼                ▼
      Close customer      Create Incident
         request                 │
                                  ▼
                     Engineering Manager triages
                                  │
                                  ▼
                       Assign severity & priority
                                  │
                                  ▼
                       Assign responder(s)
                                  │
                                  ▼
                      Engineer investigates
                                  │
                                  ▼
                    Root cause identified?
                    ┌─────────┴──────────┐
                    │                    │
                   No                   Yes
                    │                    │
                    ▼                    ▼
            Continue investigation   Implement fix
                    │                    │
                    └──────────┬─────────┘
                               ▼
                       Verify resolution
                               │
                  Issue resolved successfully?
                    ┌─────────┴──────────┐
                    │                    │
                   No                   Yes
                    │                    │
                    ▼                    ▼
             Reopen investigation   Close incident
                                          │
                                          ▼
                        Customer Success notified
                                          │
                                          ▼
                           Reporting & Analytics
                                          │
                                          ▼
                                     End

## Sequence Diagram
Client          Support      Manager        Engineer        PulseOps
  |                 |             |              |               |
  | Report Issue    |             |              |               |
  |---------------> |             |              |               |
  |                 | Create      |              |               |
  |                 | Incident    |              |               |
  |                 |--------------------------->|               |
  |                 |             |              |               |
  |                 |             | Assign Sev.  |               |
  |                 |             |------------->|               |
  |                 |             | Assign Resp. |               |
  |                 |             |----------------------------->|
  |                 |             |              |               |
  |                 |             |              | Investigate   |
  |                 |             |              |-------------->|
  |                 |             |              | Add Notes     |
  |                 |             |              |-------------->|
  |                 |             |              | Upload Logs   |
  |                 |             |              |-------------->|
  |                 |             |              | Resolve       |
  |                 |             |<-------------|               |
  |                 |             | Verify       |               |
  |                 |             | Close        |               |
  |                 |             |------------->|               |
  |                 |             | Notify CS    |               |
  |                 |             |------------->|               |
  |<-------------------------------------------------------------|
       Customer Success notifies affected tenant

## Entity Relationship Diagram (ERD)
┌──────────────────────────┐
│       Organization       │
├──────────────────────────┤
│ PK id                    │
│ name                     │
│ slug                     │
│ status                   │
│ created_at               │
└─────────────┬────────────┘
              │ 1
              │
              │ *
┌─────────────▼────────────┐
│          User            │
├──────────────────────────┤
│ PK id                    │
│ organization_id (FK)     │
│ role_id (FK)             │
│ name                     │
│ email                    │
│ password_hash            │
│ status                   │
│ created_at               │
└─────────────┬────────────┘
              │
              │
              │
┌─────────────▼────────────┐
│          Role            │
├──────────────────────────┤
│ PK id                    │
│ name                     │
│ description              │
└──────────────────────────┘


┌──────────────────────────┐
│         Project          │
├──────────────────────────┤
│ PK id                    │
│ organization_id (FK)     │
│ name                     │
│ description              │
└─────────────┬────────────┘
              │1
              │
              │*
┌─────────────▼────────────┐
│         Service          │
├──────────────────────────┤
│ PK id                    │
│ project_id (FK)          │
│ name                     │
│ description              │
└─────────────┬────────────┘
              │
              │
              │
              │*
┌─────────────▼────────────┐
│      CustomerReport      │
├──────────────────────────┤
│ PK id                    │
│ service_id (FK)          │
│ reported_by              │
│ tenant_name              │
│ title                    │
│ description              │
│ created_at               │
└─────────────┬────────────┘
              │0..*
              │
              │1
┌─────────────▼────────────┐
│        Incident          │
├──────────────────────────┤
│ PK id                    │
│ project_id (FK)          │
│ service_id (FK)          │
│ customer_report_id (FK)  │
│ title                    │
│ description              │
│ status                   │
│ severity                 │
│ root_cause              │
│ resolution              │
│ created_by (FK User)     │
│ closed_by (FK User)      │
│ created_at               │
└──────┬─────────┬─────────┘
       │         │
       │         │
       │         │
       │         │
       │         │
       │         │
       │         │
       │         │
       │         │
       ▼         ▼

┌──────────────────────┐      ┌──────────────────────┐
│ IncidentAssignment   │      │ TimelineEvent        │
├──────────────────────┤      ├──────────────────────┤
│ PK id                │      │ PK id                │
│ incident_id (FK)     │      │ incident_id (FK)     │
│ user_id (FK)         │      │ event_type           │
│ assigned_by (FK)     │      │ description          │
│ assigned_at          │      │ created_by (FK)      │
│ unassigned_at        │      │ created_at           │
└──────────────────────┘      └──────────────────────┘


┌──────────────────────┐
│ InvestigationNote    │
├──────────────────────┤
│ PK id                │
│ incident_id (FK)     │
│ author_id (FK)       │
│ note                 │
│ created_at           │
└──────────────────────┘


┌──────────────────────┐
│ Comment              │
├──────────────────────┤
│ PK id                │
│ incident_id (FK)     │
│ author_id (FK)       │
│ parent_comment_id FK │
│ comment              │
│ created_at           │
└──────────────────────┘


┌──────────────────────┐
│ Attachment           │
├──────────────────────┤
│ PK id                │
│ incident_id (FK)     │
│ uploaded_by (FK)     │
│ file_name            │
│ storage_key          │
│ mime_type            │
│ created_at           │
└──────────────────────┘


┌──────────────────────┐
│ Notification         │
├──────────────────────┤
│ PK id                │
│ recipient_id (FK)    │
│ incident_id (FK)     │
│ type                 │
│ status               │
│ sent_at              │
└──────────────────────┘


┌──────────────────────┐
│ AuditLog             │
├──────────────────────┤
│ PK id                │
│ actor_id (FK)        │
│ incident_id (FK)     │
│ action               │
│ entity_type          │
│ entity_id            │
│ metadata             │
│ created_at           │
└──────────────────────┘
