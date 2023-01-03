use super::person::ApiPerson;
use super::store::ApiStore;
use super::{ApiReceiptLine, PersonId, ReceiptId, StoreId};
use crate::db::receipt::DbReceipt;
use crate::db::receipt_line::GetReceiptLinesInput;
use crate::{api::Result, AppState};
use async_graphql::{Context, Object};
use chrono::Utc;
use sqlx::types::chrono::DateTime;

pub struct ApiReceipt {
    pub id: ReceiptId,
    pub store_id: StoreId,
    pub person_id: PersonId,
    pub date: DateTime<Utc>,
}

impl From<DbReceipt> for ApiReceipt {
    fn from(
        DbReceipt {
            id,
            store_id,
            person_id,
            date,
        }: DbReceipt,
    ) -> ApiReceipt {
        Self {
            id,
            store_id,
            person_id,
            date,
        }
    }
}

#[Object]
impl ApiReceipt {
    async fn id(&self) -> ReceiptId {
        self.id
    }

    async fn date(&self) -> DateTime<Utc> {
        self.date
    }

    async fn store(&self, ctx: &Context<'_>) -> Result<ApiStore> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_store_by_id(self.store_id).await
    }

    async fn paid_by(&self, ctx: &Context<'_>) -> Result<ApiPerson> {
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
