use super::ProductId;
use crate::{
    api::{PgCodes, Result},
    error::{Error, ResourceIdentifier},
    Db,
};
use async_graphql::{InputObject, SimpleObject};
use validator::Validate;

#[derive(SimpleObject, sqlx::FromRow, Clone)]
pub struct Product {
    pub id: ProductId,
    pub name: String,
}

#[derive(Validate, InputObject)]
pub struct CreateProductInput {
    #[validate(length(min = 1))]
    name: String,
}

impl Db {
    pub async fn get_product_by_id(&self, product_id: ProductId) -> Result<Product> {
        let product = self.product_loader.load_one(product_id).await?;

        match product {
            Some(product) => Ok(product),
            None => Err(Error::NotFound(ResourceIdentifier::ProductId(product_id))),
        }
    }

    pub async fn get_all_products(&self) -> Result<Vec<Product>> {
        struct ProductKey {
            id: ProductId,
        }

        let keys = sqlx::query_as!(ProductKey, "SELECT id FROM product")
            .fetch_all(&self.pool)
            .await?;

        let products = self
            .product_loader
            .load_many(keys.iter().map(|key| key.id))
            .await?;

        Ok(products.values().cloned().collect())
    }

    pub async fn create_product(&self, req: CreateProductInput) -> Result<Product> {
        req.validate()?;

        let CreateProductInput { name } = req;

        let created_product = sqlx::query_as!(
            Product,
            "INSERT INTO product (name) VALUES ($1) RETURNING id, name",
            name
        )
        .fetch_one(&self.pool)
        .await;

        match created_product {
            Ok(product) => Ok(product),
            Err(err) => {
                if let sqlx::Error::Database(err) = &err {
                    if let (Some(code), Some(constraint)) = (err.code(), err.constraint()) {
                        if code == PgCodes::CONSTRAINT_VIOLATION
                            && constraint == "unique_product_name"
                        {
                            return Err(Error::AlreadyExists(ResourceIdentifier::ProductName(
                                name,
                            )));
                        }
                    }
                }

                tracing::error!("Create product with name `{name}` failed: {err}");
                Err(err.into())
            }
        }
    }
}
