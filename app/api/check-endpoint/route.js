import clientPromise from '@/lib/mongodb';

export async function POST(req) {
    const { endpoint } = await req.json();

    try {
        const client = await clientPromise;
        const db = client.db('url-shortener');
        const existingUrl = await db.collection('urls').findOne({ endpoint });
        return new Response(JSON.stringify({ available: !existingUrl }), { status: 200 });
    } catch (error) {
        console.error('Error checking endpoint availability:', error);
        return new Response(JSON.stringify({ available: false }), { status: 500 });
    }
}
