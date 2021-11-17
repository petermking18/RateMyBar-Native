import React, {useEffect, useState} from 'react';
import {View, Box, useTheme, Progress, Text} from 'native-base';

export default function BarCategoryRatings({categoryRatings, ...props}) {
    if (!categoryRatings) return <></>

    let zeros = JSON.parse(JSON.stringify(categoryRatings));
    zeros.forEach((cr) => cr.averageCategoryRating = 0);
    const [crs, setCrs] = useState(zeros);
    const [crBackup, setCrBackup] = useState(categoryRatings);

    useEffect(() => {
        const unsubscribe = setTimeout(() => {setCrs(crBackup)},1);
        return unsubscribe;
    }, []);
    const {colors} = useTheme();

    return (
        <Box {...props}>
        {crs && crs.map((cr, index) => (
            <Box key={index}>
            {cr.averageCategoryRating > 0 &&
            <Box w='100%' mb={3}>
                <Box flexDirection='row' justifyContent='space-between' alignItems='flex-end'>
                    <Box w='100%'>
                        <Text mb={1} color={colors.muted[500]}>{cr.categoryName}: {cr.levelDescription}</Text>
                        <Progress colorScheme='rmb' bg={colors.muted[200]} size='md' value={cr.averageCategoryRating/.05}/>
                    </Box>
                    {/* <Text ml='auto' w='25%' textAlign='center' color={colors.muted[500]}>{cr.levelDescription}</Text> */}
                </Box>
            </Box>
            }
            </Box>
        ))}
        </Box>
    )
}