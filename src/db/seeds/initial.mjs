import { faker } from "@faker-js/faker"
import UserModel from "../models/UserModel.mjs"

export const seed = async (db) => {
  await db("todos").delete()
  await db("categories").delete()
  await db("users").delete()

  const [passwordHash, passwordSalt] =
    await UserModel.hashPassword("Admin.1234")

  await db("users").insert({
    username: "admin",
    email: "admin@admin.com",
    passwordHash,
    passwordSalt,
    enabled: "true",
    isAdmin: "true",
  })
  const categories = await db("categories")
    .insert(
      [...new Array(30)].map(() => ({
        name: faker.word.noun(),
      })),
    )
    .returning("*")
  await db("todos").insert(
    [...new Array(3000)].map(() => ({
      description: faker.word.words({ count: { min: 2, max: 10 } }),
      isDone: faker.number.int({ min: 1, max: 30 }) % 7 === 0,
      categoryId:
        categories[faker.number.int({ min: 0, max: categories.length - 1 })].id,
    })),
  )
}
