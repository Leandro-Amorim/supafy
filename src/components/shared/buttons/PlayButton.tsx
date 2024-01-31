import { Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { ImPlay3 } from "react-icons/im";
import { IoIosPause } from "react-icons/io";

export default function PlayButton({ size, playIconSize, pauseIconSize, onClick, playing }: { size: string, playIconSize: string, pauseIconSize: string, onClick: MouseEventHandler<HTMLDivElement>, playing: boolean }) {
	return (
		<Flex onClick={onClick} paddingLeft={playing ? 0 : '4px'} className="items-center justify-center shrink-0 text-black scale-100 rounded-full bg-green hover:bg-light-green hover:scale-105 active:bg-dark-green active:scale-100" role='button' boxSize={size}>
			{
				playing ? <IoIosPause size={pauseIconSize} /> : <ImPlay3 size={playIconSize} />
			}
		</Flex>
	)
}