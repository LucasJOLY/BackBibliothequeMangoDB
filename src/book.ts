import * as mongodb from "mongodb";
 
export interface Book {
   name: string;
   auteur :  string;
   type : string;
   prix : number;
   description : string;
   _id?: mongodb.ObjectId;
}