import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet , Image, Animated, Easing } from 'react-native'

function ClipitLoader() {
  const dot1 = React.useRef(new Animated.Value(0)).current
  const dot2 = React.useRef(new Animated.Value(0)).current
  const dot3 = React.useRef(new Animated.Value(0)).current

  const animateDot = (dot: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: 1, duration: 400, delay, useNativeDriver: true, easing: Easing.ease }),
        Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true, easing: Easing.ease }),
      ])
    )
  }

  React.useEffect(() => {
    animateDot(dot1, 0).start()
    animateDot(dot2, 200).start()
    animateDot(dot3, 400).start()
  }, [])

  const scaleStyle = (dot: Animated.Value, color: string) => ({
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    backgroundColor: color,
    transform: [
      {
        scale: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.4],
        }),
      },
    ],
  })

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={scaleStyle(dot1, '#034a92')} />
      <Animated.View style={scaleStyle(dot2, '#ffde59')} />
      <Animated.View style={scaleStyle(dot3, '#034a92')} />
    </View>
  )
}

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onSignUpPress = async () => {
    if (!isLoaded) return
    setLoading(true)
    try {
      await signUp.create({ emailAddress, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return
    setLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>We’ve sent you a code. Enter it below.</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#888"
          onChangeText={setCode}
        />
        <TouchableOpacity style={styles.button} onPress={onVerifyPress} disabled={loading}>
          {loading ? <ClipitLoader /> : <Text style={styles.buttonText}>Verify</Text>}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View><Image source={require("../../assets/images/wavy.png")} style={styles.design}/></View>
      <Text style={styles.title}>
        <Text style={{ fontStyle:"italic" , color:"#034a92" , fontSize:80 , textAlign:"center" ,}}>Clip-it <Text style={{ fontSize:15,}}>©</Text></Text>
        {"\n"}Create Account
      </Text>
      <Text style={styles.subtitle}>
        Sign up to get started <Text style={{ fontStyle:"italic" , color:"#034a92" }}>Clip-it <Text style={{ fontSize:15,}}>©</Text></Text>
      </Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#888"
        onChangeText={setEmailAddress}
      />

      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#888"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={loading}>
        {loading ? <ClipitLoader /> : <Text style={styles.buttonText}>Continue</Text>}
      </TouchableOpacity>

      <View style={styles.linkRow}>
        <Text style={styles.linkText}>Already have an account? </Text>
        <Link href="/sign-in" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View><Image source={require("../../assets/images/wavy.png")} style={styles.design2}/></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffde59',
    position:"relative",
    overflow:"hidden",
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  design:{
    width:350,
    height:350,
    position:"absolute",
    top:-400,
    left:-25,
  },
  design2:{
    width:350,
    height:350,
    position:"absolute",
    bottom:-405,
    right:-35,
    transform: [{ rotate: '-179deg' }],
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#444',
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
})
