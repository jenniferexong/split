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
pub struct Product {
    id: i32,
    name: String,
}

pub async fn get_product_by_id(
    Path(product_id): Path<i32>,
    State(state): State<Arc<AppState>>,
) -> ApiResult<Product> {
    let mut products = sqlx::query_as("SELECT id, name FROM product WHERE id = $1")
        .bind(product_id)
        .fetch_all(&state.pool)
        .await?;

    match products.pop() {
        Some(product) => Ok((StatusCode::OK, Json(product))),
        None => Err(Error::NotFound(ResourceIdentifier::ProductId(product_id))),
    }
}

pub async fn get_all_products(State(state): State<Arc<AppState>>) -> ApiResult<Vec<Product>> {
    let products = sqlx::query_as::<_, Product>("SELECT id, name FROM product")
        .fetch_all(&state.pool)
        .await?;

    Ok((StatusCode::OK, Json(products)))
}

#[derive(Deserialize, Validate)]
pub struct CreateProductRequest {
    #[validate(length(min = 1))]
    name: String,
}

pub async fn create_product(
    State(state): State<Arc<AppState>>,
    req: Json<CreateProductRequest>,
) -> ApiResult<Product> {
    req.validate()?;

    let created_product =
        sqlx::query_as::<_, Product>("INSERT INTO product (name) VALUES ($1) RETURNING id, name")
            .bind(&req.name)
            .fetch_one(&state.pool)
            .await;

    match created_product {
        Ok(product) => Ok((StatusCode::CREATED, Json(product))),
        Err(err) => {
            if let sqlx::Error::Database(err) = &err {
                if let (Some(code), Some(constraint)) = (err.code(), err.constraint()) {
                    if code == PgCodes::CONSTRAINT_VIOLATION && constraint == "unique_product_name"
                    {
                        return Err(Error::AlreadyExists(ResourceIdentifier::ProductName(
                            req.name.clone(),
                        )));
                    }
                }
            }

            tracing::error!("Create product with name=\"{}\" failed: {err}", req.name);
            Err(Error::Database(err))
        }
    }
}
