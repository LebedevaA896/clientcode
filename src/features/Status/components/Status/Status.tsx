import { useEffect, useState } from "react";

import { clientStatusGet } from "../../Status.client";
import styles from "./Status.module.scss";
/* создание состояние ok, которое хранит информацию о том, доступен ли сервер
(true — сервер работает, false — сервер недоступен).*/
const Status = () => {
	const [ok, setOk] = useState(false);

	const getStatus = async () => { // запрос статуса сервера
		try {
			const response = await clientStatusGet();
			if (response?.status === "ok") {
				setOk(true);
				return;
			}
			setOk(false);
		} catch (error) {
			setOk(false);
		}
	};

	useEffect(() => {
		getStatus();

		const interval = setInterval(async () => {
			getStatus(); // обновление статуса в реальном времени
		}, 5000); 

		return () => {
			clearInterval(interval); // прекращение обновления статуса
		};
	}, []);

	return (
		<div className={styles.status}>
			<p>Server status: </p>
			<div
				className={`${styles.circle} ${ok ? styles.online : styles.offline}`}
			/>
		</div>
	);
};

export { Status };
