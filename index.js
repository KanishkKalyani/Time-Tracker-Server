const { ApolloServer, gql } = require('apollo-server');
const { v4: uuid } = require('uuid');

const typeDefs = gql`
   type Tracker {
      id: ID!
      name: String!
      start: String!
      end: String!
      tags: [String!]
   }

   type Query {
      tracker: [Tracker]
   }

   type Mutation {

      addTrack(
         name: String,
      ): Tracker

      editTrack(
         id: ID!,
         name: String,
         start: String,
         end: String,
         tags: [String]
      ): Tracker

      deleteTrack(id: ID!): DeleteResponse
   }

   type DeleteResponse {
      ok: Boolean!
   }
`;

const tracker = {};

const addTracker = track => {
   const id = uuid();
   const start = "";
   const end = "";
   const tags = ["Temp Tag"];
   return tracker[id] = { ...track, id, start, end, tags };
 };

 addTracker({
   name: 'Test Track',
});

const resolvers = {
   Query: {
     tracker: () => Object.values(tracker),
   },
   Mutation: {
      addTrack: async (parent, track, context) => {
         return addTracker(track);
      },
      editTrack: async (parent, { id, ...track }, context) => {
         tracker[id] = {
            ...tracker[id],
            ...track,
          };

          return tracker[id];
      },
      deleteTrack: async (parent, { id }, context) => {
         const ok = Boolean(tracker[id]);
         delete tracker[id];

         return { ok };
      }
   },
 };

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
   console.log(`🚀 Server ready at ${url}`);
 });