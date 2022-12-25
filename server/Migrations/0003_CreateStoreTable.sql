CREATE TABLE store (
    id serial PRIMARY KEY,
    name varchar(50) NOT NULL
);

CREATE UNIQUE INDEX unique_store_name ON store (lower(name));

