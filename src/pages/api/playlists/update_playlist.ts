import multer from "multer";
import fs from 'fs/promises';
import { nanoid } from "nanoid";
import initializeAPIClient from "@/server/initializeAPIClient";
import { NextApiRequest, NextApiResponse } from "next";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import path from 'path';

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
		playlistId: string,
		name: string,
		color?: string,
		deleteImage?: string,
	},
	files: Array<{ path: string, filename: string }>
}


export default async function handler(req: APIRequest, res: NextApiResponse) {

	try {
		const { supabase, error, session, client_id } = await initializeAPIClient(req, res, 'POST', true);
		if (error) { return; }

		await runMiddleware(req, res, upload.any());

		const authorId = (await supabase.from('playlists').select('author_id').eq('id', req.body.playlistId).single()).data?.author_id ?? null;

		if (client_id !== authorId) {
			return res.status(403).json({ status: 'error', reason: 'You don\'t have permission' });
		}


		if (req.body.color !== undefined) {
			await supabase.from('playlists').update({
				name: req.body.name,
				color: req.body.color,
			}).eq('id', req.body.playlistId);
		}
		else {
			await supabase.from('playlists').update({
				name: req.body.name,
			}).eq('id', req.body.playlistId);
		}


		if (req.files.length > 0) {

			const file = await fs.readFile(req.files[0].path);
			const query = await supabase.storage.from('images').upload(`${client_id}/${req.files[0].filename}`, file, { upsert: true, contentType: 'image/png' });

			if (query.error) { console.log(query.error); }

			const oldImageUrl = (await supabase.from('playlists').select('image_url').eq('id', req.body.playlistId).single()).data?.image_url;
			if (oldImageUrl) {
				const filename = path.basename(oldImageUrl);
				await supabase.storage.from('images').remove([`${client_id}/${filename}`]);
			}

			await supabase.from('playlists').update({ image_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${query.data?.path ?? ''}` }).eq('id', req.body.playlistId);
			await fs.unlink(req.files[0].path);
		}

		if (req.body.deleteImage == 'true') {

			const oldImageUrl = (await supabase.from('playlists').select('image_url').eq('id', req.body.playlistId).single()).data?.image_url;
			if (oldImageUrl) {
				const filename = path.basename(oldImageUrl);
				await supabase.storage.from('images').remove([`${client_id}/${filename}`]);
			}
			
			await supabase.from('playlists').update({ image_url: '', color: 'red' }).eq('id', req.body.playlistId);
		}

		res.status(200).json({ 'status': 'success' });
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ status: 'error', reason: 'Internal Server Error' });
	}
}

export const config = {
	api: {
		bodyParser: false
	}
}