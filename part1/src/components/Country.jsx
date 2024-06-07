const Country = ({country}) => {
  if (country) {
    const {name, capital, area, languages, flags} = country;
    const {commonName} = name;
    const languajesKeys = Object.keys(languages);
    const {alt, png, svg} = flags;
    return (
      <>
        <h2>{commonName}</h2>
        {capital.map((cp, i) => (
          <div key={i}>capital {cp}</div>
        ))}
        <div>area {area}</div>
        <h3>languages</h3>
        {languajesKeys.map((lg, i) => (
          <li key={i}>{languages[lg]}</li>
        ))}
        <br></br>
        <img alt={alt} src={png} height={150} width={150} />
      </>
    );
  }
};

export default Country;
