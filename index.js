const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { AsyncLocalStorage } = require("async_hooks");
const port = process.env.PORT || 2500;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}
@cluster0.r44bh6t.mongodb.net/?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://FashionShop:GG3oIxNJbMLMKG6x
// @cluster0.r44bh6t.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// crud operation

async function run() {
  try {
    client.connect();

    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const clouthCollection = client.db("FashionDB").collection("Products");
    const userCollection = client.db("FashionDB").collection("User");
    // get method
    app.get("/", async (req, res) => {
      res.send("App is running111...");
    });

    app.get("/products", async (req, res) => {
      const products = req.body;
      const cursor = clouthCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/productDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await clouthCollection.findOne(query);
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const products = req.body;

      const result = await clouthCollection.insertOne(products);
      res.send(result);
    });

    app.put("/productDetails/:id", async (req, res) => {
      const id = req.params.id;
      const cloth = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCloth = {
        $set: {
          productName: cloth?.productName,
          productId: cloth?.productId,
          price: cloth?.price,
          status: cloth?.status,
          availableSizes: cloth?.availableSizes,
          offer: cloth?.offer,
          productDetails: cloth?.productDetails,
          productType: cloth?.productType,
          image: cloth?.image,
          brandName: cloth?.brandName,
          gender: cloth?.gender,
          rating: cloth?.rating,
          ratingReview: cloth?.ratingReview,
          dailyDeals: cloth?.dailyDeals,
        },
      };

      const result = await clouthCollection.updateOne(filter, updatedCloth);
      res.send(result);
    });

    app.delete("/productDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await clouthCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/products", async (req, res) => {
      const result = await clouthCollection.deleteMany();
      res.send(result);
    });
    // Products Review

    const reviewCollection = client
      .db("FashionDB")
      .collection("ProductsReview");
    app.get("/review", async (req, res) => {
      const reviews = req.body;
      console.log(reviews);
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // cart databse with crud operation

    const cartCollection = client.db("FashionDB").collection("AddedCart");

    app.get("/addedCart", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });
    app.get("/addedCart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.findOne(query);
      res.send(result);
    });
    app.post("/addedCart", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });
    app.delete("/addedCart/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(cursor);
      res.send(result);
    });
    app.delete("/addedCart", async (req, res) => {
      const result = await cartCollection.deleteMany();
      res.send(result);
    });

    // User
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    const employeeCollection = client.db("FashionDB").collection("Employee");
    //Employee
    app.get("/employee", async (req, res) => {
      const result = await employeeCollection.find().toArray();
      res.send(result);
    });

    app.get("/employee/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await employeeCollection.findOne(cursor);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listen on port : ${port}`);
});
