import { Box, Flex, Text } from "@chakra-ui/react";
import { BiShuffle } from "react-icons/bi";
import { BsRepeat, BsRepeat1 } from "react-icons/bs";
import { TbPlayerSkipBackFilled, TbPlayerSkipForwardFilled } from "react-icons/tb";
import CustomSlider from "../shared/CustomSlider";
import PlayBarSecondaryButton from "./PlayBarSecondaryButton";
import PlayBarPlayButton from "./PlayBarPlayButton";
import { formatDuration, shuffleArray } from "@/lib/utils";
import { useRecoilState, useRecoilValue } from "recoil";
import { playerRefState, queueState } from "@/lib/atoms";
import { goToNextMusic, goToPreviousMusic } from "@/lib/playerUtils";
import { PlayerState } from "@/types/UI/PlayerState";
import { Dispatch, SetStateAction } from "react";

export default function PlayBarPlayer({ player, setPlayer }: { player: PlayerState, setPlayer: Dispatch<SetStateAction<PlayerState>> }) {

	const playerRef = useRecoilValue(playerRefState);
	const [queue, setQueue] = useRecoilState(queueState);

	function toggleShuffle() {
		setPlayer((prev) => { return { ...prev, shuffle: !player.shuffle } });
		if (!player.shuffle) {
			const newShuffledQueue = structuredClone(queue.queue);
			shuffleArray(newShuffledQueue);
			setQueue((prev) => {
				return {
					...prev,
					shuffledQueue: newShuffledQueue,
				}
			})
		}
	}

	function togglePlaying() {
		setPlayer((prev) => { return { ...prev, playing: !player.playing } })
	}

	function cycleLoop() {
		if (!player.loopMusic && !player.loopPlaylist) {
			setPlayer((prev) => {
				return { ...prev, loopPlaylist: true, loopMusic: false }
			})
		}
		else if (player.loopPlaylist) {
			setPlayer((prev) => {
				return { ...prev, loopPlaylist: false, loopMusic: true }
			})
		}
		else {
			setPlayer((prev) => {
				return { ...prev, loopPlaylist: false, loopMusic: false }
			})
		}
	}

	function setSeek(val: number) {
		setPlayer((prev) => {
			return { ...prev, seek: val }
		})
		playerRef?.current?.seekTo(val, 'seconds');
	}

	function nextMusic() {
		goToNextMusic(queue, setQueue, player, setPlayer);
	}

	function previousMusic() {
		if (player.seek > 1) {
			setSeek(0);
		}
		else {
			goToPreviousMusic(queue, setQueue, player, setPlayer);
		}
	}

	return (
		<Flex userSelect={'none'} maxW={'722px'} w={'40%'} direction={'column'} h={'100%'} paddingTop={'16px'}>

			<Flex w={'100%'} gap={'16px'} h={'32px'} marginBottom={'7px'}>
				<Flex grow={1} gap={'8px'} justify={'flex-end'}>
					<PlayBarSecondaryButton size={'32px'} onClick={toggleShuffle} active={player.shuffle}><BiShuffle size={'21px'} /></PlayBarSecondaryButton>
					<PlayBarSecondaryButton size={'32px'} onClick={previousMusic}><TbPlayerSkipBackFilled size={'21px'} /></PlayBarSecondaryButton>
				</Flex>
				<PlayBarPlayButton playing={player.playing} togglePlaying={togglePlaying} />
				<Flex grow={1} gap={'8px'}>
					<PlayBarSecondaryButton size={'32px'} onClick={nextMusic}><TbPlayerSkipForwardFilled size={'21px'} /></PlayBarSecondaryButton>
					<PlayBarSecondaryButton size={'32px'} active={player.loopMusic || player.loopPlaylist} onClick={cycleLoop}>
						{
							player.loopMusic ? <BsRepeat1 size={'21px'} /> : <BsRepeat size={'21px'} />
						}
					</PlayBarSecondaryButton>
				</Flex>
			</Flex>

			<Flex gap={'8px'}>
				<Box minW={'40px'} textAlign={'right'} fontSize={'12px'} color={'#a7a7a7'}>
					<Text>{formatDuration(player.seek)}</Text>
				</Box>

				<Box w={'100%'} position={'relative'} top={'-2px'}>
					<CustomSlider value={player.seek} setValue={setSeek} step={1} min={0} max={player.duration} />
				</Box>

				<Box minW={'40px'} fontSize={'12px'} color={'#a7a7a7'}>
					<Text>{formatDuration(player.duration)}</Text>
				</Box>
			</Flex>
		</Flex>
	)
}