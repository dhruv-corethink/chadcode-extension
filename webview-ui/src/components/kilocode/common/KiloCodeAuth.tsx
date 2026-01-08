import React from "react"
import { ButtonPrimary } from "./ButtonPrimary"
import Logo from "./Logo"

interface KiloCodeAuthProps {
	onManualConfigClick?: () => void
	onLoginClick?: () => void
	className?: string
}

/**
 * CoreThink Extension - API Key Authentication Only
 *
 * This component shows a message directing users to enter their API key.
 * No OAuth or device auth flow - just API key authentication.
 */
const KiloCodeAuth: React.FC<KiloCodeAuthProps> = ({ className = "" }) => {
	const handleGoToSettings = () => {
		window.postMessage({
			type: "action",
			action: "settingsButtonClicked",
		}, "*")
	}

	return (
		<div className={`flex flex-col items-center ${className}`}>
			<Logo />

			<h2 className="m-0 p-0 mb-4">Welcome to CoreThink!</h2>
			<p className="text-center mb-2">CoreThink uses API key authentication.</p>
			<p className="text-center mb-5">
				Enter your API key in the settings to get started.
				<br />
				API keys start with <code className="bg-vscode-textBlockQuote-background px-1 rounded">sk_</code>
			</p>

			<div className="w-full flex flex-col gap-5">
				<ButtonPrimary onClick={handleGoToSettings}>Go to Settings</ButtonPrimary>
			</div>
		</div>
	)
}

export default KiloCodeAuth
