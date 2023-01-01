use super::{person::ApiPerson, ApiReceiptLine, PersonId, ReceiptLineId, ReceiptLineSplitId};
use crate::{api::Result, db::receipt_line_split::DbReceiptLineSplit, AppState};
use async_graphql::{Context, Object};

pub struct ApiReceiptLineSplit {
    pub id: ReceiptLineSplitId,
    pub receipt_line_id: ReceiptLineId,
    pub person_id: PersonId,
    pub antecedent: i32,
}

impl From<DbReceiptLineSplit> for ApiReceiptLineSplit {
    fn from(
        DbReceiptLineSplit {
            id,
            receipt_line_id,
            antecedent,
            person_id,
        }: DbReceiptLineSplit,
    ) -> Self {
        Self {
            id,
            receipt_line_id,
            antecedent,
            person_id,
        }
    }
}

#[Object]
impl ApiReceiptLineSplit {
    async fn id(&self) -> ReceiptLineSplitId {
        self.id
    }

    async fn receipt_line(&self, ctx: &Context<'_>) -> Result<ApiReceiptLine> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_receipt_line_by_id(self.receipt_line_id).await
    }

    async fn person(&self, ctx: &Context<'_>) -> Result<ApiPerson> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_person_by_id(self.person_id).await
    }

    async fn antecedent(&self) -> i32 {
        self.antecedent
    }
}
