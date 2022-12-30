use super::receipt_line::GetReceiptLinesInput;
use super::{ApiReceiptLine, CreateReceiptLineInput, Person, PersonId, ReceiptId, Store, StoreId};
use crate::error::{Error, ResourceIdentifier};
use crate::{api::Result, AppState, Db};
use async_graphql::{Context, InputObject, Object};
use chrono::Utc;
use sqlx::types::chrono::DateTime;
use validator::Validate;

#[derive(sqlx::FromRow)]
pub struct Receipt {
    id: ReceiptId,
    store_id: StoreId,
    person_id: PersonId,
    date: DateTime<Utc>,
}

#[Object]
impl Receipt {
    async fn id(&self) -> ReceiptId {
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
            .get_receipt_lines(GetReceiptLinesInput {
                receipt_id: Some(self.id),
                ..Default::default()
            })
            .await
    }
}

#[derive(Validate, InputObject)]
pub struct CreateReceiptInput {
    store_id: StoreId,
    person_id: PersonId,
    date: DateTime<Utc>,
    #[validate(length(min = 1))]
    receipt_lines: Vec<CreateReceiptLineInput>,
}

impl Db {
    pub async fn get_receipt_by_id(&self, receipt_id: ReceiptId) -> Result<Receipt> {
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

    pub async fn create_receipt(&self, req: CreateReceiptInput) -> Result<Receipt> {
        req.validate()?;

        let CreateReceiptInput {
            store_id,
            person_id,
            date,
            receipt_lines,
        } = req;

        let created_receipt = sqlx::query_as!(
            Receipt,
            "INSERT INTO receipt (store_id, person_id, date) VALUES ($1, $2, $3) RETURNING id, store_id, person_id, date",
            store_id, person_id, date
        )
        .fetch_one(&self.pool)
        .await?;

        // TODO remove receiptId from receipt line input thing
        for item in receipt_lines {
            self.create_receipt_line(item).await?;
        }

        Ok(created_receipt)
    }
}
