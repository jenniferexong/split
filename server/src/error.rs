use std::fmt;
use validator::ValidationErrors;

use crate::api::Id;

#[derive(Debug)]
pub enum Error {
    AlreadyExists(ResourceIdentifier),
    Invalid(ValidationErrors),
    Database(sqlx::Error),
    NotFound(ResourceIdentifier),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::AlreadyExists(resource_identifier) => {
                write!(f, "{resource_identifier} already exists")
            }
            Error::NotFound(resource_identifier) => {
                write!(f, "{resource_identifier} could not be found")
            }
            Error::Invalid(err) => write!(f, "Invalid request body: {err}"),
            Error::Database(err) => write!(f, "Request failed: {err}"),
        }
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
    ProductId(Id),
    ProductName(String),
    ReceiptId(Id),
    StoreId(Id),
    StoreName(String),
    PersonId(Id),
    PersonEmail(String),
}

impl fmt::Display for ResourceIdentifier {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ResourceIdentifier::ProductId(id) => write!(f, "Product with id `{id}`"),
            ResourceIdentifier::ProductName(name) => write!(f, "Product with name `{name}`"),
            ResourceIdentifier::StoreId(id) => write!(f, "Store with id `{id}`"),
            ResourceIdentifier::StoreName(name) => write!(f, "Store with name `{name}`"),
            ResourceIdentifier::PersonId(id) => write!(f, "Person with id `{id}`"),
            ResourceIdentifier::PersonEmail(email) => write!(f, "Person with email `{email}`"),
            ResourceIdentifier::ReceiptId(id) => write!(f, "Receipt with id `{id}`"),
        }
    }
}
