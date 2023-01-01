use async_graphql::SimpleObject;

use crate::db::store::DbStore;

use super::StoreId;

#[derive(SimpleObject)]
pub struct ApiStore {
    pub id: StoreId,
    pub name: String,
}

impl From<DbStore> for ApiStore {
    fn from(DbStore { id, name }: DbStore) -> Self {
        Self { id, name }
    }
}
