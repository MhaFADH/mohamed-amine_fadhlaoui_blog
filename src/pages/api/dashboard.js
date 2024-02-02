import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { pageValidator } from "@/utils/validators"
import config from "@/web/config"

const handle = mw({
  GET: [
    auth,
    validate({
      query: {
        page: pageValidator.optional(),
      },
    }),
    async ({
      res,
      models: { PostModel, CommentModel },
      input: {
        query: { page },
      },
      session,
    }) => {
      const userId = parseInt(session.id, 10)
      const query = PostModel.query()
      const posts = await query
        .clone()
        .where("userId", "=", userId)
        .withGraphFetched("user")
        .orderBy("createdAt", "DESC")
        .limit(config.ui.itemsPerPage)
        .offset((page - 1) * config.ui.itemsPerPage)
      const [{ count: countCom }] = await CommentModel.query()
        .where("authorId", "=", userId)
        .count()
      const [{ count: countPost }] = await PostModel.query()
        .where("userId", "=", userId)
        .count()

      res.send({
        result: { posts, countPost, countCom },
        meta: {
          count: countPost,
        },
      })
    },
  ],
})

export default handle
