import { useRecoilState } from "recoil";
import SideBarButtons from "./SideBarButtons";
import SideBarLibrary from "./SideBarLibrary";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";
import { libraryState, sidebarOpenState, sidebarSizeState } from "@/lib/atoms";
import { useUser } from "@supabase/auth-helpers-react";
import { updateLibrary } from "@/lib/library/updateLibrary";
import { LibraryPlaylist } from "@/types/database/LibraryPlaylist";

export default function SideBar() {

	const user = useUser();
	const [library, setLibrary] = useRecoilState(libraryState);
	const [data, setData] = useState<LibraryPlaylist[]>([]);

	const [open, setOpen] = useRecoilState(sidebarOpenState);
	const [size, setSize] = useRecoilState(sidebarSizeState);

	useEffect(() => {
		updateLibrary(setLibrary);
	}, [user]);

	useEffect(() => {
		let arr = structuredClone(library.playlists);
		switch (library.sortMode) {
			case 'Recents':
				arr.sort((a, b) => new Date(b?.last_played_at).getTime() - new Date(a?.last_played_at).getTime());
				break;
			case 'Recently Added':
				arr.sort((a, b) => new Date(b?.added_at).getTime() - new Date(a?.added_at).getTime());
				break;
			case 'Alphabetical':
				arr.sort((a, b) => a.name?.localeCompare(b?.name));
				break;
		}
		if (library.search) {
			arr = arr.filter((val) => { return val?.name?.toLowerCase()?.includes(library.search.toLowerCase()) })
		}

		setData(arr);
	}, [library.playlists, library.sortMode, library.search]);

	return (
		<Resizable className="flex shrink-0 bg-black pt-2.5 px-2.5 flex-col @container z-10"
			size={{ width: size, height: '100%' }}
			onResizeStop={(e, direction, ref, d) => { setSize((prev: number) => { return prev + d.width }); }}
			minWidth={open ? 320 : 88} maxWidth={open ? '75vw' : 88}
			enable={{ top: false, right: open, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
		>
			<SideBarButtons open={open} />
			<SideBarLibrary open={open} library={{ ...library, playlists: data }} setOpen={setOpen} />
		</Resizable>

	)
}