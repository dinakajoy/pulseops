# Architecture

## High-Level System Architecture
                                    +-----------------------------+
                                    |      SaaS Organization      |
                                    | (AcceleratorApp, etc.)      |
                                    +-------------+---------------+
                                                  |
                           Customer reports issue through SaaS Product
                                                  |
                                                  ▼
                                    +-----------------------------+
                                    |      Support Engineer       |
                                    | Creates Incident in         |
                                    |         PulseOps           |
                                    +-------------+---------------+
                                                  |
                                                  ▼
========================================================================================
                                 PulseOps Platform
========================================================================================

                    ┌────────────────────────────────────────────────┐
                    │                  Web Frontend                  │
                    │         (React / Next.js / Vue, etc.)          │
                    └──────────────────────┬─────────────────────────┘
                                           │
                                           ▼
                    ┌────────────────────────────────────────────────┐
                    │                REST API Gateway                │
                    │ Authentication • Authorization • Validation    │
                    └──────────────────────┬─────────────────────────┘
                                           │
                  ┌────────────────────────┼─────────────────────────┐
                  │                        │                         │
                  ▼                        ▼                         ▼

     ┌───────────────────┐    ┌────────────────────┐    ┌────────────────────┐
     │ Identity Service  │    │ Incident Service   │    │ Notification Service│
     │                   │    │                    │    │                    │
     │ Login             │    │ Incident CRUD      │    │ Email              │
     │ JWT               │    │ Assignment         │    │ In-App Alerts      │
     │ Users             │    │ Timeline           │    │ Future: Slack      │
     │ Roles             │    │ Investigation      │    │ Future: Teams      │
     └─────────┬─────────┘    │ Comments           │    └─────────┬──────────┘
               │              │ Attachments        │              │
               │              │ Audit              │              │
               │              └─────────┬──────────┘              │
               │                        │                         │
               └────────────────────────┼─────────────────────────┘
                                        ▼
                         ┌──────────────────────────────────┐
                         │      Reporting Service           │
                         │ Dashboards • KPIs • Metrics      │
                         └──────────────────────────────────┘

========================================================================================
                               Persistence Layer
========================================================================================

             ┌─────────────────────────────────────────────────────────┐
             │                  PostgreSQL Database                    │
             │                                                         │
             │ Organizations                                            │
             │ Users                                                    │
             │ Projects                                                 │
             │ Services                                                 │
             │ Customer Reports                                         │
             │ Incidents                                                │
             │ Incident Assignments                                     │
             │ Timeline Events                                          │
             │ Investigation Notes                                      │
             │ Comments                                                 │
             │ Notifications                                            │
             │ Audit Logs                                               │
             └─────────────────────────────────────────────────────────┘

                        │                               │
                        ▼                               ▼

            ┌──────────────────────┐       ┌──────────────────────┐
            │ Object Storage        │       │ Redis               │
            │                      │       │                      │
            │ Screenshots          │       │ Cache               │
            │ Log Files            │       │ Sessions            │
            │ HAR Files            │       │ Queues (optional)   │
            │ Attachments          │       └──────────────────────┘
            └──────────────────────┘

========================================================================================
                          External Integrations (Future)
========================================================================================

                GitHub        Slack       Microsoft Teams
                   │             │               │
                   └─────────────┼───────────────┘
                                 │
                          Email Provider

## Logical Architecture
                        PulseOps

         ┌─────────────────────────────────────┐
         │         Presentation Layer          │
         │  Web UI / REST API / Documentation  │
         └─────────────────────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │        Application Layer            │
         │                                     │
         │ Authentication                      │
         │ Incident Management                 │
         │ User Management                     │
         │ Notifications                       │
         │ Reporting                           │
         └─────────────────────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │           Domain Layer              │
         │                                     │
         │ Incident                            │
         │ Assignment                          │
         │ Timeline                            │
         │ Investigation                       │
         │ Customer Report                     │
         │ Project                             │
         │ Service                             │
         │ Organization                        │
         └─────────────────────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │        Infrastructure Layer         │
         │                                     │
         │ PostgreSQL                          │
         │ Redis                               │
         │ Object Storage                      │
         │ Email                               │
         │ Logging                             │
         │ Monitoring                          │
         └─────────────────────────────────────┘

## Deployment Architecture
                               Internet
                                   │
                                   ▼
                          DNS / Cloudflare
                                   │
                                   ▼
                           Load Balancer
                                   │
                                   ▼
                     +-----------------------------+
                     |     PulseOps API (Docker)   |
                     |     Multiple Instances      |
                     +-----------------------------+
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
             PostgreSQL         Redis        Object Storage
           (Shared DB)         Cache          Attachments
                    │
                    ▼
          Organizations
                 │
      tenant_id = 1
      tenant_id = 2
      tenant_id = 3