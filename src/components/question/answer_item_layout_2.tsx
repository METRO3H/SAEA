import { useState, useEffect, useRef } from "react";
import Item_Answer from "./item_answer.jsx";


export default function Answer_Item_Layout({answers, correct_answer_index}) {
//   const [answers_items, set_answers_items] = useState([]);
//   const [show_answer_items, set_show_answer_items] = useState([]);
//   const [itemAdded, setItemAdded] = useState(false);
//   const answerItemsSectionRef = useRef(null);

    const answer_items = answers
    console.log(answer_items)

  return (
    // <div className="answer-items-section" ref={answerItemsSectionRef}>
    <div className="answer-items-section">

        {answer_items.map((item, index) => (

          <Item_Answer
            key={"item_answer_" + index}
            answer_value={item}
            check_box_id={`Checkbox ${index + 1}`} // Actualizado para que el ID sea consistente con la posición en el array
            answer_input_label={`Respuesta ${index + 1}`} // Actualizado para que la etiqueta sea consistente con la posición en el array
            // Remove_Answer={Remove_Answer}
            // add_class={show_answer_items.includes(item.key) ? "show-answer-item" : ""} // Comprueba si la clave está en el array
          />
        ))}

      <button
        type="button"
        className="btn btn-lg btn-outline-primary btn-rounded  add-item"
        // onClick={Add_Answer}
      >
        <i className="fas fa-plus"></i>
        <span> Añadir respuesta</span>
      </button>
    </div>
  );
}
