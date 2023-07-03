import { BehaviorSubject } from 'rxjs'
import {
    Projects,
    Modules,
    Attributes,
    Immutable,
    Immutables,
} from '@youwol/vsf-core'

import { Common } from '@youwol/fv-code-mirror-editors'
import { StateTrait, Selectable } from '@youwol/vsf-canvas'
import { VirtualDOM } from '@youwol/flux-view'

export type Mode = 'dag' | 'code' | 'view'
/**
 * @category State
 * @category Entry Point
 */
export class AppState implements StateTrait {
    /**
     * @group Immutable Constants
     */
    public readonly originalSrc: string

    /**
     * @group Observable
     */
    public readonly mode$: BehaviorSubject<Mode>

    /**
     * @group Observable
     */
    public readonly project$: BehaviorSubject<Immutable<Projects.ProjectState>>

    /**
     * @group States
     */
    public readonly ideState: Common.IdeState

    public readonly emptyProject: Immutable<Projects.ProjectState>

    constructor(params: { originalSrc: string }) {
        Object.assign(this, params)
        const mode = new URLSearchParams(window.location.search).get('tab')
        this.mode$ = new BehaviorSubject<Mode>((mode as Mode) || 'view')
        this.ideState = new Common.IdeState({
            files: [
                {
                    path: './main',
                    content: params.originalSrc,
                },
            ],
            defaultFileSystem: Promise.resolve(new Map<string, string>()),
        })

        this.emptyProject = new Projects.ProjectState()
        this.project$ = new BehaviorSubject<Projects.ProjectState>(
            this.emptyProject,
        )
    }

    execute() {
        const cell = new Projects.JsCell({
            source: new Attributes.JsCode<Projects.CellFunction>({
                value: this.ideState.updates$['./main'].value.content,
            }),
            viewsFactory: this.emptyProject.environment.viewsFactory,
        })

        this.project$.value.dispose()
        const batch = new Projects.BatchCells({
            cells: [cell],
            projectsStore$: new BehaviorSubject(new Map()),
        })
        return batch.execute(this.emptyProject).then((project) => {
            this.project$.next(project)
        })
    }

    /**
     * Below are implementation of `StateTrait` from `@youwol/vsf-canvas`
     */

    displayModuleView(
        _module: Immutable<Modules.ImplementationTrait & { html: VirtualDOM }>,
    ) {
        /* no implementation for now*/
    }

    displayModuleJournal(_module: Immutable<Modules.ImplementationTrait>) {
        /* no implementation for now*/
    }

    displayModuleDocumentation(
        _module: Immutable<Modules.ImplementationTrait>,
    ) {
        /* no implementation for now*/
    }

    select(_entities: Immutables<Selectable>) {
        /* no implementation for now*/
    }
}
