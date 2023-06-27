import Post from './post';
import Topic from './topic';
import User from './user';

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Topic);
Topic.belongsTo(User);

Topic.hasMany(Post);
Post.belongsTo(Topic);

export {
  User, Topic, Post
};