const Persons = ({persons, deletePersonEvent}) => {
  return (
    <div>
      {persons?.map((person) => (
        <div key={person.id}>
          {person.name} {person.number} <button onClick={(event) => deletePersonEvent(event, person)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
