use super::StoreId;
use crate::{
    api::{PgCodes, Result},
    error::{Error, ResourceIdentifier},
    Db,
};
use async_graphql::{InputObject, SimpleObject};
use validator::Validate;

#[derive(SimpleObject, sqlx::FromRow, Clone)]
pub struct Store {
    pub id: StoreId,
    pub name: String,
}

#[derive(Validate, InputObject)]
pub struct CreateStoreInput {
    #[validate(length(min = 1))]
    name: String,
}

// TODO Look into?
trait Entity: Sized {
    type Id;
    type CreateInput;

    fn create(input: Self::CreateInput) -> Self;
    fn get(id: Self::Id) -> Self;
    fn get_all(ids: &[Self::Id]) -> Vec<Self>;
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
