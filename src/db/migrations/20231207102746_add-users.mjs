export const up = async (db) => {
  await db.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("username").notNullable().unique()
    table.text("email").notNullable().unique()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.boolean("enabled").notNullable().defaultTo("true")
    table.boolean("isAdmin").notNullable().defaultTo("false")
    table.timestamps(true, true, true)
  })

  await db.schema.alterTable("posts", (table) => {
    table.integer("userId").notNullable()
    table.foreign("userId").references("id").inTable("users")
  })
}

export const down = async (db) => {
  await db.schema.alterTable("posts", (table) => {
    table.dropColumn("userId")
  })

  await db.schema.dropTable("users")
}
