export function RestaurantCardSkeleton() {
  return (
    <article className="card" style={{ marginBottom: "1.5rem" }}>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-badge" />
      </div>
      <div className="skeleton skeleton-button" />
    </article>
  );
}
