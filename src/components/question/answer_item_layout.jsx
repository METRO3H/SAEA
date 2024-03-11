import React, { useState, useEffect, useRef } from "react";

import Item_Answer from "./item_answer.jsx";

function CheckboxGenerator() {
  const [answers_items, set_answers_items] = useState([]);
  const [show_answer_items, set_show_answer_items] = useState([]);
  const [itemAdded, setItemAdded] = useState(false);
  const answerItemsSectionRef = useRef(null);

  const handleButtonClick = () => {
    const key = Date.now().toString();
    set_answers_items([...answers_items, { key }]);

    setItemAdded(true);
    setTimeout(() => {
      set_show_answer_items([...show_answer_items, key]); // Agrega la clave al array
    }, 50);
  };

  let timeout = 200;

  const handleItemDelete = (keyToDelete) => {
    const remove_buttons = document.querySelectorAll(".remove-button");
    remove_buttons.forEach((button) => button.setAttribute("disabled", ""));
    set_show_answer_items(show_answer_items.filter((key) => key !== keyToDelete)); // Elimina la clave del array
    setItemAdded(false);
    setTimeout(() => {
      set_answers_items(answers_items.filter((item) => item.key !== keyToDelete));
      remove_buttons.forEach((button) => button.removeAttribute("disabled"));
    }, timeout);
  };

  useEffect(() => {
    if (answerItemsSectionRef.current && itemAdded) {
      setTimeout(() => {
        answerItemsSectionRef.current.scrollTop = answerItemsSectionRef.current.scrollHeight;
      }, timeout + 50);
    }
  }, [answers_items]);

  return (
    <div className="answer-items-section" ref={answerItemsSectionRef}>
      {answers_items.map((item, index) => (
        <Item_Answer
          key={item.key}
          check_box_key={item.key}
          check_box_id={`Checkbox ${index + 1}`} // Actualizado para que el ID sea consistente con la posición en el array
          check_box_label={`Respuesta ${index + 1}`} // Actualizado para que la etiqueta sea consistente con la posición en el array
          handleItemDelete={handleItemDelete}
          add_class={show_answer_items.includes(item.key) ? "show-answer-item" : ""} // Comprueba si la clave está en el array
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
