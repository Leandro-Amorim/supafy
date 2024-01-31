import { ProfileEditModalState } from "@/types/UI/ProfileEditModalState";
import { Dispatch, SetStateAction } from "react";
import fetchAPIForm from "../fetchAPIForm";
import { GenericAPIResponse } from "@/types/GenericAPIResponse";
import { FastAverageColor } from "fast-average-color";

export const updateProfile = async function (modal: ProfileEditModalState, setModal: Dispatch<SetStateAction<ProfileEditModalState>>) {

	const form = new FormData();
	form.append('name', modal.name);

	if (modal.imageData) {
		const fac = new FastAverageColor();
		const file = await createImageBitmap(modal.imageData);
		const color = fac.getColor(file).hex ?? 'royalblue';
		form.append('color', color);
		file.close();
	}

	form.append('imageData', modal.imageData ?? '');
	form.append('deleteImage', String(modal.imageData === ''));

	if (modal.imageData === '') {
		form.append('color', 'royalblue');
	}

	await fetchAPIForm<GenericAPIResponse>('profiles/update_profile', form);

	setModal((prev) => {
		return {
			...prev,
			open: false,
			name: '',
			imageData: null,
			previewUrl: '',
		}
	});
}