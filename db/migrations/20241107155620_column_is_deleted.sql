-- migrate:up
ALTER TABLE tasks
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- migrate:down
ALTER TABLE tasks
DROP COLUMN is_deleted;

