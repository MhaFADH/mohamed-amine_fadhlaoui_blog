import BaseModel from "@/db/models/BaseModel.mjs"
import UserModel from "./UserModel.mjs"
import CommentModel from "./CommentModel.mjs"

class PostModel extends BaseModel {
  static tableName = "posts"
  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        filter: (query) => query.select("id", "username", "isAdmin"),
        join: {
          from: "posts.userId",
          to: "users.id",
        },
      },
      comments: {
        relation: BaseModel.HasManyRelation,
        modelClass: CommentModel,
        join: {
          from: "posts.id",
          to: "comments.postId",
        },
      },
    }
  }
}

export default PostModel
