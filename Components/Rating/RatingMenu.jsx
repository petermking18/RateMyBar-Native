import React, {useState} from 'react';
import {useTheme, Menu, Button, Text} from 'native-base';
import {MaterialIcons} from '@expo/vector-icons';

export default function RatingMenu({onDelete}) {
    const {colors} = useTheme();
    return (
        <Menu 
            closeOnSelect={true}
            trigger={(triggerProps) => {
                return <Button {...triggerProps}>
                    <MaterialIcons name='more-horiz' size={24} color='white'/>
                </Button>
            }}
        >
            <Menu.Item onPress={onDelete} _text={{style: {color: 'red'}}}>Delete rating</Menu.Item>
        </Menu>
    )
}