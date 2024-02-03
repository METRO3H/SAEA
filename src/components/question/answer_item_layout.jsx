import { useState } from "react";
import ItemAnswer from "./item_answer.jsx";
function CheckboxGenerator() {
  const [checkboxItems, setCheckboxItems] = useState([]);

  const handleButtonClick = () => {
    const key = Date.now().toString();
    setCheckboxItems([...checkboxItems,
      {
        key,
        id: `Checkbox ${checkboxItems.length + 1}`,
        label: `Respuesta ${checkboxItems.length + 1}`,
      }
    ]);
  };

  return (
    <div>
      <div>
        {checkboxItems.map((item) => (
          <ItemAnswer
            check_box_key={item.key}
            check_box_id={item.label}
            check_box_label={item.label}
          />
        ))}
      </div>
      <button
        type="button"
        class="btn btn-outline-primary btn-lg add-item"
        data-mdb-ripple-init
        onClick={handleButtonClick}
      >
        Añadir respuesta
      </button>
    </div>
  );
}

export default CheckboxGenerator;
