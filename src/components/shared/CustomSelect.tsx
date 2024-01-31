import { AiFillCaretDown, AiFillCaretUp, AiOutlineCheck } from 'react-icons/ai';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Text,
	Box,
	Flex,
} from '@chakra-ui/react';

export default function CustomSelect({ options, selected, setSelected }: { options: Array<string>, selected: string, setSelected: (str: string) => void }) {

	return (
		<Menu>
			{({ isOpen }) => (
				<>
					<MenuButton className='pt-1 select-none text-primary cursor-pointer hover:text-white' as={Box}>
						<Flex className='items-center gap-1'>
							<Text noOfLines={1} fontSize={'14px'} fontWeight={500}>{selected}</Text>
							<Box flexShrink={0}>
								{isOpen ? < AiFillCaretUp /> : <AiFillCaretDown />}
							</Box>
						</Flex>
					</MenuButton>
					<MenuList className='bg-container-light rounded-md max-w-xs  min-w-[160px] p-1 border-none overflow-auto' boxShadow={'0 16px 24px rgba(0,0,0,.3), 0 6px 8px rgba(0,0,0,.2)'}>
						<Box className='w-full h-10 text-11 font-bold text-primary p-3'>Sort by</Box>
						{
							options.map((el) => {
								return (
									<MenuItem key={el} className={`w-full h-10 text-14 bg-transparent ${selected === el ? 'text-green' : 'text-white'}`} onClick={() => { setSelected(el) }}>
										<Flex className='w-full gap-2'>
											<Box className='grow'>{el}</Box>
											{selected === el ? <AiOutlineCheck size={'16px'} /> : []}
										</Flex>
									</MenuItem>)
							})
						}
					</MenuList>
				</>
			)}

		</Menu>
	)
}