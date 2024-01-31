import { PlaylistModalState } from "@/types/UI/PlaylistModalState";
import { FastAverageColor } from "fast-average-color";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { APIResponse } from "@/pages/api/playlists/create_playlist";
import fetchAPIForm from "../fetchAPIForm";

export const createPlaylist = async function (modal: PlaylistModalState, setModal: Dispatch<SetStateAction<PlaylistModalState>>, router: NextRouter) {

	const form = new FormData();

	if (modal.imageData) {
		const fac = new FastAverageColor();
		const file = await createImageBitmap(modal.imageData);
		const color = fac.getColor(file).hex ?? 'red';
		form.append('color', color);
		file.close();
	}

	form.append('name', modal.name);
	form.append('imageData', modal.imageData ?? '');

	const resp = await fetchAPIForm<APIResponse>('playlists/create_playlist', form);

	if (resp.id) {
		setModal((prev) => {
			return {
				...prev,
				playlistId: null,
				open: false,
				create: false,
				name: '',
				imageData: null,
				previewUrl: '',
			}
		});
		router.push(`/playlist/${resp.id}`);
	}
}