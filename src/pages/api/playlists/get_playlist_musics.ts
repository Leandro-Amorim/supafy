import { NextApiRequest, NextApiResponse } from "next";
import initializeAPIClient from "@/server/initializeAPIClient";
import { nullUUID } from "@/lib/utils";

interface APIRequest extends NextApiRequest {
	body: {
		playlistId: string,
	}
}

export interface APIResponse {
	status: 'success' | 'error',
	data: Array<{ id: string, playlist_id: string }>
}

export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', false);
		if (error) { return; }

		let query;
		if (req.body.playlistId == 'liked') {
			query = supabase.rpc('get_liked_musics_ids', { my_id: client_id ?? nullUUID});
		}
		else {
			query = supabase.rpc('get_playlist_musics_ids', { pid: req.body.playlistId, my_id: client_id ?? nullUUID });
		}
		const result = await query;

		if (result.error) { console.log(result.error) }

		res.status(200).json({
			status: 'success',
			data: result.data ?? [],
		} satisfies APIResponse);
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
