import { Flex } from "@chakra-ui/react";
import { ImPlay3 } from "react-icons/im";
import { IoIosPause } from "react-icons/io";

export default function PlayBarPlayButton({ playing, togglePlaying }: { playing: boolean, togglePlaying: () => void }) {
	return (
		<Flex onClick={togglePlaying} className={`shrink-0 ${playing ? 'pl-0' : 'pl-[3px]'} scale-100 rounded-full basis-8 bg-white items-center justify-center text-black hover:scale-[1.07] active:scale-100`}>
			{
				playing ? <IoIosPause size={'20px'} /> : <ImPlay3 size={'20px'} />
			}
		</Flex>
	)
}