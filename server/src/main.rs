mod api;
mod db;
mod error;

use crate::{
    api::{Mutation, Query},
    db::Db,
};
use api::SplitSchema;
use async_graphql::{http::GraphiQLSource, EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    http::{header::CONTENT_TYPE, HeaderValue, Method},
    response::{self, IntoResponse},
    routing::{get, post},
    Extension, Router,
};
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    tracing_subscriber::fmt::init();

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://postgres:password@localhost/split")
        .await?;

    let state = AppState::new(Db::new(pool));
    let schema = Schema::build(Query, Mutation, EmptySubscription)
        .data(state)
        .finish();

    let cors = CorsLayer::new()
        .allow_methods([Method::POST, Method::OPTIONS])
        .allow_headers([CONTENT_TYPE])
        .allow_origin("http://localhost:8000".parse::<HeaderValue>().unwrap());

    let app = Router::new()
        .route("/", get(graphiql))
        .route("/query", post(graphql_handler))
        .layer(Extension(schema))
        .layer(cors);

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
