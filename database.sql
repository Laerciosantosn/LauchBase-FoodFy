DROP DATABASE IF EXISTS foodfy;

CREATE DATABASE foodfy;

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int,
  "image" text,
  "title" text,
  "ingredients" text [],
  "preparation" text [],
  "information" text,
  "created_at" timestamp DEFAULT (now())
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "file_id" integer,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" INTEGER,
  "file_id" INTEGER
);

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE;
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;
ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

-- CREATE PROCEDURE
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- AUTO UPDATED_AT CHEFS
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- AUTO UPDATED_AT RECIPES
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- CONNECT PG SIMPLE TABLE
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
