import Question_Content_Item from "@components/question/question_content_item.jsx";
import Question_List_Item from "@components/question/question_list_item.jsx";

function Questions_Data() {
  return (
    <div id="main-question-container">
      <div id="question-list-container">
        <div className="list-group list-group-light" id="list-tab" role="tablist">
          <Question_List_Item question_list_item_number={1} add_class="active" />
          <Question_List_Item question_list_item_number={5} />
        </div>
      </div>
      <div id="question-content-container">
        <div className="tab-content">
          <Question_Content_Item question_content_item_number="1" add_class="active" />
          <Question_Content_Item question_content_item_number="5" />
        </div>
      </div>
    </div>
  );
}

export default Questions_Data;
