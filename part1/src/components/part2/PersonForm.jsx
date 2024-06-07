const PersonForm = ({name, number, submitEvent, onChangeNameEvent, onChangeNumberEvent}) => {
  return (
    <form onSubmit={submitEvent}>
      <div>
        name: <input value={name} onChange={onChangeNameEvent} />
      </div>
      <div>
        number: <input value={number} onChange={onChangeNumberEvent} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  );
};

export default PersonForm;
