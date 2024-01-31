import { Box, Input, InputGroup } from "@chakra-ui/react";
import { useState } from "react";

export default function CustomInput({ text, setText, placeholder, label }: { text: string, setText: (value: string) => void, placeholder: string, label: string }) {

	const [focus, setFocus] = useState(false);
	
	return (
		<InputGroup className='relative'>
			<Box className={`absolute top-0 translate-y-[-50%] z-10 text-11 left-[10px] font-bold ${focus ? 'opacity-1' : 'opacity-0'}`} transition={'all .2s'}>
				{label}
			</Box>
			<Input
				position={'relative'} _placeholder={{ color: '#6e6e6e' }}
				border={'1px solid transparent'} borderRadius={'4px'} textColor={'white'}
				fontSize={'14px'} px={'12px'} py={0} bg={'rgba(255,255,255,0.1)'} placeholder={placeholder}
				_hover={{ border: '1px solid transparent' }} _focus={{ bg: '#333', outline: 'none', border: '1px solid #535353', boxShadow: 'none' }}
				onFocus={() => { setFocus(true) }} onBlur={() => { setFocus(false) }}
				value={text} onChange={(e) => { setText(e.target.value) }} />
		</InputGroup>
	)
}