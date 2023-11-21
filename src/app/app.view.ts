import { VirtualDOM, ChildrenLike } from '@youwol/rx-vdom'
import { AppState, Mode } from './app.state'
import { TopBannerView } from './top-banner'
import { Common } from '@youwol/rx-code-mirror-editors'
import { Renderer3DView } from '@youwol/vsf-canvas'
import { filter } from 'rxjs/operators'
import { Immutable, Projects } from '@youwol/vsf-core'

/**
 * @category View
 */
export class CanvasView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'

    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'h-100 w-100'
    /**
     * @group States
     */
    public readonly state: AppState
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    /**
     * @group Immutable DOM Constants
     */
    connectedCallback: () => void

    constructor(params: { state: AppState }) {
        Object.assign(this, params)
        const renderer3d = new Renderer3DView({
            project$: this.state.project$.pipe(filter((p) => p != undefined)),
            workflowId: 'main',
            state: this.state,
        })
        this.children = [renderer3d]
        this.connectedCallback = () => {
            this.state.execute()
        }
    }
}
/**
 * @category View
 */
export class View implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'w-100 h-100'
    /**
     * @group States
     */
    public readonly state: AppState
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    /**
     * @group Immutable DOM Constants
     */
    connectedCallback: () => void

    constructor(params: { state: AppState }) {
        Object.assign(this, params)
        this.children = [
            {
                source$: this.state.project$.pipe(
                    filter(
                        (project) => Object.values(project.views).length > 0,
                    ),
                ),
                vdomMap: (project: Immutable<Projects.ProjectState>) => {
                    return Object.values(project.views)[0](project.instancePool)
                },
            },
        ]

        this.connectedCallback = () => {
            this.state.execute()
        }
    }
}
/**
 * @category View
 */
export class CodeView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'h-100 w-100 d-flex flex-column'
    /**
     * @group States
     */
    public readonly state: AppState
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor(params: { state: AppState }) {
        Object.assign(this, params)
        const ideView = new Common.CodeEditorView({
            ideState: this.state.ideState,
            path: './main',
            language: 'javascript',
        })
        this.children = [
            {
                tag: 'div',
                class: 'w-100 flex-grow-1',
                style: {
                    minHeight: '0px',
                },
                children: [ideView],
            },
            {
                source$: this.state.ideState.updates$['./main'],
                vdomMap: (file: { content: string }) => {
                    const url = `/applications/@youwol/vsf-snippet/latest?content=${encodeURIComponent(
                        file.content,
                    )}`

                    return {
                        tag: 'div',
                        class: 'd-flex p-3',
                        children: [
                            {
                                tag: 'div',
                                innerText:
                                    'Application URL can be copied from ',
                            },
                            { tag: 'div', class: 'mx-1' },
                            {
                                tag: 'a',
                                href: url,
                                innerText: 'here',
                            },
                        ],
                    }
                },
            },
        ]
    }
}

/**
 * @category View
 * @category Entry Point
 */
export class AppView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'vh-100 w-100 d-flex flex-column fv-text-primary fv-bg-background'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
    /**
     * @group States
     */
    public readonly state: AppState

    constructor(params: { state: AppState }) {
        Object.assign(this, params)
        this.children = [
            new TopBannerView({ state: this.state }),
            {
                tag: 'div',
                class: 'flex-grow-1 w-100 overflow-hidden',
                style: {
                    minHeight: '0px',
                },
                children: [
                    {
                        source$: this.state.mode$,
                        vdomMap: (mode: Mode) => {
                            if (mode == 'view') {
                                return new View({ state: this.state })
                            }
                            if (mode == 'dag') {
                                return new CanvasView({ state: this.state })
                            }
                            return new CodeView({ state: this.state })
                        },
                    },
                ],
            },
        ]
    }
}
