import { findAndRemove, setState, shuffleArray } from "./utils";
import { CurrentMusic, QueueState } from "@/types/UI/QueueState";
import { Dispatch, SetStateAction } from "react";
import { PlayerState } from "@/types/UI/PlayerState";
import { LibraryState } from "@/types/UI/LibraryState";
import fetchAPI from "./fetchAPI";
import { APIResponse as PlaylistMusicsResponse } from "@/pages/api/playlists/get_playlist_musics";
import { updateLibraryHistory } from "./library/updateLibraryHistory";
import { updateHomeHistory } from "./library/updateHomeHistory";
import { APIResponse as MusicInfoResponse } from "@/pages/api/queue/get_music_info";
import { APIResponse as QueueInfoResponse } from "@/pages/api/queue/get_queue_info";

export const addPlaylistToQueue = async function (playlistId: string, firstMusicId: string | null, clearQueue: boolean, queue: QueueState, setQueue: Dispatch<SetStateAction<QueueState>>,
	player: PlayerState, setPlayer: Dispatch<SetStateAction<PlayerState>>, setLibrary: Dispatch<SetStateAction<LibraryState>>) {

	if (clearQueue && queue.currentMusic.playlist_id == playlistId && !firstMusicId) {
		setPlayer((prev) => {
			return {
				...prev,
				playing: !prev.playing,
			}
		})
		return;
	}

	let newQueue: { id: string, playlist_id: string | null }[] = await getMusicsFromPlaylist(playlistId);

	if (firstMusicId) {
		const index = newQueue.findIndex((val) => { return val.id == firstMusicId });
		index ? newQueue.splice(0, index) : 0;
	}

	newQueue = newQueue.map((el) => { return { id: el.id, playlist_id: (clearQueue ? el.playlist_id : null) } })

	const oldHistory = clearQueue ? [] : structuredClone(queue.playHistory);
	const oldQueue = clearQueue ? [] : structuredClone(queue.queue);
	const oldShuffled = clearQueue ? [] : structuredClone(queue.shuffledQueue);

	const currentMusic = clearQueue ? {
		id: null,
		name: '',
		playlist_id: null,
		url: '',
		image_url: '',
		liked_by_me: false,
		artist_id: null,
		artist_name: '',
		album_name: '',
		duration: 0,
	} satisfies CurrentMusic : structuredClone(queue.currentMusic);

	oldQueue.push(...newQueue);
	shuffleArray(newQueue);
	oldShuffled.push(...newQueue);


	const queueState = setState(setQueue, {
		currentMusic: currentMusic,
		playHistory: oldHistory,
		queue: oldQueue,
		shuffledQueue: oldShuffled,
	})

	if (!queueState.currentMusic.id) {
		const newPlayer = setState(setPlayer, { seek: 0, playing: true });
		processQueue(queueState, setQueue, newPlayer, setPlayer);
	}

	if (clearQueue) {
		updateLibraryHistory(playlistId, setLibrary);
	}
	if (playlistId !== 'liked') {
		updateHomeHistory(playlistId);
	}
}

export const addMusicToQueue = async function (musicId: string, playlistId: string | null, clearQueue: boolean, queue: QueueState, setQueue: Dispatch<SetStateAction<QueueState>>,
	player: PlayerState, setPlayer: Dispatch<SetStateAction<PlayerState>>) {

	const oldHistory = clearQueue ? [] : structuredClone(queue.playHistory);
	const oldQueue = clearQueue ? [] : structuredClone(queue.queue);
	const oldShuffled = clearQueue ? [] : structuredClone(queue.shuffledQueue);
	const currentMusic = clearQueue ? {
		id: null,
		name: '',
		playlist_id: null,
		url: '',
		image_url: '',
		liked_by_me: false,
		artist_id: null,
		artist_name: '',
		album_name: '',
		duration: 0,
	} satisfies CurrentMusic : structuredClone(queue.currentMusic);

	const newMusic = {
		id: musicId,
		playlist_id: null,
	}
	oldQueue.push(newMusic);
	oldShuffled.push(newMusic);


	const queueState = setState(setQueue, {
		currentMusic: currentMusic,
		playHistory: oldHistory,
		queue: oldQueue,
		shuffledQueue: oldShuffled,
	})

	if (!queueState.currentMusic.id) {
		const newPlayer = setState(setPlayer, { seek: 0, playing: true });
		processQueue(queueState, setQueue, newPlayer, setPlayer);
	}

	if (playlistId && playlistId !== 'liked') {
		updateHomeHistory(playlistId);
	}
}

export const removeMusicFromQueue = async function (musicId: string, queue: QueueState, setQueue: Dispatch<SetStateAction<QueueState>>) {

	const normalQueue = structuredClone(queue.queue);
	const shuffledQueue = structuredClone(queue.shuffledQueue);

	findAndRemove(shuffledQueue, (val) => { return val.id == musicId; });
	findAndRemove(normalQueue, (val) => { return val.id == musicId; });

	setQueue((prev) => {
		return {
			...prev,
			queue: normalQueue,
			shuffledQueue: shuffledQueue,
		}
	});
}

export const getMusicsFromPlaylist = async function (playlistId: string) {
	const result = await fetchAPI<PlaylistMusicsResponse, { playlistId: string }>('playlists/get_playlist_musics', { playlistId });
	return (result.data ?? []);
}

export const getMusicInfo = async function (musicId: string) {

	const result = await fetchAPI<MusicInfoResponse, { musicId: string }>('queue/get_music_info', { musicId });
	return result.data ?? null;
}

export const getQueueInfo = async function (musicIds: string[]) {
	const result = await fetchAPI<QueueInfoResponse, { musicIds: Array<string> }>('queue/get_queue_info', { musicIds });
	return result.data ?? [];
}

export const onQueueEnd = function (queue: QueueState, setQueue: Dispatch<SetStateAction<QueueState>>,
	player: PlayerState, setPlayer: Dispatch<SetStateAction<PlayerState>>) {

	if (player.loopPlaylist) {
		let newQueue = setState(setQueue, {
			currentMusic: {
				id: null,
				name: '',
				playlist_id: null,
				url: '',
				image_url: '',
				liked_by_me: false,
				artist_id: null,
				artist_name: '',
				album_name: '',
				duration: 0,
			}
		});

		newQueue = setState(setQueue, {
			playHistory: [],
			queue: structuredClone(newQueue.playHistory),
			shuffledQueue: structuredClone(newQueue.playHistory),
		})

		const nextMusic = newQueue.queue[0];
		if (nextMusic) {
			processQueue(newQueue, setQueue, player, setPlayer);
		}
	}
	else {
		setQueue((prev) => {
			return {
				...prev,
				currentMusic: {
					id: null,
					name: '',
					playlist_id: null,
					url: '',
					image_url: '',
					liked_by_me: false,
					artist_id: null,
					artist_name: '',
					album_name: '',
					duration: 0,
				},
				playHistory: [],
				queue: [],
				shuffledQueue: [],
			};
		});
		setPlayer((prev) => {
			return {
				...prev,
				seek: 0,
				duration: 0,
				playing: false,			
			}
		})
	}
}

export const processQueue = async function (queue: QueueState, setQueue: Dispatch<SetStateAction<QueueState>>,
	player: PlayerState, setPlayer: Dispatch<SetStateAction<PlayerState>>) {

	const playHistory = structuredClone(queue.playHistory);

	if (queue.currentMusic.id) {
		playHistory.push({
			id: queue.currentMusic.id,
			playlist_id: queue.currentMusic.playlist_id
		})
	}
	setQueue((prev) => {
		return {
			...prev,
			playHistory
		}
	})

	const nextMusic = player.shuffle ? queue.shuffledQueue[0] : queue.queue[0];
	if (!nextMusic) { return onQueueEnd({ ...queue, playHistory }, setQueue, player, setPlayer); }

	const shuffledQueue = structuredClone(queue.shuffledQueue);
	const normalQueue = structuredClone(queue.queue);

	findAndRemove(shuffledQueue, (val) => { return val.id == nextMusic.id; });
	findAndRemove(normalQueue, (val) => { return val.id == nextMusic.id; });

	const musicInfo = await getMusicInfo(nextMusic.id);
	if (!musicInfo?.id) { return; }

	setQueue((prev) => {
		return {
			...prev,
			shuffledQueue,
			queue: normalQueue,
			currentMusic: {
				id: musicInfo.id,
				name: musicInfo.name,
				playlist_id: nextMusic.playlist_id,
				url: musicInfo.url ?? '',
				image_url: musicInfo.image_url ?? '',
				liked_by_me: musicInfo.liked_by_me,
				artist_id: musicInfo.artist_id,
				artist_name: musicInfo.artist_name,
				album_name: musicInfo.album_name,
				duration: musicInfo.duration,
			} satisfies CurrentMusic
		}
	});
}

export const goToNextMusic = async function (queue: QueueState, setQueue: Dispatch<SetStateAction<QueueState>>,
	player: PlayerState, setPlayer: Dispatch<SetStateAction<PlayerState>>) {

	const nextMusic = player.shuffle ? queue.shuffledQueue[0] : queue.queue[0];
	if (nextMusic) {
		processQueue(queue, setQueue, player, setPlayer);
	}
}

export const goToPreviousMusic = async function (queue: QueueState, setQueue: Dispatch<SetStateAction<QueueState>>,
	player: PlayerState, setPlayer: Dispatch<SetStateAction<PlayerState>>) {

	const previousMusic = queue.playHistory[queue.playHistory.length - 1];
	if (!previousMusic) { return; }

	const playHistory = structuredClone(queue.playHistory);
	const shuffledQueue = structuredClone(queue.shuffledQueue);
	const normalQueue = structuredClone(queue.queue);

	playHistory.splice(playHistory.length - 1, 1);

	if (queue.currentMusic.id) {
		const obj = {
			id: queue.currentMusic.id,
			playlist_id: queue.currentMusic.playlist_id
		};
		normalQueue.splice(0, 0, obj);
		shuffledQueue.splice(0, 0, obj);
	}

	const musicInfo = await getMusicInfo(previousMusic.id);
	if (!musicInfo?.id) { return; }

	setPlayer((prev) => {
		return {
			...prev,
			seek: 0,
			playing: true,
		}
	})

	setQueue((prev) => {
		return {
			...prev,
			playHistory,
			shuffledQueue,
			queue: normalQueue,
			currentMusic: {
				id: musicInfo.id,
				name: musicInfo.name,
				playlist_id: previousMusic.playlist_id,
				url: musicInfo.url ?? '',
				image_url: musicInfo.image_url ?? '',
				liked_by_me: musicInfo.liked_by_me,
				artist_id: musicInfo.artist_id,
				artist_name: musicInfo.artist_name,
				album_name: musicInfo.album_name,
				duration: musicInfo.duration
			} satisfies CurrentMusic
		}
	});

}

export const goToMusicById = async function (id: string, queue: QueueState, setQueue: Dispatch<SetStateAction<QueueState>>,
	player: PlayerState, setPlayer: Dispatch<SetStateAction<PlayerState>>) {

	const queueToUse = player.shuffle ? queue.shuffledQueue : queue.queue;

	const index = queueToUse.findIndex((el) => { return el.id == id });
	if (index == -1) { return; }

	const playHistory = structuredClone(queue.playHistory);

	if (queue.currentMusic.id) {
		playHistory.push({
			id: queue.currentMusic.id,
			playlist_id: queue.currentMusic.playlist_id
		})
	}

	const nextMusic = queueToUse[index];

	const shuffledQueue = structuredClone(queue.shuffledQueue);
	const normalQueue = structuredClone(queue.queue);

	if (player.shuffle) {
		const deleted = shuffledQueue.splice(0, index + 1);
		for (const el of deleted) {
			findAndRemove(normalQueue, (val) => { return val.id == el.id; });
		}
	}
	else {
		const deleted = normalQueue.splice(0, index + 1);
		for (const el of deleted) {
			findAndRemove(shuffledQueue, (val) => { return val.id == el.id; });
		}
	}

	const musicInfo = await getMusicInfo(nextMusic.id);
	if (!musicInfo?.id) { return; }

	setPlayer((prev) => {
		return {
			...prev,
			seek: 0,
			playing: true,
		}
	})

	setQueue((prev) => {
		return {
			...prev,
			playHistory,
			shuffledQueue,
			queue: normalQueue,
			currentMusic: {
				id: musicInfo.id,
				name: musicInfo.name,
				playlist_id: nextMusic.playlist_id,
				url: musicInfo.url ?? '',
				image_url: musicInfo.image_url ?? '',
				liked_by_me: musicInfo.liked_by_me,
				artist_id: musicInfo.artist_id,
				artist_name: musicInfo.artist_name,
				album_name: musicInfo.album_name,
				duration: musicInfo.duration,
			} satisfies CurrentMusic
		}
	});
}