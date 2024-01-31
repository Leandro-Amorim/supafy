export interface QueueState {
	currentMusic: CurrentMusic,
	playHistory: { id: string, playlist_id: string | null }[],
	queue: { id: string, playlist_id: string | null }[],
	shuffledQueue: { id: string, playlist_id: string | null }[],
}

export interface CurrentMusic {
	id: string | null,
	name: string,
	playlist_id: string | null,
	url: string,
	image_url: string,
	liked_by_me: boolean,
	artist_id: string | null,
	artist_name: string,
	duration: number,
	album_name: string,
}