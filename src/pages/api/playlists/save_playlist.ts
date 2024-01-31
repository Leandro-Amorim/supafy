import { NextApiRequest, NextApiResponse } from "next";
import initializeAPIClient from "@/server/initializeAPIClient";
import { nullUUID } from "@/lib/utils";

interface APIRequest extends NextApiRequest {
	body: {
		playlistId: string,
		save: boolean,
	}
}

export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', true);
		if (error) { return; }

		if (req.body.save) {
			await supabase.from('users_playlists').upsert({ user_id: client_id ?? nullUUID, playlist_id: req.body.playlistId });
		}
		else {
			await supabase.from('users_playlists').delete().eq('playlist_id', req.body.playlistId).eq('user_id', client_id ?? nullUUID);
		}

		res.status(200).json({ status: 'success' });
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
