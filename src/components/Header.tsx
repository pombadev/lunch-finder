export function Header() {
  return (
    <header className="neobrutal-header" style={{ position: 'relative' }}>
      <h1>Where's my lunch?</h1>
      <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', fontSize: '0.7rem', fontWeight: 'bold' }}>
        v{typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'dev'}
      </div>
    </header>
  )
}
