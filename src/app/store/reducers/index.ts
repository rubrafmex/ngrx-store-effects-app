// code from src/app/store/reducers/index.ts in ngrx-store-effects-app ‹07-custom-router-serializer*›

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params,
} from '@angular/router';
import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface State {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  routerReducer: fromRouter.routerReducer,
};

export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('routerReducer');

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    // >>>>>>>>>>>>>>>>>>>> Ruben comments:
    // By doing const { url } = routerState;, we destructure the url from the routerState itself
    // which is the equivalent as if we do: const url = routerState.url
    // is the same, we just use a cleaner syntax
    // >>>>>>>>>>>>>>>>>>>>
    const { url } = routerState;
    const { queryParams } = routerState.root;

    // >>>>>>>>>>>>>>>>>>>> Ruben comments:
    // Router is a state tree of itself, so we need to traverse the state tree
    // let state: ActivatedRouteSnapshot = routerState.root;
    // while (state.firstChild) {
    //   state = state.firstChild;
    // }
    //
    // Here we iterate through the router state tree by itself.
    // IMPORTANT:
    // This is not the state tree of NGRX, but the state tree of Angular's router and
    // we are just taking few properties from it and binding that to our NGRX store
    // so we loop and when we get to the latest child, we get the state
    // >>>>>>>>>>>>>>>>>>>>
    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    // >>>>>>>>>>>>>>>>>>>> Ruben comments:
    // Once we collected all we need,
    // we return this as a brand new object
    // and this is the object (IMPORTANT)
    // that will be bound to our state tree.
    //
    // The NGRX router store project, which is part of NGRX project, will
    // actually listen to angular routing events
    // This means, anytime you navigate somewhere, or angular navigates somewhere,
    // or something changes in the url this whole function is going to be called
    // which means that we will get the state representation of where we are in the
    // application at all times.
    // >>>>>>>>>>>>>>>>>>>>
    return { url, queryParams, params };
  }
}
