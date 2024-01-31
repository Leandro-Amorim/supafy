import initializeAPIClient from "@/server/initializeAPIClient";
import { NextApiRequest, NextApiResponse } from "next";
import path from 'path';

interface APIRequest extends NextApiRequest {
	body: {
		playlistId: string,
	}
}

export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', true);
		if (error) { return; }

		const authorId = (await supabase.from('playlists').select('author_id').eq('id', req.body.playlistId).single()).data?.author_id ?? null;

		if (client_id !== authorId) {
			return res.status(403).json({ status: 'error', reason: 'You don\'t have permission' });
		}

		const oldImageUrl = (await supabase.from('playlists').select('image_url').eq('id', req.body.playlistId).single()).data?.image_url;
		if (oldImageUrl) {
			const filename = path.basename(oldImageUrl);
			await supabase.storage.from('images').remove([`${client_id}/${filename}`]);
		}

		await supabase.from('playlists').delete().eq('id', req.body.playlistId);
		res.status(200).json({ 'status': 'success' });
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
