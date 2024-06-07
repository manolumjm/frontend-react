const Filter = ({text, value, onChangeEvent}) => {
  return (
    <div>
      {text} <input value={value} onChange={onChangeEvent} />
    </div>
  );
};

export default Filter;
