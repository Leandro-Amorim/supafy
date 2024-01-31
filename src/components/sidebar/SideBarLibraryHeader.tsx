import { Box, Flex } from "@chakra-ui/react";
import { VscLibrary } from "react-icons/vsc";
import { AddIcon } from "@chakra-ui/icons";
import CustomSelect from "../shared/CustomSelect";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { LuList } from "react-icons/lu";
import { useRecoilState } from "recoil";
import { libraryState, authErrorState, playlistModalState } from "@/lib/atoms";
import LibraryButton from "./buttons/LibraryButton";
import SideBarSecondaryButton from "./buttons/SideBarSecondaryButton";
import { useUser } from "@supabase/auth-helpers-react";
import LibrarySearchBar from "./LibrarySearchBar";
import { Dispatch, SetStateAction } from "react";
import { openCreatePlaylistModal } from "@/lib/modals/openCreatePlaylistModal";

export default function SideBarLibraryHeader({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {

	const [library, setLibrary] = useRecoilState(libraryState);
	const [playlistModal, setPlaylistModal] = useRecoilState(playlistModalState);

	function toggleSidebar() {
		setOpen((prev) => {
			return !prev;
		});
		setLibrary((prev) => {
			return {
				...prev,
				search: '',
			}
		})
	}

	function toggleMode() {
		setLibrary((prev) => {
			return { ...prev, viewMode: prev.viewMode == 'list' ? 'grid' : 'list' }
		})
	}

	function setSortMode(mode: string) {
		setLibrary((prev) => { return { ...prev, sortMode: mode } });
	}

	const user = useUser();
	const [login, setAuthError] = useRecoilState(authErrorState);

	function addPlaylist() {
		openCreatePlaylistModal(user, setAuthError, setPlaylistModal);
	}
	return (
		<Box className={`${open ? 'mb-0' : 'mb-2'}`}>

			<Flex className={`items-center h-10 ${open ? 'px-0' : 'px-[6px]'}`}>
				<LibraryButton onClick={toggleSidebar} icon={<VscLibrary className='shrink-0 w-7 h-7' />}>{open ? 'Your Library' : ''}</LibraryButton>
				{open ? <SideBarSecondaryButton onClick={addPlaylist} icon={<AddIcon boxSize={'14px'} />} /> : []}
				{open ? <SideBarSecondaryButton hasBg={false} onClick={toggleMode} icon={library.viewMode == 'grid' ? <LuList size={'18px'} /> : <TfiLayoutGrid2 size={'16px'} />} /> : []}
			</Flex>

			{
				open && user ?
					<Flex className="p-2 relative z-[100] gap-2 justify-between">
						<LibrarySearchBar />
						<CustomSelect options={['Recents', 'Recently Added', 'Alphabetical']} selected={library.sortMode} setSelected={setSortMode} />
					</Flex> : []
			}
		</Box>
	)
}