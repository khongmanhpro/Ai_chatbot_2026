-- PostgreSQL Initialization Script for LightRAG Insurance
-- This script will run automatically when PostgreSQL container starts

-- Create pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create dedicated schema
CREATE SCHEMA IF NOT EXISTS lightrag;

-- Set search path
ALTER DATABASE lightrag_insurance SET search_path TO lightrag, public;

-- Create monitoring user (optional - for read-only access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'lightrag_readonly') THEN
    CREATE ROLE lightrag_readonly WITH LOGIN PASSWORD 'readonly_pass_change_me';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE lightrag_insurance TO lightrag_readonly;
GRANT USAGE ON SCHEMA lightrag TO lightrag_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA lightrag TO lightrag_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA lightrag GRANT SELECT ON TABLES TO lightrag_readonly;

-- Performance tuning for RAG workload
-- These settings are optimized for a system with 8GB+ RAM
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '128MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;  -- SSD optimized
ALTER SYSTEM SET effective_io_concurrency = 200;  -- SSD optimized
ALTER SYSTEM SET work_mem = '8MB';
ALTER SYSTEM SET huge_pages = 'try';
ALTER SYSTEM SET max_worker_processes = 8;
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;
ALTER SYSTEM SET max_parallel_workers = 8;

-- Log settings for debugging (can be disabled in production)
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log slow queries > 1s
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';
