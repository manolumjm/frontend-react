const Total = ({parts}) => {
  const total = parts.reduce((accum, {exercises}) => accum + exercises, 0);

  return <p style={{fontWeight: 'bold'}}>Total of {total} exercises</p>;
};

export default Total;
