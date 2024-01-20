using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class SeedingRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //seed roles in roles table
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: ["Id", "Name"],
                values: [Guid.NewGuid().ToString(), "Admin"]);
            
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: ["Id", "Name"],
                values: [Guid.NewGuid().ToString(), "User"]);


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [AspNetRoles]");
        }
    }
}
