import { MusicInfo } from "@/types/database/MusicInfo";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

export const formatDuration = function (sec: number) {
	const hrs = ~~(sec / 3600);
	const mins = ~~((sec % 3600) / 60);
	const secs = ~~sec % 60;

	let ret = "";

	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;

	return ret;
}

export const refreshData = (router: NextRouter) => {
	router.replace(router.asPath);
}

export const getPlaylistDurationString = function (musics: MusicInfo[]) {
	let durationString = '';
	let hours = 0;
	let minutes = Math.round(musics?.reduce((accumulator, el) => { return accumulator + el.duration }, 0) / 60) || 0;
	if (minutes > 60) {
		const times = Math.floor(minutes / 60);
		hours = times;
		minutes -= times * 60;
		durationString = ` about ${hours}h ${minutes}min`
	}
	else {
		durationString = ` about ${minutes}min`
	}
	return durationString;
}

export const formatPlural = function (number: number, term: string) {
	number = number ?? 0;
	return `${number} ${term}${number == 1 ? '' : 's'}`;
}

export const shuffleArray = function <T>(array: Array<T>) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export const findAndRemove = function <T>(arr: Array<T>, predicate: (val: T) => boolean) {
	const index = arr.findIndex(predicate);
	if (index > -1) {
		arr.splice(index, 1);
	}
};

export const setState = function <T>(setter: Dispatch<SetStateAction<T>>, payload: Partial<T>) {

	let a: T | null = null;
	setter((prev) => {
		a = {
			...prev,
			...payload
		}
		return a;
	});
	return a as T;
}

export const nullUUID = '00000000-0000-0000-0000-000000000000';