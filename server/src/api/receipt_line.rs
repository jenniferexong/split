use super::{ApiReceiptLineSplit, Id, Product, Receipt};
use crate::error::{Error, ResourceIdentifier};
use crate::{api::Result, AppState, Db};
use async_graphql::{Context, InputObject, Object};
use serde::Serialize;
use validator::Validate;

#[derive(sqlx::FromRow)]
pub struct DbReceiptLine {
    id: Id,
    receipt_id: Id,
    product_id: Id,
    price: f32,
}

pub struct ApiReceiptLine {
    id: Id,
    receipt_id: Id,
    product_id: Id,
    price: f32,
}

#[Object]
impl ApiReceiptLine {
    async fn receipt(&self, ctx: &Context<'_>) -> Result<Receipt> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_receipt_by_id(self.receipt_id).await
    }

    async fn product(&self, ctx: &Context<'_>) -> Result<Product> {
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

#[derive(Validate, Serialize, InputObject)]
pub struct CreateReceiptLineInput {
    receipt_id: Id,
    product_id: Id,
    price: f32,
}

impl Db {
    pub async fn get_receipt_line_by_id(&self, receipt_line_id: Id) -> Result<ApiReceiptLine> {
        let mut receipt_lines = sqlx::query_as!(
            DbReceiptLine,
            "SELECT id, receipt_id, product_id, price FROM receipt_line WHERE id = $1",
            receipt_line_id
        )
        .fetch_all(&self.pool)
        .await?;

        match receipt_lines.pop() {
            Some(split) => Ok(split.into()),
            None => Err(Error::NotFound(ResourceIdentifier::ReceiptLineId(
                receipt_line_id,
            ))),
        }
    }

    pub async fn create_receipt_line(&self, req: CreateReceiptLineInput) -> Result<ApiReceiptLine> {
        req.validate()?;

        let CreateReceiptLineInput {
            receipt_id,
            product_id,
            price,
        } = req;

        let created_receipt_line = sqlx::query_as!(
            DbReceiptLine,
            "INSERT INTO receipt_line (receipt_id, product_id, price) VALUES ($1, $2, $3) 
            RETURNING id, receipt_id, product_id, price",
            receipt_id,
            product_id,
            price
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(created_receipt_line.into())
    }

    pub async fn get_receipt_lines_by_receipt_id(
        &self,
        receipt_id: Id,
    ) -> Result<Vec<ApiReceiptLine>> {
        let receipt_lines = sqlx::query_as!(
            DbReceiptLine,
            "SELECT line.id, line.receipt_id, line.product_id, line.price 
            FROM receipt_line AS line 
            LEFT JOIN receipt ON line.receipt_id = receipt.id 
            WHERE receipt.id = $1",
            receipt_id
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(receipt_lines.into_iter().map(Into::into).collect())
    }
    // TODO
    // get by person
    // get by product
    // get by month?
}
