use crate::{
    api::{store::ApiStore, Result, StoreId},
    error::{Error, ResourceIdentifier},
    Db,
};
use async_graphql::InputObject;
use validator::Validate;

#[derive(sqlx::FromRow, Clone)]
pub struct DbStore {
    pub(crate) id: StoreId,
    pub(crate) name: String,
}

#[derive(Validate, InputObject)]
pub struct CreateStoreInput {
    #[validate(length(min = 1))]
    name: String,
}

impl Db {
    pub async fn get_store_by_id(&self, store_id: StoreId) -> Result<ApiStore> {
        let store = self.store_loader.load_one(store_id).await?;

        match store {
            Some(store) => Ok(store.into()),
            None => Err(Error::NotFound(ResourceIdentifier::StoreId(store_id))),
        }
    }

    pub async fn get_all_stores(&self) -> Result<Vec<ApiStore>> {
        struct StoreKey {
            id: StoreId,
        }

        let keys = sqlx::query_as!(
            StoreKey,
            r#"
                SELECT id AS "id: StoreId"
                FROM store
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        let stores = self
            .store_loader
            .load_many(keys.iter().map(|key| key.id))
            .await?;

        Ok(stores
            .values()
            .cloned()
            .into_iter()
            .map(Into::into)
            .collect())
    }

    pub async fn create_store(&self, req: CreateStoreInput) -> Result<ApiStore> {
        req.validate()?;

        let CreateStoreInput { name } = req;

        let created_store = sqlx::query_as!(
            ApiStore,
            r#"
                INSERT INTO store (name)
                VALUES ($1)
                RETURNING id AS "id: StoreId", name
            "#,
            name
        )
        .fetch_one(&self.pool)
        .await;

        let resource_identifier = &ResourceIdentifier::StoreName(name);

        match created_store {
            Ok(store) => Ok(store),
            Err(err) => {
                if let Some(err) = Db::handle_unique_constraint_violation(
                    &err,
                    resource_identifier,
                    "unique_store_name",
                ) {
                    return Err(err);
                }

                tracing::error!("Create {resource_identifier} failed: {err}");
                Err(err.into())
            }
        }
    }
}
