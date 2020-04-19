DROP DATABASE IF EXISTS foodfy;

-- CREATED DATABASE
CREATE DATABASE foodfy;

-- CREATED USERS TABLE
CREATE TABLE "users" (
"id" SERIAL PRIMARY KEY,
"name" TEXT NOT NULL,
"email" TEXT UNIQUE NOT NULL,
"password" TEXT NOT NULL,
"reset_token" TEXT,
"reset_token_expires" TEXT,
"is_admin" BOOLEAN DEFAULT false,
"created_at" TIMESTAMP DEFAULT(now()),
"updated_at" TIMESTAMP DEFAULT(now())
);

-- CREATED RECIPES TABLE
CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int,
  "user_id" int,
  "title" text,
  "ingredients" text [],
  "preparation" text [],
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

-- CREATED RECIPE_FILES TABLE
CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" INTEGER,
  "file_id" INTEGER
);

-- CREATED CHEFS TABLE
CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "file_id" integer,
  "name" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

-- CREATED FILES TABLE
CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

-- CREATED SESSION TABLE
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- CREATED CONSTRAINTS
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

-- AUTO UPDATED_AT USERS
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();