export const Product = ({ pName, pComment, pImage, pPro1, pPro2 }) => {
  return (
    <>
      <div className="showcase-visual">
        <div className="art">
          <img
            alt={pName}
            className="showcase-photo"
            loading="lazy"
            src={`/assets/images/products/${pImage}`}
          />
        </div>
      </div>
      <div className="showcase-copy">
        <h3>{pName} </h3>
        <p>{pComment}</p>
        <div className="mini-row">
          <span className="mini-chip">{pPro1}</span>
          <span className="mini-chip">{pPro2}</span>
        </div>
      </div>
    </>
  );
};
