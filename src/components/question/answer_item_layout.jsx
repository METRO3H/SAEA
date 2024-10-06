import { useState, useEffect, useRef } from "react";
import Item_Answer from "./item_answer.jsx";
import { useStore } from "@nanostores/react";
import { quiz_data_store } from "@content/quiz_data";

function CheckboxGenerator() {
  const [answers_items, set_answers_items] = useState([]);
  const [show_answer_items, set_show_answer_items] = useState([]);
  const [itemAdded, setItemAdded] = useState(false);
  const answerItemsSectionRef = useRef(null);

  function Add_Answer() {
    let answer_key = Date.now().toString();
    set_answers_items((prev_answers_items) => [...prev_answers_items, { key: answer_key }]);

    setItemAdded(true);
    setTimeout(() => {
      set_show_answer_items((prev_show_answer_items) => [...prev_show_answer_items, answer_key]); // Agrega la clave al array
    }, 50);
  }

  let timeout = 200;

  function Remove_Answer(keyToDelete) {
    const remove_buttons = document.querySelectorAll(".remove-button");
    remove_buttons.forEach((button) => button.setAttribute("disabled", ""));
    set_show_answer_items(show_answer_items.filter((key) => key !== keyToDelete)); // Elimina la clave del array
    setItemAdded(false);
    setTimeout(() => {
      set_answers_items(answers_items.filter((item) => item.key !== keyToDelete));
      remove_buttons.forEach((button) => button.removeAttribute("disabled"));
    }, timeout);
  }

  useEffect(() => {
    if (answerItemsSectionRef.current && itemAdded) {
      setTimeout(() => {
        answerItemsSectionRef.current.scrollTop = answerItemsSectionRef.current.scrollHeight;
      }, timeout + 50);
    }
  }, [answers_items]);

  useEffect(() => {
    Add_Answer();
    setTimeout(Add_Answer, 0);  
  }, []);
  
  return (
    <div className="answer-items-section" ref={answerItemsSectionRef}>

        {answers_items.map((item, index) => (
          <Item_Answer
            key={item.key}
            answer_key={item.key}
            check_box_id={`Checkbox ${index + 1}`} // Actualizado para que el ID sea consistente con la posición en el array
            answer_input_label={`Respuesta ${index + 1}`} // Actualizado para que la etiqueta sea consistente con la posición en el array
            Remove_Answer={Remove_Answer}
            add_class={show_answer_items.includes(item.key) ? "show-answer-item" : ""} // Comprueba si la clave está en el array
          />
        ))}

      <button
        type="button"
        className="btn btn-lg btn-outline-primary btn-rounded  add-item"
        onClick={Add_Answer}
      >
        <i className="fas fa-plus"></i>
        <span> Añadir respuesta</span>
      </button>
    </div>
  );
}

export default CheckboxGenerator;
