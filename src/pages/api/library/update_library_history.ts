import initializeAPIClient from "@/server/initializeAPIClient";
import { NextApiRequest, NextApiResponse } from "next";

interface APIRequest extends NextApiRequest {
	body: {
		playlistId: string
	}
}

export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', false);
		if (error) { return; }

		if (!client_id) {
			return res.status(200).json({ status: 'success' });
		}

		if (req.body.playlistId === 'liked') {
			await supabase.from('profiles').update({ 'last_played_liked_music_at': (new Date()).toISOString() }).eq('id', client_id);
		}
		else {
			const { error } = await supabase.from('users_playlists').update({ 'last_played_at': (new Date()).toISOString() }).eq('user_id', client_id).eq('playlist_id', req.body.playlistId);
			if (error) { console.log(error); }
		}

		return res.status(200).json({ status: 'success' });
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
