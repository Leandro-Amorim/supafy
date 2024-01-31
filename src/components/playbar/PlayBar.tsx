import { Flex } from "@chakra-ui/react";
import PlayBarMusicInfo from "./PlayBarMusicInfo";
import PlayBarPlayer from "./PlayBarPlayer";
import PlayBarOptions from "./PlayBarOptions";
import { useRecoilState } from "recoil";
import { playerState } from "@/lib/atoms";

export default function PlayBar() {
	const [player, setPlayer] = useRecoilState(playerState);
	return (
		<Flex paddingLeft={'16px'} flexShrink={0} flexBasis={'90px'} w={'100%'} bg={'black'} alignItems={'center'} justify={'space-between'}>
			<PlayBarMusicInfo/>
			<PlayBarPlayer player={player} setPlayer={setPlayer}/>
			<PlayBarOptions player={player} setPlayer={setPlayer}/>
		</Flex>
	)
}