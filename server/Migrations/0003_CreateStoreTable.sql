CREATE TABLE store (
    id serial PRIMARY KEY,
    name varchar(100) UNIQUE NOT NULL
);

CREATE UNIQUE INDEX UNQ_store_name ON store (lower(name));

