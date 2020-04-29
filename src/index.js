import { GraphQLServer } from "graphql-yoga";

const users = [
  { id: "1", name: "DSsd", email: "sdsdds", age: 23 },
  { id: "2", name: "ebeebrevdsd", email: "sdsdsdsssss" },
];
const posts = [
  { id: "1", title: "DSsd", body: "sdsdds", published: true, author: "1" },
  {
    id: "2",
    title: "DSsbebeebrevdsd",
    body: "sdsdsdsssss",
    published: false,
    author: "2",
  },
];
const comments = [
  { id: "102", text: "vdasvb", author: "1",post:"1" },
  { id: "103", text: "vdasb", author: "2" ,post:"2"},
  { id: "104", text: "vdasb", author: "1" ,post:"2"},
  { id: "105", text: "vdasv", author: "1" ,post:"1"},
];
//type definitions
const typeDefs = `
    type Query{
       me:User!
       post:Post!
       users(query:String):[User!]
       posts(query:String):[Post!]!
       comments:[Comment!]!
    }

    type User {
        id:ID!
        name:String!
        email:String!
        age:Int
        posts:[Post!]!
        comments:[Comment!]!
    }

    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author:User!
        comments:[Comment!]!
    }

    type Comment{
        id:ID!
        text:String!
        author:User!
        post:Post!
    }
    
`;
//Resolvers
const resolvers = {
  Query: {
    comments(parent, args, ctx, info) {
      return comments;
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    },
    me() {
      return {
        id: 123042,
        name: "Mike",
        email: "teaha@xgj.com",
      };
    },
    post() {
      return {
        ID: 3423253,
        title: "grgwg",
        body: "sggsbvuvsnunus",
        published: false,
      };
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info){
        return comments.filter(comment=>{
            return comment.post===parent.id
        })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info){
        return comments.filter((post) => {
            return post.author === parent.id;
          });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user=>{
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info){
        return posts.find(post=>{
            return post.id === parent.post;
          });
    }
  },
};
const server = new GraphQLServer({
  typeDefs,
  resolvers,
});
server.start(() => {
  console.log("The server is up and running");
});
