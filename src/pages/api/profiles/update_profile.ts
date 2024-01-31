import multer from "multer";
import fs from 'fs/promises';
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import initializeAPIClient from "@/server/initializeAPIClient";
import { ParamsDictionary, RequestHandler } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { nullUUID } from "@/lib/utils";
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

		if (req.body.color !== undefined) {
			await supabase.from('profiles').update({
				username: req.body.name,
				color: req.body.color,
			}).eq('id', client_id ?? nullUUID);
		}
		else {
			await supabase.from('profiles').update({
				username: req.body.name,
			}).eq('id', client_id ?? nullUUID);
		}

		if (req.files.length > 0) {

			const file = await fs.readFile(req.files[0].path);
			const query = await supabase.storage.from('images').upload(`${client_id}/${req.files[0].filename}`, file, { upsert: true, contentType: 'image/png' });

			if (query.error) { console.error(query.error); }
			
			const oldImageUrl = (await supabase.from('profiles').select('avatar_url').eq('id', client_id ?? nullUUID).single()).data?.avatar_url;
			if (oldImageUrl) {
				const filename = path.basename(oldImageUrl);
				await supabase.storage.from('images').remove([`${client_id}/${filename}`]);
			}

			await supabase.from('profiles').update({ avatar_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${query.data?.path ?? ''}` }).eq('id', client_id ?? nullUUID);
			await fs.unlink(req.files[0].path);
		}

		if (req.body.deleteImage == 'true') {

			const oldImageUrl = (await supabase.from('profiles').select('avatar_url').eq('id', client_id ?? nullUUID).single()).data?.avatar_url;
			if (oldImageUrl) {
				const filename = path.basename(oldImageUrl);
				await supabase.storage.from('images').remove([`${client_id}/${filename}`]);
			}

			await supabase.from('profiles').update({ avatar_url: '' }).eq('id', client_id ?? nullUUID);
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