import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
    endpoint: { type: String, required: true, unique: true },
    redirectTo: { type: String, required: true },
});

const Url = mongoose.models.Url || mongoose.model('Url', UrlSchema);
export default Url;
