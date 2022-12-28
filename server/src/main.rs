use axum::{
    extract::{Path, State},
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
        .route("/products/:id", get(get_product_by_id))
        .with_state(Arc::new(AppState { pool }));

    let addr = SocketAddr::from(([127, 0, 0, 1], 5133));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}

type ApiResult<T, E = Error> = ::std::result::Result<(StatusCode, Json<T>), E>;

#[derive(Debug)]
enum Error {
    AlreadyExists(ResourceIdentifier),
    Invalid(ValidationErrors),
    Database(sqlx::Error),
    NotFound(ResourceIdentifier),
}

impl From<ValidationErrors> for Error {
    fn from(errs: ValidationErrors) -> Self {
        Self::Invalid(errs)
    }
}

impl From<sqlx::Error> for Error {
    fn from(err: sqlx::Error) -> Self {
        Self::Database(err)
    }
}

#[derive(Debug)]
enum ResourceIdentifier {
    ProductId(i32),
    ProductName(String),
    StoreName(String),
    PersonEmail(String),
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        match self {
            Error::AlreadyExists(resource_kind) => (
                StatusCode::CONFLICT,
                format!("{resource_kind:?} already exists"),
            ),
            Error::NotFound(resource_kind) => (
                StatusCode::NOT_FOUND,
                format!("{resource_kind:?} not found"),
            ),
            Error::Invalid(err) => (
                StatusCode::UNPROCESSABLE_ENTITY,
                format!("Invalid request body: {err}"),
            ),
            Error::Database(err) => {
                tracing::error!("Unknown error: {err}");

                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("Request failed: {err}"),
                )
            }
        }
        .into_response()
    }
}

async fn get_product_by_id(
    Path(product_id): Path<i32>,
    State(state): State<Arc<AppState>>,
) -> ApiResult<Product> {
    let mut products = sqlx::query_as("SELECT id, name FROM product WHERE id = $1")
        .bind(product_id)
        .fetch_all(&state.pool)
        .await?;

    match products.pop() {
        Some(product) => Ok((StatusCode::OK, Json(product))),
        None => Err(Error::NotFound(ResourceIdentifier::ProductId(product_id))),
    }
}

async fn get_all_products(State(state): State<Arc<AppState>>) -> ApiResult<Vec<Product>> {
    let products = sqlx::query_as::<_, Product>("SELECT id, name FROM product")
        .fetch_all(&state.pool)
        .await?;

    Ok((StatusCode::OK, Json(products)))
}

enum PgCodes {}

impl PgCodes {
    const CONSTRAINT_VIOLATION: &str = "23505";
}

async fn create_product(
    State(state): State<Arc<AppState>>,
    req: Json<ProductRequest>,
) -> ApiResult<Product> {
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
                        return Err(Error::AlreadyExists(ResourceIdentifier::ProductName(
                            req.name.clone(),
                        )));
                    }
                }
            }

            tracing::error!("Create product with name `{}` failed: {err}", req.name);
            Err(Error::Database(err))
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
