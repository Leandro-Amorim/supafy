import initializeAPIClient from "@/server/initializeAPIClient";
import { NextApiRequest, NextApiResponse } from "next";


interface APIRequest extends NextApiRequest {
	body: {
		playlistId: string,
		musicId: string,
		add: boolean
	}
}

export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', true);
		if (error) { return; }

		const authorId = (await supabase.from('playlists').select('author_id').eq('id', req.body.playlistId).single()).data?.author_id ?? null;

		if (client_id !== authorId) {
			return res.status(403).json({ status: 'error', reason: 'You don\'t have permission' });
		}

		if (req.body.add) {
			const order = ((await supabase.from('playlists_musics').select('order').order('order', { ascending: false }).limit(1).single()).data?.order ?? 0) + 1 ?? 50000;
			await supabase.from('playlists_musics').upsert({ playlist_id: req.body.playlistId, music_id: req.body.musicId, order: order });
		}
		else {
			await supabase.from('playlists_musics').delete().eq('music_id', req.body.musicId).eq('playlist_id', req.body.playlistId);
		}

		const result = await supabase.rpc('get_playlist_genres', { pid: req.body.playlistId });

		if (result.error) { console.error(result.error) }

		const size = result.data?.length ?? 1;

		const genres = [];
		for (const el of result.data ?? []) {
			if (el.genre) {
				genres.push(el.genre);
			}
		}

		const genreObject: { [key: string]: number } = {};

		for (const genre of genres) {
			genreObject[genre] = (genreObject[genre] ?? 0) + 1;
		}
		for (const genre of Object.keys(genreObject)) {
			genreObject[genre] = genreObject[genre] / size;
		}

		await supabase.from('playlists').update({ genre_data: genreObject }).eq('id', req.body.playlistId);

		res.status(200).json({ status: 'success' });
	}
	catch (err) {
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}
