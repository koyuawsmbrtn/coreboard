export default function Logo() {
  return (
    <div className="logo">
      <img src="/static/logo.svg" />
      <style>{`
        .logo {
          display: flex;
          align-items: center;
        }
        img {
          height: 40px;
          width: auto;
        }
      `}</style>
    </div>
  );
}