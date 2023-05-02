import Post from "./post";
import Topic from "./topic";
import User from "./user";

User.hasMany(Post)
User.hasMany(Topic)
Topic.belongsTo(User)
Post.belongsTo(Topic)
Post.belongsTo(User)

export {
  User, Topic, Post
}