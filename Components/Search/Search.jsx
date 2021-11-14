import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {Text, useTheme, Box, Input, ScrollView, HStack, KeyboardAvoidingView} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {RateMyBarApi} from '../../Api/RateMyBarApi';

const api = new RateMyBarApi();

export default function Search({token, location}) {
    const {colors} = useTheme();
    const [text, setText] = useState('');
    const [results, setResults] = useState([]);
    const nav = useNavigation();
    let _inputRef = useRef();

    const handleText = (value) => {
        setText(value);
        if (value.length > 2) {
            api.search.search(token.id, token.token, value).then(response => {
                setResults(response.results);
            })
        } else {
            setResults([]);
        }
    }

    useEffect(() => {
        const unsubscribe = nav.addListener('focus', () => {
            _inputRef.current.focus();
            setText('');
            setResults([]);
        })
        return unsubscribe;
    }, [nav]);

    return (
        <SafeAreaView>
            <Input ref={_inputRef} autoFocus={true} fontSize={20} 
                placeholder='Search...' returnKeyType='done' 
                value={text} onChangeText={text => handleText(text)}
                variant='underlined' px={5} h={12} bg='white'
            />
            <KeyboardAvoidingView h={{base: '400px', lg: 'auto'}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView keyboardShouldPersistTaps='always' pt={3} h='100%'>
                    {results.map((result, index) => (
                        <TouchableOpacity key={index} onPress={() => {
                            switch(result.parentType) {
                                case 'Tag':
                                    nav.navigate('Tag', {tag: result.parentID})
                                    break;
                                case 'User':
                                    nav.navigate('User', {userID: result.parentID})
                                    break;
                                case 'Bar':
                                    nav.navigate('Bar', {barID: result.parentID})
                                    break;
                            }
                        }}>
                            <Box px={5} bg='white' borderBottomColor={colors.muted[200]} py={3} borderBottomWidth={1}>
                                <HStack alignItems='center'>
                                    <Text fontSize={19} fontWeight='bold'>{result.name}</Text>
                                    <Text fontSize={19} color={colors.muted[500]} ml='auto'>{result.parentType.toUpperCase()}</Text>
                                </HStack>
                                {result.description.length > 0 && <Text color={colors.muted[500]}>{result.description}</Text>}
                            </Box>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}