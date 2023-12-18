import * as mongodb from "mongodb";
import { Book } from "./book";
 
export const collections: {
   book?: mongodb.Collection<Book>;
} = {};
 
export async function connectToDatabase(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("notreDb");
   await applySchemaValidation(db);
 
   const bookCollection = db.collection<Book>("book");
   collections.book = bookCollection;
}
 
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",
           required: ["name", "auteur", "type", "prix", "description"],
           additionalProperties: false,
           properties: {
               _id: {},
               name: {
                   bsonType: "string",
                   description: "'name' est obligatoire et doit etre une chaine de caractere",
               },
               auteur: {
                   bsonType: "string",
                   description: "'position' est obligatoire et doit etre une chaine de caractere",
               },
               type: {
                     bsonType: "string",
                     description: "'type' est obligatoire et doit etre une chaine de caractere",
               },
               prix: {
                        bsonType: "int",
                        description: "'prix' est obligatoire et doit etre un entier",
                },
                description: {
                        bsonType: "string",
                        description: "'description' est obligatoire et doit etre une chaine de caractere",
                },
           },
       },
   };
 
   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "book",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("book", {validator: jsonSchema});
       }
   });
}