pub mod products;
pub mod stores;

use axum::{http::StatusCode, Json};

use crate::error::Error;

pub type ApiResult<T, E = Error> = ::std::result::Result<(StatusCode, Json<T>), E>;

pub enum PgCodes {}

impl PgCodes {
    pub const CONSTRAINT_VIOLATION: &str = "23505";
}
