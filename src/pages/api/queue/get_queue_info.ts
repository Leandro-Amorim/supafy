import { NextApiRequest, NextApiResponse } from "next";
import initializeAPIClient from "@/server/initializeAPIClient";
import { MusicInfo } from "@/types/database/MusicInfo";
import { nullUUID } from "@/lib/utils";

interface APIRequest extends NextApiRequest {
	body: {
		musicIds: Array<string>
	}
}

export interface APIResponse {
	status: 'success' | 'error',
	data?: Array<MusicInfo>
}

export default async function handler(req: APIRequest, res: NextApiResponse) {


	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', false);
		if (error) { return; }

		const result = await supabase.rpc('get_queue_info', { mids: req.body.musicIds, my_id: client_id ?? nullUUID });

		if (result.error) { console.error(result.error) }

		res.status(200).json({
			status: 'success',
			data: result.data ?? [],
		} satisfies APIResponse);
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
