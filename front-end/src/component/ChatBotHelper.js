// export function ChatBotHelper({ predictions }) {
//   return (
//     <table className="table">
//       <thead>
//         <tr>
//           <th scope="col">Index</th>
//           <th scope="col">Predicted Emotion</th>
//           <th scope="col">Confidence Level</th>
//         </tr>
//       </thead>
//       {predictions && (
//         <tbody>
//           {predictions.map(
//             (p, index) =>
//               index < 8 && (
//                 <tr key={index}>
//                   <th scope="row">{index + 1}</th>
//                   <td>{p.label}</td>
//                   <td>{p.score}</td>
//                 </tr>
//               )
//           )}
//           <p className="lead" onClick={setDisplayRecord(true)}>
//             Click here to load complete records
//           </p>
//         </tbody>
//       )}
//     </table>a
//   );
// }
