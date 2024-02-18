import { ScoresProps } from "./Scores.types"

const Scores = ({ myScoresArray }: ScoresProps) => {
  return (
    <div className="w-full h-[4rem] p-5 items-center flex justify-center rounded-[5px] overflow-x-auto overflow-y-hidden border border-black border-solid">
      <ul className="flex flex-row gap-5">
        {myScoresArray.map((score) => (
          <li key={score.id}>
            <h6 className="flex justify-center">{score.number}</h6>
            <p>{score.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scores;

// {...rest} to put it inside the div element  <div {.../div} className="">

// border-separate border-spacing-x-1.5 table-auto