require('dotenv').config();
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.tlbypdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        const coffees = client.db("espresso").collection("coffees")
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Get All
        app.get('/', async (req, res) => {
            const cursor = coffees.find({});
            const requiredCoffes = await cursor.toArray();
            res.send(requiredCoffes)
        })

        // Get One
        app.get('/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const coffee = await coffees.findOne(query);
            res.send(coffee)
        })

        // Post One
        app.post('/', async (req, res) => {
            const coffee = req.body;
            const result = await coffees.insertOne(coffee)

            res.send(result)
        })

        // Update One
        app.put('/:id', async (req, res) => {
            const coffee = req.body;
            const id = req.params.id
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updateCoffee = {
                $set: {
                    name: coffee.name,
                    chef: coffee.chef,
                    supplier: coffee.supplier,
                    price: coffee.price,
                    category: coffee.category,
                    details: coffee.details,
                    photoUrl: coffee.photoUrl
                },
            };
            const result = await coffees.updateOne(filter, updateCoffee, options);
            res.send(result)
        })

        app.delete('/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffees.deleteOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
