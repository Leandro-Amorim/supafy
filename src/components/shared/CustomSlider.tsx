import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { useState } from "react";

export default function CustomSlider({ value, setValue, min, max, step }: { value: number, setValue: (val: number)=>void, min: number, max: number, step: number}) {

	const [hover, setHover] = useState(false);
	const [dragging, setDragging] = useState(false);
	return (
		<Slider onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }} onChangeStart={() => { setDragging(true) }} onChangeEnd={(val) => { setDragging(false) }}
			value={value} onChange={setValue} max={max} min={min} step={step} aria-label='slider-ex-1' h={'12px'} w={'100%'} focusThumbOnChange={false}>
			<SliderTrack bg={'#4d4d4d'} h={'4px'} borderRadius={'2px'}>
				<SliderFilledTrack bg={hover || dragging ? '#1db954' : 'white'} />
			</SliderTrack>
			<SliderThumb boxSize={'12px'} visibility={hover || dragging ? 'visible' : 'hidden'} />
		</Slider>
	)
}