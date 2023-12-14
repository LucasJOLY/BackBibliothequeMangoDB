import * as mongodb from "mongodb";
 
export interface Book {
   name: string;
   position: string;
   level: "junior" | "mid" | "senior";
   _id?: mongodb.ObjectId;
}