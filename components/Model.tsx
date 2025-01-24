// import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { useEffect, useRef } from "react";
// import { ArrowHelper, Group, MathUtils } from "three";

// // useGLTF.preload("/robot_playground.glb")
// useGLTF.preload("/engine.glb");

// export default function Model() {
// 	const group = useRef<Group>(null);
// 	const { nodes, materials, animations, scene } = useGLTF("/engine.glb");
// 	const { actions, clips } = useAnimations(animations, scene);
// 	const scroll = useScroll();

// 	useFrame(({ camera }) => {
// 		group.current?.rotateY(MathUtils.degToRad(0.2));
// 		group.current.scale = new Vector3(2, 2, 2);
// 	});
// 	// useEffect(() => {
// 	// 	console.log(actions);
// 	// 	//@ts-ignore
// 	// 	actions["Experiment"].play().paused = true;
// 	// }, []);
// 	// useFrame(
// 	// 	() =>
// 	// 		//@ts-ignore
// 	// 		(actions["Experiment"].time =
// 	// 			//@ts-ignore
// 	// 			(actions["Experiment"].getClip().duration * scroll.offset) / 4)
// 	// );

// 	return (
// 		<group ref={group}>
// 			<primitive object={scene} />
// 		</group>
// 	);
// }

import { createRoot } from "react-dom/client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

import "./styles.css";

function Box(props: JSX.IntrinsicElements["mesh"]) {
	// Типизация useRef для Mesh
	const meshRef = useRef<Mesh>(null);

	// Состояние для наведения и активации
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);

	// Анимация вращения
	useFrame((_, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.x += delta;
		}
	});

	// Возврат JSX для элемента Three.js
	return (
		<mesh {...props} ref={meshRef} scale={15} onClick={() => setActive(!active)} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
			<boxGeometry args={[3, 1, 1]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
	<Canvas>
		<ambientLight intensity={Math.PI / 2} />
		<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
		<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
		<Box position={[-1.2, 0, 0]} />
		<Box position={[1.2, 0, 0]} />
	</Canvas>
);
