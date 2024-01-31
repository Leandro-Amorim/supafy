import { nullUUID } from "@/lib/utils";
import initializeAPIClient from "@/server/initializeAPIClient";
import { BasicArtist } from "@/types/database/BasicArtist";
import { BasicPlaylist } from "@/types/database/BasicPlaylist";
import { MusicInfo } from "@/types/database/MusicInfo";
import { NextApiRequest, NextApiResponse } from "next";

interface APIRequest extends NextApiRequest {
	body: {
		search_term: string,
	}
}

export interface APIResponse {
	status: 'success' | 'error',
	data?: {
		musics: MusicInfo[],
		artists: BasicArtist[],
		playlists: BasicPlaylist[],
	} | null
}

export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', false);
		if (error) { return; }

		const result = await supabase.rpc('get_search', { search_term: req.body.search_term, my_id: client_id ?? nullUUID}).single<
			{
				musics: MusicInfo[],
				artists: BasicArtist[],
				playlists: BasicPlaylist[],
			}>();

		if (result.error) { console.error(result.error) }
		res.status(200).json({
			status: 'success',
			data: result.data,
		} satisfies APIResponse);
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
