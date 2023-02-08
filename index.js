require('dotenv').config()
const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000

// middle wares
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Server Running')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vlhy1ml.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const contentConnection = client.db('Portmanteau').collection('Content')

        app.post('/content', async (req, res) => {
            const query = req.body
            const result = await contentConnection.insertOne(query)
            res.send(result)
        })
        app.get('/content', async (req, res) => {
            const query = {}
            const result = await contentConnection.find(query).toArray()
            res.send(result)
        })

        app.delete('/content/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await contentConnection.deleteOne(filter)
            res.send(result)
        })

        app.put('/content/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateData = {
                $set: {
                    title: data.title
                }
            }
            const result = await contentConnection.updateOne(filter, updateData, options)
            res.send(result)
        })

    }
    catch (e) {
        console.log(e)
    }
}

run()

app.listen(port, () => console.log(`Server Running on PORT ${port}`))