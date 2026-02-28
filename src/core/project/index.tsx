// CreateAndDeploy/index.tsx
import { useState } from "react"
import ServiceSelector, { type ServiceType } from "./Services"
import OverviewCard from "./Overview"
import RepositorySection from "./Repository"
import ConfigSection from "./Config"
import EnvVarsSection from "./Env"
import PricingSection from "./Pricing"
import DeployActions from "./Deploy"
import { useLocation } from "react-router-dom"
import type { Project } from "../Dashboard"

export default function CreateAndDeploy() {
    const [selectedService, setSelectedService] = useState<ServiceType>("not_selected")
    const [selectedRepo, setSelectedRepo] = useState<string | undefined>()
    const [gitUrl, setGitUrl] = useState("")
    const [appName, setAppName] = useState("")
    const [envVars, setEnvVars] = useState([{ key: "", value: "" }])
    const [instances, setInstances] = useState(1)
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const location = useLocation()
    const state = location.state as Project

    const [region, setRegion] = useState("asia-south1")
    const [runtime, setRuntime] = useState("nodejs")
    const [buildCommand, setBuildCommand] = useState("")
    const [startCommand, setStartCommand] = useState("")
    const [outputDir, setOutputDir] = useState("")

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
            <ServiceSelector
                selectedService={selectedService}
                setSelectedService={setSelectedService}
            />

            <OverviewCard
                projectName={state.name}
                selectedService={selectedService}
                selectedRepo={selectedRepo || ""}
                onReset={() => {
                    setSelectedService("not_selected")
                    setSelectedRepo(undefined)
                    setGitUrl("")
                }}
            />

            {(selectedService === 'redis') && (
                <>
                    <PricingSection
                        serviceType={selectedService}
                        instances={instances}
                        setInstances={setInstances}
                        selectedPlan={selectedPlan || ""}
                        setSelectedPlan={setSelectedPlan}

                    />
                </>
            )}

            {(selectedService === 'object_storage') && (
                <>
                    <PricingSection
                        serviceType={selectedService}
                        instances={instances}
                        setInstances={setInstances}
                        selectedPlan={selectedPlan || ""}
                        setSelectedPlan={setSelectedPlan}

                    />
                </>
            )}

            {(selectedService === 'web_service') && (
                <>
                    <RepositorySection
                        gitUrl={gitUrl}
                        setGitUrl={setGitUrl}
                        selectedRepo={selectedRepo}
                        setSelectedRepo={setSelectedRepo}
                    />

                    <ConfigSection
                        appName={state.name}
                        setAppName={setAppName}
                        region={region}
                        setRegion={setRegion}
                        runtime={runtime}
                        setRuntime={setRuntime}
                        buildCommand={buildCommand}
                        setBuildCommand={setBuildCommand}
                        startCommand={startCommand}
                        setStartCommand={setStartCommand}
                        outputDir={outputDir}
                        setOutputDir={setOutputDir}
                    />


                    <EnvVarsSection
                        envVars={envVars}
                        setEnvVars={setEnvVars}
                    />

                    <PricingSection
                        serviceType={selectedService}
                        instances={instances}
                        setInstances={setInstances}
                        selectedPlan={selectedPlan || ""}
                        setSelectedPlan={setSelectedPlan}
                    />

                    <DeployActions
                        selectedService={selectedService}
                        selectedRepo={selectedRepo}
                        appName={appName}
                        selectedPlan={selectedPlan}
                    />
                </>
            )}


            {(selectedService === 'static') && (
                <>
                    <RepositorySection
                        gitUrl={gitUrl}
                        setGitUrl={setGitUrl}
                        selectedRepo={selectedRepo}
                        setSelectedRepo={setSelectedRepo}
                    />

                    <ConfigSection
                        appName={state.name}
                        setAppName={setAppName}
                        region={region}
                        setRegion={setRegion}
                        runtime={runtime}
                        setRuntime={setRuntime}
                        buildCommand={buildCommand}
                        setBuildCommand={setBuildCommand}
                        startCommand={startCommand}
                        setStartCommand={setStartCommand}
                        outputDir={outputDir}
                        setOutputDir={setOutputDir}
                    />


                    <EnvVarsSection
                        envVars={envVars}
                        setEnvVars={setEnvVars}
                    />

                    <PricingSection
                        serviceType={selectedService}
                        instances={instances}
                        setInstances={setInstances}
                        selectedPlan={selectedPlan || ""}
                        setSelectedPlan={setSelectedPlan}
                    />

                    <DeployActions
                        selectedService={selectedService}
                        selectedRepo={selectedRepo}
                        appName={appName}
                        selectedPlan={selectedPlan}
                    />
                </>
            )}
        </div>
    )
}
