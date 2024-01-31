import { libraryState, authErrorState, playlistContextState, playlistDeleteModalState, playlistModalState, queueState, playerState } from '@/lib/atoms';
import { openDeletePlaylistModal } from '@/lib/modals/openDeletePlaylistModal';
import { openEditPlaylistModal } from '@/lib/modals/openEditPlaylistModal';
import { addPlaylistToQueue } from '@/lib/playerUtils';
import { savePlaylist } from '@/lib/playlists/savePlaylist';
import { ContextMenuParams } from '@/types/UI/ContextMenuParams';
import { useToast } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Menu, Item, Separator } from 'react-contexify';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export default function PlaylistContextMenu() {

	const router = useRouter();
	const user = useUser();
	const setAuthError = useSetRecoilState(authErrorState);
	const setLibrary = useSetRecoilState(libraryState);
	const toast = useToast();
	const playlistContext = useRecoilValue(playlistContextState);

	const setPlaylistModal = useSetRecoilState(playlistModalState);
	const setPlaylistDeleteModal = useSetRecoilState(playlistDeleteModalState);

	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);

	const handleItemClick = ({ id }: ContextMenuParams) => {
		switch (id) {
			case "edit":
				openEditPlaylistModal(user, playlistContext.playlistId, playlistContext.name, playlistContext.imageUrl, setPlaylistModal);
				break;
			case "delete":
				openDeletePlaylistModal(user, playlistContext.playlistId, playlistContext.name, setPlaylistDeleteModal);
				break;
			case "save":
				savePlaylist(user, playlistContext.playlistId, playlistContext.saved, playlistContext.setSaved, setAuthError, setLibrary, toast);
				break;
			case "link":
				const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
				navigator.clipboard.writeText(origin + '/playlist/' + playlistContext.playlistId).then(() => {
					toast({
						status: 'info',
						description: <span>Link copied to <b>Clipboard</b></span>
					});
				})
				break;
			case "queue":
				addPlaylistToQueue(playlistContext.playlistId, null, false, queue, setQueue, player, setPlayer, setLibrary);
				break;
		}
	}

	return (
		<Menu id={'playlist'}>
			<Item className='text-sm' id="queue" onClick={handleItemClick}>Add to queue</Item>
			{
				playlistContext.playlistId !== 'liked' && playlistContext.isOwner ? <Item className='text-sm' id="edit" onClick={handleItemClick}>Edit details</Item> : []
			}
			{
				playlistContext.playlistId !== 'liked' && playlistContext.isOwner ? <Item className='text-sm' id="delete" onClick={handleItemClick}>Delete</Item> : []
			}
			{
				playlistContext.playlistId !== 'liked' && !playlistContext.isOwner ? <Item className='text-sm' id="save" onClick={handleItemClick}>{!playlistContext.saved ? 'Add to ' : 'Remove from '}Your library</Item> : []
			}
			<Separator />
			{
				playlistContext.playlistId !== 'liked' && <Item className='text-sm' id="link" onClick={handleItemClick}>Copy link to playlist</Item>
			}

		</Menu>
	)
}
