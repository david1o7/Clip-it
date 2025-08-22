import { SignOutButton } from '@/components/SignOutButton';
import { SignedIn, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useUser();

  return (
    <SignedIn>
        <View style={styles.container}>
        <Image source={require('../../assets/images/wavy.png')} style={styles.design} />
          <Text style={styles.title}>Clip-it</Text>

          <Text style={styles.welcome}>
           {"Hello 👋\n\nWelcome to Clip-it\n\nEasily organise,store and \nget reminded \nabout information \nyou snap for later."}
          </Text>

          <View style={styles.HomeButton}>
            <Link href="/explore" asChild>
              <Pressable style={styles.button}>
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Get Started</Text>
                  <Image
                    source={require('../../assets/images/arrow.png')}
                    style={styles.arrow}
                  />
                </View>
              </Pressable>
            </Link>
            <Image source={require('../../assets/images/wavy.png')} style={styles.design2} />
          </View>

          <View style={styles.signOutContainer}>
            <Text style={styles.userInfo}>
              Signed in as{"\n"}{user?.emailAddresses[0].emailAddress}
            </Text>
            <SignOutButton />
          </View>
        </View>
    </SignedIn>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: '#ffde59',
    position:"relative",
  },
  title: {
    fontSize: 54,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
    zIndex:2,
  },
  welcome: {
    textAlign: "center",
    color: "#333",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 60,
    zIndex:2,
  },
  HomeButton: {
    marginTop: 20,
  },
  button: {
    width: 280,
    height: 55,
    borderRadius: 35,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:2,
  },
  design:{
    position:"absolute",
    width:550,
    height:500,
    transform:[{ rotate :"90deg"}],
    top:-60,
    right:-250,
    zIndex:1,
  },
  design2:{
    width:550,
    height:500,
    bottom:-250,
    left:-300,
    zIndex:1,
    transform:[{ rotate: "270deg"}],
    position: "absolute",
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  arrow: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  signOutContainer: {
    position: 'absolute',
    top: "5%",
    right: "15%",
    alignItems: 'center',
    zIndex:2,
    backgroundColor:"#fff",
    borderRadius: 35,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: 'center',
    width:300,
  },
  userInfo: {
    color: '#034a92',
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
});
