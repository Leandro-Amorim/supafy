import { Box, Flex } from "@chakra-ui/react";
import SideBarPlaylistList from "./SideBarPlaylistList";
import SideBarLibraryHeader from "./SideBarLibraryHeader";
import CustomScrollbar from "../shared/CustomScrollbar";
import SideBarPlaylistGrid from "./SideBarPlaylistGrid";
import { Dispatch, SetStateAction } from "react";
import { LibraryState } from "@/types/UI/LibraryState";


export default function SideBarLibrary({ open, setOpen, library }: {open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, library: LibraryState}) {

	return (
		<Flex className={`mt-2 rounded-lg bg-container flex-col grow py-2 select-none ${open ? 'px-2' : 'px-[2px]'}`}>

			<SideBarLibraryHeader open={open} setOpen={setOpen} />

			<CustomScrollbar>
				<Box display={'grid'} className={library.viewMode == 'list' || !open ? "grid-cols-1" : `grid-cols-2 @md:grid-cols-3  @xl:grid-cols-4 @3xl:grid-cols-5 @4xl:grid-cols-6
				@5xl:grid-cols-7 @6xl:grid-cols-8 @7xl:grid-cols-9 @8xl:grid-cols-10`}>
					{
						library.playlists?.map((el) => {
							if (library.viewMode == 'list' || !open) {
								return (<SideBarPlaylistList open={open} playlist={el} key={el.id} />)
							}
							else {
								return (<SideBarPlaylistGrid playlist={el} key={el.id} />)
							}
						})
					}
				</Box>
			</CustomScrollbar>
		</Flex>
	)
}