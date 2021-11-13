import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Platform, SafeAreaView, Keyboard, TouchableWithoutFeedback, ScrollView, View, Touchable} from 'react-native';
import {useTheme, Input, FormControl, KeyboardAvoidingView, Heading, Button, VStack, Center, Text, Stack, Actionsheet, Box, Switch, HStack} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import UserToken from '../../UserToken';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const api = new RateMyBarApi();
const LoginStack = createStackNavigator();

export default function Login({setToken}) {
    const styles = getStyles(useTheme());
    const {colors} = useTheme();
    const [username, setUsername] = useState('');
    let usernameRef = useRef();
    const [password, setPassword] = useState('');
    let passwordRef = useRef();
    const [loginError, setLoginError] = useState('');
    const valid = () => {
        if (username.length == 0 || password.length == 0) {
            return false;
        }
        return true;
    }

    const handleLogin = () => {
        api.auth.login(username, password)
        .then(user => {
            const userToken = new UserToken(user.userID, user.username, user.name, user.school, user.email, user.AuthToken);
            setToken(userToken);
        }).catch(err => {
            setLoginError(err);
        })
    }

    const handleRegister = async (username, email, name, school, dob, phone, password, privacy) => {
        const newUser = {username, email, name, school, dob, phone, password, privacy};
        const user = await api.auth.register(newUser);
        const userToken = new UserToken(user.userID, user.username, user.name, user.school, user.email, user.authToken);
        setToken(userToken);
    }

    return (
        <NavigationContainer>
            <LoginStack.Navigator
                initialRouteName='Login'>
                <LoginStack.Screen
                    name='Login'
                    options={{ title: 'Login', headerShown: false}}>
                    {(props) => 
                    <SafeAreaView style={styles.outer} {...props}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Center flex={1} px={0}>
                        <KeyboardAvoidingView h={{base: '400px', lg: 'auto'}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, padding: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} keyboardVerticalOffset={120} >
                            <VStack p={6} flex='1' justifyContent='center'>
                                <Heading fontSize={48} mb={2}>Login to RateMyBar</Heading>
                                <Input fontSize={25} mb={2} ref={r => usernameRef = r} autoCapitalize='none' variant='underlined' value={username} returnKeyType='next' onSubmitEditing={() => passwordRef.focus()} placeholder='Username' type='username' onChangeText={text => setUsername(text)}/>
                                <Input fontSize={25} mb={2} ref={r => passwordRef = r} variant='underlined' value={password} placeholder='Password' type='password' returnKeyType='go' onSubmitEditing={() => handleLogin()} onChangeText={text => setPassword(text)}/>
                                {loginError.length > 0 && <Text fontSize='lg' style={{color: 'red'}}>{loginError}</Text>}
                                <Button colorScheme="primary" style={styles.button} size="lg" mb='2' isDisabled={!valid()} onPress={() => handleLogin()}>Login</Button>
                                <Button colorScheme='primary' style={styles.button} variant='outline' size='lg' onPress={() => props.navigation.navigate('Register')}>Register</Button>
                            </VStack>
                        </KeyboardAvoidingView>
                    </Center>
                    </TouchableWithoutFeedback>
                    </SafeAreaView>
                    }
                </LoginStack.Screen>
                <LoginStack.Screen
                    name='Register'
                    options={{title: 'Register', presentation: 'modal', headerBackImage: null, headerStyle: styles.headerStyle, headerBackTitleVisible: false, headerBackTitleStyle: styles.headerBackTitleStyle, headerTintColor: 'white'}}>
                    {(props) => 
                        <RegisterForm handleRegister={handleRegister} {...props} />
                    }
                </LoginStack.Screen>
            </LoginStack.Navigator>
        </NavigationContainer>
    )
}

function RegisterForm({handleRegister, ...props}) {
    const styles = getStyles(useTheme());
    const {colors} = useTheme();
    const dobInitial = new Date(new Date().setFullYear(new Date().getFullYear() - 21));
    const [username, setUsername] = useState(null);
    const [usernameError, setUsernameError] = useState('');
    let usernameRef = useRef();
    const [name, setName] = useState(null);
    const [nameError, setNameError] = useState('');
    let nameRef = useRef();
    const [school, setSchool] = useState(null);
    const [schoolError, setSchoolError] = useState('');
    let schoolRef = useRef();
    const [dob, setDob] = useState(dobInitial);
    const [dobError, setDobError] = useState('');
    const [showDob, setShowDob] = useState(false);
    const [dobChanged, setDobChanged] = useState(false);
    const [email, setEmail] = useState(null);
    const [emailError, setEmailError] = useState('');
    let emailRef = useRef();
    const [phone, setPhone] = useState(null);
    const [phoneError, setPhoneError] = useState('');
    let phoneRef = useRef();
    const [password, setPassword] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    let passwordRef = useRef();
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    let confirmPasswordRef = useRef();
    const [privacy, setPrivacy] = useState(false);
    const [allUsernames, setAllUsernames] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.auth.getAllUsernames().then(usernames => {
            let arr = [];
            usernames.forEach(uObj => arr.push(uObj.username));
            setAllUsernames(arr);
        })
    }, []);

    useEffect(() => {
        if (username === null) return;
        if (username.length === 0) {
            setUsernameError('Username cannot be blank');
        } else if (username.includes(' ')) {
            setUsernameError('Username cannot contain spaces');
        } else if (allUsernames.some(au => au === username.toLowerCase())) {
            setUsernameError('Username is already taken')
        } else {
            setUsernameError('');
        }
    }, [username]);
    useEffect(() => {
        if (name === null) return;
        if (name.length === 0) {
            setNameError('Name cannot be blank');
        } else {
            setNameError('');
        }
    }, [name]);
    useEffect(() => {
        if (school === null) return;
        if (school.length === 0) {
            setSchoolError('School cannot be blank');
        } else {
            setSchoolError('');
        }
    }, [school]);
    useEffect(() => {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0) && today.getDate() < dob.getDate()) {
            age--;
        }
        if (age < 21) {
            setDobError('You must be 21 to use this app');
        } else {
            setDobError('');
        }
    }, [dob]);
    useEffect(() => {
        if (email === null) return;
        if (email.length === 0) {
            setEmailError('Email cannot be blank');
        } else if (email.includes(' ')) {
            setEmailError('Email cannot contain spaces');
        } else if (!email.includes('@') || !email.includes('.')) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    }, [email]);
    useEffect(() => {
        if (phone === null) return;
        if (phone.length !== 10) {
            setPhoneError('Invalid phone number length')
        } else if (phone.match(/[^\d]/)) {
            setPhoneError('Phone number can only contain numbers')
        } else {
            setPhoneError('');
        }
    }, [phone]);
    useEffect(() => {
        if (password === null) return;
        if (password.length === 0) {
            setPasswordError('Password cannot be blank');
        } else {
            setPasswordError('');
        }
    }, [password]);
    useEffect(() => {
        if (password === null) return;
        if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }
    }, [confirmPassword, password]);

    const formInvalid = () => {
        const fields = [username, name, school, email, phone, password, confirmPassword];
        if (fields.some(f => f === null)) return true;
        if (!dobChanged) return true;
        const errorFields = [usernameError, nameError, schoolError, dobError, emailError, phoneError, passwordError, confirmPasswordError];
        if (errorFields.some(ef => ef !== '')) return true;
        return false;
    }

    return (
        <SafeAreaView style={styles.outer} {...props}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, padding: 40, flexDirection: 'column', justifyContent: 'center'}} keyboardVerticalOffset={120}>
                    <ScrollView>
                        <Heading fontSize={30} mb={2}>Create Account</Heading>
                        <VStack p={0} flex='1' justify-content='flex-end'>
                            <Input style={styles.input} ref={r => usernameRef = r} variant='underlined' value={username} placeholder='Username' type='username' returnKeyType='next' onSubmitEditing={() => {nameRef.focus()}} onChangeText={text => setUsername(text)}/>
                            <Text style={styles.error}>{usernameError}</Text>
                            <Input style={styles.input} ref={r => nameRef = r} variant='underlined' value={name} placeholder='Name' type='name' returnKeyType='next' onSubmitEditing={() => {schoolRef.focus()}} onChangeText={text => setName(text)}/>
                            <Text style={styles.error}>{nameError}</Text>
                            <Input style={styles.input} ref={r => schoolRef = r} variant='underlined' value={school} placeholder='School' returnKeyType='next' onSubmitEditing={() => emailRef.focus()} onChangeText={text => setSchool(text)}/>
                            <Text style={styles.error}>{schoolError}</Text>
                            <Input style={styles.input} ref={r => emailRef = r} variant='underlined' value={email} placeholder='Email' returnKeyType='next' onSubmitEditing={() => phoneRef.focus()}type='email' keyboardType='email-address' onChangeText={text => setEmail(text)}/>
                            <Text style={styles.error}>{emailError}</Text>
                            <Input style={styles.input} ref={r => phoneRef = r} variant='underlined' value={phone} placeholder='Phone number' type='tel' keyboardType='phone-pad' returnKeyType='next' onSubmitEditing={() => passwordRef.focus()} onChangeText={text => setPhone(text)}/>
                            <Text style={styles.error}>{phoneError}</Text>
                            <Input style={styles.input} ref={r => passwordRef = r} variant='underlined' value={password} placeholder='Password' type='password' returnKeyType='next' onSubmitEditing={() => confirmPasswordRef.focus()} onChangeText={text => setPassword(text)}/>
                            <Text style={styles.error}>{passwordError}</Text>
                            <Input style={styles.input} ref={r => confirmPasswordRef = r} variant='underlined' value={confirmPassword} placeholder='Confirm password' type='password' returnKeyType='done' onChangeText={text => setConfirmPassword(text)}/>
                            <Text style={styles.error}>{confirmPasswordError}</Text>
                            <Button colorScheme={dobError ? 'danger' : 'primary'} variant={dobChanged ? 'subtle' : 'solid'}  size='md' mb={0} style={styles.button} onPress={() => setShowDob(true)}>{dobChanged ? 'Born ' + moment(dob).format('MMMM Do YYYY') : 'Enter birthdate'}</Button>
                            <Text style={styles.error}>{dobError}</Text>
                            <HStack alignItems='center' justifyContent='center' mb={4} space={4}>
                                <Text>Make account private</Text>
                                <Switch size='lg' colorScheme='primary' isChecked={privacy} onToggle={(val) => setPrivacy(val)}/>
                            </HStack>
                            <Button style={styles.button} isDisabled={formInvalid() || submitting} onPress={() => {
                                setSubmitting(true);
                                handleRegister(username, email, name, school, dob, phone, password, privacy);
                            }}>Create Account</Button>
                        </VStack>
                        <Actionsheet isOpen={showDob} onClose={() => setShowDob(false)}>
                            <Actionsheet.Content>
                                <Box w='100%' h={200} px={4}>
                                    <DateTimePicker
                                    value={dob}
                                    mode='date'
                                    display='spinner'
                                    onChange={(event, date) => {
                                        setDob(date);
                                        setDobChanged(true)
                                        }}/>
                                </Box>
                            </Actionsheet.Content>
                        </Actionsheet>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

const getStyles = (theme) => {
    const colors = theme.colors;
    const styles = StyleSheet.create({
        button: {
            borderRadius: 25,
            paddingTop: 15,
            paddingBottom: 15,
        },
        input: {
            fontSize: 25,
            marginBottom: 2
        },
        error: {
            fontSize: 15,
            color: colors.danger['500'],
            textAlign: 'center'
        },
        outer: {
            flex: 1
        },
        inner: {
            padding: 24,
            flex: 1,
            justifyContent: 'flex-end'
        },
        headerBackTitleStyle: {
            color: 'white',
            fontWeight: '600'
        },
        headerStyle: {
            backgroundColor: colors.primary['500']
        }
    })
    return styles;
}