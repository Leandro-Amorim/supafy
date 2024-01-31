import SideBar from "@/components/sidebar/SideBar";
import PlayBar from "@/components/playbar/PlayBar";
import { Box, Flex, Text } from "@chakra-ui/react";
import MainContainer from "@/components/shared/MainContainer";
import QueueMusicItem from "@/components/queue/QueueMusicItem";
import Page from "@/components/shared/Page";
import { useRecoilValue } from "recoil";
import { playerState, queueState } from "@/lib/atoms";
import { useEffect, useState } from "react";
import { getQueueInfo } from "@/lib/playerUtils";
import ClearQueueButton from "@/components/queue/ClearQueueButton";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase";
import { GetServerSideProps } from "next";
import { MusicInfo } from "@/types/database/MusicInfo";

export default function Queue() {

	const queue = useRecoilValue(queueState);
	const player = useRecoilValue(playerState);

	const [data, setData] = useState<Array<MusicInfo>>([]);

	useEffect(() => {
		async function updateData() {
			const queueToUse = (player.shuffle ? queue.shuffledQueue : queue.queue) ?? [];
			const ids = queueToUse.map((el) => { return el.id });
			if (ids.length == 0) {
				setData([]);
				return;
			}

			const infos = await getQueueInfo(ids);

			setData(queueToUse.map((el) => {
				const musicInfo = infos?.find((inf) => { return inf.id == el.id });
				return {
					id: musicInfo?.id ?? '',
					name: musicInfo?.name ?? '',
					url: musicInfo?.url ?? '',
					image_url: musicInfo?.image_url ?? '',
					liked_by_me: musicInfo?.liked_by_me ?? false,
					artist_id: musicInfo?.artist_id ?? '',
					artist_name: musicInfo?.artist_name ?? '',
					album_name: musicInfo?.album_name ?? '',
					duration: musicInfo?.duration ?? 0,
				}
			}));

		}
		updateData();
	}, [player.shuffle, queue.queue, queue.shuffledQueue]);

	return (
		<Page>
			<Flex grow={1} minH={0}>
				<SideBar />
				<MainContainer color={'#121212'} darkenHeader={false} headerContent={[]} hasGradient={false} distanceToReveal="0px">
					<Box marginTop={'30px'} marginBottom={'34px'}>
						<Text fontSize={'24px'} color={'white'} fontWeight={700} marginBottom={'12px'}>Queue</Text>
						{
							queue.currentMusic.id ?
								<>
									<Text fontSize={'16px'} color={'#a7a7a7'} fontWeight={700} marginBottom={'10px'}>Now playing</Text>
									<QueueMusicItem music={queue.currentMusic} index={1} />
								</>
								:
								[]
						}
					</Box>
					{
						(data.length > 0) &&
						<>
							<Flex gap={'4px'} marginBottom={'8px'} justifyContent={'space-between'} alignItems={'end'}>
								<Text fontSize={'16px'} color={'#a7a7a7'} fontWeight={700}>Next in queue</Text>
								<ClearQueueButton />
							</Flex>
							<Flex direction={'column'}>
								{
									data.map((music, index) => {
										return <QueueMusicItem key={music.id} music={music} index={index + 2} />
									})
								}
							</Flex>
						</>
					}


				</MainContainer>
			</Flex>

			<PlayBar />

		</Page >
	)
}

export const getServerSideProps = (async (context) => {

	const supabase = createPagesServerClient<Database>(context);
	const { data: { session } } = await supabase.auth.getSession();
	const client_id = session?.user?.id ?? null;

	if (client_id) {
		const profile = (await supabase.from('profiles').select('*').eq('id', client_id).single()).data;
		if (profile && profile.signup_completed === false) {
			return {
				redirect: {
					destination: '/complete_profile',
					permanent: false,
				},
			}
		}
	}

	return {
		props: {
		},
	}
}) satisfies GetServerSideProps;