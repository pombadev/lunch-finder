export function Header() {
  return (
    <header className="neobrutal-header">
      <h1>Where's my lunch?</h1>
      {typeof __COMMIT_HASH__ !== 'undefined' && (
        <a
          href={`https://github.com/pombadev/lunch-finder/commit/${__COMMIT_HASH__}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.5rem',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            color: 'inherit',
          }}
        >
          v{__COMMIT_HASH__}
        </a>
      )}
    </header>
  )
}
