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
use async_graphql::Context;
use async_graphql::{EmptySubscription, InputType, Object, Schema};
use axum::async_trait;
use person::*;
use product::*;
use receipt::*;
use receipt_line::*;
use receipt_line_split::*;
use store::*;

pub(crate) type SplitSchema = Schema<Query, Mutation, EmptySubscription>;

pub type Result<T, E = Error> = ::std::result::Result<T, E>;

macro_rules! newtype_id {
    ($name:ident) => {
        #[derive(PartialEq, Eq, Hash, Debug, Clone, Copy, sqlx::Type, serde::Serialize)]
        #[sqlx(transparent)]
        #[serde(transparent)]
        pub struct $name(pub i32);

        #[async_trait]
        impl async_graphql::OutputType for $name {
            fn type_name() -> std::borrow::Cow<'static, str> {
                <i32 as async_graphql::OutputType>::type_name()
            }

            fn create_type_info(
                registry: &mut async_graphql::registry::Registry,
            ) -> ::std::string::String {
                <i32 as async_graphql::OutputType>::create_type_info(registry)
            }

            async fn resolve(
                &self,
                ctx: &async_graphql::ContextSelectionSet<'_>,
                field: &async_graphql::Positioned<async_graphql::parser::types::Field>,
            ) -> async_graphql::ServerResult<async_graphql::Value> {
                <i32 as async_graphql::OutputType>::resolve(&self.0, ctx, field).await
            }
        }

        impl async_graphql::InputType for $name {
            type RawValueType = i32;

            fn type_name() -> std::borrow::Cow<'static, str> {
                <Self::RawValueType as InputType>::type_name()
            }

            fn create_type_info(registry: &mut async_graphql::registry::Registry) -> String {
                <Self::RawValueType as InputType>::create_type_info(registry)
            }

            fn parse(value: Option<async_graphql::Value>) -> async_graphql::InputValueResult<Self> {
                <Self::RawValueType as InputType>::parse(value)
                    .map(Self)
                    .map_err(|err| err.propagate())
            }

            fn to_value(&self) -> async_graphql::Value {
                <Self::RawValueType as InputType>::to_value(&self.0)
            }

            fn as_raw_value(&self) -> Option<&Self::RawValueType> {
                <Self::RawValueType as InputType>::as_raw_value(&self.0)
            }
        }

        impl std::fmt::Display for $name {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                <i32 as std::fmt::Display>::fmt(&self.0, f)
            }
        }
    };
}

newtype_id!(ProductId);
newtype_id!(StoreId);
newtype_id!(PersonId);
newtype_id!(ReceiptId);
newtype_id!(ReceiptLineId);
newtype_id!(ReceiptLineSplitId);

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
