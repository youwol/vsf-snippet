import { TopBannerView as TopBannerBaseView } from '@youwol/os-top-banner'
import { AppState, Mode } from '../app.state'

/**
 * @category View
 */
export class TopBannerView extends TopBannerBaseView {
    constructor(params: { state: AppState }) {
        const btnClass = (target: Mode) => ({
            source$: params.state.mode$,
            vdomMap: (mode: Mode): string => {
                return mode == target
                    ? 'fv-text-focus fv-border-bottom-focus'
                    : ''
            },
            wrapper: (d) =>
                `${d}  mx-2 p-1 rounded fv-pointer fv-hover-bg-secondary`,
        })

        super({
            innerView: {
                tag: 'div',
                class: 'd-flex w-100 justify-content-center my-auto align-items-center',
                children: [
                    {
                        tag: 'div',
                        class: btnClass('view'),
                        innerText: 'View',
                        onclick: () => params.state.mode$.next('view'),
                    },
                    {
                        tag: 'div',
                        class: btnClass('dag'),
                        innerText: 'DAG',
                        onclick: () => params.state.mode$.next('dag'),
                    },
                    {
                        tag: 'div',
                        class: btnClass('code'),
                        innerText: 'Code',
                        onclick: () => params.state.mode$.next('code'),
                    },
                    { tag: 'div', class: 'mx-3' },
                    {
                        tag: 'div',
                        class: 'fas fa-sync-alt fv-pointer fv-hover-bg-secondary p-1 rounded',
                        onclick: () => params.state.execute(),
                    },
                ],
            },
        })
    }
}
