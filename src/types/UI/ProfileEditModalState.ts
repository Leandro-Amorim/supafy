export interface ProfileEditModalState {
	open: boolean,
	name: string,
	imageData: null | '' | File,
	previewUrl: string,
}