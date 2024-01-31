import { Box, Flex, Text } from "@chakra-ui/react";
import { RiMusic2Line } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import Image from "next/image";
import { MouseEventHandler, ReactNode, useState } from "react";

export default function ImageUploader({ onClick, data, onClear, isRound, icon }: {
	onClick: MouseEventHandler<HTMLDivElement>,
	onClear: MouseEventHandler<HTMLDivElement>,
	isRound?: boolean,
	data: {
		name: string,
		previewUrl: string,
		imageData: '' | File | null,
	},
	icon?: ReactNode
}) {

	const [hover, setHover] = useState(false);

	return (
		<Flex className='mt-4 select-none w-[180px] h-[180px] bg-red items-center justify-center relative' boxShadow={'0 4px 60px rgba(0,0,0,.5)'} rounded={isRound ? 'full' : 'none'}>
			{
				hover ? [] : icon ?? <RiMusic2Line size={'64px'} color='#7f7f7f' />
			}
			{
				data.previewUrl ?
					<Box className="w-full h-full overflow-hidden" position={'relative'} flexShrink={0} boxShadow={'0 4px 24px rgba(0,0,0,.5)'} rounded={isRound ? 'full' : 'none'}>
						<Image fill={true} className="object-cover" alt={'Image'} src={ data.previewUrl} />
					</Box> :
					[]
			}
			<Flex onClick={onClick} className={`select-none absolute z-[1] w-full h-full bg-black ${data.previewUrl ? 'bg-opacity-70' : 'bg-opacity-0'} text-16 text-white items-center justify-center flex-col gap-1 opacity-0 hover:opacity-100`}
				onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }} rounded={isRound ? 'full' : 'none'}>
				<GoPencil size='48px' />
				<Text>Choose photo</Text>
			</Flex>
			<Flex onClick={onClear} className={`absolute z-[2] right-2 top-2 w-8 h-8 rounded-full bg-black bg-opacity-50 text-primary hover:text-white items-center justify-center ${hover ? 'opacity-100' : 'opacity-0'} hover:opacity-100`}><MdClose size={'20px'} /></Flex>
		</Flex>
	)
}