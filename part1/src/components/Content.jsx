import Part from './Part';
import Total from './Total';

const Content = ({parts}) => {
  const content = parts.map(({name, exercises, id}) => <Part key={id} name={name} exercise={exercises} />);

  return (
    <div>
      {content} <Total parts={parts} />
    </div>
  );
};

export default Content;
