require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://azizul:123@cluster0.13lfhki.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("brandShopDB").collection("products");
    const cartCollection = client.db("brandShopDB").collection("carts");

    app.get('/products', async(req, res)=>{
      const result = await productCollection.find().toArray()
      res.send(result)
    })

    
    app.post('/products', async(req, res)=>{
      const product = req.body
      const result = await productCollection.insertOne(product)
      res.send(result)

    })
    app.get('/products/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    app.patch('/products/:id', async(req, res) =>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedProducts = req.body
      const updateDoc = {
          $set:{

            image:updatedProducts.image, 
            name:updatedProducts.name,
            brand:updatedProducts.brand, 
            category:updatedProducts.category, 
            price:updatedProducts.price, 
            rating:updatedProducts.rating
          }
      } 
      const result = await productCollection.updateOne(filter, updateDoc, options)
      res.send(result)

  })
  // cart operation
  app.get('/carts', async(req, res)=>{
    const result = await cartCollection.find().toArray()
    res.send(result)
  })
  app.post('/carts', async(req, res)=>{
    const cart = req.body
    const result = await cartCollection.insertOne(cart)
    res.send(result)

  })
  app.delete('/carts/:id', async(req, res)=>{
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await cartCollection.deleteOne(query)
    res.send(result)
  })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Brand shop app is running !')
  })
  
app.listen(port, () => {
    console.log(`Brand shop app running on port ${port}`)
  })