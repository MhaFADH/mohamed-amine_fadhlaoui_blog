export const up = async (db) => {
  await db.schema.alterTable("posts", (table) => {
    table.integer("visits").notNullable().defaultTo("0")
  })

  await db.schema.createTable("comments", (table) => {
    table.increments("id")
    table.integer("authorId").notNullable()
    table.integer("postId").notNullable()
    table.text("content").notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (db) => {
  await db.schema.alterTable("posts", (table) => {
    table.dropColumn("visits")
  })

  await db.schema.dropTable("comments")
}
