export default function Loading() {
  return (
    <main className="jari-loader" role="status" aria-label="Loading JARI">
      <span className="sr-only">Loading JARI</span>
      <div className="jari-loader__word" aria-hidden="true">
        <span className="jari-loader__j">J</span>
        <span className="jari-loader__rest">ARI</span>
      </div>
      <p className="jari-loader__caption" aria-hidden="true">Poultry farm intelligence</p>
      <div className="jari-loader__track" aria-hidden="true"><span /></div>
    </main>
  );
}
