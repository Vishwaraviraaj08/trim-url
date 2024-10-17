import clientPromise from '@/lib/mongodb';

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db('url-shortener');
        const urls = await db.collection('urls').find()
            .map(url => ({ endpoint: url.endpoint, redirectUrl: url.redirectUrl }))
            .toArray();
        return new Response(JSON.stringify(urls), { status: 200 });
    } catch (error) {
        console.error('Error checking endpoint availability:', error);
        return new Response(JSON.stringify({ available: false }), { status: 500 });
    }
}
