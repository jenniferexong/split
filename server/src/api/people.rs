use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use validator::Validate;

use super::ApiResult;
use crate::AppState;
use crate::{
    api::PgCodes,
    error::{Error, ResourceIdentifier},
};

#[derive(Serialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Person {
    id: i32,
    first_name: String,
    last_name: String,
    email: String,
}

pub async fn get_person_by_id(
    Path(person_id): Path<i32>,
    State(state): State<Arc<AppState>>,
) -> ApiResult<Person> {
    let mut people =
        sqlx::query_as("SELECT id, first_name, last_name, email FROM person WHERE id = $1")
            .bind(person_id)
            .fetch_all(&state.pool)
            .await?;

    match people.pop() {
        Some(person) => Ok((StatusCode::OK, Json(person))),
        None => Err(Error::NotFound(ResourceIdentifier::PersonId(person_id))),
    }
}

pub async fn get_all_people(State(state): State<Arc<AppState>>) -> ApiResult<Vec<Person>> {
    let people = sqlx::query_as::<_, Person>("SELECT id, first_name, last_name, email FROM person")
        .fetch_all(&state.pool)
        .await?;

    Ok((StatusCode::OK, Json(people)))
}

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CreatePersonRequest {
    #[validate(length(min = 1))]
    first_name: String,
    #[validate(length(min = 1))]
    last_name: String,
    #[validate(email)]
    email: String,
}

pub async fn create_person(
    State(state): State<Arc<AppState>>,
    req: Json<CreatePersonRequest>,
) -> ApiResult<Person> {
    req.validate()?;

    let created_person = sqlx::query_as::<_, Person>(
        "INSERT INTO person (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING id, first_name, last_name, email",
    )
    .bind(&req.first_name)
    .bind(&req.last_name)
    .bind(&req.email)
    .fetch_one(&state.pool)
    .await;

    match created_person {
        Ok(store) => Ok((StatusCode::CREATED, Json(store))),
        Err(err) => {
            if let sqlx::Error::Database(err) = &err {
                if let (Some(code), Some(constraint)) = (err.code(), err.constraint()) {
                    if code == PgCodes::CONSTRAINT_VIOLATION && constraint == "unique_person_email"
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
