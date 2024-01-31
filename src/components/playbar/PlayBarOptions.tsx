import { Flex } from "@chakra-ui/react";
import { SlVolume1, SlVolume2, SlVolumeOff } from "react-icons/sl";
import { MdQueueMusic } from "react-icons/md";
import CustomSlider from "../shared/CustomSlider";
import PlayBarSecondaryButton from "./PlayBarSecondaryButton";
import { useRouter } from "next/router";
import { Link } from "@chakra-ui/next-js";
import { Dispatch, SetStateAction } from "react";
import { PlayerState } from "@/types/UI/PlayerState";

export default function PlayBarOptions({ player, setPlayer }: { player: PlayerState, setPlayer: Dispatch<SetStateAction<PlayerState>> }) {

	const router = useRouter();

	function toggleMute() {
		setPlayer((prev) => { return { ...prev, muted: !player.muted, volume: (player.volume == 0 ? 1 : player.volume) } })
	}

	function setVolume(val: number) {
		setPlayer((prev) => { return { ...prev, volume: val, muted: (val == 0) } })
	}

	return (
		<Flex minWidth={'180px'} width={'30%'} alignItems={'center'} h={'100%'} justify={'flex-end'}>

			<Link href={router?.asPath?.includes('/queue') ? '/' : '/queue'} cursor={'default'}><PlayBarSecondaryButton size={'32px'} active={router?.asPath?.includes('/queue')}><MdQueueMusic size={'21px'} /></PlayBarSecondaryButton></Link>
			<Flex basis={'125px'} marginRight={'16px'}>

				<PlayBarSecondaryButton pr={player.volume == 0 || player.muted ? '2px' : player.volume <= 0.5 ? '4px' : '2px'} size={'32px'} onClick={toggleMute}>
					{
						player.volume == 0 || player.muted ? <SlVolumeOff size={'16px'} /> :
							player.volume <= 0.5 ? <SlVolume1 size={'16px'} /> : <SlVolume2 size={'16px'} />
					}
				</PlayBarSecondaryButton>
				<Flex grow={1} paddingTop={'2px'}>
					<CustomSlider value={player.muted ? 0 : player.volume} setValue={setVolume} min={0} max={1} step={0.01} />
				</Flex>

			</Flex>
		</Flex>
	)
}


