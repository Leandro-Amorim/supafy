import MusicContextMenu from "./MusicContextMenu";
import PlaylistContextMenu from "./PlaylistContextMenu";

export default function ContextProvider() {
	return (
		<>
			<MusicContextMenu />
			<PlaylistContextMenu />
		</>
	)
}