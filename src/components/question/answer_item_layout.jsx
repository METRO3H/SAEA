import React, { useState, useEffect, useRef } from "react";
import { quiz_data } from "@content/quiz_data.ts";
import Item_Answer from "./item_answer.jsx";

function CheckboxGenerator() {
  const [checkboxItems, setCheckboxItems] = useState([]);
  const [show_answer_items, set_show_answer_items] = useState([]);
  const [itemAdded, setItemAdded] = useState(false);
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
    setItemAdded(true);
    setTimeout(() => {
      set_show_answer_items([...show_answer_items, key]); // Agrega la clave al array
    }, 50);
  };
  let timeout = 200;
  const handleItemDelete = (keyToDelete) => {
    const remove_buttons = document.querySelectorAll(".remove-button")
    console.log(remove_buttons);
    remove_buttons.forEach(button => button.setAttribute("disabled", ""))
    set_show_answer_items(show_answer_items.filter((key) => key !== keyToDelete)); // Elimina la clave del array
    setItemAdded(false);
    setTimeout(() => {
      setCheckboxItems(checkboxItems.filter((item) => item.key !== keyToDelete));
      remove_buttons.forEach(button => button.removeAttribute("disabled"))
    }, timeout);
    
  };

  useEffect(() => {
    if (answerItemsSectionRef.current && itemAdded) {
      setTimeout(() => {
        console.log(answerItemsSectionRef.current.scrollHeight);
        answerItemsSectionRef.current.scrollTop = answerItemsSectionRef.current.scrollHeight;
      }, timeout + 50);
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
