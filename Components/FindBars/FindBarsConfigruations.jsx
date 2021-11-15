import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, RefreshControl, Dimensions} from 'react-native';
import {Text, useTheme, ScrollView, View, Popover, Slider, Button, Box, Select} from 'native-base';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons';

export default function FindBarsConfigurations({radius, setRadius, sortBy, setSortBy}) {
    const {colors} = useTheme();
    const vw = Dimensions.get('window').width;
    const [showConfig, setShowConfig] = useState(false);
    const [currentRadius, setCurrentRadius] = useState(radius);

    return <Popover
        trigger={(triggerProps) => {
            return <Button {...triggerProps} onPress={() => setShowConfig(true)} colorScheme='primary' borderRadius={25}>
                <MaterialIcons name='tune' size={24} color='white'/>
            </Button>
        }}
        isOpen={showConfig} onClose={() => setShowConfig(false)}
    >
        <Popover.Content w={vw}>
            <Popover.Arrow/>
            <Popover.CloseButton/>
            <Popover.Header>Configure</Popover.Header>
            <Popover.Body>
                <Box flexDirection='row' justifyContent='space-between' alignItems='center' py={5}>
                    <Text w='50%' color={colors.muted[500]}>Distance ({Math.floor(currentRadius)} mile{Math.floor(currentRadius) !== 1 && 's'})</Text>
                    <Slider
                        width='50%'
                        size='lg'
                        defaultValue={currentRadius}
                        onChange={v => setCurrentRadius(v)}
                        onChangeEnd={v => setRadius(v)}
                        colorScheme='rmb'
                    >
                        <Slider.Track bg='lightgray'>
                            <Slider.FilledTrack/>
                        </Slider.Track>
                        <Slider.Thumb/>
                    </Slider>
                </Box>
                <Box flexDirection='row' justifyContent='space-between' alignItems='center' py={5}>
                    <Text w='50%' color={colors.muted[500]}>Sort by</Text>
                    <Select width='50%'
                        selectedValue={sortBy}
                        onValueChange={v => {
                            setSortBy(v);
                            setShowConfig(false);
                        }}
                        h='50px'
                    >
                        <Select.Item label='Nearest' value='Nearest'/>
                        <Select.Item label='Highest rated' value='Highest rated'/>
                    </Select>
                </Box>
            </Popover.Body>
        </Popover.Content>
    </Popover>
}