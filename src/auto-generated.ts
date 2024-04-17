
const runTimeDependencies = {
    "externals": {
        "@youwol/vsf-core": "^0.3.1",
        "@youwol/vsf-canvas": "^0.3.0",
        "rxjs": "^7.5.6",
        "@youwol/rx-vdom": "^1.0.1",
        "@youwol/webpm-client": "^3.0.0",
        "@youwol/rx-code-mirror-editors": "^0.5.0",
        "@youwol/os-top-banner": "^0.2.0"
    },
    "includedInBundle": {}
}
const externals = {
    "@youwol/vsf-core": "window['@youwol/vsf-core_APIv03']",
    "@youwol/vsf-canvas": "window['@youwol/vsf-canvas_APIv03']",
    "rxjs": "window['rxjs_APIv7']",
    "@youwol/rx-vdom": "window['@youwol/rx-vdom_APIv1']",
    "@youwol/webpm-client": "window['@youwol/webpm-client_APIv3']",
    "@youwol/rx-code-mirror-editors": "window['@youwol/rx-code-mirror-editors_APIv05']",
    "@youwol/os-top-banner": "window['@youwol/os-top-banner_APIv02']",
    "rxjs/operators": "window['rxjs_APIv7']['operators']"
}
const exportedSymbols = {
    "@youwol/vsf-core": {
        "apiKey": "03",
        "exportedSymbol": "@youwol/vsf-core"
    },
    "@youwol/vsf-canvas": {
        "apiKey": "03",
        "exportedSymbol": "@youwol/vsf-canvas"
    },
    "rxjs": {
        "apiKey": "7",
        "exportedSymbol": "rxjs"
    },
    "@youwol/rx-vdom": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/rx-vdom"
    },
    "@youwol/webpm-client": {
        "apiKey": "3",
        "exportedSymbol": "@youwol/webpm-client"
    },
    "@youwol/rx-code-mirror-editors": {
        "apiKey": "05",
        "exportedSymbol": "@youwol/rx-code-mirror-editors"
    },
    "@youwol/os-top-banner": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/os-top-banner"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./index.ts",
    "loadDependencies": [
        "@youwol/vsf-core",
        "@youwol/vsf-canvas",
        "rxjs",
        "@youwol/rx-vdom",
        "@youwol/webpm-client",
        "@youwol/rx-code-mirror-editors",
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
    version:'0.3.1-wip',
    shortDescription:"Simple Visual Studio Flow project editor.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/vsf-snippet&tab=doc',
    npmPackage:'https://www.npmjs.com/package/@youwol/vsf-snippet',
    sourceGithub:'https://github.com/youwol/vsf-snippet',
    userGuide:'https://l.youwol.com/doc/@youwol/vsf-snippet',
    apiVersion:'03',
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
            return window[`@youwol/vsf-snippet_APIv03`]
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
            `@youwol/vsf-snippet#0.3.1-wip~dist/@youwol/vsf-snippet/${entry.name}.js`
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
            return window[`@youwol/vsf-snippet/${entry.name}_APIv03`]
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
