import {useEffect, useState} from 'react';
import Note from './components/Note';
import Notification from './components/Notification';
import Filter from './components/part2/Filter';
import PersonForm from './components/part2/PersonForm';
import Persons from './components/part2/Persons';
import countryService from './services/contries';
import noteService from './services/notes';
import personService from './services/persons';

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>{' '}
    </div>
  );
};

const History = ({allClicks}) => {
  if (allClicks.length === 0) {
    return <div> the app is used by pressing the buttons </div>;
  }
  return <div> button press history: {allClicks.join(' ')} </div>;
};

const StatisticLine = ({text, value, porcent}) => {
  return (
    <tr>
      <th>
        {text} {value} {porcent ? '%' : ''}
      </th>
    </tr>
  );
};

const Statistics = ({good, neutral, bad, all}) => {
  if (all == 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    );
  }
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={all} />
        <StatisticLine text='average' value={(good - bad) / all} />
        <StatisticLine text='positive' value={(good * 100) / all} porcent={true} />
      </tbody>
    </table>
  );
};

const AnecdoteMaxVote = ({anecdotes, vote, maxVoteIndex}) => {
  if (Math.max(...vote) > 0) {
    return <>{anecdotes[maxVoteIndex]}</>;
  }
};

const Button = ({handleClick, text}) => <button onClick={handleClick}> {text} </button>;

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    console.log('effect');
    personService.getAll().then((response) => {
      console.log('promise fulfilled');
      setPersons(response);
    });
  }, []);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setError(true);
        setTimeout(() => {
          setErrorMessage(null);
          setError(null);
        }, 5000);
      });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = {...note, important: !note.important};

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        // alert(`the note '${note.content}' was already deleted from server`);
        setErrorMessage(`Note '${note.content}' was already removed from server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });

    console.log(`importance of ${id} needs to be toggled`);
  };

  const notesToShow = showAll ? notes : notes.filter(({important}) => important === true);
  // ------------------------------------------

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [persons, setPersons] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState(false);

  const addPerson = (event) => {
    event.preventDefault();
    const isRepeat = persons?.find((p) => p.name === newName);
    if (isRepeat) {
      const msg = `${newName} is already added to phonebook, replace the old number with a new one?`;
      if (window.confirm(msg)) {
        personService.update(isRepeat.id, {...isRepeat, number: newNumber}).then((returnedPerson) => {
          const updatedPersons = persons.map((person) => (person.id === returnedPerson.id ? returnedPerson : person));
          setPersons(updatedPersons);
          setNewName('');
          setNewNumber('');
          setErrorMessage(`Updated ${returnedPerson.name} phone`);
          setError(false);
          setTimeout(() => {
            setErrorMessage(null);
            setError(null);
          }, 5000);
        });
      }
    } else {
      const personObject = {name: newName, number: newNumber};
      personService
        .create(personObject)
        .then((returnedPerson) => {
          if (persons && persons.length > 0) {
            setPersons([...persons, returnedPerson]);
          } else setPersons([returnedPerson]);
          setNewName('');
          setNewNumber('');
          setErrorMessage(`Added ${returnedPerson.name}`);
          setError(false);
          setTimeout(() => {
            setErrorMessage(null);
            setError(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setErrorMessage(error.response.data.error);
          setError(true);
          setTimeout(() => {
            setErrorMessage(null);
            setError(null);
          }, 5000);
        });
    }
  };

  const personsToShow = persons?.filter(({name}) => name.includes(newFilter));

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const handleDeletePerson = (event, person) => {
    event.preventDefault();
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .delete(person.id)
        .then((deletedPerson) => {
          setPersons(persons.filter((person) => person.id !== deletedPerson.id));
        })
        .catch((error) => {
          setErrorMessage(`Information of ${person.name} has already been removed from server`);
          setError(true);
          setTimeout(() => {
            setErrorMessage(null);
            setError(null);
          }, 5000);
        });
    }
  };

  /////////////////////////////

  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (newFilter) {
      const timeoutId = setTimeout(
        () =>
          countryService.getByName(newFilter).then((ct) => {
            setCountry(ct);
          }),
        1000
      );
      return () => clearTimeout(timeoutId);
    }
  }, [newFilter]);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} error={error} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      </div>
      <ul>
        {notesToShow?.map((note) => (
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <div>
          note: <input value={newNote} onChange={handleNoteChange} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
      <div>
        {notes?.map((note) => (
          <div key={note.id}>{note.content}</div>
        ))}
      </div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} error={error} />
      <Filter text='filter shown with' value={newFilter} onChangeEvent={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm name={newName} number={newNumber} submitEvent={addPerson} onChangeNameEvent={handleNameChange} onChangeNumberEvent={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePersonEvent={handleDeletePerson} />

      {/* filtro de paises */}
      {/* <Filter text='find contries' value={newFilter} onChangeEvent={handleFilterChange} />
      
      <div>
        <Country country={country}></Country>
      </div> */}
      <Footer />
    </div>
  );
};

export default App;
