use super::{
    receipt_line::{CreateReceiptLineInput, CreateReceiptReceiptLineSplitInput},
    Db,
};
use crate::{
    api::{receipt::ApiReceipt, PersonId, ProductId, ReceiptId, Result, StoreId},
    error::{Error, ResourceIdentifier},
};
use async_graphql::InputObject;
use chrono::{DateTime, Utc};
use serde::Serialize;
use validator::Validate;

#[derive(sqlx::FromRow, Clone, Copy)]
pub struct DbReceipt {
    pub(crate) id: ReceiptId,
    pub(crate) store_id: StoreId,
    pub(crate) person_id: PersonId,
    pub(crate) date: DateTime<Utc>,
}

#[derive(Validate, InputObject)]
pub struct CreateReceiptInput {
    store_id: StoreId,
    person_id: PersonId,
    date: DateTime<Utc>,
    #[validate(length(min = 1))]
    receipt_lines: Vec<CreateReceiptReceiptLineInput>,
}

#[derive(Validate, Serialize, InputObject)]
pub struct CreateReceiptReceiptLineInput {
    product_id: ProductId,
    price: f32,
    #[validate(length(min = 1))]
    receipt_line_splits: Vec<CreateReceiptReceiptLineSplitInput>,
}

impl Db {
    pub async fn get_receipt_by_id(&self, receipt_id: ReceiptId) -> Result<ApiReceipt> {
        let mut receipts = sqlx::query_as!(
            DbReceipt,
            r#"
                SELECT id AS "id: ReceiptId",
                       store_id AS "store_id: StoreId",
                       person_id AS "person_id: PersonId",
                       date
                FROM receipt WHERE id = $1
            "#,
            receipt_id.0
        )
        .fetch_all(&self.pool)
        .await?;

        match receipts.pop() {
            Some(receipt) => Ok(receipt.into()),
            None => Err(Error::NotFound(ResourceIdentifier::ReceiptId(receipt_id))),
        }
    }

    pub async fn get_receipts_by_person_id(&self, person_id: PersonId) -> Result<Vec<ApiReceipt>> {
        let receipts = self.receipt_loader.load_one(person_id).await?;

        match receipts {
            Some(receipts) => Ok(receipts.into_iter().map(Into::into).collect()),
            None => Ok(vec![]),
        }
    }

    pub async fn get_all_receipts(&self) -> Result<Vec<ApiReceipt>> {
        struct ReceiptKey {
            id: ReceiptId,
        }

        let keys = sqlx::query_as!(
            ReceiptKey,
            r#"
                SELECT id AS "id: ReceiptId"
                FROM receipt
                ORDER BY date DESC
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        let receipts = self
            .receipt_loader
            .load_many(keys.iter().map(|key| key.id))
            .await?;

        Ok(keys.iter().map(|k| receipts[&k.id].into()).collect())
    }

    pub async fn create_receipt(&self, req: CreateReceiptInput) -> Result<ApiReceipt> {
        req.validate()?;

        let CreateReceiptInput {
            store_id,
            person_id,
            date,
            receipt_lines,
        } = req;

        let created_receipt = sqlx::query_as!(
            DbReceipt,
            r#"
                INSERT INTO receipt (store_id, person_id, date)
                VALUES ($1, $2, $3)
                RETURNING id AS "id: ReceiptId",
                          store_id AS "store_id: StoreId",
                          person_id AS "person_id: PersonId",
                          date
            "#,
            store_id.0,
            person_id.0,
            date
        )
        .fetch_one(&self.pool)
        .await?;

        for line in receipt_lines {
            self.create_receipt_line(CreateReceiptLineInput {
                receipt_id: created_receipt.id,
                product_id: line.product_id,
                price: line.price,
                receipt_line_splits: line.receipt_line_splits,
            })
            .await?;
        }

        Ok(created_receipt.into())
    }
}
