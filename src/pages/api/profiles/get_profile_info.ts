import initializeAPIClient from "@/server/initializeAPIClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	try {

		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', false);
		if (error) { return; }

		if (!client_id) {
			return res.status(200).json({});
		}

		let query = supabase.from('profiles').select('username, avatar_url').eq('id', client_id).single();

		const result = await query;

		if (result.error) { console.log(result.error) }

		res.status(200).json(result.data);
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
