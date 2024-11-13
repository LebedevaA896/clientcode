import { Decrypt } from "features/Decrypt";
import { Encrypt } from "features/Encrypt";
import { Layout } from "features/Layout";
import { Status } from "features/Status";
import { Toast } from "features/Toast";

const App = () => {
	return (
		<Layout>
			<Status />
			<Encrypt />
			<Decrypt />
			<Toast />
		</Layout>
	);
};

export { App };
