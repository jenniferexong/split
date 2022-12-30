use crate::{
    api::{PgCodes, Result},
    AppState, Db,
};
use async_graphql::{Context, InputObject, Object};
use serde::Serialize;
use validator::Validate;
use crate::error::{Error, ResourceIdentifier};
use super::{ApiReceiptLine, ReceiptLineSplitId, ReceiptLineId, ReceiptId, Person, PersonId};

#[derive(sqlx::FromRow)]
pub struct DbReceiptLineSplit {
    id: ReceiptLineSplitId,
    receipt_line_id: ReceiptLineId,
    person_id: PersonId,
    antecedent: i32,
}

pub struct ApiReceiptLineSplit {
    id: ReceiptLineSplitId,
    receipt_line_id: ReceiptLineId,
    person_id: PersonId,
    antecedent: i32,
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

    async fn person(&self, ctx: &Context<'_>) -> Result<Person> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_person_by_id(self.person_id).await
    }

    async fn antecedent(&self) -> i32 {
        self.antecedent
    }
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
        let mut receipt_line_splits = sqlx::query_as!(
            DbReceiptLineSplit,
            "SELECT id, receipt_line_id, person_id, antecedent FROM receipt_line_split WHERE id = $1",
            receipt_line_split_id
        )
        .fetch_all(&self.pool)
        .await?;

        match receipt_line_splits.pop() {
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
        let receipt_line_splits = sqlx::query_as!(
            DbReceiptLineSplit,
            "SELECT split.id, split.receipt_line_id, split.person_id, split.antecedent 
            FROM receipt_line_split AS split 
            LEFT JOIN receipt_line AS line ON split.receipt_line_id = line.id 
            WHERE line.id = $1",
            receipt_line_id
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(receipt_line_splits.into_iter().map(Into::into).collect())
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
            "INSERT INTO receipt_line_split (receipt_line_id, person_id, antecedent) VALUES ($1, $2, $3) 
            RETURNING id, receipt_line_id, person_id, antecedent",
            receipt_line_id, person_id, antecedent
        )
        .fetch_one(&self.pool)
        .await;

        match created_split {
            Ok(split) => Ok(split.into()),
            Err(err) => {
                if let sqlx::Error::Database(err) = &err {
                    if let (Some(code), Some(constraint)) = (err.code(), err.constraint()) {
                        if code == PgCodes::CONSTRAINT_VIOLATION
                            && constraint == "unique_receipt_line_split"
                        {
                            return Err(Error::AlreadyExists(
                                ResourceIdentifier::ReceiptLineSplit {
                                    receipt_line_id,
                                    person_id,
                                },
                            ));
                        }
                    }
                }

                tracing::error!("Create receipt line split with receipt line `{receipt_line_id}` and person_id `{person_id}` failed: {err}");
                Err(Error::Database(err))
            }
        }
    }

    // TODO
    // get by person
    // get by product
    // get by month?
}
