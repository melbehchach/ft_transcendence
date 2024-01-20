import { ScoresProps } from "./Scores.types"

const Scores = ({ myScoresArray }: ScoresProps) => {
  return (
    <div className="">
      <table className="ml-[10px] mt-[5px] border-separate border-spacing-x-1.5 table-auto">
        <thead>
          <tr>
            {myScoresArray.map((myScoresArray) => (
              <th className="text-lg font-inter" key={myScoresArray.id}>
                {myScoresArray.number}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {myScoresArray.map((myScoresArray) => (
              <td
                className="text-sm font-inter text-gray-500"
                key={myScoresArray.id}
              >
                {myScoresArray.type}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Scores;

// {...rest} to put it inside the div element  <div {.../div} className="">
