use super::{ApiReceiptLine, CreateReceiptLineInput, Id, Person, Store};
use crate::error::{Error, ResourceIdentifier};
use crate::{api::Result, AppState, Db};
use async_graphql::{Context, InputObject, Object};
use axum::Json;
use sqlx::types::time::Date;
use validator::Validate;

#[derive(sqlx::FromRow)]
pub struct Receipt {
    id: Id,
    store_id: Id,
    person_id: Id,
    date: Date,
}

#[Object]
impl Receipt {
    async fn id(&self) -> Id {
        self.id
    }

    async fn store(&self, ctx: &Context<'_>) -> Result<Store> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_store_by_id(self.store_id).await
    }

    async fn paid_by(&self, ctx: &Context<'_>) -> Result<Person> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_person_by_id(self.person_id).await
    }

    async fn receipt_lines(&self, ctx: &Context<'_>) -> Result<Vec<ApiReceiptLine>> {
        let state = ctx.data_unchecked::<AppState>();
        state
            .db
            .get_receipt_lines_by_receipt_id(self.person_id)
            .await
    }
}

#[derive(Validate, InputObject)]
pub struct CreateReceiptInput {
    store_id: Id,
    receipt_id: Id,
    #[validate(length(min = 1))]
    receipt_lines: Vec<CreateReceiptLineInput>,
}

impl Db {
    pub async fn get_receipt_by_id(&self, receipt_id: Id) -> Result<Receipt> {
        let mut receipts = sqlx::query_as!(
            Receipt,
            "SELECT id, store_id, person_id, date FROM receipt WHERE id = $1",
            receipt_id
        )
        .fetch_all(&self.pool)
        .await?;

        match receipts.pop() {
            Some(receipt) => Ok(receipt),
            None => Err(Error::NotFound(ResourceIdentifier::ReceiptId(receipt_id))),
        }
    }

    pub async fn get_all_receipts(&self) -> Result<Vec<Receipt>> {
        let receipts =
            sqlx::query_as!(Receipt, "SELECT id, store_id, person_id, date FROM receipt")
                .fetch_all(&self.pool)
                .await?;

        Ok(receipts)
    }

    pub async fn create_receipt(&self, req: Json<CreateReceiptInput>) -> Result<Receipt> {
        /*
        req.validate()?;

        let CreateReceiptInput {
            store_id,
            receipt_id,
            receipt_lines,
        } = req;

        let created_receipt = sqlx::query_as!(
            "INSERT INTO receipt (name) VALUES ($1) RETURNING id, name",
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(created_receipt)
        */
        todo!();
    }
}
