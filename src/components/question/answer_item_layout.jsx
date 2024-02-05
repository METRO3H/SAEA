import React, { useState } from "react";
import ItemAnswer from "./item_answer.jsx";

function CheckboxGenerator() {
  const [checkboxItems, setCheckboxItems] = useState([]);

  const handleButtonClick = () => {
    const key = Date.now().toString();
    setCheckboxItems([
      ...checkboxItems,
      {
        key,
        id: `Checkbox ${checkboxItems.length + 1}`, // Corregido para que el ID se incremente correctamente
        label: `Respuesta ${checkboxItems.length + 1}`, // Corregido para que la etiqueta se incremente correctamente
      },
    ]);
  };

  const handleItemDelete = (keyToDelete) => {
    setCheckboxItems(checkboxItems.filter((item) => item.key !== keyToDelete));
  };

  return (
    <div className="answer-items-section">
      {checkboxItems.map((item, index) => (
        <ItemAnswer
          key={item.key}
          check_box_key={item.key}
          check_box_id={`Checkbox ${index + 1}`} // Actualizado para que el ID sea consistente con la posición en el array
          check_box_label={`Respuesta ${index + 1}`} // Actualizado para que la etiqueta sea consistente con la posición en el array
          handleItemDelete={handleItemDelete}
        />
      ))}

      <button
        type="button"
        className="btn btn-outline-primary btn-lg btn-rounded add-item"
        data-mdb-ripple-init
        onClick={handleButtonClick}
      >
        <i className="fas fa-plus" style={{ paddingRight: "4px" }}></i>
        Añadir respuesta
      </button>
    </div>
  );
}

export default CheckboxGenerator;
