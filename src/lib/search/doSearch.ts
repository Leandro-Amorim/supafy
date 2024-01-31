import { SearchState } from "@/types/UI/SearchState";
import { Dispatch, SetStateAction } from "react";
import fetchAPI from "../fetchAPI";
import { APIResponse } from "@/pages/api/get_search";
import { calculateResultsRelevancy } from "./calculateResultsRelevancy";
import { setState } from "../utils";

export const doSearch = async function (setSearch: Dispatch<SetStateAction<SearchState>>) {

	const search = setState(setSearch, { state: 1 });
	const result = await fetchAPI<APIResponse, { search_term: string }>('get_search', { search_term: search.input ?? '' });

	const data = result.data ??
	{
		artists: [],
		musics: [],
		playlists: []
	}

	setSearch((prev) => {
		return {
			...prev,
			state: 2,
			...calculateResultsRelevancy(search?.input ?? '', data),
		}
	})
}