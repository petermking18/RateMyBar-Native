import React, {useEffect, useState} from 'react';
import {View, Box, useTheme, Progress, Text} from 'native-base';

export default function CategoryRatings({categoryRatings, ...props}) {
    let zeros = JSON.parse(JSON.stringify(categoryRatings));
    zeros.forEach((cr) => cr.rating = 0);
    const [crs, setCrs] = useState(zeros);
    const [crBackup, setCrBackup] = useState(categoryRatings);

    useEffect(() => {
        setTimeout(() => {setCrs(crBackup)},1);
    }, []);
    const {colors} = useTheme();

    return (
        <Box {...props}>
        {crs && crs.map((cr, index) => (
            <Box key={index} w='100%'>
                <Text color={colors.muted[500]}>{cr.ratingCategory}</Text>
                <Box flexDirection='row' justifyContent='space-between' alignItems='center'>
                    <Progress w='70%' colorScheme='rmb' bg={colors.muted[200]} size='md' value={cr.rating/.05}/>
                    <Text ml='auto' color={colors.muted[500]}>{cr.ratingDescription}</Text>
                </Box>
                {/* {cr.comment && cr.comment.length > 0 && <Text color={colors.muted[400]} fontStyle='italic'>"{cr.comment}"</Text>} */}
            </Box>
        ))}
        </Box>
    )
}