import { ScoresProps } from "./Scores.types";


const Scores = ( {myScoresArray}: ScoresProps ) => {
  return (
    <div  className="w-[327px] h-[69px] border border-[#000000] rounded-[15px] flex justify-center items-center">
      <table className="border-separate border-spacing-x-3 table-auto">
        <thead>
          <tr>
            {myScoresArray.map((myScoresArray) => (
              <th className="text-2xl font-inter" key={myScoresArray.id}>
                {myScoresArray.number}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {myScoresArray.map((myScoresArray) => (
              <td className="text-base font-inter" key={myScoresArray.id}>
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