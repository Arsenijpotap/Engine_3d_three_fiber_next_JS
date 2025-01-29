"use client";
import React, { useEffect, useState } from "react";
import Scene from "./Scene";
import Menu from "./Menu";

export default function Main() {
	let canvas;
	let [active, setActive] = useState(false);
	const [activeObj, setActiveObj] = useState("none"); // Состояние скрытия
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "e" || event.key === "E" || event.key === "у" || event.key === "У") {
				setActive((act) => !act);
			}
			if (event.key === "Escape") {
				setActiveObj("none");
				setActive(true);
			}
		};

		// Добавляем слушатель
		window.addEventListener("keydown", handleKeyDown);

		// Убираем слушатель при размонтировании
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
	return (
		<div className="main">
			<Scene active={active} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj} />
			<Menu active={active} setActive={setActive} activeObj={activeObj} setActiveObj={setActiveObj}></Menu>
		</div>
	);
}
