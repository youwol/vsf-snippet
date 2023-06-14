import { TopBannerView as TopBannerBaseView } from '@youwol/os-top-banner'
import { AppState, Mode } from '../app.state'
import { attr$ } from '@youwol/flux-view'

/**
 * @category View
 */
export class TopBannerView extends TopBannerBaseView {
    constructor(params: { state: AppState }) {
        const btnClass = (target: Mode) =>
            attr$(
                params.state.mode$,
                (mode): string => {
                    return mode == target
                        ? 'fv-text-focus fv-border-bottom-focus'
                        : ''
                },
                {
                    wrapper: (d) =>
                        `${d}  mx-2 p-1 rounded fv-pointer fv-hover-bg-secondary`,
                },
            )

        super({
            innerView: {
                class: 'd-flex w-100 justify-content-center my-auto align-items-center',
                children: [
                    {
                        class: btnClass('view'),
                        innerText: 'View',
                        onclick: () => params.state.mode$.next('view'),
                    },
                    {
                        class: btnClass('dag'),
                        innerText: 'DAG',
                        onclick: () => params.state.mode$.next('dag'),
                    },
                    {
                        class: btnClass('code'),
                        innerText: 'Code',
                        onclick: () => params.state.mode$.next('code'),
                    },
                    { class: 'mx-3' },
                    {
                        class: 'fas fa-sync-alt fv-pointer fv-hover-bg-secondary p-1 rounded',
                        onclick: () => params.state.execute(),
                    },
                ],
            },
        })
    }
}
