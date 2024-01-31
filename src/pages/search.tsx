import PlayBar from "@/components/playbar/PlayBar";
import SearchHeaderContent from "@/components/search/SearchHeaderContent";
import SearchResults from "@/components/search/SearchResults";
import MainContainer from "@/components/shared/MainContainer";
import Page from "@/components/shared/Page";
import SideBar from "@/components/sidebar/SideBar";
import { Flex } from "@chakra-ui/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase";
import { GetServerSideProps } from "next";
import { BasicGenre } from "@/types/database/BasicGenre";

export default function Search({ genres }: { genres: BasicGenre[] | null }) {
	return (
		<Page>
			<Flex grow={1} minH={0}>
				<SideBar />
				<MainContainer distanceToReveal={'100px'} hasGradient={false} color={'rgb(18,18,18)'} darkenHeader={false} headerContent={<SearchHeaderContent />} headerAlwaysVisible={true}>
					<SearchResults genres={genres} />
				</MainContainer>
			</Flex>
			<PlayBar />
		</Page>
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

	const genres = (await supabase.from('genres').select('*').returns<Array<BasicGenre>>()).data;

	return {
		props: {
			genres
		},
	}
}) satisfies GetServerSideProps;
