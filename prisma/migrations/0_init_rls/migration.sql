-- Enable PostgreSQL Row-Level Security (RLS) for Tenant Isolation
CREATE TABLE IF NOT EXISTS "Tenant" (
    "tenantId" TEXT NOT NULL PRIMARY KEY,
    "companyName" VARCHAR(255) NOT NULL,
    "planTier" TEXT NOT NULL DEFAULT 'pro',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "HardwareProject" (
    "projectId" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL REFERENCES "Tenant"("tenantId") ON DELETE CASCADE,
    "projectName" VARCHAR(255) NOT NULL,
    "edaFormat" TEXT NOT NULL DEFAULT 'kicad',
    "bomData" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "HardwareProject" ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON "HardwareProject"
    AS RESTRICTIVE
    FOR ALL
    USING ("tenantId" = nullif(current_setting('app.current_tenant_id', true), ''));
