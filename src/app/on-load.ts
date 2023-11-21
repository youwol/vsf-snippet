import { AppState } from './app.state'
import { AppView } from './app.view'
import { render } from '@youwol/rx-vdom'

const encoded = new URLSearchParams(window.location.search).get('content')
const vDOM = new AppView({
    state: new AppState({ originalSrc: decodeURI(encoded) }),
})
document.body.appendChild(render(vDOM))

export {}
