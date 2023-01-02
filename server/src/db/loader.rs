use crate::{
    api::{PersonId, ProductId, ReceiptId, ReceiptLineId, ReceiptLineSplitId, StoreId},
    db::{
        person::DbPerson, product::DbProduct, receipt::DbReceipt, receipt_line::DbReceiptLine,
        receipt_line_split::DbReceiptLineSplit, store::DbStore,
    },
};
use async_graphql::dataloader::Loader;
use axum::async_trait;
use sqlx::{Pool, Postgres};
use std::{collections::HashMap, sync::Arc};

pub struct PersonLoader {
    pool: Pool<Postgres>,
}

impl PersonLoader {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl Loader<PersonId> for PersonLoader {
    type Value = DbPerson;

    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[PersonId]) -> Result<HashMap<PersonId, Self::Value>, Self::Error> {
        let keys = keys.iter().map(|key| key.0).collect::<Vec<i32>>();

        let people = sqlx::query_as!(
            DbPerson,
            r#"
                SELECT id AS "id: PersonId", first_name, last_name, email
                FROM person
                WHERE id = ANY($1)
            "#,
            &keys
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(people
            .into_iter()
            .map(|person| (person.id, person))
            .collect())
    }
}

pub struct ProductLoader {
    pool: Pool<Postgres>,
}

impl ProductLoader {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl Loader<ProductId> for ProductLoader {
    type Value = DbProduct;

    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[ProductId],
    ) -> Result<HashMap<ProductId, Self::Value>, Self::Error> {
        let keys = keys.iter().map(|key| key.0).collect::<Vec<i32>>();

        let products = sqlx::query_as!(
            DbProduct,
            r#"
                SELECT id AS "id: ProductId", name
                FROM product
                WHERE id = ANY($1)
            "#,
            &keys
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(products
            .into_iter()
            .map(|product| (product.id, product))
            .collect())
    }
}

pub struct StoreLoader {
    pool: Pool<Postgres>,
}

impl StoreLoader {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl Loader<StoreId> for StoreLoader {
    type Value = DbStore;

    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[StoreId]) -> Result<HashMap<StoreId, Self::Value>, Self::Error> {
        let keys = keys.iter().map(|key| key.0).collect::<Vec<i32>>();

        let stores = sqlx::query_as!(
            DbStore,
            r#"
                SELECT id AS "id: StoreId", name
                FROM store
                WHERE id = ANY($1)
            "#,
            &keys
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(stores.into_iter().map(|store| (store.id, store)).collect())
    }
}

pub struct ReceiptLoader {
    pool: Pool<Postgres>,
}

impl ReceiptLoader {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl Loader<ReceiptId> for ReceiptLoader {
    type Value = DbReceipt;

    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[ReceiptId],
    ) -> Result<HashMap<ReceiptId, Self::Value>, Self::Error> {
        let keys = keys.iter().map(|key| key.0).collect::<Vec<i32>>();

        let receipts = sqlx::query_as!(
            DbReceipt,
            r#"
                SELECT id AS "id: ReceiptId",
                       store_id AS "store_id: StoreId",
                       person_id AS "person_id: PersonId",
                       date
                FROM receipt
                WHERE id = ANY($1)
            "#,
            &keys
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(receipts
            .into_iter()
            .map(|receipt| (receipt.id, receipt))
            .collect())
    }
}

pub struct ReceiptLineLoader {
    pool: Pool<Postgres>,
}

impl ReceiptLineLoader {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl Loader<ReceiptLineId> for ReceiptLineLoader {
    type Value = DbReceiptLine;

    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[ReceiptLineId],
    ) -> Result<HashMap<ReceiptLineId, Self::Value>, Self::Error> {
        let keys = keys.iter().map(|key| key.0).collect::<Vec<i32>>();

        let receipt_lines = sqlx::query_as!(
            DbReceiptLine,
            r#"
                SELECT id AS "id: ReceiptLineId",
                       receipt_id AS "receipt_id: ReceiptId",
                       product_id AS "product_id: ProductId",
                       price
                FROM receipt_line
                WHERE id = ANY($1)
            "#,
            &keys
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(receipt_lines
            .into_iter()
            .map(|receipt_line| (receipt_line.id, receipt_line))
            .collect())
    }
}

pub struct ReceiptLineSplitLoader {
    pool: Pool<Postgres>,
}

impl ReceiptLineSplitLoader {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl Loader<ReceiptLineSplitId> for ReceiptLineSplitLoader {
    type Value = DbReceiptLineSplit;

    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[ReceiptLineSplitId],
    ) -> Result<HashMap<ReceiptLineSplitId, Self::Value>, Self::Error> {
        let keys = keys.iter().map(|key| key.0).collect::<Vec<i32>>();

        let receipt_line_splits = sqlx::query_as!(
            DbReceiptLineSplit,
            r#"
                SELECT id AS "id: ReceiptLineSplitId",
                              receipt_line_id AS "receipt_line_id: ReceiptLineId",
                              person_id AS "person_id: PersonId",
                              antecedent
                FROM receipt_line_split
                WHERE id = ANY($1)
            "#,
            &keys
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(receipt_line_splits
            .into_iter()
            .map(|split| (split.id, split))
            .collect())
    }
}

#[async_trait]
impl Loader<ReceiptLineId> for ReceiptLineSplitLoader {
    type Value = Vec<DbReceiptLineSplit>;

    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[ReceiptLineId],
    ) -> Result<HashMap<ReceiptLineId, Self::Value>, Self::Error> {
        let mut map = HashMap::new();

        for line_id in keys {
            let receipt_line_splits = sqlx::query_as!(
                DbReceiptLineSplit,
                r#"
                    SELECT split.id AS "id: ReceiptLineSplitId",
                           split.receipt_line_id AS "receipt_line_id: ReceiptLineId",
                           split.person_id AS "person_id: PersonId",
                           split.antecedent
                    FROM receipt_line_split AS split
                    LEFT JOIN receipt_line AS line
                    ON split.receipt_line_id = line.id
                    WHERE line.id = $1
                "#,
                line_id.0
            )
            .fetch_all(&self.pool)
            .await?;

            map.insert(*line_id, receipt_line_splits);
        }

        Ok(map)
    }
}
