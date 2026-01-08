import { JETBRAIN_PRODUCTS, ChadCodeWrapperProperties } from "../../../../src/shared/kilocode/wrapper"
import { getAppUrl } from "@roo-code/types"

const getJetbrainsUrlScheme = (code: string) => {
	return JETBRAIN_PRODUCTS[code as keyof typeof JETBRAIN_PRODUCTS]?.urlScheme || "jetbrains"
}

const getChadCodeSource = (uriScheme: string = "vscode", kiloCodeWrapperProperties?: ChadCodeWrapperProperties) => {
	if (
		!kiloCodeWrapperProperties?.kiloCodeWrapped ||
		!kiloCodeWrapperProperties.kiloCodeWrapper ||
		!kiloCodeWrapperProperties.kiloCodeWrapperCode
	) {
		return uriScheme
	}

	return `${getJetbrainsUrlScheme(kiloCodeWrapperProperties.kiloCodeWrapperCode)}`
}

export function getChadCodeBackendSignInUrl(
	uriScheme: string = "vscode",
	uiKind: string = "Desktop",
	kiloCodeWrapperProperties?: ChadCodeWrapperProperties,
) {
	const source = uiKind === "Web" ? "web" : getChadCodeSource(uriScheme, kiloCodeWrapperProperties)
	return getAppUrl(`/sign-in-to-editor?source=${source}`)
}

export function getChadCodeBackendSignUpUrl(
	uriScheme: string = "vscode",
	uiKind: string = "Desktop",
	kiloCodeWrapperProperties?: ChadCodeWrapperProperties,
) {
	const source = uiKind === "Web" ? "web" : getChadCodeSource(uriScheme, kiloCodeWrapperProperties)
	return getAppUrl(`/users/sign_up?source=${source}`)
}
