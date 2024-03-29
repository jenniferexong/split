use super::receipt_line_split::CreateReceiptLineSplitInput;
use crate::api::receipt_line::ApiReceiptLine;
use crate::api::{PersonId, ProductId, ReceiptId, ReceiptLineId};
use crate::error::{Error, ResourceIdentifier};
use crate::{api::Result, Db};
use async_graphql::InputObject;
use serde::Serialize;
use validator::Validate;

#[derive(sqlx::FromRow, Clone, Copy)]
pub struct DbReceiptLine {
    pub(crate) id: ReceiptLineId,
    pub(crate) receipt_id: ReceiptId,
    pub(crate) product_id: ProductId,
    pub(crate) price: f32,
}

#[derive(Validate, Serialize, InputObject)]
pub struct CreateReceiptLineInput {
    pub receipt_id: ReceiptId,
    pub product_id: ProductId,
    pub price: f32,
    #[validate(length(min = 1))]
    pub receipt_line_splits: Vec<CreateReceiptReceiptLineSplitInput>,
}

#[derive(Validate, Serialize, InputObject)]
pub struct CreateReceiptReceiptLineSplitInput {
    pub person_id: PersonId,
    #[validate(range(min = 1))]
    pub antecedent: i32,
}

#[derive(Default, InputObject)]
pub struct GetReceiptLinesInput {
    pub receipt_id: Option<ReceiptId>,
    pub product_id: Option<ProductId>,
}

impl Db {
    pub async fn get_receipt_line_by_id(
        &self,
        receipt_line_id: ReceiptLineId,
    ) -> Result<ApiReceiptLine> {
        let receipt_line = self.receipt_line_loader.load_one(receipt_line_id).await?;

        match receipt_line {
            Some(line) => Ok(ApiReceiptLine::from(line)),
            None => Err(Error::NotFound(ResourceIdentifier::ReceiptLineId(
                receipt_line_id,
            ))),
        }
    }

    pub async fn get_receipt_lines(
        &self,
        input: GetReceiptLinesInput,
    ) -> Result<Vec<ApiReceiptLine>> {
        let receipt_id = input.receipt_id.map(|id| id.0);
        let product_id = input.product_id.map(|id| id.0);

        let receipt_lines = sqlx::query_as!(
            DbReceiptLine,
            r#"
                SELECT line.id AS "id: ReceiptLineId",
                       line.receipt_id AS "receipt_id: ReceiptId",
                       line.product_id AS "product_id: ProductId",
                       line.price
                FROM receipt_line AS line
                LEFT JOIN receipt
                ON line.receipt_id = receipt.id
                WHERE ($1::int IS NULL OR receipt.id = $1)
                AND ($2::int IS NULL OR line.product_id = $2)
            "#,
            receipt_id,
            product_id
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(receipt_lines.into_iter().map(Into::into).collect())
    }

    pub async fn create_receipt_line(&self, req: CreateReceiptLineInput) -> Result<ApiReceiptLine> {
        req.validate()?;

        let CreateReceiptLineInput {
            receipt_id,
            product_id,
            price,
            receipt_line_splits,
        } = req;

        let created_receipt_line = sqlx::query_as!(
            DbReceiptLine,
            r#"
                INSERT INTO receipt_line (receipt_id, product_id, price)
                VALUES ($1, $2, $3)
                RETURNING id AS "id: ReceiptLineId",
                          receipt_id AS "receipt_id: ReceiptId",
                          product_id AS "product_id: ProductId",
                          price
            "#,
            receipt_id.0,
            product_id.0,
            price
        )
        .fetch_one(&self.pool)
        .await?;

        // create receipt line splits
        for item in receipt_line_splits {
            self.create_receipt_line_split(CreateReceiptLineSplitInput {
                receipt_line_id: created_receipt_line.id,
                person_id: item.person_id,
                antecedent: item.antecedent,
            })
            .await?;
        }

        Ok(created_receipt_line.into())
    }
}
