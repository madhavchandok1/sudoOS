export default function MobileBlock() {
  return (
    <div className="mobile-block" aria-hidden="false">
      <div className="mobile-block-inner">
        <div className="mobile-block-icon">🖥️</div>
        <h1 className="mobile-block-title">Desktop experience required</h1>
        <p className="mobile-block-text">
          sudoOS is designed for large screens. For the best experience, please open this site on a{' '}
          <strong>desktop</strong>, <strong>laptop</strong>, or switch your device to{' '}
          <strong>desktop mode</strong>.
        </p>
      </div>
    </div>
  );
}
