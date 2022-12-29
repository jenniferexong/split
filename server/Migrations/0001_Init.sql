BEGIN;

CREATE TABLE product (
    id serial PRIMARY KEY,
    name varchar(50) NOT NULL,
    CONSTRAINT check_product_name CHECK (LENGTH(name) > 0)
);

CREATE UNIQUE INDEX unique_product_name ON product (lower(name));

CREATE TABLE store (
    id serial PRIMARY KEY,
    name varchar(50) NOT NULL,
    CONSTRAINT check_store_name CHECK (LENGTH(name) > 0)
);

CREATE UNIQUE INDEX unique_store_name ON store (lower(name));

CREATE TABLE person (
    id serial PRIMARY KEY,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(50) UNIQUE NOT NULL,
    CONSTRAINT check_person CHECK (LENGTH(first_name) > 0 AND LENGTH(last_name) > 0 AND LENGTH(email) > 0)
);

CREATE UNIQUE INDEX unique_person_email ON person (lower(email));

CREATE TABLE receipt (
    id serial PRIMARY KEY,
    store_id int REFERENCES store (id) NOT NULL
);

COMMIT;

-- DROP TABLE product, store, person;
