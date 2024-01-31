import { Database } from "@/supabase";
import { GenericAPIResponse } from "@/types/GenericAPIResponse";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";



export default async function initializeAPIClient(req: NextApiRequest, res: NextApiResponse, method: 'GET' | 'POST' = 'POST', auth = false) {

	let supabase = createPagesServerClient<Database>({ req, res });
	let error = false;

	const { data: { session } } = await supabase.auth.getSession();
	const client_id = session?.user?.id ?? null;

	if (req.method !== method) {
		const resp: GenericAPIResponse = {
			status: 'error',
			reason: 'Method not allowed',
		};
		res.status(405).json(resp);
		error = true;
	}
	else if (auth && client_id === null) {
		const resp: GenericAPIResponse = {
			status: 'error',
			reason: 'Not authorized',
		}
		res.status(401).json(resp);
		error = true;
	}
	return {
		supabase,
		error,
		session,
		client_id,
	};
}