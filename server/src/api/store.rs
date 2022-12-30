use super::StoreId;
use crate::{
    api::{PgCodes, Result},
    error::{Error, ResourceIdentifier},
    Db,
};
use async_graphql::{InputObject, SimpleObject};
use validator::Validate;

#[derive(SimpleObject, sqlx::FromRow)]
pub struct Store {
    id: StoreId,
    name: String,
}

#[derive(Validate, InputObject)]
pub struct CreateStoreInput {
    #[validate(length(min = 1))]
    name: String,
}

impl Db {
    pub async fn get_store_by_id(&self, store_id: StoreId) -> Result<Store> {
        let mut stores =
            sqlx::query_as!(Store, "SELECT id, name FROM store WHERE id = $1", store_id)
                .fetch_all(&self.pool)
                .await?;

        match stores.pop() {
            Some(store) => Ok(store),
            None => Err(Error::NotFound(ResourceIdentifier::StoreId(store_id))),
        }
    }

    pub async fn get_all_stores(&self) -> Result<Vec<Store>> {
        let stores = sqlx::query_as!(Store, "SELECT id, name FROM store")
            .fetch_all(&self.pool)
            .await?;

        Ok(stores)
    }

    pub async fn create_store(&self, req: CreateStoreInput) -> Result<Store> {
        req.validate()?;

        let CreateStoreInput { name } = req;

        let created_store = sqlx::query_as!(
            Store,
            "INSERT INTO store (name) VALUES ($1) RETURNING id, name",
            name
        )
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
                            return Err(Error::AlreadyExists(ResourceIdentifier::StoreName(name)));
                        }
                    }
                }

                tracing::error!("Create store with name `{name}` failed: {err}");
                Err(Error::Database(err))
            }
        }
    }
}
