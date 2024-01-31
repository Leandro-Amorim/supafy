import fetchAPI from "../fetchAPI";
import { GenericAPIResponse } from "@/types/GenericAPIResponse";

export const updateHomeHistory = async function (playlistId: string) {
	const resp = await fetchAPI<GenericAPIResponse, { playlistId: string }>('library/update_home_history', { playlistId });
	return resp.status;
}