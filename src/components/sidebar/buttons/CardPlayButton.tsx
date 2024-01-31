import { Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { ImPlay3 } from "react-icons/im";
import { IoIosPause } from "react-icons/io";

export default function CardPlayButton({ hover, onClick, playing, bottom, right }: { hover?: boolean, onClick: MouseEventHandler<HTMLDivElement>, playing: boolean, bottom?: string, right?: string }) {
	return (
		<Flex role='button' color={'black'} boxSize={'48px'} borderRadius={'full'} alignItems={'center'} justify={'center'} onClick={onClick}
			transition={'opacity .3s ease, transform .3s ease'} position={'absolute'} bottom={bottom ?? '8px'} right={right ?? '8px'} boxShadow={'0 8px 8px rgba(0,0,0,.3)'} paddingLeft={playing ? 0 : '4px'}
			className={'bg-[#1ed760] scale-100 hover:scale-105 hover:bg-[#1fdf64] active:bg-[#169c46] active:scale-100 ' + (hover ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')} >
			{
				playing ? <IoIosPause size={'28px'} /> : <ImPlay3 size={'24px'} />
			}

		</Flex>
	)
}