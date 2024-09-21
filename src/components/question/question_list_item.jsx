function question_list_item({ question_list_item_number, add_class = "", item_data }) {
  console.log(item_data)
  return (
    <a
      className={`list-group-item list-group-item-action ${add_class} px-3 border-0`}
      id={`question-list-item-${question_list_item_number}`}
      type="button"
      data-mdb-list-init
      href={`#question-content-item-${question_list_item_number}`}
      role="tab"
      title={`Pregunta ${question_list_item_number}`}
      aria-controls={`question-content-item-${question_list_item_number}`}
    >
      <i className="fas fa-circle-question"></i> Pregunta {question_list_item_number}
    </a>
  );
}

export default question_list_item;
