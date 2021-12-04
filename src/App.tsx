import React, {useEffect, useState} from 'react';
import {useLiveQuery} from "dexie-react-hooks";

import logo from './logo.svg';
import {db, Pokemon} from "./db";

const useEventListener = (type: string, listener: (evt: Event) => void) => {
  useEffect(() => {
    window.addEventListener(type, listener)

    return () => window.removeEventListener(type, listener)
  }, [type, listener])
}

const usePokemon = (): Pokemon[] | undefined => {
  const pokemons = useLiveQuery(() => db.pokemonTable && db.pokemonTable.toArray());

  useEffect(() => {
    const amount = 151
    if (pokemons && pokemons.length !== amount) {
      console.log("isFetching")
      fetch("https://pokeapi.co/api/v2/pokemon?limit="+amount)
          .then(async resp => {
            const data = await resp.json()
            const pokemonData: Pokemon[] = await Promise.all(data.results.map(async (pkm: {name: string, url: string}) => {
              const pkmResp = await fetch(pkm.url)
              const pkmJSON = await pkmResp.json();

              const speciesResp = await fetch(pkmJSON.species.url)
              pkmJSON.species.data = await speciesResp.json()

              return pkmJSON
            }))

            db.pokemonTable.bulkPut(pokemonData)
          })
          .catch(console.error)
      }
  }, [pokemons])

  return pokemons
}

function AppPokemon() {
  const pokemons = usePokemon();

  useEventListener("on", (e) => {})

  useEffect(() => {
    window.addEventListener("onblur", evt => {})

    return () => window.removeEventListener("onblur", evt => {})
  }, [])

  console.log(pokemons)

  return (
    <div className="App">
      <header className="App-header">
        <div className="container-fluid">
          <div className="row d-flex align-content-center justify-content-center">
            {pokemons ? pokemons.map(pokemon => {
              const flavor = pokemon.species.data.flavor_text_entries.find(entry => entry.language.name === "en")

              return (
                <div className="col-md-4 col-xl-3 mt-3" key={pokemon.id}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
                      </h5>
                      <img
                          className="card-img-top"
                          src={pokemon.sprites.front_default}
                          alt="Pokemon sprite"
                      />
                      {flavor ? (
                          <pre className="card-text text-start small">
                        {flavor.flavor_text}
                      </pre>
                      ): null}
                      <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                  </div>
                </div>
              )
            }): null}
          </div>
        </div>
      </header>
    </div>
  );
}

function AppState() {
  const [clicked, setClicked] = useState(0)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>You clicked {clicked} times</p>
        <button className="btn btn-secondary" onClick={event => {
          event.stopPropagation();
          event.preventDefault();

          setClicked(clicked - 1)
        }}>decrease
          <button className="btn btn-primary" onClick={event => {
            event.stopPropagation();
            event.preventDefault();

            setClicked(clicked + 1)
          }}>increase</button></button>
      </header>
    </div>
  );
}

function AppDefault() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

class AppClass extends React.Component<{}, {clicked: number}> {
  constructor() {
    super({});
    this.state = {
      clicked: 0
    }

    // this.increase = this.increase.bind(this)
    // this.decrease = this.decrease.bind(this)
  }

  increase() {
    this.setState(state => ({...state, clicked: state.clicked + 1}))
  }

  decrease() {
    this.setState(state => ({...state, clicked: state.clicked - 1}))
  }

  render() {
    return <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          AppClass
        </p>


        <p>You clicked {this.state.clicked} times</p>
        <button className="btn btn-secondary" onClick={event => {
          event.stopPropagation();
          event.preventDefault();

          this.decrease()
        }}>decrease
          <button className="btn btn-primary" onClick={event => {
            event.stopPropagation();
            event.preventDefault();

            this.increase()
          }}>increase</button></button>
      </header>
    </div>;
  }
}

function AppCreateElementVersion() {
  const img = React.createElement("img", {className: "App-logo", src: logo, alt: "logo"})

  const code = React.createElement("code", {children: "src/App.tsx"})
  const p = React.createElement("p", {children: ["Edit ", code, " and saved to reload [AppCreateElementVersion]"]})

  const a = React.createElement("a", {
    children: "Learn React",
    className: "App-link",
    href:"https://reactjs.org",
    target: "_blank",
    rel: "noopener noreferrer"
  })

  const header = React.createElement("header", {children: [img, p, a], className: "App-header"})

  return React.createElement("div", {children: header, className: "App"})
}

export default AppPokemon;
