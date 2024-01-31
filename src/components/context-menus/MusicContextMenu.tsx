import { libraryState, authErrorState, musicContextState, playlistModalState, queueState, playerState } from '@/lib/atoms';
import { openCreatePlaylistModal } from '@/lib/modals/openCreatePlaylistModal';
import { addMusicToPlaylist } from '@/lib/musics/addMusicToPlaylist';
import { likeMusic } from '@/lib/musics/likeMusic';
import { removeMusicFromPlaylist } from '@/lib/musics/removeMusicFromPlaylist';
import { addMusicToQueue, removeMusicFromQueue } from '@/lib/playerUtils';
import { updatePlaylistEntries } from '@/lib/playlists/updatePlaylistEntries';
import { useToast } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Menu, Item, Separator, Submenu, ItemParams } from 'react-contexify';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export default function MusicContextMenu() {

	const router = useRouter();
	const user = useUser();
	const setAuthError = useSetRecoilState(authErrorState);
	const setLibrary = useSetRecoilState(libraryState);
	const toast = useToast();
	const musicContext = useRecoilValue(musicContextState);

	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);

	const [playlists, setPlaylists] = useState<Array<{ id: string, name: string }>>([]);
	const setPlaylistModal = useSetRecoilState(playlistModalState);

	useEffect(() => {
		updatePlaylistEntries(setPlaylists);
	}, [musicContext.playlistId, musicContext.musicId]);

	const handleItemClick = ({ id }: ItemParams) => {
		switch (id) {
			case "remove":
				removeMusicFromPlaylist(user, musicContext.playlistId ?? '', musicContext.musicId, router);
				break;
			case "like":
				likeMusic(user, musicContext.musicId, musicContext.liked, musicContext.setLiked, setAuthError, setLibrary, toast, router);
				break;
			case "create-playlist":
				openCreatePlaylistModal(user, setAuthError, setPlaylistModal);
				break;
			case "artist":
				router.push(`/artist/${musicContext.artistId}`);
				break;
			case "queue":
				if (!musicContext.isQueue) {
					addMusicToQueue(musicContext.musicId, musicContext.playlistId, false, queue, setQueue, player, setPlayer);
					toast({
						status: 'info',
						description: <span>{'On queue'}</span>
					});
				}
				else {
					removeMusicFromQueue(musicContext.musicId, queue, setQueue);
					toast({
						status: 'info',
						description: <span>{'Removed from queue'}</span>
					});
				}
				break;
			default:
				addMusicToPlaylist(user, id ?? '', musicContext.musicId, playlists?.find((el) => { return el.id == id })?.name ?? '', setAuthError, toast);
				break;
		}
	}

	return (
		<Menu id={'music'}>
			<Submenu className='text-sm' label="Add to playlist">
				<Item className='text-sm' id="create-playlist" onClick={handleItemClick}>Create playlist</Item>
				{
					playlists.map((el) => {
						if (el.id == musicContext.playlistId) { return []; }
						return (<Item className='text-sm' id={el.id} key={el.id} onClick={handleItemClick}>{el.name}</Item>)
					})
				}

			</Submenu>
			{
				musicContext.isOwner ? <Item className='text-sm' id="remove" onClick={handleItemClick}>Remove from this playlist</Item> : []
			}
			<Item className='text-sm' id="like" onClick={handleItemClick}>{!musicContext.liked ? 'Save to your ' : 'Remove from your '}Liked Songs</Item>
			<Separator />
			<Item className='text-sm' id="artist" onClick={handleItemClick}>Go to artist</Item>
			<Separator />
			<Item className='text-sm' id="queue" onClick={handleItemClick}>{musicContext.isQueue ? 'Remove from queue' : 'Add to queue'}</Item>
		</Menu>
	)
}
