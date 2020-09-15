import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Modal,
  Animated,
  StatusBar,
  Button,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("window");

export default function App() {
  const [content, setContent] = useState([
    {
      content:
        " https://images.unsplash.com/photo-1597905040736-ba674651bd1c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
      type: "image",
      finish: 0,
    },
    {
      content:
        "https://images.unsplash.com/photo-1594601760552-f48ad23d1885?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=712&q=80 ",
      type: "image",
      finish: 0,
    },
    {
      content:
        " https://images.unsplash.com/photo-1590102938754-c88619f5c916?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=330&q=80",
      type: "image",
      finish: 0,
    },
    {
      content:
        "https://images.unsplash.com/photo-1588094504781-0a67bc2306f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
      type: "image",
      finish: 0,
    },
    {
      content:
        " https://images.unsplash.com/photo-1588094504138-285acf7892ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1472&q=80",
      type: "image",
      finish: 0,
    },
    {
      content:
        "https://images.unsplash.com/photo-1581487431871-ea7a73c2d4e8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80 ",
      type: "image",
      finish: 0,
    },
    {
      content:
        "https://images.unsplash.com/photo-1575525351824-0a7403f45852?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80 ",
      type: "image",
      finish: 0,
    },
    {
      content: " https://gramho.com/media/2371598848517019528",
      type: "image",
      finish: 0,
    },
    {
      content:
        "https://onlinehyderabad.in/wp-content/uploads/2019/04/10-Mindblowing-Facts-About-Golconda-Fort-Hyderabad-760x410.jpg ",
      type: "image",
      finish: 0,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [end, setEnd] = useState(0);
  const [current, setCurrent] = useState(0);
  const [load, setLoad] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  function start(n) {
    if (content[current].type == "video") {
      if (load) {
        Animated.timing(progress, {
          toValue: 1,
          duration: n,
        }).start(({ finished }) => {
          if (finished) {
            next();
          }
        });
      }
    } else {
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
      }).start(({ finished }) => {
        if (finished) {
          next();
        }
      });
    }
  }

  function play() {
    start(end);
  }

  function next() {
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the next content is empty
      close();
    }
  }

  function previous() {
    // checking if the previous content is not empty
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the previous content is empty
      close();
    }
  }

  // closing the modal set the animation progress to 0
  function close() {
    progress.setValue(0);
    setLoad(false);
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      {/* MODAL */}
      <Modal animationType="fade" transparent={false} visible={modalVisible}>
        <View style={styles.containerModal}>
          <View style={styles.backgroundContainer}>
            {/* check the content type is video or an image */}
            {content[current].type == "video" ? (
              <Video
                source={{
                  uri: content[current].content,
                }}
                rate={1.0}
                volume={1.0}
                resizeMode="cover"
                shouldPlay={true}
                positionMillis={0}
                onReadyForDisplay={play()}
                onPlaybackStatusUpdate={(AVPlaybackStatus) => {
                  console.log(AVPlaybackStatus);
                  setLoad(AVPlaybackStatus.isLoaded);
                  setEnd(AVPlaybackStatus.durationMillis);
                }}
                style={{ height: height, width: width }}
              />
            ) : (
              <Image
                onLoadEnd={() => {
                  progress.setValue(0);
                  play();
                }}
                source={{
                  uri: content[current].content,
                }}
                style={{ width: width, height: height, resizeMode: "cover" }}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "column",
              flex: 1,
            }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,1)", "transparent"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 100,
              }}
            />
            {/* ANIMATION BARS */}
            <View
              style={{
                flexDirection: "row",
                paddingTop: 10,
                paddingHorizontal: 10,
              }}
            >
              {content.map((index, key) => {
                return (
                  // BACKGROUND
                  <View
                    key={key}
                    style={{
                      height: 2,
                      flex: 1,
                      flexDirection: "row",
                      backgroundColor: "rgba(117, 117, 117, 0.5)",
                      marginHorizontal: 2,
                    }}
                  >
                    {/* THE ANIMATION OF THE BAR*/}
                    <Animated.View
                      style={{
                        flex: current == key ? progress : content[key].finish,
                        height: 2,
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      }}
                    ></Animated.View>
                  </View>
                );
              })}
            </View>
            {/* END OF ANIMATION BARS */}

            <View
              style={{
                height: 50,
                flexDirection: "row",

                justifyContent: "space-between",
                paddingHorizontal: 15,
              }}
            >
              {/* AVATAR AND USERNAME  */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ height: 30, width: 30, borderRadius: 25 }}
                  source={{
                    uri:
                      "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                  }}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    paddingLeft: 10,
                  }}
                >
                  My Insta Stories
                </Text>
              </View>
              {/* END OF THE AVATAR AND USERNAME */}
              {/* THE CLOSE BUTTON */}
              <TouchableOpacity
                onPress={() => {
                  close();
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",

                    height: 50,
                    paddingHorizontal: 15,
                  }}
                >
                  <Ionicons name="ios-close" size={28} color="white" />
                </View>
              </TouchableOpacity>
              {/* END OF CLOSE BUTTON */}
            </View>
            {/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableWithoutFeedback onPress={() => previous()}>
                <View style={{ flex: 1 }}></View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => next()}>
                <View style={{ flex: 1 }}></View>
              </TouchableWithoutFeedback>
            </View>
            {/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
          </View>
        </View>
      </Modal>
      {/* END OF MODAL */}

      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View>
          <Image
            source={{
              uri:
                " https://images.unsplash.com/photo-1495567720989-cebdbdd97913?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            }}
            style={{
              height: 70,
              width: 70,
              borderRadius: 50,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
      <Text style={{ fontWeight: "bold", color: "#D62976" }}>
        React-Native Insta Stories
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerModal: {
    flex: 1,
  },
  backgroundContainer: {
    position: "absolute",

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
