import React, { useState, useEffect, useRef } from "react";

import ItemAnswer from "./item_answer.jsx";

function CheckboxGenerator() {
  const [checkboxItems, setCheckboxItems] = useState([]);
  const answerItemsSectionRef = useRef(null);

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

  useEffect(() => {
    if (answerItemsSectionRef.current) {
      answerItemsSectionRef.current.scrollTop = answerItemsSectionRef.current.scrollHeight;
    }
  }, [checkboxItems]);

  return (
    <div className="answer-items-section" ref={answerItemsSectionRef}>
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
        className="btn btn-lg btn-outline-primary btn-rounded bg-light bg-gradient add-item"
        onClick={handleButtonClick}
      >
        <i className="fas fa-plus"></i>
        Añadir respuesta
      </button>
    </div>
  );
}

export default CheckboxGenerator;
