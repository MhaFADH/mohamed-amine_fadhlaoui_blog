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

  await db("users").insert(
    [...Array(25)].map(() => ({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      passwordHash: "alskdjalsdkjasdlkjalskdjalsdkjasdlkjalskdjalsdkjasdlkj",
      passwordSalt: "alskdjalsdkjasdlkjalskdjalsdkjasdlkjalskdjalsdkjasdlkj",
      enabled: "true",
      isAdmin: "false",
    })),
  )

  await db("posts").insert(
    [...new Array(3000)].map(() => ({
      title: faker.word.words({ count: { min: 1, max: 3 } }),
      content: faker.word.words({ count: { min: 2, max: 10 } }),
      userId: 1,
      visits: faker.number.int({ min: 0, max: 100 }),
    })),
  )

  await db("comments").insert(
    [...new Array(4000)].map(() => ({
      authorId: faker.number.int({ min: 1, max: 25 }),
      postId: faker.number.int({ min: 9, max: 3000 }),
      content: faker.word.words({ count: { min: 2, max: 10 } }),
    })),
  )
}
