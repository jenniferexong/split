use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};
use std::fmt;
use validator::ValidationErrors;

#[derive(Debug)]
pub enum Error {
    AlreadyExists(ResourceIdentifier),
    Invalid(ValidationErrors),
    Database(sqlx::Error),
    NotFound(ResourceIdentifier),
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        match self {
            Error::AlreadyExists(resource_kind) => (
                StatusCode::CONFLICT,
                format!("{resource_kind} already exists"),
            ),
            Error::NotFound(resource_kind) => (
                StatusCode::NOT_FOUND,
                format!("{resource_kind} could not be found"),
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
pub enum ResourceIdentifier {
    ProductId(i32),
    ProductName(String),
    StoreId(i32),
    StoreName(String),
    PersonEmail(String),
}

impl fmt::Display for ResourceIdentifier {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ResourceIdentifier::ProductId(id) => {
                write!(f, "Product with id={}", id)
            }
            ResourceIdentifier::ProductName(name) => {
                write!(f, "Product with name=\"{}\"", name)
            }
            ResourceIdentifier::StoreId(id) => {
                write!(f, "Store with id={}", id)
            }
            ResourceIdentifier::StoreName(name) => {
                write!(f, "Store with name=\"{}\"", name)
            }
            ResourceIdentifier::PersonEmail(email) => {
                write!(f, "Person with email=\"{}\"", email)
            }
        }
    }
}
