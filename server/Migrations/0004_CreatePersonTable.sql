CREATE TABLE person (
    id serial PRIMARY KEY,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(50) UNIQUE NOT NULL
);

CREATE UNIQUE INDEX unique_person_email ON person (lower(email));

