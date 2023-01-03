use async_graphql::SimpleObject;

use crate::db::product::DbProduct;

use super::ProductId;

#[derive(SimpleObject)]
pub struct ApiProduct {
    pub id: ProductId,
    pub name: String,
}

impl From<DbProduct> for ApiProduct {
    fn from(DbProduct { id, name }: DbProduct) -> Self {
        Self { id, name }
    }
}
