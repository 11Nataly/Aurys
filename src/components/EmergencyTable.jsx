// src/components/EmergencyTable.jsx
import "../styles/table.css";

const EmergencyTable = () => {
  const data = [
    { agencia: "Secretaría de salud", telefono: "106", horario: "24/7" },
    { agencia: "Línea única de emergencias Nacional", telefono: "123", horario: "24/7" },
    { agencia: "Línea 'porque quiero estar bien'", telefono: "3330333588", horario: "24/7" },
    { agencia: "Policía Nacional", telefono: "018000111488", horario: "24/7" },
    { agencia: "Ministerio de la Protección Social", telefono: "018000113113", horario: "24/7" },
  ];

  return (
    <section className="emergency">
      <h2>Líneas de emergencia</h2>
      <table>
        <thead>
          <tr>
            <th>Agencia</th>
            <th>Número telefónico</th>
            <th>Horario de atención</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.agencia}</td>
              <td>{item.telefono}</td>
              <td>{item.horario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EmergencyTable;