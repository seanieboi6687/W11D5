import { LOAD_ITEMS, REMOVE_ITEM, ADD_ITEM } from "./items";

const LOAD = "pokemon/LOAD";
const LOAD_TYPES = "pokemon/LOAD_TYPES";
const ADD_ONE = "pokemon/ADD_ONE";

const load = (list) => ({
  type: LOAD,
  list,
});

const loadTypes = (types) => ({
  type: LOAD_TYPES,
  types,
});

const addOnePokemon = (pokemon) => ({
  type: ADD_ONE,
  pokemon,
});

/* ----------------THUNK CREATOR----------------*/
export const getPokemon = () => async (dispatch) => {
  const response = await fetch(`/api/pokemon`);

  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
  }
};

export const getPokeDetails = (id) => async (dispatch) => {
  const response = await fetch(`/api/pokemon/${id}`);

  if (response.ok) {
    const details = await response.json();
    dispatch(addOnePokemon(details));
  }
};

export const getPokemonTypes = () => async (dispatch) => {
  const response = await fetch(`/api/pokemon/types`);

  if (response.ok) {
    const types = await response.json();
    dispatch(loadTypes(types));
  }
};

export const createPokemon = (createdPokemon) => async (dispatch) => {
  const response = await fetch("/api/pokemon", {
    method: "POST",
    body: JSON.stringify(createdPokemon),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (response.ok) {
    const result = await response.json();
    dispatch(addOnePokemon(result));
    return result;
  } else {
    // return error
  }
};

export const editPokemon = (editedPokemonNum) => async (dispatch) => {
  const response = await fetch(`/api/pokemon/${editedPokemonNum.id}`, {
    method: "PATCH",
    body: JSON.stringify(editedPokemonNum),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (response.ok) {
    const result = await response.json();
    dispatch(addOnePokemon(result));
    return result;
  } else {
    // return error
  }
}

const initialState = {
  list: [],
  types: [],
};

const sortList = (list) => {
  return list
    .sort((pokemonA, pokemonB) => {
      return pokemonA.number - pokemonB.number;
    })
    .map((pokemon) => pokemon.id);
};

const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const allPokemon = {};
      action.list.forEach((pokemon) => {
        allPokemon[pokemon.id] = pokemon;
      });
      return {
        ...allPokemon,
        ...state,
        list: sortList(action.list),
      };
    case LOAD_TYPES:
      return {
        ...state,
        types: action.types,
      };
    case ADD_ONE:
      if (!state[action.pokemon.id]) {
        const newState = {
          ...state,
          [action.pokemon.id]: action.pokemon,
        };
        const pokemonList = newState.list.map((id) => newState[id]);
        pokemonList.push(action.pokemon);
        newState.list = sortList(pokemonList);
        return newState;
      }
      return {
        ...state,
        [action.pokemon.id]: {
          ...state[action.pokemon.id],
          ...action.pokemon,
        },
      };
    case LOAD_ITEMS:
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: action.items.map((item) => item.id),
        },
      };
    case REMOVE_ITEM:
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: state[action.pokemonId].items.filter(
            (itemId) => itemId !== action.itemId
          ),
        },
      };
    case ADD_ITEM:
      console.log(action.item);
      return {
        ...state,
        [action.item.pokemonId]: {
          ...state[action.item.pokemonId],
          items: [...state[action.item.pokemonId].items, action.item.id],
        },
      };
    default:
      return state;
  }
};

export default pokemonReducer;
