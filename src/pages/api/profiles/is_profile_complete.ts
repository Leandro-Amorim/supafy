import { NextApiRequest, NextApiResponse } from "next";
import initializeAPIClient from "@/server/initializeAPIClient";
import { nullUUID } from "@/lib/utils";

export interface APIResponse {
	status: 'success' | 'error',
	data: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', true);
		if (error) { return; }

		const completed = (await supabase.from('profiles').select('signup_completed').eq('id', client_id ?? nullUUID).single()).data?.signup_completed ?? false;

		res.status(200).json({
			'status': 'success',
			data: completed,
		});
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}