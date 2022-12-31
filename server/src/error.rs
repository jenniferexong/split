use crate::api::{PersonId, ProductId, ReceiptId, ReceiptLineId, ReceiptLineSplitId, StoreId};
use std::fmt;
use std::sync::Arc;
use validator::ValidationErrors;

#[derive(Debug)]
pub enum Error {
    AlreadyExists(ResourceIdentifier),
    Invalid(ValidationErrors),
    Database(Arc<sqlx::Error>),
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
        Self::Database(Arc::new(err))
    }
}

impl From<Arc<sqlx::Error>> for Error {
    fn from(err: Arc<sqlx::Error>) -> Self {
        Self::Database(err)
    }
}

#[derive(Debug)]
pub enum ResourceIdentifier {
    ProductId(ProductId),
    ProductName(String),
    ReceiptId(ReceiptId),
    ReceiptLineId(ReceiptLineId),
    ReceiptLineSplitId(ReceiptLineSplitId),
    ReceiptLineSplit {
        receipt_line_id: ReceiptLineId,
        person_id: PersonId,
    },
    StoreId(StoreId),
    StoreName(String),
    PersonId(PersonId),
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
            ResourceIdentifier::ReceiptLineId(id) => write!(f, "Receipt line with id `{id}`"),
            ResourceIdentifier::ReceiptLineSplitId(id) => {
                write!(f, "Receipt line split with id `{id}`")
            }
            ResourceIdentifier::ReceiptLineSplit {
                receipt_line_id,
                person_id,
            } => {
                write!(f, "Receipt line split with receipt line id `{receipt_line_id}` and person id `{person_id}`")
            }
        }
    }
}
