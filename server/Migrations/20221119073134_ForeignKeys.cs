using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Receipts_StoreId",
                table: "Receipts",
                column: "StoreId");

            migrationBuilder.CreateIndex(
                name: "IX_ReceiptLines_ItemId",
                table: "ReceiptLines",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReceiptLines_Items_ItemId",
                table: "ReceiptLines",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Receipts_Stores_StoreId",
                table: "Receipts",
                column: "StoreId",
                principalTable: "Stores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReceiptLines_Items_ItemId",
                table: "ReceiptLines");

            migrationBuilder.DropForeignKey(
                name: "FK_Receipts_Stores_StoreId",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_Receipts_StoreId",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_ReceiptLines_ItemId",
                table: "ReceiptLines");
        }
    }
}
