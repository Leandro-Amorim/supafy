import { AuthErrorState } from '@/types/UI/AuthErrorState';
import { LibraryState } from '@/types/UI/LibraryState';
import { MusicContextState } from '@/types/UI/MusicContextState';
import { PlayerState } from '@/types/UI/PlayerState';
import { PlaylistContextState } from '@/types/UI/PlaylistContextState';
import { PlaylistDeleteModalState } from '@/types/UI/PlaylistDeleteModalState';
import { PlaylistModalState } from '@/types/UI/PlaylistModalState';
import { ProfileEditModalState } from '@/types/UI/ProfileEditModalState';
import { CurrentMusic, QueueState } from '@/types/UI/QueueState';
import { SearchState } from '@/types/UI/SearchState';
import { BasicArtist } from '@/types/database/BasicArtist';
import { BasicPlaylist } from '@/types/database/BasicPlaylist';
import { MusicInfo } from '@/types/database/MusicInfo';
import { RefObject } from 'react';
import ReactPlayer from 'react-player';
import { atom } from 'recoil';

export const sidebarOpenState = atom({
	key: 'sidebarOpenState',
	default: true
})

export const sidebarSizeState = atom({
	key: 'sidebarSizeState',
	default: 320
})

export const libraryState = atom({
	key: 'libraryState',
	default: {
		viewMode: 'list',
		sortMode: 'Recents',
		search: '',
		playlists: []
	} as LibraryState,
});

export const authErrorState = atom({
	key: 'authErrorState',
	default: {
		showingError: false,
		errorMessage: '',
	} as AuthErrorState
});

export const musicContextState = atom({
	key: 'musicContextState',
	default: {
		musicId: '',
		playlistId: '',
		artistId: '',
		liked: false,
		setLiked: null,
		isOwner: false,
		isQueue: false
	} as MusicContextState
})

export const playlistContextState = atom({
	key: 'playlistContextState',
	default: {
		playlistId: '',
		name: '',
		imageUrl: '',
		saved: false,
		setSaved: null,
		isOwner: false,
	} as PlaylistContextState
})

export const playlistModalState = atom({
	key: 'playlistModalState',
	default: {
		playlistId: null,
		open: false,
		create: false,
		name: '',
		imageData: null,
		previewUrl: '',
	} as PlaylistModalState
})

export const playlistDeleteModalState = atom({
	key: 'playlistDeleteModalState',
	default: {
		playlistId: null,
		name: '',
		open: false,
	} as PlaylistDeleteModalState
})

export const playerState = atom({
	key: 'playerState',
	default: {
		playing: false,
		shuffle: false,
		loopMusic: false,
		loopPlaylist: false,
		volume: 1,
		muted: false,
		seek: 0,
		duration: 0,
	} as PlayerState
})

export const playerRefState = atom({
	key: 'playerRefState',
	default: null as RefObject<ReactPlayer> | null,
	dangerouslyAllowMutability: true,
})

export const queueState = atom({
	key: 'queueState',
	default: {
		currentMusic: {
			id: null,
			name: '',
			playlist_id: null,
			url: '',
			image_url: '',
			liked_by_me: false,
			artist_id: null,
			artist_name: '',
			duration: 0,
			album_name: '',
		} satisfies CurrentMusic,
		playHistory: [] as { id: string, playlist_id: string | null }[],
		queue: [] as { id: string, playlist_id: string | null }[],
		shuffledQueue: [] as { id: string, playlist_id: string | null }[],
	} as QueueState
})

export const profileEditModalState = atom({
	key: 'profileEditModalState',
	default: {
		open: false,
		name: '',
		imageData: null,
		previewUrl: '',
	} as ProfileEditModalState
})

export const searchState = atom({
	key: 'searchState',
	default: {
		input: '',
		state: 0,
		topResult: {} as (MusicInfo | BasicArtist | BasicPlaylist),
		results: {
			musics: [] as MusicInfo[],
			artists: [] as BasicArtist[],
			playlists: [] as BasicPlaylist[],
		}
	} as SearchState
})