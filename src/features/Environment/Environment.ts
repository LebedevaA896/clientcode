export enum EnvironmentTypes {
	Production = "production",
	Development = "development",
}

export const environmentVersion = APP_VERSION;
export const environmentEnv = MODE as EnvironmentTypes;

export const isProd = () => environmentEnv === EnvironmentTypes.Production;

export const API_BASE_ENV = {
	[EnvironmentTypes.Production]:
		"https://vault-production-4286.up.railway.app",
	[EnvironmentTypes.Development]: "http://192.168.0.111:65001",
};

export const API_BASE_URL = API_BASE_ENV[environmentEnv];
