export interface PlaylistModalState {
	playlistId: string | null,
	open: boolean,
	create: boolean,
	name: string,
	imageData: '' | File | null,
	previewUrl: string
}