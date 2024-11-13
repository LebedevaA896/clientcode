import { useEffect, useState } from "react";

import { clientStatusGet } from "../../Status.client";
import styles from "./Status.module.scss";

const Status = () => {
	const [ok, setOk] = useState(false);

	const getStatus = async () => {
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
			getStatus();
		}, 5000);

		return () => {
			clearInterval(interval);
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
