CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE invitation_status AS ENUM (
    'pending',
    'accepted',
    'revoked'
);

CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    email VARCHAR(255) NOT NULL,

    role_id UUID NOT NULL
        REFERENCES roles(id),

    token_hash VARCHAR(255) NOT NULL,

    status invitation_status NOT NULL DEFAULT 'pending',

    expires_at TIMESTAMPTZ NOT NULL,

    accepted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT invitations_organization_fk
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT invitations_token_hash_unique
        UNIQUE (token_hash)
);

CREATE INDEX invitations_status_idx
    ON invitations(status);

CREATE INDEX invitations_created_at_idx
    ON invitations(created_at);