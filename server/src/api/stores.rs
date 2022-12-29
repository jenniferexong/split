use async_graphql::{InputObject, SimpleObject};
use validator::Validate;

use crate::{
    api::{PgCodes, Result},
    error::{Error, ResourceIdentifier},
    Db,
};

#[derive(SimpleObject, sqlx::FromRow)]
pub struct Store {
    id: i32,
    name: String,
}

#[derive(Validate, InputObject)]
pub struct CreateStoreRequest {
    #[validate(length(min = 1))]
    name: String,
}

impl Db {
    pub async fn get_store_by_id(&self, store_id: i32) -> Result<Store> {
        let mut stores = sqlx::query_as("SELECT id, name FROM store WHERE id = $1")
            .bind(store_id)
            .fetch_all(&self.pool)
            .await?;

        match stores.pop() {
            Some(store) => Ok(store),
            None => Err(Error::NotFound(ResourceIdentifier::StoreId(store_id))),
        }
    }

    pub async fn get_all_stores(&self) -> Result<Vec<Store>> {
        let stores = sqlx::query_as::<_, Store>("SELECT id, name FROM store")
            .fetch_all(&self.pool)
            .await?;

        Ok(stores)
    }

    pub async fn create_store(&self, req: CreateStoreRequest) -> Result<Store> {
        req.validate()?;

        let created_store =
            sqlx::query_as::<_, Store>("INSERT INTO store (name) VALUES ($1) RETURNING id, name")
                .bind(&req.name)
                .fetch_one(&self.pool)
                .await;

        match created_store {
            Ok(store) => Ok(store),
            Err(err) => {
                if let sqlx::Error::Database(err) = &err {
                    if let (Some(code), Some(constraint)) = (err.code(), err.constraint()) {
                        if code == PgCodes::CONSTRAINT_VIOLATION
                            && constraint == "unique_store_name"
                        {
                            return Err(Error::AlreadyExists(ResourceIdentifier::StoreName(
                                req.name.clone(),
                            )));
                        }
                    }
                }

                tracing::error!("Create store with name=\"{}\" failed: {err}", req.name);
                Err(Error::Database(err))
            }
        }
    }
}
