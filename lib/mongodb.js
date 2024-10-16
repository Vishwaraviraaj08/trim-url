import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://url-shortener:vishwa08@samplecluster.clrkivs.mongodb.net/url-shortener?retryWrites=true&w=majority&appName=sampleCluster";

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
