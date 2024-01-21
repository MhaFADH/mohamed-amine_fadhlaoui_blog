import { faker } from "@faker-js/faker"
import UserModel from "../models/UserModel.mjs"

export const seed = async (db) => {
  await db("posts").delete()
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

  await db("posts").insert(
    [...new Array(3000)].map(() => ({
      title: faker.word.words({ count: { min: 1, max: 3 } }),
      content: faker.word.words({ count: { min: 2, max: 10 } }),
      userId: 1,
    })),
  )
}
