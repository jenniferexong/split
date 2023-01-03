use async_graphql::{Context, Object};

use crate::api::Result;
use crate::db::person::DbPerson;
use crate::AppState;

use super::receipt::ApiReceipt;
use super::receipt_line_split::ApiReceiptLineSplit;
use super::PersonId;

pub struct ApiPerson {
    pub id: PersonId,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
}

impl From<DbPerson> for ApiPerson {
    fn from(
        DbPerson {
            id,
            first_name,
            last_name,
            email,
        }: DbPerson,
    ) -> Self {
        Self {
            id,
            first_name,
            last_name,
            email,
        }
    }
}

#[Object]
impl ApiPerson {
    async fn id(&self) -> PersonId {
        self.id
    }

    async fn first_name(&self) -> &str {
        &self.first_name
    }

    async fn last_name(&self) -> &str {
        &self.last_name
    }

    async fn email(&self) -> &str {
        &self.email
    }

    async fn receipt_line_splits(&self, ctx: &Context<'_>) -> Result<Vec<ApiReceiptLineSplit>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_receipt_line_splits_by_person_id(self.id).await
    }

    async fn receipts(&self, ctx: &Context<'_>) -> Result<Vec<ApiReceipt>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_receipts_by_person_id(self.id).await
    }
}
