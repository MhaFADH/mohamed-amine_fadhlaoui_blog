import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { UnauthorizedError } from "@/api/errors"
import config from "@/web/config"
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
  pageValidator,
} from "@/utils/validators"

const handle = mw({
  POST: [
    validate({
      body: {
        username: usernameValidator,
        email: emailValidator,
        password: passwordValidator,
      },
    }),
    async ({
      input: {
        body: { username, email, password },
      },
      models: { UserModel },
      res,
    }) => {
      const user = await UserModel.query().findOne({ email })

      if (user) {
        res.send({ result: true })

        return
      }

      const [passwordHash, passwordSalt] =
        await UserModel.hashPassword(password)

      await UserModel.query().insertAndFetch({
        username,
        email,
        passwordHash,
        passwordSalt,
      })

      res.send({ result: true })
    },
  ],
  GET: [
    auth,
    validate({
      query: {
        page: pageValidator.optional(),
      },
    }),
    async ({
      models: { UserModel },
      input: {
        query: { page },
      },
      res,
      session,
    }) => {
      if (!session.isAdmin) {
        throw new UnauthorizedError()
      }

      const query = UserModel.query()
      const users = await UserModel.query()
        .select("id", "username", "enabled", "isAdmin")
        .limit(config.ui.itemsPerPage)
        .offset((page - 1) * config.ui.itemsPerPage)
      const [{ count }] = await query.clone().count()

      res.send({
        result: users,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handle
