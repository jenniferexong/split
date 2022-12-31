mod api;
mod error;

use crate::api::{Mutation, Query};
use api::{
    loader::{
        PersonLoader, ProductLoader, ReceiptLineLoader, ReceiptLineSplitLoader, ReceiptLoader,
        StoreLoader,
    },
    SplitSchema,
};
use async_graphql::{dataloader::DataLoader, http::GraphiQLSource, EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    response::{self, IntoResponse},
    routing::{get, post},
    Extension, Router,
};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    tracing_subscriber::fmt::init();

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://postgres:password@localhost/postgres")
        .await?;

    let state = AppState::new(Db::new(pool));
    let schema = Schema::build(Query, Mutation, EmptySubscription)
        .data(state)
        .finish();

    let app = Router::new()
        .route("/", get(graphiql))
        .route("/query", post(graphql_handler))
        .layer(Extension(schema));

    let addr = SocketAddr::from(([127, 0, 0, 1], 5133));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}

async fn graphql_handler(schema: Extension<SplitSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

// Graphql client api
async fn graphiql() -> impl IntoResponse {
    response::Html(GraphiQLSource::build().endpoint("/query").finish())
}

pub struct AppState {
    db: Db,
}

impl AppState {
    pub fn new(db: Db) -> Self {
        Self { db }
    }
}

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
}
