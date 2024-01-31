export interface BasicPlaylist {
	id: string,
	name: string,
	image_url: string | null,
	author_id: string | null,
	author_name: string | null,
	saved_by_me: boolean,
	color: string,
}