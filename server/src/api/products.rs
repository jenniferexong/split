use async_graphql::{InputObject, SimpleObject};
use validator::Validate;

use crate::{
    api::{PgCodes, Result},
    error::{Error, ResourceIdentifier},
    Db,
};

#[derive(SimpleObject, sqlx::FromRow)]
pub struct Product {
    id: i32,
    name: String,
}

#[derive(Validate, InputObject)]
pub struct CreateProductRequest {
    #[validate(length(min = 1))]
    name: String,
}

impl Db {
    pub async fn get_product_by_id(&self, product_id: i32) -> Result<Product> {
        let mut products = sqlx::query_as("SELECT id, name FROM product WHERE id = $1")
            .bind(product_id)
            .fetch_all(&self.pool)
            .await?;

        match products.pop() {
            Some(product) => Ok(product),
            None => Err(Error::NotFound(ResourceIdentifier::ProductId(product_id))),
        }
    }

    pub async fn get_all_products(&self) -> Result<Vec<Product>> {
        let products = sqlx::query_as::<_, Product>("SELECT id, name FROM product")
            .fetch_all(&self.pool)
            .await?;

        Ok(products)
    }

    pub async fn create_product(&self, req: CreateProductRequest) -> Result<Product> {
        req.validate()?;

        let created_product = sqlx::query_as::<_, Product>(
            "INSERT INTO product (name) VALUES ($1) RETURNING id, name",
        )
        .bind(&req.name)
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
                                req.name.clone(),
                            )));
                        }
                    }
                }

                tracing::error!("Create product with name=\"{}\" failed: {err}", req.name);
                Err(Error::Database(err))
            }
        }
    }
}
