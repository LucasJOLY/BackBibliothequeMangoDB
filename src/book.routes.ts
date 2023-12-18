import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
 
export const bookRouter = express.Router();
bookRouter.use(express.json());
 
bookRouter.get("/", async (_req, res) => {
   try {
       const book = await collections.book.find({}).toArray();
       res.status(200).send(book);
   } catch (error) {
       res.status(500).send(error.message);
   }
});

bookRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const book = await collections.book.findOne(query);
  
        if (book) {
            res.status(200).send(book);
        } else {
            res.status(404).send(`Impossible de trouver le livre: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Impossible de trouver le livre: ID ${req?.params?.id}`);
    }
 });


 bookRouter.post("/", async (req, res) => {
    try {
        const book = req.body;
        const result = await collections.book.insertOne(book);
  
        if (result.acknowledged) {
            res.status(201).send(`Livre crée: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Impossible de créer ce livre.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });



 bookRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const book = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.book.updateOne(query, { $set: book });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Livre mis a jour: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Impossible de trouver le livre : ID ${id}`);
        } else {
            res.status(304).send(`Impossible de mettre a jour ce livre : ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });



 bookRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.book.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Livre supprimé: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Impossible de supprimer ce livre: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Impossible de trouver le livre: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });