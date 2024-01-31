import { BiSearch } from "react-icons/bi";
import SideBarSecondaryButton from "./buttons/SideBarSecondaryButton";
import { Box, Input, InputGroup, InputLeftElement, InputRightElement, useOutsideClick } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { libraryState } from "@/lib/atoms";
import { IoMdClose } from "react-icons/io";

export default function LibrarySearchBar() {

	const ref = useRef(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [open, setOpen] = useState(false);
	const [library, setLibrary] = useRecoilState(libraryState);

	function setSearch(val: string) {
		setLibrary((prev) => {
			return {
				...prev,
				search: val,
			}
		})
	}

	function outsideClick() {
		if (library.search == '') {
			setOpen(false);
		}
	}

	useOutsideClick({
		ref: ref,
		handler: outsideClick
	})

	return (
		<Box flexShrink={0} flexBasis={open ? '180px' : '32px'} className="relative" transitionTimingFunction={'cubic-bezier(.3,0,.4,1)'} transitionProperty={'flex-basis'} transitionDuration={'.3s'}>
			<InputGroup ref={ref} className="h-8 bg-container-hover rounded-[4px] w-full" transitionTimingFunction={'cubic-bezier(.3,0,.4,1)'} transitionProperty={'opacity'} transitionDuration={'.3s'}
				opacity={open ? 1 : 0}>

				<InputLeftElement pointerEvents='none' className="text-primary !w-8 !h-full ">
					<BiSearch size={'20px'} />
				</InputLeftElement>
				<Input ref={inputRef} value={library.search} onChange={(e) => { setSearch(e.target.value) }} variant={'unstyled'} className={`${library.search !== '' ? '!pr-8' : '!pr-2'} !pl-8 !text-primary font-medium !text-[12px] placeholder:text-primary placeholder:font-medium`} placeholder='Search in Your Library' />
				{
					library.search !== '' &&
					<InputRightElement onClick={() => { setSearch('') }} className="text-primary !w-8 !h-full">
						<IoMdClose className="!cursor-default" size={'22px'} />
					</InputRightElement>
				}

			</InputGroup>
			{
				!open &&
				<Box className="absolute top-0 left-0 z-10">
					<SideBarSecondaryButton searchVariation={true} onClick={() => { setOpen(true); inputRef.current?.focus() }} icon={<BiSearch size={'20px'} />} />
				</Box>
			}
		</Box>
	)
}