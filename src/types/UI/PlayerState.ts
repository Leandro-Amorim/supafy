export interface PlayerState {
	playing: boolean,
	shuffle: boolean,
	loopMusic: boolean,
	loopPlaylist: boolean,
	volume: number,
	muted: boolean,
	seek: number,
	duration: number,
}