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
pub struct Store {
    id: i32,
    name: String,
}

pub async fn get_store_by_id(
    Path(store_id): Path<i32>,
    State(state): State<Arc<AppState>>,
) -> ApiResult<Store> {
    let mut stores = sqlx::query_as("SELECT id, name FROM store WHERE id = $1")
        .bind(store_id)
        .fetch_all(&state.pool)
        .await?;

    match stores.pop() {
        Some(store) => Ok((StatusCode::OK, Json(store))),
        None => Err(Error::NotFound(ResourceIdentifier::StoreId(store_id))),
    }
}

pub async fn get_all_stores(State(state): State<Arc<AppState>>) -> ApiResult<Vec<Store>> {
    let stores = sqlx::query_as::<_, Store>("SELECT id, name FROM store")
        .fetch_all(&state.pool)
        .await?;

    Ok((StatusCode::OK, Json(stores)))
}

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CreateStoreRequest {
    #[validate(length(min = 1))]
    name: String,
}

pub async fn create_store(
    State(state): State<Arc<AppState>>,
    req: Json<CreateStoreRequest>,
) -> ApiResult<Store> {
    req.validate()?;

    let created_store =
        sqlx::query_as::<_, Store>("INSERT INTO store (name) VALUES ($1) RETURNING id, name")
            .bind(&req.name)
            .fetch_one(&state.pool)
            .await;

    match created_store {
        Ok(store) => Ok((StatusCode::CREATED, Json(store))),
        Err(err) => {
            if let sqlx::Error::Database(err) = &err {
                if let (Some(code), Some(constraint)) = (err.code(), err.constraint()) {
                    if code == PgCodes::CONSTRAINT_VIOLATION && constraint == "unique_store_name" {
                        return Err(Error::AlreadyExists(ResourceIdentifier::StoreName(
                            req.name.clone(),
                        )));
                    }
                }
            }

            tracing::error!("Create store with name=\"{}\" failed: {err}", req.name);
            Err(Error::Database(err))
        }
    }
}
