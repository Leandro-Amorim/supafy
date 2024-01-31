export interface MusicInfo {
	id: string,
	name: string,
	url: string | null,
	image_url: string | null,
	artist_id: string,
	artist_name: string,
	album_name: string,
	duration: number,
	liked_by_me: boolean,
	genre_name?: string
}