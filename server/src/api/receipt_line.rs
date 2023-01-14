use super::{
    product::ApiProduct, receipt::ApiReceipt, ApiReceiptLineSplit, ProductId, ReceiptId,
    ReceiptLineId,
};
use crate::{api::Result, db::receipt_line::DbReceiptLine, AppState};
use async_graphql::{Context, Object};

pub struct ApiReceiptLine {
    pub id: ReceiptLineId,
    pub receipt_id: ReceiptId,
    pub product_id: ProductId,
    pub price: f32,
}

impl From<DbReceiptLine> for ApiReceiptLine {
    fn from(
        DbReceiptLine {
            id,
            receipt_id,
            product_id,
            price,
        }: DbReceiptLine,
    ) -> ApiReceiptLine {
        Self {
            id,
            receipt_id,
            product_id,
            price,
        }
    }
}

#[Object]
impl ApiReceiptLine {
    async fn id(&self) -> ReceiptLineId {
        self.id
    }

    async fn receipt(&self, ctx: &Context<'_>) -> Result<ApiReceipt> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_receipt_by_id(self.receipt_id).await
    }

    async fn product(&self, ctx: &Context<'_>) -> Result<ApiProduct> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_product_by_id(self.product_id).await
    }

    async fn price(&self) -> f32 {
        self.price
    }

    async fn splits(&self, ctx: &Context<'_>) -> Result<Vec<ApiReceiptLineSplit>> {
        let state = ctx.data_unchecked::<AppState>();
        state
            .db
            .get_receipt_line_splits_by_receipt_line_id(self.id)
            .await
    }
}
