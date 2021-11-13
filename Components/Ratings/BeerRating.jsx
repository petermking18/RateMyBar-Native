import React from 'react';
import {default as empty} from '../../assets/PNG/empty.png';
import {default as quarter} from '../../assets/PNG/quarter.png';
import {default as half} from '../../assets/PNG/half.png';
import {default as threequarter} from '../../assets/PNG/threequarter.png';
import {default as full} from '../../assets/PNG/full.png';
import {Image, HStack} from 'native-base';

export default function BeerRating({rating, ...props}) {
    const floor = Math.floor(rating);

    const getPartial = () => {
        const amt = rating - floor;
        if (amt <= 0.125) {
            return empty;
        }else if (amt <= 0.375) {
            return quarter;
        } else if (amt <= 0.625) {
            return half;
        } else if (amt <= 0.875) {
            return threequarter;
        } else {
            return full;
        }
    }

    return (
        <HStack {...props} space={1}>
            {Array(Math.floor(rating)).fill(null).map((mug, index) => (
                <Image key={index} source={full} size={5} alt='Mug'/>
            ))}
            {rating - floor != 0 && 
                <Image source={getPartial()} size={5} alt='Mug'/>
            }
            {Array(5-Math.ceil(rating)).fill(null).map((mug, index) => (
                <Image key={index} source={empty} size={5} alt='Mug'/>
            ))}
            {/* <Image source={half} size={7}/> */}
        </HStack>
    )
}