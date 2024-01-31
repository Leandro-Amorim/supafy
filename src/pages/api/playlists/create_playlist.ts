import multer from "multer";
import fs from 'fs/promises';
import { nanoid } from "nanoid";
import initializeAPIClient from "@/server/initializeAPIClient";
import { NextApiRequest, NextApiResponse } from "next";
import { ParamsDictionary, RequestHandler } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { nullUUID } from "@/lib/utils";

const upload = multer({
	storage: multer.diskStorage({
		destination: 'uploads/',
		filename: (req, file, cb) => cb(null, nanoid()),
	}),
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) {

	return new Promise((resolve, reject) => {
		//@ts-ignore
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result)
			}
			return resolve(result)
		})
	})

}

interface APIRequest extends NextApiRequest {
	body: {
		name: string,
		color?: string,
	},
	files: Array<{ path: string, filename: string }>
}

export interface APIResponse {
	status: 'success' | 'error',
	id?: string,
	reason?: string
}

export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', true);
		if (error) { return; }

		await runMiddleware(req, res, upload.any());

		const playlist_id = (await supabase.from('playlists').insert({
			name: req.body.name,
			author_id: client_id,
			color: req.body.color ?? 'red',
			image_url: '',
			genre_data: {}
		}).select().single()).data?.id ?? null;

		await supabase.from('users_playlists').upsert({ user_id: client_id ?? nullUUID, playlist_id: playlist_id ?? '' });

		if (req.files.length > 0 && playlist_id) {

			const file = await fs.readFile(req.files[0].path);
			const query = await supabase.storage.from('images').upload(`${client_id}/${req.files[0].filename}`, file, { upsert: true, contentType: 'image/png' });

			if (query.error) { console.error(query.error); }

			await supabase.from('playlists').update({ image_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${query.data?.path ?? ''}` }).eq('id', playlist_id);
			await fs.unlink(req.files[0].path);
		}

		res.status(200).json({ status: 'success', id: playlist_id ?? '' } satisfies APIResponse);
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};