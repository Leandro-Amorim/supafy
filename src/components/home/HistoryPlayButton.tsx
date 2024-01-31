import { Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { ImPlay3 } from "react-icons/im";
import { IoIosPause } from "react-icons/io";

export default function HistoryPlayButton({ hover, onClick, playing }: { hover: boolean, onClick: MouseEventHandler<HTMLDivElement>, playing: boolean }) {
	return (
		<Flex ml={'8px'} role='button' color={'black'} borderRadius={'full'} alignItems={'center'} justify={'center'} zIndex={1}
			transition={'opacity .3s ease, transform .3s ease'} bottom={'8px'} right={'8px'} boxShadow={'0 8px 8px rgba(0,0,0,.3)'} paddingLeft={playing ? 0 : '4px'}
			className={'@6xl:size-12 size-8 bg-[#1ed760] scale-100 hover:scale-105 hover:bg-[#1fdf64] active:bg-[#169c46] active:scale-100 ' + (hover ? 'opacity-100' : 'opacity-0')} onClick={onClick}>
			{
				playing ? <IoIosPause className="@6xl:size-7 size-5"/> : <ImPlay3 className="@6xl:size-7 size-5" />
			}
		</Flex>
	)
}