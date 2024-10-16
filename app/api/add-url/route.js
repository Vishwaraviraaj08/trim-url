import clientPromise from '@/lib/mongodb';

export async function POST(req) {
    const { endpoint, redirectUrl } = await req.json();

    try {
        const client = await clientPromise;
        const db = client.db('url-shortener');
        const existingUrl = await db.collection('urls').findOne({ endpoint });

        if (existingUrl) {
            return new Response(JSON.stringify({ success: false, message: 'Endpoint already exists' }), { status: 400 });
        }

        await db.collection('urls').insertOne({ endpoint, redirectUrl });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error adding URL:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error adding URL' }), { status: 500 });
    }
}
