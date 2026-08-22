CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE organization_status AS ENUM (
    'active',
    'suspended',
    'archived'
);

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,

    slug VARCHAR(255) NOT NULL,

    status organization_status NOT NULL DEFAULT 'active',

    owner_email VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT organizations_slug_unique
        UNIQUE (slug)
);

CREATE INDEX organizations_status_idx
    ON organizations(status);

CREATE INDEX organizations_created_at_idx
    ON organizations(created_at);