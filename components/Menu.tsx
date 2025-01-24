import Image from "next/image";
import React, { useState } from "react";
import cross from "/public/cross.png";
import info from "../utils/info";
interface Menu {
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	activeObj: string;
	setActiveObj: React.Dispatch<React.SetStateAction<string>>;
}

export default function Menu({ active, setActive, setActiveObj, activeObj }: Menu) {
	let title = "";
	let description = "";
	function handleClick() {
		setActive(!active);
	}
	if (
		(activeObj in info && activeObj == "/top.glb") ||
		activeObj == "/karter.glb" ||
		activeObj == "/boxEngine.glb" ||
		activeObj == "/cilin.glb" ||
		activeObj == "/karter2.glb" ||
		activeObj == "/porsh.glb" ||
		activeObj == "/pal.glb" ||
		activeObj == "/karb.glb" ||
		activeObj == "/vozd.glb" ||
		activeObj == "/shatun.glb" ||
		activeObj == "/zaziganie.glb" ||
		activeObj == "/remen.glb" ||
		activeObj == "/svecha.glb" ||
		activeObj == "/zaschita.glb" ||
		activeObj == "/krep.glb" ||
		activeObj == "/vihod.glb" ||
		activeObj == "/mehanizm.glb" ||
		activeObj == "/ship.glb" ||
		activeObj == "/vipusk.glb"
	) {
		title = info[activeObj].title;
		description = info[activeObj].description;
	}

	return (
		<div className={activeObj != "none" ? "active menu" : "menu"}>
			{/* <button onClick={handleClick}>click</button> */}
			<button
				onClick={() => {
					setActiveObj("none");
					setActive(true);
				}}
			>
				<Image className="cross" src={cross} width={70} height={70} alt="cross"></Image>
				<h1>{title}</h1>
				<p>{description}</p>
			</button>
		</div>
	);
}
