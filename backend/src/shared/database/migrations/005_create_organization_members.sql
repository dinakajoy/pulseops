CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id),

    user_id UUID NOT NULL
        REFERENCES users(id),

    role_id UUID NOT NULL
        REFERENCES roles(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (organization_id, user_id)
);