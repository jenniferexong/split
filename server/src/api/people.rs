use async_graphql::{InputObject, SimpleObject};


use validator::Validate;

use crate::{
    api::{PgCodes, Result},
    error::{Error, ResourceIdentifier},
    Db,
};

#[derive(SimpleObject, sqlx::FromRow)]
pub struct Person {
    id: i32,
    first_name: String,
    last_name: String,
    email: String,
}

#[derive(Validate, InputObject)]
pub struct CreatePersonRequest {
    #[validate(length(min = 1))]
    first_name: String,
    #[validate(length(min = 1))]
    last_name: String,
    #[validate(email)]
    email: String,
}

impl Db {
    pub async fn get_person_by_id(&self, person_id: i32) -> Result<Person> {
        let mut people =
            sqlx::query_as("SELECT id, first_name, last_name, email FROM person WHERE id = $1")
                .bind(person_id)
                .fetch_all(&self.pool)
                .await?;

        match people.pop() {
            Some(person) => Ok(person),
            None => Err(Error::NotFound(ResourceIdentifier::PersonId(person_id))),
        }
    }

    pub async fn get_all_people(&self) -> Result<Vec<Person>> {
        let people =
            sqlx::query_as::<_, Person>("SELECT id, first_name, last_name, email FROM person")
                .fetch_all(&self.pool)
                .await?;

        Ok(people)
    }

    pub async fn create_person(&self, req: CreatePersonRequest) -> Result<Person> {
        req.validate()?;

        let created_person = sqlx::query_as::<_, Person>(
        "INSERT INTO person (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING id, first_name, last_name, email",
    )
    .bind(&req.first_name)
    .bind(&req.last_name)
    .bind(&req.email)
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
                                req.email.clone(),
                            )));
                        }
                    }
                }

                tracing::error!("Create person with email=\"{}\" failed: {err}", req.email);
                Err(Error::Database(err))
            }
        }
    }
}
