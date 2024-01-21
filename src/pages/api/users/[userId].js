import mw from "@/api/mw"
import auth from "@/api/middlewares/auth"
import { HTTP_ERRORS } from "@/api/constants"
import jsonwebtoken from "jsonwebtoken"
import config from "@/config.mjs"
import { emailValidator, usernameValidator } from "@/utils/validators"
import { object } from "yup"
import { UnauthorizedError } from "@/api/errors"

const handle = mw({
  PATCH: [
    auth,
    async ({
      models: { UserModel },
      req: {
        body,
        query: { userId },
        cookies: { [config.security.jwt.cookieName]: cookie },
      },
      res,
    }) => {
      const { payload } = jsonwebtoken.decode(cookie)
      const editSchema = object({
        username: usernameValidator,
        email: emailValidator,
      })
      const isEdit = "email" in body && "username" in body

      if (!payload.isAdmin && payload.id !== parseInt(userId, 10)) {
        throw new UnauthorizedError()
      }

      if (isEdit) {
        if (!editSchema.isValidSync(body)) {
          throw new UnauthorizedError()
        }

        const user = await UserModel.query().findOne({ email: body.email })

        if (user) {
          throw new UnauthorizedError()
        }
      }

      await UserModel.query().updateAndFetchById(userId, body).throwIfNotFound()

      res.send("User updated")
    },
  ],
  DELETE: [
    auth,
    async ({
      models: { UserModel },
      req: {
        query: { userId },
      },
      res,
      session,
    }) => {
      const user = await UserModel.query().findById(userId).throwIfNotFound()

      if (
        parseInt(session.id, 10) !== parseInt(userId, 10) ||
        !session.isAdmin
      ) {
        await UserModel.query().delete().where({ id: userId })
        res.send(`User ${user.username} has been deleted`)
      }

      res.status(HTTP_ERRORS.NOT_FOUND).send("Cannot delete own account")
    },
  ],
})

export default handle
