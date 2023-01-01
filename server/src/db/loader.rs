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
        let people = sqlx::query_as!(
            DbPerson,
            "SELECT id, first_name, last_name, email FROM person WHERE id = ANY($1)",
            keys
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
        let products = sqlx::query_as!(
            DbProduct,
            "SELECT id, name FROM product WHERE id = ANY($1)",
            keys
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
        let stores = sqlx::query_as!(
            DbStore,
            "SELECT id, name FROM store WHERE id = ANY($1)",
            keys
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
        let receipts = sqlx::query_as!(
            DbReceipt,
            "SELECT id, store_id, person_id, date FROM receipt WHERE id = ANY($1)",
            keys
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
        let receipt_lines = sqlx::query_as!(
            DbReceiptLine,
            "SELECT id, receipt_id, product_id, price FROM receipt_line WHERE id = ANY($1)",
            keys
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
        let receipt_line_splits = sqlx::query_as!(
            DbReceiptLineSplit,
            "SELECT id, receipt_line_id, person_id, antecedent FROM receipt_line_split WHERE id = ANY($1)",
            keys
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(receipt_line_splits
            .into_iter()
            .map(|split| (split.id, split))
            .collect())
    }
}
