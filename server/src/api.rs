pub mod people;
pub mod products;
pub mod receipts;
pub mod stores;

use async_graphql::{Context, EmptySubscription, Object, Schema};

use crate::{error::Error, AppState};

use self::{
    people::{CreatePersonInput, Person},
    products::{CreateProductInput, Product},
    stores::{CreateStoreInput, Store},
};

pub(crate) type SplitSchema = Schema<Query, Mutation, EmptySubscription>;

pub type Result<T, E = Error> = ::std::result::Result<T, E>;

pub type Id = i32;

pub enum PgCodes {}

impl PgCodes {
    pub const CONSTRAINT_VIOLATION: &str = "23505";
}

pub struct Query;

#[Object]
impl Query {
    /// Get all products
    async fn products(&self, ctx: &Context<'_>) -> Result<Vec<Product>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_all_products().await
    }

    /// Get product by id
    async fn product(&self, ctx: &Context<'_>, id: Id) -> Result<Product> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_product_by_id(id).await
    }

    /// Get all stores
    async fn stores(&self, ctx: &Context<'_>) -> Result<Vec<Store>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_all_stores().await
    }

    /// Get store by id
    async fn store(&self, ctx: &Context<'_>, id: Id) -> Result<Store> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_store_by_id(id).await
    }

    /// Get all people
    async fn people(&self, ctx: &Context<'_>) -> Result<Vec<Person>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_all_people().await
    }

    /// Get person by id
    async fn person(&self, ctx: &Context<'_>, id: Id) -> Result<Person> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_person_by_id(id).await
    }
}

pub struct Mutation;

#[Object]
impl Mutation {
    /// Create product
    async fn product(&self, ctx: &Context<'_>, input: CreateProductInput) -> Result<Product> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.create_product(input).await
    }

    /// Create store
    async fn store(&self, ctx: &Context<'_>, input: CreateStoreInput) -> Result<Store> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.create_store(input).await
    }

    /// Create person
    async fn person(&self, ctx: &Context<'_>, input: CreatePersonInput) -> Result<Person> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.create_person(input).await
    }
}
