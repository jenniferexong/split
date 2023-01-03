use crate::api::receipt_line_split::ApiReceiptLineSplit;
use crate::api::{PersonId, ReceiptLineId, ReceiptLineSplitId};
use crate::error::{Error, ResourceIdentifier};
use crate::{api::Result, Db};
use async_graphql::InputObject;
use serde::Serialize;
use validator::Validate;

#[derive(sqlx::FromRow, Clone, Copy)]
pub struct DbReceiptLineSplit {
    pub id: ReceiptLineSplitId,
    pub receipt_line_id: ReceiptLineId,
    pub person_id: PersonId,
    pub antecedent: i32,
}

#[derive(Validate, Serialize, InputObject)]
pub struct CreateReceiptLineSplitInput {
    pub receipt_line_id: ReceiptLineId,
    pub person_id: PersonId,
    #[validate(range(min = 1))]
    pub antecedent: i32,
}

impl Db {
    pub async fn get_receipt_line_split_by_id(
        &self,
        receipt_line_split_id: ReceiptLineSplitId,
    ) -> Result<ApiReceiptLineSplit> {
        let receipt_line_split = self
            .receipt_line_split_loader
            .load_one(receipt_line_split_id)
            .await?;

        match receipt_line_split {
            Some(split) => Ok(ApiReceiptLineSplit::from(split)),
            None => Err(Error::NotFound(ResourceIdentifier::ReceiptLineSplitId(
                receipt_line_split_id,
            ))),
        }
    }

    pub async fn get_receipt_line_splits_by_receipt_line_id(
        &self,
        receipt_line_id: ReceiptLineId,
    ) -> Result<Vec<ApiReceiptLineSplit>> {
        let receipt_line_splits = self
            .receipt_line_split_loader
            .load_one(receipt_line_id)
            .await?;

        match receipt_line_splits {
            Some(splits) => Ok(splits.into_iter().map(Into::into).collect()),
            None => Ok(vec![]),
        }
    }

    pub async fn get_receipt_line_splits_by_person_id(
        &self,
        person_id: PersonId,
    ) -> Result<Vec<ApiReceiptLineSplit>> {
        let receipt_line_splits = self.receipt_line_split_loader.load_one(person_id).await?;

        match receipt_line_splits {
            Some(splits) => Ok(splits.into_iter().map(Into::into).collect()),
            None => Ok(vec![]),
        }
    }

    pub async fn create_receipt_line_split(
        &self,
        req: CreateReceiptLineSplitInput,
    ) -> Result<ApiReceiptLineSplit> {
        req.validate()?;

        let CreateReceiptLineSplitInput {
            receipt_line_id,
            person_id,
            antecedent,
        } = req;

        let created_split = sqlx::query_as!(
            DbReceiptLineSplit,
            r#"
                INSERT INTO receipt_line_split (receipt_line_id, person_id, antecedent)
                VALUES ($1, $2, $3)
                RETURNING id AS "id: ReceiptLineSplitId",
                          receipt_line_id AS "receipt_line_id: ReceiptLineId",
                          person_id AS "person_id: PersonId",
                          antecedent
            "#,
            receipt_line_id.0,
            person_id.0,
            antecedent
        )
        .fetch_one(&self.pool)
        .await;

        let resource_identifier = ResourceIdentifier::ReceiptLineSplit {
            receipt_line_id,
            person_id,
        };

        match created_split {
            Ok(split) => Ok(split.into()),
            Err(err) => {
                if let Some(err) = Db::handle_unique_constraint_violation(
                    &err,
                    &resource_identifier,
                    "unique_receipt_line_split",
                ) {
                    return Err(err);
                };

                tracing::error!("Create {resource_identifier} failed: {err}");
                Err(err.into())
            }
        }
    }
}
