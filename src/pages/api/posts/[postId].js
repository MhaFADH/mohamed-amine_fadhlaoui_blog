import { UnauthorizedError } from "@/api/errors"
import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  idValidator,
  postContentValidator,
  postTitleValidator,
} from "@/utils/validators"

const handle = mw({
  GET: [
    validate({
      query: {
        postId: idValidator,
      },
    }),
    async ({
      models: { PostModel },
      input: {
        query: { postId },
      },
      res,
    }) => {
      const post = await PostModel.query()
        .findById(postId)
        .withGraphFetched("[user,comments.[user]]")
        .throwIfNotFound()

      res.send(post)
    },
  ],
  PATCH: [
    auth,
    validate({
      query: {
        postId: idValidator,
      },
      body: {
        title: postTitleValidator,
        content: postContentValidator,
      },
    }),
    async ({
      models: { PostModel },
      input: {
        body,
        query: { postId },
      },
      res,
      session,
    }) => {
      const post = await PostModel.query()
        .findById(postId)
        .withGraphFetched("user")
        .throwIfNotFound()

      if (parseInt(post.user.id, 10) !== parseInt(session.id, 10)) {
        throw new UnauthorizedError()
      }

      await PostModel.query()
        .updateAndFetchById(postId, {
          ...body,
          updatedAt: PostModel.fn.now(),
        })
        .throwIfNotFound()

      res.send("Post updated")
    },
  ],
})

export default handle
