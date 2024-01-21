import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  pageValidator,
  postContentValidator,
  postTitleValidator,
} from "@/utils/validators"
import config from "@/web/config"

const handle = mw({
  POST: [
    auth,
    validate({
      body: {
        content: postContentValidator,
        title: postTitleValidator,
      },
    }),
    async ({
      models: { PostModel },
      input: {
        body: { title, content },
      },
      res,
      session,
    }) => {
      const post = await PostModel.query().insertAndFetch({
        title,
        content,
        userId: session.id,
      })

      res.send(post)
    },
  ],
  GET: [
    validate({
      query: {
        page: pageValidator.optional(),
      },
    }),
    async ({
      res,
      models: { PostModel },
      input: {
        query: { page },
      },
    }) => {
      const query = PostModel.query()
      const posts = await query
        .clone()
        .withGraphFetched("user")
        .orderBy("createdAt", "DESC")
        .limit(config.ui.itemsPerPage)
        .offset((page - 1) * config.ui.itemsPerPage)
      const [{ count }] = await query.clone().count()

      res.send({
        result: posts,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handle
