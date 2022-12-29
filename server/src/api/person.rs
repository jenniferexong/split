use async_graphql::{InputObject, SimpleObject};

use validator::Validate;

use super::Id;
use crate::{
    api::{PgCodes, Result},
    error::{Error, ResourceIdentifier},
    Db,
};

#[derive(SimpleObject, sqlx::FromRow)]
pub struct Person {
    id: Id,
    first_name: String,
    last_name: String,
    email: String,
}

#[derive(Validate, InputObject)]
pub struct CreatePersonInput {
    #[validate(length(min = 1))]
    first_name: String,
    #[validate(length(min = 1))]
    last_name: String,
    #[validate(email)]
    email: String,
}

impl Db {
    pub async fn get_person_by_id(&self, person_id: Id) -> Result<Person> {
        let mut people = sqlx::query_as!(
            Person,
            "SELECT id, first_name, last_name, email FROM person WHERE id = $1",
            person_id
        )
        .fetch_all(&self.pool)
        .await?;

        match people.pop() {
            Some(person) => Ok(person),
            None => Err(Error::NotFound(ResourceIdentifier::PersonId(person_id))),
        }
    }

    pub async fn get_all_people(&self) -> Result<Vec<Person>> {
        let people = sqlx::query_as!(
            Person,
            "SELECT id, first_name, last_name, email FROM person"
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(people)
    }

    pub async fn create_person(&self, req: CreatePersonInput) -> Result<Person> {
        req.validate()?;

        let CreatePersonInput {
            first_name,
            last_name,
            email,
        } = req;

        let created_person = sqlx::query_as!(
            Person,
            "INSERT INTO person (first_name, last_name, email) 
            VALUES ($1, $2, $3) 
            RETURNING id, first_name, last_name, email",
            first_name,
            last_name,
            email
        )
        .fetch_one(&self.pool)
        .await;

        match created_person {
            Ok(store) => Ok(store),
            Err(err) => {
                if let sqlx::Error::Database(err) = &err {
                    if let (Some(code), Some(constraint)) = (err.code(), err.constraint()) {
                        if code == PgCodes::CONSTRAINT_VIOLATION
                            && constraint == "unique_person_email"
                        {
                            return Err(Error::AlreadyExists(ResourceIdentifier::PersonEmail(
                                email,
                            )));
                        }
                    }
                }

                tracing::error!("Create person with email `{email}` failed: {err}");
                Err(Error::Database(err))
            }
        }
    }
}
