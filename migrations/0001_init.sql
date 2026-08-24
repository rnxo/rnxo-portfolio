-- DESIGN.md 3章のデータモデルに対応するマイグレーション
CREATE TABLE articles (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,
  body            TEXT NOT NULL,
  cover_image_url TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at    TEXT,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_articles_slug ON articles (slug);
CREATE INDEX idx_articles_status_published_at ON articles (status, published_at DESC);
