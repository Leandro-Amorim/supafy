import { searchState } from "@/lib/atoms";
import { Box, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import GenreCard from "./GenreCard";
import TopResult from "./TopResult";
import PlaylistCardContainer from "../shared/PlaylistCardContainer";
import PlaylistCard from "../shared/PlaylistCard";
import SongResult from "./SongResult";
import ArtistCard from "../shared/ArtistCard";
import { BasicGenre } from "@/types/database/BasicGenre";

export default function SearchResults({ genres }: { genres: BasicGenre[] | null }) {

	const search = useRecoilValue(searchState);

	if (search.state == 1) {
		return [];
	}

	if (search.state == 0) {
		return (
			<Box className="w-full mt-6">
				<Text className="mb-4 text-white text-[24px] font-bold">Browse all</Text>
				<Box className={`w-full grid grid-cols-2 @lg:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-6
				@8xl:grid-cols-7 @9xl:grid-cols-8 @10xl:grid-cols-9 gap-3`}>
					{
						genres?.map((genre) => {
							return <GenreCard genre={genre} key={genre.id} />
						})
					}
				</Box>
			</Box>
		)
	}

	const noResults = search.results.artists.length == 0 && search.results.musics.length == 0 && search.results.playlists.length == 0;

	if (noResults) {
		return (
			<Box className="w-full pt-[20%] text-center text-white">
				<Text className="text-2xl font-bold">
					{`No results found for "${search.input}"`}
				</Text>
				<Text className="text-16 pt-[10px]">
					Please make sure your words are spelled correctly, or use fewer or different keywords.
				</Text>
			</Box>
		)
	}

	return (
		<Box className="w-full mt-6 flex flex-col gap-6 mb-4">
			<Box className={`w-full grid grid-cols-1 @lg:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-6
		@8xl:grid-cols-7 @9xl:grid-cols-8 @10xl:grid-cols-9 gap-y-6 @3xl:gap-x-6`}>

				<Box className="flex flex-col col-start-1 col-end-3 mb-4">
					<Text className="font-bold text-white mb-4 text-[24px]">Top result</Text>
					<TopResult data={search.topResult} />
				</Box>
				{
					search.results.musics.length > 0 &&
					<Box className="flex flex-col col-start-1 col-end-4 @3xl:col-start-3 @3xl:col-end-[-1] mb-4">
						<Text className="font-bold text-white mb-4 text-[24px]">Songs</Text>
						<Box className="w-full select-none">
							{
								search.results.musics.map((music, index) => {
									if (index > 3) { return [] }
									return <SongResult music={music} key={music.id} />
								})
							}
						</Box>
					</Box>
				}
			</Box>
			{
				search.results.artists.length > 0 &&
				<PlaylistCardContainer title={'Artists'}>
					{
						search.results.artists.map((artist) => {
							return <ArtistCard artist={artist} key={artist.id} />
						})
					}
				</PlaylistCardContainer>
			}
			{
				search.results.playlists.length > 0 &&
				<PlaylistCardContainer title={'Playlists'}>
					{
						search.results.playlists.map((playlist) => {
							return <PlaylistCard playlist={playlist} key={playlist.id} />
						})
					}
				</PlaylistCardContainer>
			}
		</Box>
	)
}