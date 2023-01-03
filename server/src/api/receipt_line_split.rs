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

    async fn amount(&self, ctx: &Context<'_>) -> Result<f32> {
        let state = ctx.data_unchecked::<AppState>();
        let siblings = state
            .db
            .get_receipt_line_splits_by_receipt_line_id(self.receipt_line_id)
            .await?;

        let price = state
            .db
            .get_receipt_line_by_id(self.receipt_line_id)
            .await?
            .price;

        let consequent = siblings
            .iter()
            .map(|sibling| sibling.antecedent)
            .sum::<i32>() as f32;

        Ok((price / consequent) * self.antecedent as f32)
    }
}
