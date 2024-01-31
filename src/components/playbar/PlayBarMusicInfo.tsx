import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import LikeButton from "../shared/buttons/LikeButton";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authErrorState, libraryState, queueState } from "@/lib/atoms";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { likeMusic } from "@/lib/musics/likeMusic";

export default function PlayBarMusicInfo() {

	const user = useUser();
	const setLibrary = useSetRecoilState(libraryState);
	const setAuthError = useSetRecoilState(authErrorState);
	const queue = useRecoilValue(queueState);
	const [liked, setLiked] = useState(false);
	const toast = useToast();
	const router = useRouter();

	function onLike() {
		if (!queue.currentMusic.id) { return; }
		likeMusic(user, queue.currentMusic.id, liked, setLiked, setAuthError, setLibrary, toast, router);
	}

	useEffect(() => {
		setLiked(queue.currentMusic.liked_by_me);
	}, [queue.currentMusic.liked_by_me]);

	return (
		<Flex minWidth={'180px'} width={'30%'} alignItems={'center'} h={'100%'}>
			{
				queue.currentMusic.id ?
					<>
						<Box w={'56px'} h={'56px'} position={'relative'} flexShrink={0} borderRadius={'4px'} overflow={'hidden'} >
							<Image fill={true} className="object-cover" alt="playlist" src={queue.currentMusic.image_url} />
						</Box>

						<Flex marginLeft={'16px'} marginRight={'16px'} direction={'column'}>
							<Box color={'white'} fontSize={'14px'}><Text noOfLines={1}>{queue.currentMusic.name}</Text></Box>
							{/*@ts-ignore*/}
							<Box color={'#b3b3b3'} _hover={{ color: 'white' }} fontSize={'11px'}><Link href={`/artist/${queue.currentMusic.artist_id}`} transition={'none'}><Text noOfLines={1}>{queue.currentMusic.artist_name}</Text></Link></Box>
						</Flex>

						<LikeButton liked={liked} size={'32px'} iconSize={'20px'} onClick={onLike} />
					</>
					:
					[]
			}
		</Flex>
	)
}