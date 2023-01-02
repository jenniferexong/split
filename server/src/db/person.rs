use super::Db;
use crate::{
    api::{person::ApiPerson, PersonId, Result},
    error::{Error, ResourceIdentifier},
};
use async_graphql::InputObject;
use validator::Validate;

#[derive(sqlx::FromRow, Clone)]
pub struct DbPerson {
    pub(crate) id: PersonId,
    pub(crate) first_name: String,
    pub(crate) last_name: String,
    pub(crate) email: String,
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
    pub async fn get_person_by_id(&self, person_id: PersonId) -> Result<ApiPerson> {
        let person = self.person_loader.load_one(person_id).await?;

        match person {
            Some(person) => Ok(person.into()),
            None => Err(Error::NotFound(ResourceIdentifier::PersonId(person_id))),
        }
    }

    pub async fn get_all_people(&self) -> Result<Vec<ApiPerson>> {
        struct PersonKey {
            id: PersonId,
        }

        let keys = sqlx::query_as!(
            PersonKey,
            r#"
                SELECT id as "id: PersonId"
                FROM person
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        let people = self
            .person_loader
            .load_many(keys.iter().map(|key| key.id))
            .await?;

        Ok(people
            .values()
            .cloned()
            .into_iter()
            .map(Into::into)
            .collect())
    }

    pub async fn create_person(&self, req: CreatePersonInput) -> Result<ApiPerson> {
        req.validate()?;

        let CreatePersonInput {
            first_name,
            last_name,
            email,
        } = req;

        let created_person = sqlx::query_as!(
            DbPerson,
            r#"
                INSERT INTO person (first_name, last_name, email)
                VALUES ($1, $2, $3)
                RETURNING id AS "id: PersonId", first_name, last_name, email
            "#,
            first_name,
            last_name,
            email
        )
        .fetch_one(&self.pool)
        .await;

        let resource_identifier = &ResourceIdentifier::PersonEmail(email);

        match created_person {
            Ok(store) => Ok(store.into()),
            Err(err) => {
                if let Some(err) = Db::handle_unique_constraint_violation(
                    &err,
                    resource_identifier,
                    "unique_person_name",
                ) {
                    return Err(err);
                }

                tracing::error!("Create {resource_identifier} failed: {err}");
                Err(err.into())
            }
        }
    }
}
