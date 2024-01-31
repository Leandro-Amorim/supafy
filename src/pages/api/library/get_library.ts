import { NextApiRequest, NextApiResponse } from "next";
import initializeAPIClient from "@/server/initializeAPIClient";
import { LibraryPlaylist } from "@/types/database/LibraryPlaylist";

export interface APIResponse {
	status: 'success' | 'error',
	data?: LibraryPlaylist[],
	reason?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'GET', false);
		if (error) { return; }

		if (!client_id) {
			return res.status(200).json([]);
		}

		const library = await supabase.rpc('get_library', { my_id: client_id }).returns<Array<LibraryPlaylist>>();
		const liked = await supabase.rpc('get_liked_library', { my_id: client_id }).single<{ liked_musics: number, last_played_at: string, added_at: string }>();

		if (library.error) { console.error(library.error) }
		if (liked.error) { console.error(liked.error) }

		const finalResult = (library.data ?? []);

		if (liked.data?.liked_musics && liked.data?.liked_musics > 0) {
			finalResult.push({
				id: 'liked',
				name: 'Liked Songs',
				image_url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
				author_id: client_id,
				author_name: liked.data.liked_musics + ' songs',
				last_played_at: liked.data.last_played_at,
				added_at: liked.data.added_at
			})
		}
		res.status(200).json({
			status: 'success',
			data: finalResult,
		} satisfies APIResponse);
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
