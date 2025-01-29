"use client";

interface Props {
	position: number[];
	src: string;
	setRotateObj: React.Dispatch<React.SetStateAction<boolean>>;
	rotateObj: boolean;
	group: React.RefObject<Group<THREE.Object3DEventMap>>;
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	isMetal: boolean;
	activeObj: string;
	setActiveObj: React.Dispatch<React.SetStateAction<string>>;
}
interface Scene {
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	activeObj: string;
	setActiveObj: React.Dispatch<React.SetStateAction<string>>;
}

import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { ArrowHelper, Group, MathUtils, Vector3 } from "three";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import Controls from "./OrbitControls";
import * as THREE from "three";
import { div, rotate, vec3 } from "three/examples/jsm/nodes/Nodes.js";
import "../app/style.scss";

function Obj({ group, position, src, isMetal, rotateObj, setRotateObj, active, setActiveObj, activeObj, setActive }: Props) {
	const meshRef = useRef<Mesh>(null);
	const [removed, setRemoved] = useState(false);
	const [hovered, setHover] = useState(false);
	const meshColorRef = useRef();
	const { nodes, materials, animations, scene } = useGLTF(src);
	const [opacity, setOpacity] = useState(1);
	const scroll = useScroll();
	let xSpeed: number;
	let ySpeed: number;
	let zSpeed: number;
	let time = new Date().getTime();
	const [originalColor, setOriginalColor] = useState(null);

	useEffect(() => {
		if (scene && !originalColor) {
			scene.traverse((child) => {
				if (child instanceof THREE.Mesh && isMetal) {
					child.material = new THREE.MeshStandardMaterial({
						metalness: isMetal ? 1.0 : 0,
						roughness: isMetal ? 0.4 : 1,
					});
				}
				if (child instanceof THREE.Mesh) {
					if (child.isMesh && child.material && child.material.color) {
						setOriginalColor(child.material.color.clone());
					}
				}
			});
		}
	}, [scene, originalColor]);

	let deg = 0;
	scene.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			if (child.material) {
				child.material.color.set(hovered ? "#36bca5" : originalColor);
			}
		}
	});

	setTimeout(() => {
		if (new Date().getTime() - time > 5000) {
			setRotateObj(true);
			if (deg == 0) {
				for (let i = 0; i < 3; i++) {
					setTimeout(() => {
						deg = i / 100;
					}, i * 100);
				}
			}
		} else {
			setRotateObj(false);
			for (let i = 60; i > 0; i--) {
				setTimeout(() => {
					deg = i / 100;
				}, i * 100);
			}
		}
	}, 5001);

	let clock = new THREE.Clock();
	let [ix, iy, iz] = position;
	let n = 1000;
	useFrame(({ camera }) => {
		if (activeObj != src && opacity >= 0 && activeObj != "none") {
			setOpacity((prev) => Math.max(prev - 0.2, 0));
			if (opacity == 0) {
				setRemoved(true);
			}
		}

		if (activeObj == src && opacity <= 1) {
			setRemoved(false);
			setOpacity((prev) => Math.min(prev + 0.1, 1));
		}
		if (opacity <= 1 && activeObj == "none") {
			setRemoved(false);
			setOpacity((prev) => Math.min(prev + 0.1, 1));
		}
		if (rotateObj) {
			if (group.current) group.current.rotateY(MathUtils.degToRad(deg));
		}
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh && child.material) {
				child.material.transparent = true;
				child.material.opacity = opacity;
			}
		});

		x = Math.floor(x * n) / n;
		y = Math.floor(y * n) / n;
		z = Math.floor(z * n) / n;

		const targetX = active ? ix : 0;
		const targetY = active ? iy : -3;
		const targetZ = active ? iz : 0;

		const xSpeed = (targetX - x) / 10;
		const ySpeed = (targetY - y) / 10;
		const zSpeed = (targetZ - z) / 10;

		if (Math.abs(targetX - x) > Math.abs(xSpeed)) {
			setX(x + xSpeed);
		} else {
			setX(targetX);
		}

		if (Math.abs(targetY - y) > Math.abs(ySpeed)) {
			setY(y + ySpeed);
		} else {
			setY(targetY);
		}

		if (Math.abs(targetZ - z) > Math.abs(zSpeed)) {
			setZ(z + zSpeed);
		} else {
			setZ(targetZ);
		}
	});

	let [x, setX] = useState(0);
	let [y, setY] = useState(-3);
	let [z, setZ] = useState(0);
	if (removed) {
		return null;
	}
	return (
		<mesh
			position={new Vector3(x, y, z)}
			ref={meshRef}
			scale={1}
			onClick={(event) => {
				setActive(false);
				setActiveObj(src);
				event.stopPropagation();
			}}
			onPointerOver={(event) => {
				event.stopPropagation();
				setRotateObj(false);
				setHover(true);
			}}
			onPointerOut={(event) => {
				event.stopPropagation();
				setRotateObj(true);
				setHover(false);
			}}
		>
			<primitive object={scene} /> <Controls activeObj={activeObj} />
		</mesh>
	);
}

export default function Scene({ active, setActive, setActiveObj, activeObj }: Scene) {
	let [rotateObj, setRotateObj] = useState(true);
	const group = useRef<Group>(null);

	return (
		<div>
			<Canvas className={activeObj != "none" ? "active c-div" : "c-div"}>
				<ambientLight intensity={Math.PI / 2} />
				<spotLight position={[100, 100, 100]} angle={15} penumbra={1} decay={0} intensity={10} />
				<spotLight position={[-100, 100, -100]} angle={15} penumbra={1} decay={0} intensity={10} />
				<pointLight position={[10, 10, -10]} decay={0} intensity={Math.PI} />
				<group ref={group}>
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/boxEngine.glb" position={[0, -9, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/karter.glb" position={[0, -3, -5]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/top.glb" position={[0, 3, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/cilin.glb" position={[0, 2.5, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/karter2.glb" position={[0, -3, 5]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/porsh.glb" position={[0, 0, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/pal.glb" position={[0, 0, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/karb.glb" position={[-1, -3, 0]} />
					<Obj active={active} isMetal={false} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/vozd.glb" position={[-1, -3, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/shatun.glb" position={[0, 0, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/vipusk.glb" position={[2, -9, 0]} />
					<Obj
						active={active}
						isMetal={false}
						setActive={setActive}
						activeObj={activeObj}
						setActiveObj={setActiveObj}
						group={group}
						rotateObj={rotateObj}
						setRotateObj={setRotateObj}
						src="/zaziganie.glb"
						position={[0, -1.5, -3.5]}
					/>
					<Obj active={active} isMetal={false} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/remen.glb" position={[0, -1.5, -2]} />
					<Obj active={active} isMetal={false} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/svecha.glb" position={[0, 4, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/zaschita.glb" position={[4, -3, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/krep.glb" position={[4, -3, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/vihod.glb" position={[0, -1.5, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/mehanizm.glb" position={[0, -1.5, 0]} />
					<Obj active={active} isMetal={true} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} group={group} rotateObj={rotateObj} setRotateObj={setRotateObj} src="/ship.glb" position={[0, -1.5, 0]} />
				</group>
			</Canvas>
		</div>
	);
}
