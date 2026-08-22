CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,

    description TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT roles_name_unique UNIQUE (name)
); 

INSERT INTO roles (name, description)
VALUES
    ('ADMIN', 'Responsible for system administration.'),
    ('ENGINEERING_MANAGER', 'Responsible for coordinating engineering work.'),
    ('BACKEND_ENGINEER', 'Responsible for backend services.'),
    ('FRONTEND_ENGINEER', 'Responsible for frontend services.'),
    ('DEVOPS_ENGINEER', 'Responsible for infrastructure.'),
    ('SUPPORT_ENGINEER', 'First responder for customer complaints and incidents.'),
    ('CUSTOMER_SUCCESS', 'Read-only customer-facing role.')
ON CONFLICT (name) DO NOTHING;