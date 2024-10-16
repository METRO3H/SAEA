import { useState } from "react";
import "@styles/test_react.css";
export function App_test() {
  
  const items = ["bob", "aaa", "ccc", "ddd", "qqq"];
  const [show_item, set_show_item] = useState(new Array (items.length).fill(true));
  console.log(show_item)
  return (
    <div className="App">
      <ul className="containa">
        {items.map((item, index) => {
          const show = show_item[index] ? "show-item" : "";
         
          return (
            <li className={"item "+ show} key={index}>
              <span>{item}</span>
              <button
                type="button"
                onClick={() => set_show_item(show_item.map((item, i) => (i === index ? false : item)))}
                />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
