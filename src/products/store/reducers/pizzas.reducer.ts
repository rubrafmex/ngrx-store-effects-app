// code from src/products/store/reducers/index.ts in ngrx-store-effects-app ‹05-entities*›

import * as fromPizzas from '../actions/pizzas.action';
import { Pizza } from '../../models/pizza.model';

export interface PizzaState {

  // >>>>>>>>>>>>>>>>>>>> Ruben comments:
  //
  // To optimize we use entities instead of arrays,
  // so we pass from [{ id:1, name:'Pizza1' }, {id:2, name:'Pizza2'}]
  // to something like:
  // const pizza: any = {
  //   1: {
  //     id: 1,
  //     name: 'Pizza1',
  //     toppings: []
  //   }
  // }
  // then we can look up the pizza we need really quickly like:
  // const id = 1
  // pizza[id]
  // >>>>>>>>>>>>>>>>>>>>

  entities: { [id: number]: Pizza };
  loaded: boolean;
  loading: boolean;
}

export const initialState: PizzaState = {
  entities: {},
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromPizzas.PizzasAction
): PizzaState {
  switch (action.type) {
    case fromPizzas.LOAD_PIZZAS: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromPizzas.LOAD_PIZZAS_SUCCESS: {
      const pizzas = action.payload;

      // >>>>>>>>>>>>>>>>>>>> Ruben comments:
      // We take an array and we flat the array into just pure objects, so we can look them up faster
      // >>>>>>>>>>>>>>>>>>>>

      const entities = pizzas.reduce(
        (entities: { [id: number]: Pizza }, pizza: Pizza) => {
          return {
            ...entities,
            [pizza.id]: pizza,
          };
        },
        {
          ...state.entities,
        }
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        entities,
      };
    }

    case fromPizzas.LOAD_PIZZAS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }
  }

  return state;
}

export const getPizzasEntities = (state: PizzaState) => state.entities;
export const getPizzasLoading = (state: PizzaState) => state.loading;
export const getPizzasLoaded = (state: PizzaState) => state.loaded;
