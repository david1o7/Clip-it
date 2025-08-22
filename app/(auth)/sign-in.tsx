import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState, useRef, useEffect } from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet , Image, Animated, Easing } from 'react-native'

function ClipitLoader() {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  const animateDot = (dot: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
      ])
    )
  }

  useEffect(() => {
    animateDot(dot1, 0).start()
    animateDot(dot2, 200).start()
    animateDot(dot3, 400).start()
  }, [])

  return (
    <View style={loaderStyles.container}>
      <Animated.View
        style={[
          loaderStyles.dot,
          {
            backgroundColor: '#034a92',
            transform: [
              {
                scale: dot1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.4],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          loaderStyles.dot,
          {
            backgroundColor: '#ffde59',
            transform: [
              {
                scale: dot2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.4],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          loaderStyles.dot,
          {
            backgroundColor: '#034a92',
            transform: [
              {
                scale: dot3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.4],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  )
}

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) return
    setLoading(true)

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Image source={require('../../assets/images/wavy.png')} style={styles.design} />
      </View>
      <Text style={styles.title}>
        Welcome Back to{' '}
        <Text style={{ fontStyle: 'italic', color: '#034a92' }}>
          Clip-it <Text style={{ fontSize:15 }}>©</Text>
        </Text>
      </Text>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 13,
          textAlign: 'center',
          color: '#173459',
          fontStyle: 'italic',
        }}
      >
        Snap , Save , Get reminded about important information.{"\n"}
      </Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

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

      <TouchableOpacity style={styles.button} onPress={onSignInPress} disabled={loading}>
        {loading ? <ClipitLoader /> : <Text style={styles.buttonText}>Continue</Text>}
      </TouchableOpacity>

      <View style={styles.linkRow}>
        <Text style={styles.linkText}>Don’t have an account? </Text>
        <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View>
        <Image source={require('../../assets/images/wavy.png')} style={styles.design2} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffde59',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
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
  design: {
    width: 350,
    height: 350,
    position: 'absolute',
    top: -450,
    left: -25,
  },
  design2: {
    width: 350,
    height: 350,
    position: 'absolute',
    bottom: -448,
    right: -35,
    transform: [{ rotate: '-179deg' }],
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

const loaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
})
