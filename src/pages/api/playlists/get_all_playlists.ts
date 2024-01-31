import initializeAPIClient from "@/server/initializeAPIClient";
import { NextApiRequest, NextApiResponse } from "next";

export interface APIResponse {
	status: 'success' | 'error',
	data: Array<{ id: string, name: string }>,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', false);
		if (error) { return; }

		if (!client_id) {
			return res.status(200).json([]);
		}
		const result = await supabase.from('playlists').select('id, name').eq('author_id', client_id);
		if (result.error) { console.error(result.error); }

		res.status(200).json({
			status: 'success',
			data: result.data ?? []
		} satisfies APIResponse);
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
