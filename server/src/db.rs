pub mod loader;
pub mod person;
pub mod product;
pub mod receipt;
pub mod receipt_line;
pub mod receipt_line_split;
pub mod store;

use crate::{
    api::PgCodes,
    error::{Error, ResourceIdentifier},
};
use async_graphql::dataloader::DataLoader;
use person::*;
use product::*;
use receipt::*;
use receipt_line::*;
use receipt_line_split::*;
use sqlx::{Pool, Postgres};
use store::*;

use self::loader::{
    PersonLoader, ProductLoader, ReceiptLineLoader, ReceiptLineSplitLoader, ReceiptLoader,
    StoreLoader,
};

pub struct Db {
    person_loader: DataLoader<PersonLoader>,
    product_loader: DataLoader<ProductLoader>,
    store_loader: DataLoader<StoreLoader>,
    receipt_loader: DataLoader<ReceiptLoader>,
    receipt_line_loader: DataLoader<ReceiptLineLoader>,
    receipt_line_split_loader: DataLoader<ReceiptLineSplitLoader>,
    pool: Pool<Postgres>,
}

impl Db {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self {
            person_loader: DataLoader::new(PersonLoader::new(pool.clone()), tokio::spawn),
            product_loader: DataLoader::new(ProductLoader::new(pool.clone()), tokio::spawn),
            store_loader: DataLoader::new(StoreLoader::new(pool.clone()), tokio::spawn),
            receipt_loader: DataLoader::new(ReceiptLoader::new(pool.clone()), tokio::spawn),
            receipt_line_loader: DataLoader::new(
                ReceiptLineLoader::new(pool.clone()),
                tokio::spawn,
            ),
            receipt_line_split_loader: DataLoader::new(
                ReceiptLineSplitLoader::new(pool.clone()),
                tokio::spawn,
            ),
            pool,
        }
    }

    pub fn handle_unique_constraint_violation(
        err: &sqlx::Error,
        resource_identifier: &ResourceIdentifier,
        unique_constraint_name: &str,
    ) -> Option<Error> {
        if let sqlx::Error::Database(err) = &err {
            if let (Some(code), Some(constraint)) = (err.code(), err.constraint()) {
                if code == PgCodes::CONSTRAINT_VIOLATION && constraint == unique_constraint_name {
                    return Some(Error::AlreadyExists(resource_identifier.clone()));
                }
            }
        }

        None
    }
}
