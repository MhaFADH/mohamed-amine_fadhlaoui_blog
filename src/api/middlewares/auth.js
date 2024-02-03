import { ForbiddenError } from "@/api/errors"
import config from "@/config.mjs"
import jsonwebtoken from "jsonwebtoken"

const auth = async (ctx) => {
  const {
    req: {
      cookies: { [config.security.jwt.cookieName]: fromClient },
    },
    next,
  } = ctx
  const sessionToken = fromClient || ctx.req.headers.cookie

  try {
    const { payload } = jsonwebtoken.verify(
      sessionToken,
      config.security.jwt.secret,
    )
    ctx.session = payload

    await next()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.info(err)
    throw new ForbiddenError()
  }
}

export default auth
