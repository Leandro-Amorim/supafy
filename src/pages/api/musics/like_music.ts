// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { nullUUID } from "@/lib/utils";
import initializeAPIClient from "@/server/initializeAPIClient";
import { NextApiRequest, NextApiResponse } from "next";

interface APIRequest extends NextApiRequest {
	body: {
		like: boolean,
		musicId: string
	}
}

export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', true);
		if (error) { return; }

		if (req.body.like) {
			await supabase.from('music_likes').upsert({ user_id: client_id ?? nullUUID, music_id: req.body.musicId });
		}
		else {
			await supabase.from('music_likes').delete().eq('music_id', req.body.musicId).eq('user_id', client_id ?? nullUUID);
		}

		res.status(200).json({ status: 'success' });
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
