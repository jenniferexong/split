use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::{net::SocketAddr, sync::Arc};
use validator::{Validate, ValidationErrors};

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    tracing_subscriber::fmt::init();

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://postgres:password@localhost/postgres")
        .await?;

    let app = Router::new()
        .route("/products", get(get_all_products).post(create_product))
        .with_state(Arc::new(AppState { pool }));

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    let addr = SocketAddr::from(([127, 0, 0, 1], 5133));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}

#[derive(Debug)]
enum Error {
    AlreadyExists(ResourceKind),
    Invalid(ValidationErrors),
    Unknown(sqlx::Error),
}

impl From<ValidationErrors> for Error {
    fn from(errs: ValidationErrors) -> Self {
        Self::Invalid(errs)
    }
}

#[derive(Debug)]
enum ResourceKind {
    Product { name: String },
    Store { name: String },
    Person { email: String },
    Receipt,
    ReceiptLine,
    ReceiptLineSplit,
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        match self {
            Error::AlreadyExists(resource_kind) => (
                StatusCode::CONFLICT,
                format!("{resource_kind:?} already exists"),
            ),
            Error::Invalid(err) => (
                StatusCode::UNPROCESSABLE_ENTITY,
                format!("Invalid request body: {err}"),
            ),
            Error::Unknown(err) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Request failed: {err}"),
            ),
        }
        .into_response()
    }
}

async fn get_all_products(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let products = sqlx::query_as::<_, Product>("SELECT id, name FROM product")
        .fetch_all(&state.pool)
        .await;

    (StatusCode::OK, Json(products.unwrap()))
}

enum PgCodes {}

impl PgCodes {
    const CONSTRAINT_VIOLATION: &str = "23505";
}

async fn create_product(
    State(state): State<Arc<AppState>>,
    req: Json<ProductRequest>,
) -> impl IntoResponse {
    req.validate()?;

    let created_product =
        sqlx::query_as::<_, Product>("INSERT INTO product (name) VALUES ($1) RETURNING id, name")
            .bind(&req.name)
            .fetch_one(&state.pool)
            .await;

    match created_product {
        Ok(product) => Ok((StatusCode::CREATED, Json(product))),
        Err(err) => {
            if let sqlx::Error::Database(err) = &err {
                if let (Some(code), Some(constraint)) = (err.code(), err.constraint()) {
                    if code == PgCodes::CONSTRAINT_VIOLATION && constraint == "unique_product_name"
                    {
                        return Err(Error::AlreadyExists(ResourceKind::Product {
                            name: req.name.clone(),
                        }));
                    }
                }
            }

            tracing::error!("Create product with name `{}` failed: {err}", req.name);
            Err(Error::Unknown(err))
        }
    }
}

#[derive(Serialize, sqlx::FromRow)]
struct Product {
    id: i32,
    name: String,
}

#[derive(Deserialize, Validate)]
struct ProductRequest {
    #[validate(length(min = 1))]
    name: String,
}

struct AppState {
    pool: Pool<Postgres>,
}
