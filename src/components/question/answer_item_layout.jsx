import React, { useState, useEffect, useRef } from "react";
import { quiz_data } from "@content/quiz_data.ts";
import Item_Answer from "./item_answer.jsx";

function CheckboxGenerator() {
  const [checkboxItems, setCheckboxItems] = useState([]);
  const [deletingKey, setDeletingKey] = useState(null);
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
  const item_answer_remove_style = {
    margin: "0",
    padding: "0",
    height: "0",
    overflow: "hidden",
  };
  const handleItemDelete = (keyToDelete) => {

    setDeletingKey(keyToDelete);

    // Utiliza un efecto secundario para eliminar el elemento después de un retraso
    setTimeout(() => {
      setCheckboxItems(checkboxItems.filter((item) => item.key !== keyToDelete));
      setDeletingKey(null); // Resetea deletingKey cuando la eliminación está completa
    }, 3000); // Ajusta este retraso según sea necesario
  };

  useEffect(() => {
    if (answerItemsSectionRef.current) {
      answerItemsSectionRef.current.scrollTop = answerItemsSectionRef.current.scrollHeight;
    }
  }, [checkboxItems]);

  return (
    <div className="answer-items-section" ref={answerItemsSectionRef}>
      {checkboxItems.map((item, index) => (
        <Item_Answer
          key={item.key}
          check_box_key={item.key}
          check_box_id={`Checkbox ${index + 1}`} // Actualizado para que el ID sea consistente con la posición en el array
          check_box_label={`Respuesta ${index + 1}`} // Actualizado para que la etiqueta sea consistente con la posición en el array
          handleItemDelete={handleItemDelete}
          add_style={item.key === deletingKey ? item_answer_remove_style : {}}
        />
      ))}

      <button
        type="button"
        className="btn btn-lg btn-outline-primary btn-rounded  add-item"
        onClick={handleButtonClick}
      >
        <i className="fas fa-plus"></i>
        <span> Añadir respuesta</span>
      </button>
    </div>
  );
}

export default CheckboxGenerator;
