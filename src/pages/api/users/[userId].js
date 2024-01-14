import mw from "@/api/mw"
import auth from "@/api/middlewares/auth"
import { HTTP_ERRORS } from "@/api/constants"

const handle = mw({
  PATCH: [
    auth,
    async ({
      models: { UserModel },
      req: {
        body,
        query: { userId },
        headers: { cookie },
      },
      res,
    }) => {
      console.info("COOKIESBACKEND => ", cookie)
      const user = await UserModel.query().findById(userId).throwIfNotFound()

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
