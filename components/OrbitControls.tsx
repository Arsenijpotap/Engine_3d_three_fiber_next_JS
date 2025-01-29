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
		<OrbitControls attach="orbitControls" args={[camera, gl.domElement]} minDistance={5} maxDistance={30} rotateSpeed={activeObj != "none" ? 2 : 0.2} zoomSpeed={activeObj != "none" ? 2 : 0.2} panSpeed={activeObj != "none" ? 2 : 0.3} />
	);
}

export default Controls;
