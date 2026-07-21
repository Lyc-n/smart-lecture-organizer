-- Full-text search GIN indexes for items
CREATE INDEX IF NOT EXISTS idx_items_name_fts ON items USING GIN (to_tsvector('indonesian', name));

-- Full-text search GIN indexes for groups (searchable fields: name, subtitle, description)
CREATE INDEX IF NOT EXISTS idx_groups_search_fts ON groups USING GIN (to_tsvector('indonesian', coalesce(name, '') || ' ' || coalesce(subtitle, '') || ' ' || coalesce(description, '')));
