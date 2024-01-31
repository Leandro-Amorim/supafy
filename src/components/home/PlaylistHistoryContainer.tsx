import { Box, Text } from "@chakra-ui/react";
import PlaylistHistoryCard from "./PlaylistHistoryCard";
import { Dispatch, SetStateAction, useMemo } from "react";
import { BasicPlaylist } from "@/types/database/BasicPlaylist";

export default function PlaylistHistoryContainer({ history, setColor }: { history: BasicPlaylist[], setColor: Dispatch<SetStateAction<string | null>> }) {

	const greeting = useMemo(() => {
		const hour = (new Date()).getHours();
		if (hour >= 6 && hour <= 12) {
			return 'Good morning';
		}
		if (hour > 12 && hour < 18) {
			return 'Good afternoon';
		}
		return 'Good evening';
	}, []);

	return (
		<Box className="flex flex-col">
			<Text className="text-white text-[32px] font-bold mb-2">{greeting}</Text>
			<Box className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 @6xl:gap-3 gap-2">
				{
					history.map((el) => {
						return <PlaylistHistoryCard key={el.id} playlist={el} setColor={setColor} />
					})
				}
			</Box>
		</Box>
	)
}