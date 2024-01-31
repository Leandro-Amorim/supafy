import { LibraryState } from "@/types/UI/LibraryState";
import { PlaylistModalState } from "@/types/UI/PlaylistModalState";
import { FastAverageColor } from "fast-average-color";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { updateLibrary } from "../library/updateLibrary";
import fetchAPIForm from "../fetchAPIForm";
import { refreshData } from "../utils";

export const updatePlaylist = async function (modal: PlaylistModalState, setModal: Dispatch<SetStateAction<PlaylistModalState>>,
	setLibrary: Dispatch<SetStateAction<LibraryState>>, router: NextRouter) {
	const playlistId = modal.playlistId;

	const form = new FormData();

	if (modal.imageData) {
		const fac = new FastAverageColor();
		const file = await createImageBitmap(modal.imageData);
		const color = fac.getColor(file).hex ?? 'red';
		form.append('color', color);
		file.close();
	}

	form.append('playlistId', modal.playlistId ?? '');
	form.append('name', modal.name);
	form.append('imageData', modal.imageData ?? '');
	form.append('deleteImage', String(modal.imageData === ''));

	if (modal.imageData === '') {
		form.append('color', 'red');
	}

	await fetchAPIForm('playlists/update_playlist', form);
	updateLibrary(setLibrary);

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

	if (router.asPath.includes(`/playlist/${playlistId}`)) {
		refreshData(router);
	}
}