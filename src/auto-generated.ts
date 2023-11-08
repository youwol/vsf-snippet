
const runTimeDependencies = {
    "externals": {
        "@youwol/vsf-core": "^0.2.1",
        "@youwol/vsf-canvas": "^0.2.1",
        "rxjs": "^6.5.5",
        "@youwol/flux-view": "^1.1.0",
        "@youwol/cdn-client": "^2.0.6",
        "@youwol/fv-code-mirror-editors": "^0.3.1",
        "@youwol/os-top-banner": "^0.1.1"
    },
    "includedInBundle": {}
}
const externals = {
    "@youwol/vsf-core": "window['@youwol/vsf-core_APIv02']",
    "@youwol/vsf-canvas": "window['@youwol/vsf-canvas_APIv02']",
    "rxjs": "window['rxjs_APIv6']",
    "@youwol/flux-view": "window['@youwol/flux-view_APIv1']",
    "@youwol/cdn-client": "window['@youwol/cdn-client_APIv2']",
    "@youwol/fv-code-mirror-editors": "window['@youwol/fv-code-mirror-editors_APIv03']",
    "@youwol/os-top-banner": "window['@youwol/os-top-banner_APIv01']",
    "rxjs/operators": "window['rxjs_APIv6']['operators']"
}
const exportedSymbols = {
    "@youwol/vsf-core": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/vsf-core"
    },
    "@youwol/vsf-canvas": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/vsf-canvas"
    },
    "rxjs": {
        "apiKey": "6",
        "exportedSymbol": "rxjs"
    },
    "@youwol/flux-view": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/flux-view"
    },
    "@youwol/cdn-client": {
        "apiKey": "2",
        "exportedSymbol": "@youwol/cdn-client"
    },
    "@youwol/fv-code-mirror-editors": {
        "apiKey": "03",
        "exportedSymbol": "@youwol/fv-code-mirror-editors"
    },
    "@youwol/os-top-banner": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/os-top-banner"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./index.ts",
    "loadDependencies": [
        "@youwol/vsf-core",
        "@youwol/vsf-canvas",
        "rxjs",
        "@youwol/flux-view",
        "@youwol/cdn-client",
        "@youwol/fv-code-mirror-editors",
        "@youwol/os-top-banner"
    ]
}

const secondaryEntries : {[k:string]:{entryFile: string, name: string, loadDependencies:string[]}}= {}

const entries = {
     '@youwol/vsf-snippet': './index.ts',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/vsf-snippet/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/vsf-snippet',
        assetId:'QHlvdXdvbC92c2Ytc25pcHBldA==',
    version:'0.1.2-wip',
    shortDescription:"Simple Visual Studio Flow project editor.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/vsf-snippet&tab=doc',
    npmPackage:'https://www.npmjs.com/package/@youwol/vsf-snippet',
    sourceGithub:'https://github.com/youwol/vsf-snippet',
    userGuide:'https://l.youwol.com/doc/@youwol/vsf-snippet',
    apiVersion:'01',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/vsf-snippet_APIv01`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/vsf-snippet#0.1.2-wip~dist/@youwol/vsf-snippet/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/vsf-snippet/${entry.name}_APIv01`]
        })
    },
    getCdnDependencies(name?: string){
        if(name && !secondaryEntries[name]){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const deps = name ? secondaryEntries[name].loadDependencies : mainEntry.loadDependencies

        return deps.map( d => `${d}#${runTimeDependencies.externals[d]}`)
    }
}
