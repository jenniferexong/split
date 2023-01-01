use async_graphql::SimpleObject;

use crate::db::person::DbPerson;

use super::PersonId;

#[derive(SimpleObject)]
pub struct ApiPerson {
    pub id: PersonId,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
}

impl From<DbPerson> for ApiPerson {
    fn from(
        DbPerson {
            id,
            first_name,
            last_name,
            email,
        }: DbPerson,
    ) -> Self {
        Self {
            id,
            first_name,
            last_name,
            email,
        }
    }
}
