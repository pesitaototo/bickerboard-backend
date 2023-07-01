import Post from './post';
import Topic from './topic';
import User from './user';

User.hasMany(Post, { onDelete: 'cascade', hooks: true });
Post.belongsTo(User);

User.hasMany(Topic, { onDelete: 'cascade', hooks: true });
Topic.belongsTo(User);

Topic.hasMany(Post);
Post.belongsTo(Topic);

export {
  User, Topic, Post
};