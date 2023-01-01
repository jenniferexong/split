pub mod person;
pub mod product;
pub mod receipt;
pub mod receipt_line;
pub mod receipt_line_split;
pub mod store;

use crate::{
    db::{
        person::CreatePersonInput, product::CreateProductInput, receipt::CreateReceiptInput,
        receipt_line::GetReceiptLinesInput, store::CreateStoreInput,
    },
    error::Error,
    AppState,
};
use async_graphql::{Context, EmptySubscription, Object, Schema};
use person::*;
use product::*;
use receipt::*;
use receipt_line::*;
use receipt_line_split::*;
use store::*;

pub(crate) type SplitSchema = Schema<Query, Mutation, EmptySubscription>;

pub type Result<T, E = Error> = ::std::result::Result<T, E>;

pub type ProductId = i32;
pub type StoreId = i32;
pub type PersonId = i32;
pub type ReceiptId = i32;
pub type ReceiptLineId = i32;
pub type ReceiptLineSplitId = i32;

pub enum PgCodes {}

impl PgCodes {
    pub const CONSTRAINT_VIOLATION: &str = "23505";
}

pub struct Query;

#[Object]
impl Query {
    /// Get all products
    async fn products(&self, ctx: &Context<'_>) -> Result<Vec<ApiProduct>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_all_products().await
    }

    /// Get product by id
    async fn product(&self, ctx: &Context<'_>, id: ProductId) -> Result<ApiProduct> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_product_by_id(id).await
    }

    /// Get all stores
    async fn stores(&self, ctx: &Context<'_>) -> Result<Vec<ApiStore>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_all_stores().await
    }

    /// Get store by id
    async fn store(&self, ctx: &Context<'_>, id: StoreId) -> Result<ApiStore> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_store_by_id(id).await
    }

    /// Get all people
    async fn people(&self, ctx: &Context<'_>) -> Result<Vec<ApiPerson>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_all_people().await
    }

    /// Get person by id
    async fn person(&self, ctx: &Context<'_>, id: PersonId) -> Result<ApiPerson> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_person_by_id(id).await
    }

    /// Get all receipts
    async fn receipts(&self, ctx: &Context<'_>) -> Result<Vec<ApiReceipt>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_all_receipts().await
    }

    /// Get receipt by id
    async fn receipt(&self, ctx: &Context<'_>, id: ReceiptId) -> Result<ApiReceipt> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_receipt_by_id(id).await
    }

    /// Get receipt lines
    async fn receipt_lines(
        &self,
        ctx: &Context<'_>,
        #[graphql(default)] filter: GetReceiptLinesInput,
    ) -> Result<Vec<ApiReceiptLine>> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_receipt_lines(filter).await
    }

    /// Get receipt line split by id
    async fn receipt_line_split(
        &self,
        ctx: &Context<'_>,
        id: ReceiptLineSplitId,
    ) -> Result<ApiReceiptLineSplit> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_receipt_line_split_by_id(id).await
    }

    /// Get receipt line by id
    async fn receipt_line(&self, ctx: &Context<'_>, id: ReceiptLineId) -> Result<ApiReceiptLine> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.get_receipt_line_by_id(id).await
    }

    // TODO add get all receipt line splits by receipt line id
}

pub struct Mutation;

#[Object]
impl Mutation {
    /// Create product
    async fn product(&self, ctx: &Context<'_>, input: CreateProductInput) -> Result<ApiProduct> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.create_product(input).await
    }

    /// Create store
    async fn store(&self, ctx: &Context<'_>, input: CreateStoreInput) -> Result<ApiStore> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.create_store(input).await
    }

    /// Create person
    async fn person(&self, ctx: &Context<'_>, input: CreatePersonInput) -> Result<ApiPerson> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.create_person(input).await
    }

    /// Create receipt
    async fn receipt(&self, ctx: &Context<'_>, input: CreateReceiptInput) -> Result<ApiReceipt> {
        let state = ctx.data_unchecked::<AppState>();
        state.db.create_receipt(input).await
    }
}