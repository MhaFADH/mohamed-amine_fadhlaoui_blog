import { UnauthorizedError } from "@/api/errors"
import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { commentValidator, idValidator } from "@/utils/validators"

const handle = mw({
  POST: [
    auth,
    validate({
      body: {
        authorId: idValidator,
        postId: idValidator,
        content: commentValidator,
      },
    }),
    async ({
      models: { CommentModel },
      input: {
        body: { content, authorId, postId },
      },
      res,
      session,
    }) => {
      if (parseInt(session.id, 10) !== authorId) {
        throw new UnauthorizedError()
      }

      const comment = await CommentModel.query().insertAndFetch({
        authorId,
        content,
        postId,
      })

      res.send(comment)
    },
  ],
  GET: [
    async ({ res, models: { CommentModel } }) => {
      const query = CommentModel.query()
      const comments = await query.clone().withGraphFetched("user")

      res.send(comments)
    },
  ],
})

export default handle
