use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::postgres::PgTypeInfo;
use std::sync::Arc;
use validator::Validate;

use super::ApiResult;
use crate::error::{Error, ResourceIdentifier};
use crate::AppState;

#[derive(Serialize, sqlx::FromRow, sqlx::Decode)]
#[serde(rename_all = "camelCase")]
pub struct Receipt {
    id: i32,
    //https://github.com/launchbadge/sqlx/issues/856
}

impl sqlx::Type<sqlx::Postgres> for Receipt {
    fn type_info() -> PgTypeInfo {
        PgTypeInfo::with_name("receipt")
    }
}

pub async fn get_receipt_by_id(
    Path(receipt_id): Path<i32>,
    State(state): State<Arc<AppState>>,
) -> ApiResult<Receipt> {
    let mut receipts = sqlx::query_as("SELECT id FROM receipt WHERE id = $1")
        .bind(receipt_id)
        .fetch_all(&state.pool)
        .await?;

    match receipts.pop() {
        Some(receipt) => Ok((StatusCode::OK, Json(receipt))),
        None => Err(Error::NotFound(ResourceIdentifier::ReceiptId(receipt_id))),
    }
}

pub async fn get_all_receipts(State(state): State<Arc<AppState>>) -> ApiResult<Vec<Receipt>> {
    let receipts = sqlx::query_as::<_, Receipt>("SELECT id, name FROM receipt")
        .fetch_all(&state.pool)
        .await?;

    Ok((StatusCode::OK, Json(receipts)))
}

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CreateReceiptRequest {
    #[validate(length(min = 1))]
    name: String,
}

pub async fn create_receipt(
    State(state): State<Arc<AppState>>,
    req: Json<CreateReceiptRequest>,
) -> ApiResult<Receipt> {
    req.validate()?;

    let created_receipt =
        sqlx::query_as::<_, Receipt>("INSERT INTO receipt (name) VALUES ($1) RETURNING id, name")
            .bind(&req.name)
            .fetch_one(&state.pool)
            .await?;

    Ok((StatusCode::CREATED, Json(created_receipt)))
}
