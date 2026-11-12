import { useState } from 'react'

export function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="app-container">
      <div className="w3-card-4 w3-round-large w3-white" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <header className="w3-container w3-blue w3-round-large" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          <h2>
            <i className="fa fa-desktop w3-margin-right" aria-hidden="true"></i>
            Electron + Vite + React + TypeScript
          </h2>
        </header>

        <div className="w3-container w3-padding-24">
          <p className="w3-text-dark-grey">
            Your desktop application template is up and running with W3.CSS and Font Awesome.
          </p>

          <div className="w3-panel w3-pale-blue w3-leftbar w3-border-blue w3-padding">
            <p className="w3-margin-0">
              Button clicked: <strong>{count}</strong> {count === 1 ? 'time' : 'times'}
            </p>
          </div>

          <div className="w3-margin-top">
            <button
              className="w3-button w3-cobalt w3-round w3-margin-right"
              onClick={() => setCount((prev) => prev + 1)}
            >
              <i className="fa fa-plus w3-margin-right" aria-hidden="true"></i>
              Increment Counter
            </button>

            <button
              className="w3-button w3-light-grey w3-round"
              onClick={() => setCount(0)}
            >
              <i className="fa fa-refresh w3-margin-right" aria-hidden="true"></i>
              Reset
            </button>
          </div>
        </div>

        <footer className="w3-container w3-light-grey w3-padding w3-small w3-text-grey">
          Ready to build • v2.0.0
        </footer>
      </div>
    </div>
  )
}

export default App
