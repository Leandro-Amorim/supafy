import { searchState } from "@/lib/atoms";
import { doSearch as doSearchOriginal } from "@/lib/search/doSearch";
import { Box, Input, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { useRecoilState } from "recoil";
import { useDebouncedCallback } from "use-debounce";

export default function SearchHeaderContent() {

	const [search, setSearch] = useRecoilState(searchState);
	const [focus, setFocus] = useState(false);
	const [hover, setHover] = useState(false);

	const doSearch = useDebouncedCallback(doSearchOriginal, 500);

	function setInput(val: string) {
		setSearch((prev) => {
			return {
				...prev,
				input: val,
				state: val == '' ? 0 : prev.state,
			}
		});
		if (val) {
			doSearch(setSearch);
		}
	}

	return (
		<Box className="w-full h-16 pr-4bg-red-500 relative flex items-center">
			<InputGroup className={`!w-full !max-w-[364px] !h-12 !rounded-full !bg-searchbox hover:!bg-container-hover !px-9 !py-[6px] `}
				boxShadow={focus ? '0 0 0 2px white' : (hover ? '0 0 0 1px hsla(0,0%,100%,.2)' : 'none')}
				onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }}>

				<InputLeftElement pointerEvents='none' className={`${focus || hover ? 'text-white' : 'text-primary'} !w-9 !h-full pl-2 pt-[2px]`}>
					<BiSearch size={'20px'} />
				</InputLeftElement>

				<Input placeholder="What do you want to listen to?" value={search.input} onChange={(evt) => { setInput(evt.target.value) }} transition={'none'} variant={'unstyled'} className="!w-full !p-0 !outline-none !text-ellipsis !text-white !text-14 placeholder:text-ellipsis placeholder:!text-14 placeholder:!text-dark-active" onFocus={() => { setFocus(true) }} onBlur={() => { setFocus(false) }} />

				{
					search.input &&
					<InputRightElement onClick={() => { setInput('') }} className="text-white !w-9 !h-full pr-2 pt-[2px]">
						<IoMdClose className="!cursor-default" size={'22px'} />
					</InputRightElement>
				}

			</InputGroup>
		</Box>
	)
}