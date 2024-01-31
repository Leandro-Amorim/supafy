import { FastAverageColor } from "fast-average-color";
import fetchAPIForm from "../fetchAPIForm";

export const completeProfile = async function (
	data: {
		name: string,
		previewUrl: string,
		imageData: '' | File | null
	}) {

	const form = new FormData();

	if (data.imageData) {
		const fac = new FastAverageColor();
		const file = await createImageBitmap(data.imageData);
		const color = fac.getColor(file).hex ?? 'royalblue';
		form.append('color', color);
		file.close();
	}

	form.append('name', data.name);
	form.append('imageData', data.imageData ?? '');
	await fetchAPIForm('profiles/complete_profile', form);
}