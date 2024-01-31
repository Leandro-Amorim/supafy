import { User } from "@supabase/auth-helpers-nextjs";
import { NextRouter } from "next/router";
import { refreshData } from "../utils";
import fetchAPI from "../fetchAPI";
import { GenericAPIResponse } from "@/types/GenericAPIResponse";

export const removeMusicFromPlaylist = async function (user: User | null, playlistId: string, musicId: string, router: NextRouter) {
	if (!user) { return; }

	await fetchAPI<GenericAPIResponse, { playlistId: string, musicId: string, add: boolean }>('musics/add_music', { playlistId, musicId, add: false });
	refreshData(router);
}