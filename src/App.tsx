import { Header } from './components/Header'
import { MainList } from './components/MainList'
import './index.css'

function App() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <Header />
      <main>
        <MainList />
      </main>
    </div>
  )
}

export default App
