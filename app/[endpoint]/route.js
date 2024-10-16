import clientPromise from '@/lib/mongodb';

export async function GET(req, { params }) {
    const { endpoint } = params;

    try {
        const client = await clientPromise;
        const db = client.db('url-shortener');
        const urlEntry = await db.collection('urls').findOne({ endpoint: endpoint });

        if (urlEntry) {
            let res = urlEntry.redirectUrl
            if (!res.match(/^[a-zA-Z]+:\/\//)) {
                res = 'https://' + res;
            }
            return Response.redirect(res, 302);
        } else {
            return new Response(JSON.stringify({ message: 'URL not found' }), { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching URL:', error);
        return new Response(JSON.stringify({ message: 'Error getting URL', endpoint: endpoint }), { status: 500 });
    }
}
