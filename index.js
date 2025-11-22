import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE_URL || 
  `mongodb+srv://${process.env.DATABASE_dbb}:${process.env.Password}@cluster0.shgwdad.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Database connected");

    const db = client.db("smartdb");
    const smartCollection = db.collection("smarts");
    const bookingsCollection = db.collection("bookings");

    app.get("/smarts", async (req, res) => {
      const result = await smartCollection.find().toArray();
      res.send(result);
    });

    app.get("/smarts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await smartCollection.findOne({ _id: new ObjectId(id) });

      res.send({
        Success: true,
        result,
      });
    });

    app.post("/smarts", async (req, res) => {
      const data = req.body;
      data.createdAt = new Date();

      const result = await smartCollection.insertOne(data);
      res.send({
        Success: true,
        result,
      });
    });

    app.put("/smarts/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const result = await smartCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

      res.send({
        Success: true,
        result,
      });
    });

    app.delete("/smarts/:id", async (req, res) => {
      const id = req.params.id;

      const result = await smartCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({
        Success: true,
        result,
      });
    });

    app.get("/latest-smarts", async (req, res) => {
      const result = await smartCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();

      res.send(result);
    });

    app.get("/my-vehicles", async (req, res) => {
      const email = req.query.email;
      const result = await smartCollection
        .find({ userEmail: email })
        .toArray();

      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const data = req.body;
      console.log(req.body)
      data.createdAt = new Date();

      const result = await bookingsCollection.insertOne(data);
      res.send(result);
    });

    app.get("/my-bookings", async (req, res) => {
      const email = req.query.email;

      const result = await bookingsCollection
        .find({ customerEmail: email })
        .toArray();

      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Ping successful. MongoDB connected.");
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment10 CRUD Server is Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
