import { OrbitControls } from "@react-three/drei";
import { extend, useThree } from "@react-three/fiber";
import { getDistanceAttenuation } from "three/examples/jsm/nodes/Nodes.js";

extend({ OrbitControls });
interface OrbitControls {
	activeObj: string;
}
function Controls({ activeObj }: OrbitControls) {
	const { camera, gl } = useThree();

	return (
		<OrbitControls
			attach="orbitControls"
			args={[camera, gl.domElement]}
			minDistance={5} // Минимальное расстояние от камеры до объекта
			maxDistance={30} // Максимальное расстояние от камеры до объекта
			rotateSpeed={activeObj != "none" ? 2 : 0.2} // Скорость вращения (уменьшите значение для меньшей чувствительности)
			zoomSpeed={activeObj != "none" ? 2 : 0.2} // Скорость масштабирования
			panSpeed={activeObj != "none" ? 2 : 0.3} // Скорость панорамирования
		/>
	);
}

export default Controls;
