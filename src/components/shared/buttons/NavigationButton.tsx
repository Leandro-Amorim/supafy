import { Flex } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

export default function Navigationbutton({ forward = false }: { forward?: boolean }) {
	const router = useRouter();
	return (
		<Flex className={`shrink-0 w-8 h-8 bg-opacity-70 cursor-pointer text-white items-center justify-center rounded-full bg-black ${forward ? 'pl-[2px]' : 'pr-[3px]'}`} role='button' onClick={() => { forward ? router.forward() : router.back() }}>
			{forward ? <IoIosArrowForward size={'20px'} /> : <IoIosArrowBack size={'20px'} />}
		</Flex>
	)
}