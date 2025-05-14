import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  PanResponder,
  Platform,
} from "react-native";
import Matter from "matter-js";

const BUBBLE_MIN_SIZE = 60;
const BUBBLE_MAX_SIZE = 120;

export default function BubbleArena({ coins, width, height, bubbleSizeMode }) {
  const [tick, setTick] = useState(0);
  const [bodies, setBodies] = useState([]);
  const engine = useRef(Matter.Engine.create()).current;
  const world = engine.world;
  engine.gravity.y = 0;

  const frameId = useRef();

  useEffect(() => {
    const renderLoop = () => {
      Matter.Engine.update(engine, 16.67);
      setTick((t) => t + 1);
      frameId.current = requestAnimationFrame(renderLoop);
    };

    frameId.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(frameId.current);
  }, []);

  useEffect(() => {
    Matter.World.clear(world, false);

    const wallOptions = { isStatic: true };
    const walls = [
      Matter.Bodies.rectangle(width / 2, -25, width, 50, wallOptions),
      Matter.Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions),
      Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOptions),
      Matter.Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions),
    ];
    Matter.World.add(world, walls);

    const values = coins.map((c) =>
      bubbleSizeMode === "market_cap"
        ? c.market_cap
        : Math.abs(c.price_change_percentage_24h)
    );
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    const newBodies = coins.map((coin) => {
      const rawVal =
        bubbleSizeMode === "market_cap"
          ? coin.market_cap
          : Math.abs(coin.price_change_percentage_24h);
      const norm = (rawVal - minVal) / (maxVal - minVal || 1);
      const size = BUBBLE_MIN_SIZE + norm * (BUBBLE_MAX_SIZE - BUBBLE_MIN_SIZE);

      const body = Matter.Bodies.circle(
        Math.random() * (width - size),
        Math.random() * (height - size),
        size / 2,
        {
          restitution: 0.9,
          frictionAir: 0,
          label: coin.id,
          plugin: { coin, size },
        }
      );

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      });

      Matter.World.add(world, body);
      return body;
    });

    setBodies(newBodies);
  }, [coins, bubbleSizeMode, width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {bodies.map((body) => {
        const { x, y } = body.position;
        const coin = body.plugin.coin;
        const size = body.plugin.size;
        const isPositive = coin.price_change_percentage_24h >= 0;

        const panResponder =
          Platform.OS !== "web"
            ? PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderGrant: () => {
                  Matter.Body.setVelocity(body, { x: 0, y: 0 });
                },
                onPanResponderMove: (_, gesture) => {
                  Matter.Body.setPosition(body, {
                    x: gesture.moveX,
                    y: gesture.moveY,
                  });
                },
              })
            : {};

        const style = {
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.05)",
        };

        return (
          <View
            key={coin.id}
            style={style}
            {...(panResponder?.panHandlers || {})}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: coin.image }}
                style={styles.coinImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.bubbleText}>{coin.symbol.toUpperCase()}</Text>
            <Text style={styles.bubbleText}>
              ${coin.current_price.toLocaleString()}
            </Text>
            <Text style={styles.bubbleText}>
              {isPositive ? "+" : ""}
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  imageWrapper: {
    width: 32,
    height: 32,
    marginBottom: 4,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
  },
  coinImage: {
    width: "100%",
    height: "100%",
  },
});
