import { Flex, useOutsideClick } from "@chakra-ui/react";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverArrow,
	PopoverCloseButton,
	PopoverAnchor,
} from '@chakra-ui/react'
import { useRecoilState } from "recoil";
import { authErrorState } from "@/lib/atoms";
import { MouseEventHandler, useRef } from "react";
export default function LoginButton({ onClick }: { onClick: MouseEventHandler<HTMLDivElement> }) {

	const ref = useRef(null);
	const [login, setAuthError] = useRecoilState(authErrorState);

	function closePopover() {
		setAuthError((prev) => { return { ...prev, showingError: false } });
	}
	useOutsideClick({
		ref: ref,
		handler: closePopover
	})
	return (

		<Popover isOpen={login.showingError} placement="bottom-end">
			<PopoverAnchor>
				<Flex className="select-none items-center justify-center rounded-full shrink-0 px-2 h-8 scale-100 text-black text-14 font-bold bg-white hover:scale-105 hover:bg-[#f6f6f6] active:bg-[#b7b7b7] active:scale-100" onClick={onClick} role='button'>
					Log in
				</Flex>
			</PopoverAnchor>
			{/*@ts-ignore*/}
			<PopoverContent ref={ref} bg={'#0d72ea'} borderRadius={'8px'} maxW={'336px'} transition={'all .3s'} boxShadow={'0 4px 40px rgba(0,0,0,.3)'}
				fontSize={'14px'} lineHeight={1.4} outline={0} border={0} padding={'16px'}>
				<PopoverArrow bg={'#0d72ea'} border={0} boxShadow={'none'} />

				<PopoverHeader fontSize={'18px'} fontWeight={700} color={'white'} padding={0} border={0} mb={'8px'} display={'flex'} justifyContent={'space-between'}>
					{'You\'re not logged in'}
					<PopoverCloseButton position={'static'} bg={'transparent'} boxSize={'24px'} onClick={closePopover} />
				</PopoverHeader>
				<PopoverBody padding={0} fontSize={'14px'} color={'white'}>
					{
						login.errorMessage
					}
				</PopoverBody>
			</PopoverContent>
		</Popover>
	)
}