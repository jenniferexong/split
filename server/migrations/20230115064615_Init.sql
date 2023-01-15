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
    email varchar(50) NOT NULL,
    CONSTRAINT check_person CHECK (LENGTH(first_name) > 0 AND LENGTH(last_name) > 0 AND LENGTH(email) > 0)
);

CREATE UNIQUE INDEX unique_person_email ON person (lower(email));

CREATE TABLE receipt (
    id serial PRIMARY KEY,
    store_id int REFERENCES store (id) NOT NULL,
    -- Paid by
    person_id int REFERENCES person (id) NOT NULL,
    date timestamptz NOT NULL
);

CREATE TABLE receipt_line (
    id serial PRIMARY KEY,
    receipt_id int REFERENCES receipt (id) ON DELETE CASCADE NOT NULL,
    product_id int REFERENCES product (id) NOT NULL,
    price float (8) NOT NULL
);

CREATE TABLE receipt_line_split (
    id serial PRIMARY KEY,
    receipt_line_id int REFERENCES receipt_line (id) ON DELETE CASCADE NOT NULL,
    -- Paid by
    person_id int REFERENCES person (id) NOT NULL,
    -- numerator of ratio!
    antecedent int NOT NULL
);

CREATE UNIQUE INDEX unique_receipt_line_split ON receipt_line_split (receipt_line_id, person_id);

COMMIT;

-- DROP TABLE product, store, person, receipt, receipt_line, receipt_line_split;
