import { nullUUID } from "@/lib/utils";
import initializeAPIClient from "@/server/initializeAPIClient";
import { MusicInfo } from "@/types/database/MusicInfo";
import { NextApiRequest, NextApiResponse } from "next";

export interface APIResponse {
	status: 'success' | 'error',
	data?: MusicInfo | null
}

interface APIRequest extends NextApiRequest {
	body: {
		musicId: string
	}
}

export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', false);
		if (error) { return; }

		const result = await supabase.rpc('get_music_info', { mid: req.body.musicId, my_id: client_id ??nullUUID }).single();

		if (result.error) { console.error(result.error) }

		res.status(200).json({
			status: 'success',
			data: result.data
		} satisfies APIResponse);
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
