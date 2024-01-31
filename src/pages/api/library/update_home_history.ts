import initializeAPIClient from "@/server/initializeAPIClient";
import { NextApiRequest, NextApiResponse } from "next";

interface APIRequest extends NextApiRequest {
	body: {
		playlistId: string,
	}
}
export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', false);
		if (error) { return; }

		if (!client_id) {
			return res.status(200).json({ status: 'success' });
		}

		await supabase.from('playlist_history').upsert({ 'last_played_at': (new Date()).toISOString(), 'user_id': client_id, 'playlist_id': req.body.playlistId });

		return res.status(200).json({ status: 'success' });
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}