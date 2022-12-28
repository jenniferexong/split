mod api;
mod error;

use crate::api::{
    products::{create_product, get_all_products, get_product_by_id},
    stores::{create_store, get_all_stores, get_store_by_id},
};
use axum::{routing::get, Router};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::{net::SocketAddr, sync::Arc};

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    tracing_subscriber::fmt::init();

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://postgres:password@localhost/postgres")
        .await?;

    let app = Router::new()
        .route("/products", get(get_all_products).post(create_product))
        .route("/products/:id", get(get_product_by_id))
        .route("/stores", get(get_all_stores).post(create_store))
        .route("/stores/:id", get(get_store_by_id))
        .with_state(Arc::new(AppState { pool }));

    let addr = SocketAddr::from(([127, 0, 0, 1], 5133));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}

pub struct AppState {
    pool: Pool<Postgres>,
}
